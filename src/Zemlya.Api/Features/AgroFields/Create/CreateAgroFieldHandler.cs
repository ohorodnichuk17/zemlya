using MediatR;
using Zemlya.Api.Abstractions;
using Zemlya.Api.Infrastructure.Database;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace Zemlya.Api.Features.AgroFields.CreateField;

public sealed record CreateAgroFieldRequest(
    string Name,
    CropType CropType,
    SoilType SoilType,
    decimal SizeHectares,
    decimal Latitude,
    decimal Longitude) : IRequest<Guid>;
public sealed class CreateAgroFieldHandler(DatabaseContext context) : IRequestHandler<CreateAgroFieldRequest, Guid>
{
    public async Task<Guid> Handle(CreateAgroFieldRequest request, CancellationToken cancellationToken)
    {
        var newAgroField = new AgroField
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            CropType = request.CropType,
            SoilType = request.SoilType,
            SizeHectares = request.SizeHectares,
            Latitude = request.Latitude,
            Longitude = request.Longitude,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await context.AgroFields.AddAsync(newAgroField, cancellationToken);

        await context.SaveChangesAsync(cancellationToken);

        return newAgroField.Id;
    }
}
