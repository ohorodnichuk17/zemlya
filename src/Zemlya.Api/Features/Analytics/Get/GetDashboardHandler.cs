using MediatR;
using Microsoft.EntityFrameworkCore;
using Zemlya.Api.Abstractions;
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
    AgroClimaticZoneResolver zoneResolver,
    CropGrowthStageResolver cropResolver,
    ILogger<GetDashboardHandler> logger) 
    : IRequestHandler<GetDashboardQuery, DashboardResponse>
{
    public async Task<DashboardResponse> Handle(GetDashboardQuery request, CancellationToken cancellationToken)
    {
        var field = await context.AgroFields
            .FirstOrDefaultAsync(f => f.Id == request.FieldId, cancellationToken);

        if (field == null)
        {
            throw new Exception("Поле не знайдено");
        }

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

        var recommendations = await context.Recommendations
            .Where(r => r.FieldId == field.Id)
            .OrderBy(r => r.ScheduledFor)
            .ToListAsync(cancellationToken);

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

        var growthStage = cropResolver.ResolveGrowthStage(field.CropType, field.SowingDate);
        var agroZone = zoneResolver.ResolveZone(field.Oblast);

        var forecastDtos = forecast.Select(f =>
        {
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
            AgroClimaticZone: agroZone.ToString(),
            GrowthStage: growthStage.ToString(),
            DaysSinceSowing: (DateTime.UtcNow - field.SowingDate).Days,
            CurrentTemperature: weather.Temperature,
            CurrentHumidity: weather.Humidity,
            RainAmount: weather.Rain1h,
            WeatherDescription: weather.Description,
            Forecast: forecastDtos,
            Recommendations: recDtos
        );
    }

    private static List<ForecastItem> GenerateFallbackForecast()
    {
        var forecastList = new List<ForecastItem>();
        var now = DateTime.UtcNow;
        for (var i = 0; i < 40; i++)
        {
            var forecastTime = now.AddHours(3 * i);
            var hour = forecastTime.Hour;
            var temp = Math.Round(22m + 8m * (decimal)Math.Sin((hour - 6) * Math.PI / 12), 2);
            var humidity = Math.Round(55m - 15m * (decimal)Math.Sin((hour - 6) * Math.PI / 12), 2);
            var rain = i is >= 16 and <= 22 ? 1.5m : 0m;

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
}