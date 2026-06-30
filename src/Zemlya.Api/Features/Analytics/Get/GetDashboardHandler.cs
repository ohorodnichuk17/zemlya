using MediatR;
using Microsoft.EntityFrameworkCore;
using Zemlya.Api.Abstractions;
using Zemlya.Api.Features.Recommendations.Generate;
using Zemlya.Api.Infrastructure.Database;

namespace Zemlya.Api.Features.Analytics.Get;

public sealed record GetDashboardQuery(Guid FieldId) : IRequest<DashboardResponse>;

public sealed record DashboardResponse(
    string FieldName,
    string Crop,
    string Soil,
    decimal CurrentTemperature,
    decimal CurrentHumidity,
    decimal RainAmount,
    decimal IrrigationAmount,
    string IrrigationDescription,
    decimal FertilizerAmount,
    string FertilizerDescription
);

public class GetDashboardHandler(DatabaseContext context
    , IWeatherService weatherService
    , ZemlyaEngine engine) 
    : IRequestHandler<GetDashboardQuery, DashboardResponse>
{
    public async Task<DashboardResponse> Handle(GetDashboardQuery request, CancellationToken cancellationToken)
    {
        var field = await context.AgroFields
            .FirstOrDefaultAsync(f => f.Id == request.FieldId, cancellationToken);

        if (field == null)
            throw new Exception("Поле не знайдено");

        var weather = await weatherService.GetWeatherAsync(field.Latitude, field.Longitude, cancellationToken);

        var result = engine.Calculate(field.CropType, field.SoilType, weather);

        return new DashboardResponse(
            field.Name,
            field.CropType.ToString(),
            field.SoilType.ToString(),
            weather.Temperature,
            weather.Humidity,
            weather.Rain1h,
            result.IrrigationAmount,
            result.IrrigationDescription,
            result.FertilizerAmount,
            result.FertilizerDescription
        );
    }
}