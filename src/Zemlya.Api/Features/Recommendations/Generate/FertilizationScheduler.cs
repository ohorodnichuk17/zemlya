using Zemlya.Api.Features.AgroFields;

namespace Zemlya.Api.Features.Recommendations.Generate;

public class FertilizationScheduler
{
    public Recommendation? GenerateFertilizationRecommendation(
        AgroField field, 
        DailyWeatherMetrics weather, 
        AgroContext context,
        bool isFirstDay)
    {
        var fertilizerBase = GetBaseFertilization(field.CropType);
        var cropFertilizerMultiplier = GetStageFertilizerMultiplier(context.GrowthStage);
        var soilFertilizerMultiplier = GetSoilFertilizerMultiplier(field.SoilType);

        var fertilizerAmount = fertilizerBase * cropFertilizerMultiplier * soilFertilizerMultiplier;

        // Екологічні обмеження на внесення добрив
        string? fertilizerBlockReason = null;

        if (weather.TotalRain > 0.5m || weather.RainNext24h > 5.0m)
        {
            fertilizerBlockReason = "Внесення скасовано: високий ризик вимивання азоту та забруднення водойм через прогнозовані опади.";
        }
        else if (weather.MaxTemp > 30m)
        {
            fertilizerBlockReason = "Внесення відкладено: екстремальна спека (>30°C) може призвести до хімічних опіків рослин.";
        }
        else if (context.GrowthStage == CropGrowthStage.Maturity || context.GrowthStage == CropGrowthStage.Harvested)
        {
            fertilizerBlockReason = "Підживлення не проводиться на етапі дозрівання культурами для запобігання накопиченню нітратів у врожаї.";
        }

        fertilizerAmount = Math.Round(fertilizerAmount, 2, MidpointRounding.AwayFromZero);

        if (fertilizerAmount > 0 && fertilizerBlockReason == null)
        {
            var details = new List<string>();
            if (field.CropType == CropType.Sunflower)
            {
                details.Add("Фокус на калійні добрива.");
            }
            else if (field.CropType == CropType.Wheat)
            {
                details.Add("Фокус на азотне підживлення.");
            }

            if (field.SoilType == SoilType.Chernozem)
            {
                details.Add("Родючий чорнозем, норму знижено на 20%.");
            }

            var desc = details.Count > 0 ? string.Join(" ", details) : "Стандартне внесення комплексних добрив.";

            return new Recommendation
            {
                Id = Guid.NewGuid(),
                FieldId = field.Id,
                ActionType = ActionType.Fertilization,
                ScheduledFor = DateTime.SpecifyKind(weather.TargetDate, DateTimeKind.Utc).AddHours(9), // Внесення вранці
                Amount = fertilizerAmount,
                IsCompleted = false,
                Description = desc
            };
        }
        
        if (fertilizerBlockReason != null && isFirstDay) 
        {
            return CreateRecommendation(
                fieldId: field.Id, 
                scheduledFor: DateTime.SpecifyKind(weather.TargetDate, DateTimeKind.Utc).AddHours(9),
                amount: 0m,
                description: fertilizerBlockReason
            );
        }

        return null;
    }

    private static decimal GetBaseFertilization(CropType crop) => crop switch
    {
        CropType.Corn => 150m,
        CropType.Sunflower => 120m,
        CropType.Wheat => 100m,
        _ => 80m
    };

    private static decimal GetStageFertilizerMultiplier(CropGrowthStage stage) => stage switch
    {
        CropGrowthStage.Germination => 0.3m,
        CropGrowthStage.Vegetative => 1.0m,
        CropGrowthStage.Flowering => 0.7m,
        CropGrowthStage.Maturity => 0.0m,
        CropGrowthStage.Harvested => 0.0m,
        _ => 1.0m
    };

    private static decimal GetSoilFertilizerMultiplier(SoilType soil) => soil switch
    {
        SoilType.Chernozem => 0.8m,  // Природно родючий, економимо хімікати
        SoilType.Podzol => 0.7m,     // Високий ризик вимивання, зменшуємо разову порцію
        SoilType.Clay => 1.0m,
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
            ActionType = ActionType.Fertilization,
            ScheduledFor = scheduledFor,
            Amount = amount,
            IsCompleted = false,
            Description = description
        };
    }
}
