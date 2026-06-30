namespace Zemlya.Api.Features.Recommendations.Generate;

public record DailyWeatherMetrics(
    DateTime TargetDate,
    decimal AvgTemp,
    decimal MaxTemp,
    decimal AvgHumidity,
    decimal TotalRain,
    decimal RainNext24h
);
