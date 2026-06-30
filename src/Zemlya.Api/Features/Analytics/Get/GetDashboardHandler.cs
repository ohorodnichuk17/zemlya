using MediatR;
using Microsoft.EntityFrameworkCore;
using Zemlya.Api.Abstractions;
using Zemlya.Api.Features.AgroFields;
using Zemlya.Api.Features.Recommendations;
using Zemlya.Api.Features.Recommendations.Services;
using Zemlya.Api.Infrastructure.Database;
using Zemlya.Api.Infrastructure.Weather;

namespace Zemlya.Api.Features.Analytics.Get;

public sealed record GetDashboardQuery(Guid FieldId) : IRequest<DashboardResponse>;

public sealed record DashboardResponse(
    Guid FieldId,
    string FieldName,
    string Crop,
    string Soil,
    decimal SizeHectares,
    string Oblast,
    string ShellingImpactLevel,
    DateTime SowingDate,
    string AgroClimaticZone,
    string GrowthStage,
    int DaysSinceSowing,
    
    decimal CurrentTemperature,
    decimal CurrentHumidity,
    decimal RainAmount,
    string WeatherDescription,
    
    List<DashboardForecastDto> Forecast,
    List<DashboardRecommendationDto> Recommendations
);

public sealed record DashboardForecastDto(
    string DateText,
    decimal Temperature,
    decimal Humidity,
    decimal Rain,
    string Main,
    string Description
);

public sealed record DashboardRecommendationDto(
    Guid Id,
    string ActionType,
    DateTime ScheduledFor,
    decimal Amount,
    bool IsCompleted,
    string? Description
);

