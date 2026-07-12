using Zemlya.Api.Features.AgroFields;
using Zemlya.Api.Features.Recommendations;
using Zemlya.Api.Infrastructure.Weather;

namespace Zemlya.Api.Abstractions;

public interface IZemlyaEngine
{
    List<Recommendation> GenerateSchedule(AgroField field, List<ForecastItem> forecast);
}