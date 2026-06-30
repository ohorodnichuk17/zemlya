namespace Zemlya.Api.Features.Recommendations.Models;

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

// Стадії росту культури
public enum CropGrowthStage
{
    Germination,    // Проростання
    Vegetative,     // Вегетація
    Flowering,      // Цвітіння
    Maturity,       // Дозрівання
    Harvested       // Зібрані
}
