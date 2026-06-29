using System.Globalization;
using Zemlya.Api.Features.AgroFields;
using Zemlya.Api.Infrastructure.Weather;

namespace Zemlya.Api.Features.Recommendations.Generate;

public class ZemlyaEngine(ILogger<ZemlyaEngine> logger)
{
    public RecommendationCalculationResult Calculate(
        CropType crop,
        SoilType soil,
        CurrentWeather weather)
    {
        var irrigationResult = CalculateIrrigation(crop, soil, weather);
        var fertilizerResult = CalculateFertilization(crop, soil, weather);

        return new RecommendationCalculationResult(
            irrigationResult.Amount,
            irrigationResult.Description,
            fertilizerResult.Amount,
            fertilizerResult.Description
        );
    }

    private (decimal Amount, string Description) CalculateIrrigation(
        CropType crop, 
        SoilType soil, 
        CurrentWeather weather)
    {
        // 1. Якщо йде дощ, полив не потрібен
        if (weather.Rain1h > 0m)
        {
            logger.LogInformation("Irrigation skipped: Rain detected ({0}mm)", weather.Rain1h);
            return (0m, $"Полив скасовано: виявлено активний дощ ({weather.Rain1h.ToString("0.##", CultureInfo.InvariantCulture)} мм/год).");
        }

        // 2. Базові потреби культур у воді (літри на гектар)
        var baseAmount = crop switch
        {
            CropType.Corn => 15000m,       // Висока потреба у волозі
            CropType.Wheat => 8000m,       // Помірна потреба у волозі
            CropType.Sunflower => 4000m,   // Посухостійка культура
            _ => 5000m
        };

        // 3. Коефіцієнт поглинання ґрунту
        var soilMultiplier = soil switch
        {
            SoilType.Chernozem => 0.9m,    // Відмінно утримує вологу, потребує менше поливу
            SoilType.Clay => 0.8m,         // Ризик перезволоження, зменшуємо об'єм
            SoilType.Podzol => 1.2m,       // Піщаний/підзолистий ґрунт, потребує більше води загалом, але її слід вносити порціями
            _ => 1.0m
        };

        var amount = baseAmount * soilMultiplier;

        // 4. Коефіцієнт екстремальних погодних умов (сильна спека та сухість)
        if (weather.Temperature > 28m && weather.Humidity < 40m)
        {
            amount *= 1.3m; // Збільшення на 30% через високу швидкість випаровування
        }

        // 5. Забезпечення точності десяткових знаків відповідно до лімітів БД (точність 10, 2)
        var finalAmount = Math.Round(amount, 2, MidpointRounding.AwayFromZero);

        // 6. Обробка частоти внесення та інструкцій щодо порцій
        string description;
        if (soil == SoilType.Podzol)
        {
            const int sessions = 3;
            var sessionAmount = Math.Round(finalAmount / sessions, 2, MidpointRounding.AwayFromZero);
            description = $"Піщаний ґрунт (підзолистий). Внесіть загальний об'єм за {sessions} окремі легкі сеанси поливу по {sessionAmount.ToString("0.##", CultureInfo.InvariantCulture)} л/га, щоб запобігти вимиванню хімікатів та поживних речовин у ґрунтові води.";
        }
        else
        {
            description = "Рекомендовано стандартний одноразовий полив.";
        }

        return (finalAmount, description);
    }

    private (decimal Amount, string Description) CalculateFertilization(
        CropType crop, 
        SoilType soil, 
        CurrentWeather weather)
    {
        // 1. Екологічне блокування: заборона внесення під час дощу для запобігання змиванню хімікатів у річки
        if (weather.Rain1h > 0.5m)
        {
            logger.LogWarning("Fertilization blocked: High runoff risk due to rain ({Rain}mm)", weather.Rain1h);
            return (0m, "Внесення добрив ЗАБОРОНЕНО: виявлено сильний дощ. Змив призведе до потрапляння хімікатів у сусідні річки.");
        }

        // 2. Базові норми внесення добрив (кг на гектар)
        var baseAmount = crop switch
        {
            CropType.Corn => 150m,
            CropType.Sunflower => 120m,   // Культура з високим споживанням калію та виснаженням азоту
            CropType.Wheat => 100m,
            _ => 80m
        };

        // 3. Коефіцієнти запобігання вимиванню з ґрунту
        var soilMultiplier = soil switch
        {
            SoilType.Chernozem => 0.8m,    // Дуже родючий, зменшуємо кількість синтетичних хімікатів на 20%
            SoilType.Podzol => 0.6m,       // Піщаний ґрунт: високий ризик вимивання. Обмежуємо разову дозу для захисту ґрунтових вод.
            SoilType.Clay => 1.0m,
            _ => 1.0m
        };

        var amount = baseAmount * soilMultiplier;

        // 4. Забезпечення точності десяткових знаків відповідно до лімітів БД (точність 10, 2)
        var finalAmount = Math.Round(amount, 2, MidpointRounding.AwayFromZero);

        // 5. Формування опису агрономічних інструкцій
        var details = new List<string>();

        if (crop == CropType.Sunflower)
        {
            details.Add("Культура суттєво виснажує азот; перевірте показник азоту в ґрунті після збору врожаю.");
        }

        if (soil == SoilType.Podzol)
        {
            const int splits = 2;
            var doseAmount = Math.Round(finalAmount / splits, 2, MidpointRounding.AwayFromZero);
            details.Add($"Ризик вимивання піщаного ґрунту. РОЗДІЛІТЬ внесення на {splits} легкі дози по {doseAmount.ToString("0.##", CultureInfo.InvariantCulture)} кг/га.");
        }
        else if (soil == SoilType.Chernozem)
        {
            details.Add("Природно родючий чорнозем. Хімічне навантаження знижено на 20%.");
        }

        var description = details.Count > 0 
            ? string.Join(" ", details) 
            : "Стандартна одноразова доза внесення добрив.";

        return (finalAmount, description);
    }
}

public record RecommendationCalculationResult(
    decimal IrrigationAmount, 
    string IrrigationDescription, 
    decimal FertilizerAmount, 
    string FertilizerDescription
);