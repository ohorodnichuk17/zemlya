using MediatR;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.EntityFrameworkCore;
using Zemlya.Api.Abstractions;
using Zemlya.Api.Features.Recommendations.Services;
using Zemlya.Api.Infrastructure.Database;

namespace Zemlya.Api.Features.AgroFields.Patch;

public sealed record PatchAgroFieldRequest(Guid Id, JsonPatchDocument<AgroField> Patch) : IRequest;
public sealed class PatchAgroFieldHandler(DatabaseContext context,
    IZemlyaEngine engine, 
    IWeatherService weatherService,
    ILogger<PatchAgroFieldHandler> logger) : IRequestHandler<PatchAgroFieldRequest>
{
    public async Task Handle(PatchAgroFieldRequest request, CancellationToken cancellationToken)
    {
        var agroField = await context.AgroFields.FirstOrDefaultAsync(af => af.Id == request.Id, cancellationToken);

        if (agroField == null)
        {
            logger.LogWarning("Agro field not found.");
            throw new KeyNotFoundException("Agro field not found.");
        }
        if(agroField.IsArchived == true || agroField.IsDeleted == true)
        {
            logger.LogWarning("No access to this field.");
            throw new InvalidOperationException("No access to this field.");
        }

        request.Patch.ApplyTo(agroField);

        var entry = context.Entry(agroField);

        //Перевірка чи були змінені поля ShellingImpactLevel та SowingDate

        var propertyShellingImpactLevel = entry.Property(p => p.ShellingImpactLevel);
        var propertySowingDate = entry.Property(p => p.SowingDate);

        if (propertyShellingImpactLevel.IsModified == true || propertySowingDate.IsModified == true)
        {
            var forecast = await weatherService.GetForecastAsync(agroField.Latitude, agroField.Longitude, cancellationToken);

            if(forecast == null) logger.LogWarning("Forecast is null, passing an empty array");

            context.Recommendations.RemoveRange(context.Recommendations.Where(r => r.FieldId == agroField.Id));

            var recommendations = engine.GenerateSchedule(agroField, forecast ?? []);

            context.Recommendations.AddRange(recommendations);

            agroField.Recommendations = recommendations;

        }          
            
        agroField.UpdatedAt = DateTime.UtcNow;

        await context.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Changes are saved");

    }
}