public class GetDashboardHandler(
    DatabaseContext context,
    IWeatherService weatherService,
    ZemlyaEngine engine,
    ILogger<GetDashboardHandler> logger) 
    : IRequestHandler<GetDashboardQuery, DashboardResponse>
{
    public async Task<DashboardResponse> Handle(GetDashboardQuery request, CancellationToken cancellationToken)
    {
        var field = await context.AgroFields
            .FirstOrDefaultAsync(f => f.Id == request.FieldId, cancellationToken);

        if (field == null)
            throw new Exception("Поле не знайдено");

        // 1. Отримуємо погоду та прогноз з безпечним фолбеком
        var weather = await weatherService.GetWeatherAsync(field.Latitude, field.Longitude, cancellationToken);
        if (weather == null)
        {
            logger.LogWarning("Weather service returned null. Using fallback values.");
            weather = new CurrentWeather(Temperature: 21m, Humidity: 60m, Main: "Clouds", Description: "хмарно з проясненнями", Rain1h: 0m);
        }

        var forecast = await weatherService.GetForecastAsync(field.Latitude, field.Longitude, cancellationToken);
        if (forecast == null || forecast.Count == 0)
        {
            logger.LogWarning("Forecast service returned null. Simulating fallback forecast.");
            forecast = GenerateFallbackForecast();
        }

        // 2. Отримуємо збережені рекомендації з БД
        var recommendations = await context.Recommendations
            .Where(r => r.FieldId == field.Id)
            .OrderBy(r => r.ScheduledFor)
            .ToListAsync(cancellationToken);

        // Самолікування: якщо рекомендацій немає, згенеруємо та збережемо їх
        if (recommendations.Count == 0)
        {
            logger.LogInformation("No recommendations found in DB for field {Id}. Generating on the fly.", field.Id);
            var generatedRecs = engine.GenerateSchedule(field, forecast);
            foreach (var rec in generatedRecs)
            {
                rec.AgroField = field;
                rec.FieldId = field.Id;
                await context.Recommendations.AddAsync(rec, cancellationToken);
            }
            await context.SaveChangesAsync(cancellationToken);
            recommendations = generatedRecs;
        }

        // 3. Розрахуємо додаткові агрономічні параметри
        var daysSinceSowing = (DateTime.UtcNow - field.SowingDate).Days;
        var growthStageStr = GetGrowthStageString(field.CropType, daysSinceSowing);
        var agroZoneStr = GetAgroZoneString(field.Oblast);

        // 4. Формуємо DTO
        var forecastDtos = forecast.Select(f =>
        {
            // Спробуємо розпарсити dt_txt або перевести dt в DateTime
            var date = DateTimeOffset.FromUnixTimeSeconds(f.Dt).DateTime.ToLocalTime();
            return new DashboardForecastDto(
                DateText: date.ToString("yyyy-MM-dd HH:mm"),
                Temperature: f.Main.Temp,
                Humidity: f.Main.Humidity,
                Rain: f.Rain?.Rain3h ?? 0m,
                Main: f.Weather.FirstOrDefault()?.Main ?? "Unknown",
                Description: f.Weather.FirstOrDefault()?.Description ?? "Немає опису"
            );
        }).ToList();

        var recDtos = recommendations.Select(r => new DashboardRecommendationDto(
            Id: r.Id,
            ActionType: r.ActionType.ToString(),
            ScheduledFor: r.ScheduledFor,
            Amount: r.Amount,
            IsCompleted: r.IsCompleted,
            Description: r.Description
        )).ToList();

        return new DashboardResponse(
            FieldId: field.Id,
            FieldName: field.Name,
            Crop: field.CropType.ToString(),
            Soil: field.SoilType.ToString(),
            SizeHectares: field.SizeHectares,
            Oblast: field.Oblast,
            ShellingImpactLevel: field.ShellingImpactLevel.ToString(),
            SowingDate: field.SowingDate,
            AgroClimaticZone: agroZoneStr,
            GrowthStage: growthStageStr,
            DaysSinceSowing: daysSinceSowing,
            CurrentTemperature: weather.Temperature,
            CurrentHumidity: weather.Humidity,
            RainAmount: weather.Rain1h,
            WeatherDescription: weather.Description,
            Forecast: forecastDtos,
            Recommendations: recDtos
        );
    }

    private List<ForecastItem> GenerateFallbackForecast()
    {
        var forecastList = new List<ForecastItem>();
        var now = DateTime.UtcNow;
        for (int i = 0; i < 40; i++)
        {
            var forecastTime = now.AddHours(3 * i);
            var hour = forecastTime.Hour;
            var temp = Math.Round(22m + 8m * (decimal)Math.Sin((hour - 6) * Math.PI / 12), 2);
            var humidity = Math.Round(55m - 15m * (decimal)Math.Sin((hour - 6) * Math.PI / 12), 2);
            decimal rain = (i >= 16 && i <= 22) ? 1.5m : 0m;

            forecastList.Add(new ForecastItem(
                Dt: ((DateTimeOffset)forecastTime).ToUnixTimeSeconds(),
                Main: new ForecastMain(temp, humidity),
                Weather: [new ForecastWeather(rain > 0 ? "Rain" : "Clouds", rain > 0 ? "помірний дощ" : "хмарно з проясненнями")],
                Rain: rain > 0 ? new ForecastRain(rain) : null,
                DtTxt: forecastTime.ToString("yyyy-MM-dd HH:mm:ss")
            ));
        }
        return forecastList;
    }

    private string GetGrowthStageString(CropType crop, int days)
    {
        if (days < 0) return "Посів не розпочато";

        return crop switch
        {
            CropType.Wheat => days switch
            {
                <= 20 => "Сходи (Germination)",
                <= 60 => "Кущення / Вегетація (Vegetative)",
                <= 90 => "Цвітіння / Колосіння (Flowering)",
                <= 115 => "Молочно-воскова стиглість (Maturity)",
                _ => "Врожай зібрано (Harvested)"
            },
            CropType.Sunflower => days switch
            {
                <= 15 => "Сходи (Germination)",
                <= 55 => "Бутонізація / Вегетація (Vegetative)",
                <= 85 => "Цвітіння кошиків (Flowering)",
                <= 110 => "Дозрівання насіння (Maturity)",
                _ => "Врожай зібрано (Harvested)"
            },
            CropType.Corn => days switch
            {
                <= 15 => "Сходи (Germination)",
                <= 50 => "Листоутворення / Вегетація (Vegetative)",
                <= 80 => "Викидання волоті (Flowering)",
                <= 115 => "Молочна стиглість качанів (Maturity)",
                _ => "Врожай зібрано (Harvested)"
            },
            _ => "Вегетація"
        };
    }

    private string GetAgroZoneString(string oblast)
    {
        var clean = oblast.Trim().ToLower();
        if (clean.Contains("житомир") || clean.Contains("чернігів") || 
            clean.Contains("волин") || clean.Contains("рівн") || 
            clean.Contains("сум") || clean.Contains("київ"))
        {
            return "Полісся (Волога лісова зона)";
        }

        if (clean.Contains("херсон") || clean.Contains("запоріж") || 
            clean.Contains("миколаїв") || clean.Contains("одес") || 
            clean.Contains("дніпро") || clean.Contains("донец") || 
            clean.Contains("луган") || clean.Contains("крим") || 
            clean.Contains("кіровоград"))
        {
            return "Степ (Посушлива зона)";
        }

        return "Лісостеп (Помірна зона)";
    }
}