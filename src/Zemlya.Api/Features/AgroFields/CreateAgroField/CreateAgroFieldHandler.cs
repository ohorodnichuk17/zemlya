using Zemlya.Api.Abstractions;
using Zemlya.Api.Infrastructure.Database;

namespace Zemlya.Api.Features.AgroFields.CreateField;

public sealed record CreateAgroFieldRequest(
    string Name,
    CropType CropType,
    SoilType SoilType,
    decimal SizeHectares,
    decimal Latitude,
    decimal Longitude);
public sealed class CreateAgroFieldHandler(DatabaseContext context) : IHandler<CreateAgroFieldRequest, string>
{
    public async Task<string> HandleAsync(CreateAgroFieldRequest command, CancellationToken cancellationToken)
    {
        var newAgroField = new AgroField
        {
            Id = Guid.NewGuid(),
            Name = command.Name,
            CropType = command.CropType,
            SoilType = command.SoilType,
            SizeHectares = command.SizeHectares,
            Latitude = command.Latitude,
            Longitude = command.Longitude,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        await context.AgroFields.AddAsync(newAgroField,cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
        return newAgroField.Id.ToString();
    }
}
