using Zemlya.Api.Features.AgroFields;

namespace Zemlya.Api.Features.Recommendations.Generate;

public class IrrigationScheduler(ILogger<IrrigationScheduler> logger)
{
    public Recommendation? GenerateIrrigationRecommendation(
        AgroField field, 
        DailyWeatherMetrics weather, 
        AgroContext context)
    {
        var irrigationBase = GetBaseIrrigation(field.CropType);
        var cropIrrigationMultiplier = GetStageIrrigationMultiplier(context.GrowthStage);
        var soilIrrigationMultiplier = GetSoilIrrigationMultiplier(field.SoilType);
        var zoneIrrigationMultiplier = GetZoneIrrigationMultiplier(context.Zone);

        var irrigationAmount = irrigationBase * cropIrrigationMultiplier * soilIrrigationMultiplier * zoneIrrigationMultiplier;

        // Збільшення норми поливу у спеку
        if (weather is { MaxTemp: > 28m, AvgHumidity: < 40m })
        {
            irrigationAmount *= 1.3m;
        }

        irrigationAmount = Math.Round(irrigationAmount, 2, MidpointRounding.AwayFromZero);

        // Правила блокування поливу на основі опадів
        if (weather.TotalRain > 2.0m || weather.RainNext24h > 3.0m)
        {
            logger.LogInformation("Day {TargetDate}: Irrigation skipped due to forecasted rain (Today: {TotalRain}mm, Next24h: {RainNext24h}mm)", 
                weather.TargetDate.ToShortDateString(), weather.TotalRain, weather.RainNext24h);
            return null;
        }
        
        if (context.GrowthStage == CropGrowthStage.Maturity || context.GrowthStage == CropGrowthStage.Harvested)
        {
            logger.LogInformation("Day {TargetDate}: Irrigation skipped due to ripening stage", weather.TargetDate.ToShortDateString());
            return null;
        }

        if (irrigationAmount <= 0)
        {
            return null;
        }
        
        var desc = field.SoilType == SoilType.Podzol 
            ? "Піщаний підзолистий ґрунт. Полив розділити на 2 сесії протягом дня, щоб запобігти вимиванню поживних речовин." 
            : "Рекомендовано рівномірний крапельний полив у вечірній час.";

        return CreateRecommendation(
            fieldId: field.Id,
            scheduledFor: DateTime.SpecifyKind(weather.TargetDate, DateTimeKind.Utc).AddHours(18),
            amount: irrigationAmount,
            description: desc
        );

    }

    private static decimal GetBaseIrrigation(CropType crop) => crop switch
    {
        CropType.Corn => 15000m,
        CropType.Wheat => 8000m,
        CropType.Sunflower => 5000m,
        _ => 6000m
    };

    private static decimal GetStageIrrigationMultiplier(CropGrowthStage stage) => stage switch
    {
        CropGrowthStage.Germination => 0.5m,
        CropGrowthStage.Vegetative => 1.0m,
        CropGrowthStage.Flowering => 1.5m,
        CropGrowthStage.Maturity => 0.3m,
        CropGrowthStage.Harvested => 0.0m,
        _ => 1.0m
    };

    private static decimal GetSoilIrrigationMultiplier(SoilType soil) => soil switch
    {
        SoilType.Chernozem => 0.9m,  // Утримує вологу
        SoilType.Clay => 0.8m,       // Ризик застою води
        SoilType.Podzol => 1.2m,     // Піщаний, швидко дренує
        _ => 1.0m
    };

    private static decimal GetZoneIrrigationMultiplier(UkrainianAgroZone zone) => zone switch
    {
        UkrainianAgroZone.Polissya => 0.7m,    // Надлишкове зволоження
        UkrainianAgroZone.ForestSteppe => 1.0m, // Помірне зволоження
        UkrainianAgroZone.Steppe => 1.4m,       // Посушливий південь/схід
        _ => 1.0m
    };
    
    private static Recommendation CreateRecommendation(
        Guid fieldId,
        DateTime scheduledFor,
        decimal amount,
        string description)
    {
        return new Recommendation
        {
            Id = Guid.NewGuid(),
            FieldId = fieldId,
            ActionType = ActionType.Irrigation,
            ScheduledFor = scheduledFor,
            Amount = amount,
            IsCompleted = false,
            Description = description
        };
    }
}
