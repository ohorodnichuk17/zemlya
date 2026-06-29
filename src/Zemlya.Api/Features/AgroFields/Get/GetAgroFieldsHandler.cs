using MediatR;
using Microsoft.EntityFrameworkCore;
using Zemlya.Api.Features.Recommendations;
using Zemlya.Api.Infrastructure.Database;

namespace Zemlya.Api.Features.AgroFields.Get;

public sealed record GetAgroFieldsRequest(int Page, int SizeOfPage) : IRequest<ICollection<GetAgroFieldsResponse>>;
public sealed record GetAgroFieldsResponse(
    Guid Id,
    string Name,
    string CropType,
    string SoilType,
    decimal SizeHectares,
    decimal Latitude,
    decimal Longitude,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    ICollection<Recommendation> Recommendations);
public class GetAgroFieldsHandler(DatabaseContext context) : IRequestHandler<GetAgroFieldsRequest, ICollection<GetAgroFieldsResponse>>
{
    public async Task<ICollection<GetAgroFieldsResponse>> Handle(GetAgroFieldsRequest request, CancellationToken cancellationToken)
    {
        return await context.AgroFields.Skip(request.Page * request.SizeOfPage).Take(request.SizeOfPage).Select(af => new GetAgroFieldsResponse(
            af.Id,
            af.Name,
            af.CropType.ToString(),
            af.SoilType.ToString(),
            af.SizeHectares,
            af.Latitude,
            af.Longitude,
            af.CreatedAt,
            af.UpdatedAt,
            af.Recommendations
            ))
            .ToListAsync();
    }
}
