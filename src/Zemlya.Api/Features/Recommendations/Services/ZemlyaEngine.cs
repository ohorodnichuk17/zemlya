using Zemlya.Api.Features.AgroFields;
using Zemlya.Api.Features.Recommendations.Models;
using Zemlya.Api.Infrastructure.Weather;

namespace Zemlya.Api.Features.Recommendations.Services;

public class ZemlyaEngine(
    AgroClimaticZoneResolver zoneResolver,
    CropGrowthStageResolver cropGrowthResolver,
    ForecastAggregator forecastAggregator,
    ReclamationScheduler reclamationScheduler,
    IrrigationScheduler irrigationScheduler,
    FertilizationScheduler fertilizationScheduler,
    ILogger<ZemlyaEngine> logger)
{
    public List<Recommendation> GenerateSchedule(AgroField field, List<ForecastItem> forecast)
    {
        var recommendations = new List<Recommendation>();

        // 1. Визначення агрокліматичної зони України за областю
        var zone = zoneResolver.ResolveZone(field.Oblast);

        // 2. Розрахунок фази росту культури за датою посіву
        var growthStage = cropGrowthResolver.ResolveGrowthStage(field.CropType, field.SowingDate);
        var context = new AgroContext(zone, growthStage);

        logger.LogInformation("Generating schedule for field {Name} ({CropType}, {SoilType}), Oblast: {Oblast}, Zone: {Zone}, Stage: {GrowthStage}", 
            field.Name, field.CropType, field.SoilType, field.Oblast, zone, growthStage);

        // 3. Якщо поле постраждало від обстрілів, додається рекомендацію щодо рекультивації
        if (field.ShellingImpactLevel != ShellingImpactLevel.None)
        {
            var reclamationRec = reclamationScheduler.GenerateReclamationRecommendation(field);
            recommendations.Add(reclamationRec);
        }

        // 4. Згрупування прогнозу погоди по днях
        var dailyWeatherList = forecastAggregator.AggregateForecast(forecast);

        // 5. Розрахунок поливу та підживлення по днях на основі прогнозу погоди та фази росту
        for (var dayIndex = 0; dayIndex < dailyWeatherList.Count; dayIndex++)
        {
            var dailyWeather = dailyWeatherList[dayIndex];
            var isFirstDay = (dayIndex == 0);

            // Полив
            var irrigation = irrigationScheduler.GenerateIrrigationRecommendation(field, dailyWeather, context);
            if (irrigation != null)
            {
                recommendations.Add(irrigation);
            }

            // Підживлення
            var fertilization = fertilizationScheduler.GenerateFertilizationRecommendation(field, dailyWeather, context, isFirstDay);
            if (fertilization != null)
            {
                recommendations.Add(fertilization);
            }
        }

        return recommendations;
    }
}