using Zemlya.Api.Infrastructure.Weather;

namespace Zemlya.Api.Abstractions;

public interface IWeatherService
{
    Task<CurrentWeather?> GetWeatherAsync(decimal lat, decimal lng, CancellationToken cancellationToken = default);
}