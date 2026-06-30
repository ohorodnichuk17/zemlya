namespace Zemlya.Api.Features.Recommendations.Models;

public record DailyWeatherMetrics(
    DateTime TargetDate,
    decimal AvgTemp,
    decimal MaxTemp,
    decimal AvgHumidity,
    decimal TotalRain,
    decimal RainNext24h
);
