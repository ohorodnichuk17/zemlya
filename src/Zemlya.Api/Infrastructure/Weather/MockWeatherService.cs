using Zemlya.Api.Abstractions;

namespace Zemlya.Api.Infrastructure.Weather;

public class MockWeatherService(HttpClient httpClient) : IWeatherService
{
    public Task<CurrentWeather?> GetWeatherAsync(decimal lat, decimal lng, CancellationToken ct)
    {
        return Task.FromResult<CurrentWeather?>(new CurrentWeather(Temperature: 30m, Humidity: 35m, Main: "Unknown", Description: "No description", Rain1h: 0m));
        // return Task.FromResult<CurrentWeather?>(new CurrentWeather(Temperature: 18m, Humidity: 85m, Rain1h: 2.5m));
    }

    public Task<List<ForecastItem>?> GetForecastAsync(decimal lat, decimal lng, CancellationToken ct)
    {
        var forecastList = new List<ForecastItem>();
        var now = DateTime.UtcNow;
        for (int i = 0; i < 40; i++) // 5 days, 3-hour intervals
        {
            var forecastTime = now.AddHours(3 * i);
            var hour = forecastTime.Hour;
            var temp = Math.Round(22m + 8m * (decimal)Math.Sin((hour - 6) * Math.PI / 12), 2);
            var humidity = Math.Round(55m - 15m * (decimal)Math.Sin((hour - 6) * Math.PI / 12), 2);
            
            decimal rain = 0m;
            if (i >= 16 && i <= 22)
            {
                rain = 1.5m;
            }

            forecastList.Add(new ForecastItem(
                Dt: ((DateTimeOffset)forecastTime).ToUnixTimeSeconds(),
                Main: new ForecastMain(temp, humidity),
                Weather: [new ForecastWeather(rain > 0 ? "Rain" : "Clouds", rain > 0 ? "помірний дощ" : "хмарно з проясненнями")],
                Rain: rain > 0 ? new ForecastRain(rain) : null,
                DtTxt: forecastTime.ToString("yyyy-MM-dd HH:mm:ss")
            ));
        }
        return Task.FromResult<List<ForecastItem>?>(forecastList);
    }
}