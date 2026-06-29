using System.Text.Json.Serialization;

namespace Zemlya.Api.Infrastructure.Weather;

public record WeatherResponse(MainInfo Main, WeatherDto[] Weather, RainInfo? Rain);
public record MainInfo(decimal Temp, decimal Humidity);
public record WeatherDto(string Main, string Description);
public record RainInfo([property: JsonPropertyName("1h")] decimal? Rain1h);
