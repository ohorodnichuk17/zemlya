using Zemlya.Api.Infrastructure.Weather;

namespace Zemlya.Api.Features.Recommendations.Generate;

public class ForecastAggregator
{
    public List<DailyWeatherMetrics> AggregateForecast(List<ForecastItem> forecast)
    {
        var forecastByDay = forecast
            .GroupBy(f => DateTimeOffset.FromUnixTimeSeconds(f.Dt).UtcDateTime.Date)
            .OrderBy(g => g.Key)
            .Take(5)
            .ToList();

        var dailyMetrics = new List<DailyWeatherMetrics>();

        for (var i = 0; i < forecastByDay.Count; i++)
        {
            var dayGroup = forecastByDay[i];
            var targetDate = dayGroup.Key;

            var avgTemp = dayGroup.Average(f => f.Main.Temp);
            var maxTemp = dayGroup.Max(f => f.Main.Temp);
            var avgHumidity = dayGroup.Average(f => f.Main.Humidity);
            var totalRain = dayGroup.Sum(f => f.Rain?.Rain3h ?? 0m);

            var rainNext24h = 0m;
            if (i + 1 < forecastByDay.Count)
            {
                rainNext24h = forecastByDay[i + 1].Sum(f => f.Rain?.Rain3h ?? 0m);
            }

            dailyMetrics.Add(new DailyWeatherMetrics(
                TargetDate: targetDate,
                AvgTemp: avgTemp,
                MaxTemp: maxTemp,
                AvgHumidity: avgHumidity,
                TotalRain: totalRain,
                RainNext24h: rainNext24h
            ));
        }

        return dailyMetrics;
    }
}