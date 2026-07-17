using System.Globalization;
using Zemlya.Api.Abstractions;

namespace Zemlya.Api.Infrastructure.Weather;

public class WeatherService(
    HttpClient httpClient,
    IConfiguration configuration,
    ILogger<WeatherService> logger)
    : IWeatherService
{
    private readonly string _apiKey = configuration["OpenWeatherMap:ApiKey"] 
                                      ?? throw new InvalidOperationException("OpenWeatherMap ApiKey is not configured. Please add 'OpenWeatherMap:ApiKey' to appsettings.json.");

    public async Task<CurrentWeather?> GetWeatherAsync(decimal lat, decimal lng, CancellationToken cancellationToken = default)
    {
        try
        {
            var latStr = lat.ToString(CultureInfo.InvariantCulture);
            var lonStr = lng.ToString(CultureInfo.InvariantCulture);
            
            var url = $"https://api.openweathermap.org/data/2.5/weather?lat={latStr}&lon={lonStr}&appid={_apiKey}&units=metric";
            
            logger.LogInformation("Fetching weather data from OpenWeatherMap for Lat: {0}, Lng: {1}", latStr, lonStr);
            
            var response = await httpClient.GetAsync(url, cancellationToken);
            
            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync(cancellationToken);
                logger.LogError("Failed to fetch weather data. Status: {0}, Error: {1}", response.StatusCode, errorContent);
                return null;
            }

            var weatherData = await response.Content.ReadFromJsonAsync<WeatherResponse>(cancellationToken: cancellationToken);
            
            if (weatherData == null)
            {
                logger.LogWarning("Weather data was null after deserialization.");
                return null;
            }
            
            var mainWeather = weatherData.Weather?.FirstOrDefault();
            
            return new CurrentWeather(
                Temperature: weatherData.Main.Temp,
                Humidity: weatherData.Main.Humidity,
                Main: mainWeather?.Main ?? "Unknown",
                Description: mainWeather?.Description ?? "No description",
                Rain1h: weatherData.Rain?.Rain1h ?? 0m
            );
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while fetching weather data for Lat: {0}, Lng: {1}.", lat, lng);
            return null;
        }
    }

    public async Task<List<ForecastItem>?> GetForecastAsync(decimal lat, decimal lng, CancellationToken cancellationToken = default)
    {
        try
        {
            var latStr = lat.ToString(CultureInfo.InvariantCulture);
            var lonStr = lng.ToString(CultureInfo.InvariantCulture);
            
            var url = $"https://api.openweathermap.org/data/2.5/forecast?lat={latStr}&lon={lonStr}&appid={_apiKey}&units=metric";
            
            logger.LogInformation("Fetching weather forecast data from OpenWeatherMap for Lat: {0}, Lng: {1}", latStr, lonStr);
            
            var response = await httpClient.GetAsync(url, cancellationToken);
            
            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync(cancellationToken);
                logger.LogError("Failed to fetch weather forecast. Status: {0}, Error: {1}", response.StatusCode, errorContent);
                return null;
            }
            
            var forecastData = await response.Content.ReadFromJsonAsync<ForecastResponse>(cancellationToken: cancellationToken);
            return forecastData?.List;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while fetching weather forecast for Lat: {0}, Lng: {1}.", lat, lng);
            return null;
        }
    }
}
