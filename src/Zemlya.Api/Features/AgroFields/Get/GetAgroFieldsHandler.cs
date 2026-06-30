using MediatR;
using Microsoft.EntityFrameworkCore;
using Zemlya.Api.Features.Recommendations;
using Zemlya.Api.Infrastructure.Database;

namespace Zemlya.Api.Features.AgroFields.Get;

public sealed record GetAgroFieldsRequest(int Page, int SizeOfPage) : IRequest<PaginationAgroFieldsResponse>;
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
    ICollection<Guid> RecommendationsId);
public sealed record PaginationAgroFieldsResponse(
    ICollection<GetAgroFieldsResponse> Fields,
    int TotalCount);
public class GetAgroFieldsHandler(DatabaseContext context) : IRequestHandler<GetAgroFieldsRequest, PaginationAgroFieldsResponse>
{
    public async Task<PaginationAgroFieldsResponse> Handle(GetAgroFieldsRequest request, CancellationToken cancellationToken)
    {
        return new PaginationAgroFieldsResponse(
            await context.AgroFields
            .Skip(request.Page * request.SizeOfPage)
            .Take(request.SizeOfPage)
            .Select(af => new GetAgroFieldsResponse(
            af.Id,
            af.Name,
            af.CropType.ToString(),
            af.SoilType.ToString(),
            af.SizeHectares,
            af.Latitude,
            af.Longitude,
            af.CreatedAt,
            af.UpdatedAt,
            af.Recommendations.Select(r => r.Id).ToList()
            ))
            .ToListAsync(),
            await context.AgroFields.CountAsync());
    }
}
