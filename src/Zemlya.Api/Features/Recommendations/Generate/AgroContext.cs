namespace Zemlya.Api.Features.Recommendations.Generate;

public record AgroContext(
    UkrainianAgroZone Zone, 
    CropGrowthStage GrowthStage
);

public enum UkrainianAgroZone
{
    Polissya,
    ForestSteppe,
    Steppe
}

public enum CropGrowthStage
{
    Germination,
    Vegetative,
    Flowering,
    Maturity,
    Harvested
}
