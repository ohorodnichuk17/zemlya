using System.Text.Json.Serialization;

namespace Zemlya.Api.Infrastructure.Weather;

public record ForecastResponse(
    [property: JsonPropertyName("list")] List<ForecastItem> List
);

public record ForecastItem(
    [property: JsonPropertyName("dt")] long Dt,
    [property: JsonPropertyName("main")] ForecastMain Main,
    [property: JsonPropertyName("weather")] List<ForecastWeather> Weather,
    [property: JsonPropertyName("rain")] ForecastRain? Rain,
    [property: JsonPropertyName("dt_txt")] string DtTxt
);

public record ForecastMain(
    [property: JsonPropertyName("temp")] decimal Temp,
    [property: JsonPropertyName("humidity")] decimal Humidity
);

public record ForecastWeather(
    [property: JsonPropertyName("main")] string Main,
    [property: JsonPropertyName("description")] string Description
);

public record ForecastRain(
    [property: JsonPropertyName("3h")] decimal? Rain3h
);
