using Zemlya.Api.Features.AgroFields;
using Zemlya.Api.Features.Recommendations.Models;

namespace Zemlya.Api.Features.Recommendations.Services;

public class CropGrowthStageResolver
{
    public CropGrowthStage GetGrowthStage(CropType crop, DateTime sowingDate)
    {
        var daysSinceSowing = (DateTime.UtcNow - sowingDate).Days;

        if (daysSinceSowing < 0)
        {
            return CropGrowthStage.Germination;
        }

        return crop switch
        {
            CropType.Wheat => daysSinceSowing switch
            {
                <= 20 => CropGrowthStage.Germination,
                <= 60 => CropGrowthStage.Vegetative,
                <= 90 => CropGrowthStage.Flowering,
                <= 115 => CropGrowthStage.Maturity,
                _ => CropGrowthStage.Harvested
            },
            CropType.Sunflower => daysSinceSowing switch
            {
                <= 15 => CropGrowthStage.Germination,
                <= 55 => CropGrowthStage.Vegetative,
                <= 85 => CropGrowthStage.Flowering,
                <= 110 => CropGrowthStage.Maturity,
                _ => CropGrowthStage.Harvested
            },
            CropType.Corn => daysSinceSowing switch
            {
                <= 15 => CropGrowthStage.Germination,
                <= 50 => CropGrowthStage.Vegetative,
                <= 80 => CropGrowthStage.Flowering,
                <= 115 => CropGrowthStage.Maturity,
                _ => CropGrowthStage.Harvested
            },
            _ => CropGrowthStage.Vegetative
        };
    }
}