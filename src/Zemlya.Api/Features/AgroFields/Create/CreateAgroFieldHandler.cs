using MediatR;
using Zemlya.Api.Abstractions;
using Zemlya.Api.Exceptions;
using Zemlya.Api.Infrastructure.Database;

namespace Zemlya.Api.Features.AgroFields.Create;

public sealed record CreateAgroFieldRequest(
    string Name,
    CropType CropType,
    SoilType SoilType,
    decimal SizeHectares,
    decimal Latitude,
    decimal Longitude,
    string Oblast,
    ShellingImpactLevel ShellingImpactLevel,
    DateTime SowingDate) : IRequest<Guid>;

public sealed class CreateAgroFieldHandler(
    DatabaseContext context,
    IWeatherService weatherService,
    IZemlyaEngine engine,
    ITenantProvider tenantProvider) 
    : IRequestHandler<CreateAgroFieldRequest, Guid>
{
    public async Task<Guid> Handle(CreateAgroFieldRequest request, CancellationToken cancellationToken)
    {
        var tenantId = tenantProvider.GetCurrentTenantId()
            ?? throw new UnauthorizedException("TenantId not found in token. Is the user authenticated?");

        var newAgroField = new AgroField
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            CropType = request.CropType,
            SoilType = request.SoilType,
            SizeHectares = request.SizeHectares,
            Latitude = request.Latitude,
            Longitude = request.Longitude,
            Oblast = request.Oblast,
            ShellingImpactLevel = request.ShellingImpactLevel,
            SowingDate = DateTime.SpecifyKind(request.SowingDate, DateTimeKind.Utc),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            TenantId = tenantId
        };

        await context.AgroFields.AddAsync(newAgroField, cancellationToken);

        var forecast = await weatherService.GetForecastAsync(request.Latitude, request.Longitude, cancellationToken);
        
        forecast ??= [];

        var initialRecs = engine.GenerateSchedule(newAgroField, forecast);
        foreach (var rec in initialRecs)
        {
            rec.AgroField = newAgroField;
            rec.FieldId = newAgroField.Id;
            await context.Recommendations.AddAsync(rec, cancellationToken);
        }

        await context.SaveChangesAsync(cancellationToken);

        return newAgroField.Id;
    }
}
