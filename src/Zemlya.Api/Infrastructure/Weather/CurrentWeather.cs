namespace Zemlya.Api.Infrastructure.Weather;

public record CurrentWeather(
    decimal Temperature,
    decimal Humidity,
    string Main,
    string Description,
    decimal Rain1h
);
