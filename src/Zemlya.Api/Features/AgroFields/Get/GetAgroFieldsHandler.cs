using MediatR;
using Microsoft.EntityFrameworkCore;
using Zemlya.Api.Infrastructure.Database;

namespace Zemlya.Api.Features.AgroFields.Get;

public sealed record GetAgroFieldsRequest(bool IsArchived,int Page = 0, int SizeOfPage = 10) : IRequest<PaginationAgroFieldsResponse>;

public sealed record GetAgroFieldsResponse(
    Guid Id,
    string Name,
    string CropType,
    string SoilType,
    decimal SizeHectares,
    decimal Latitude,
    decimal Longitude,
    string Oblast,
    string ShellingImpactLevel,
    DateTime SowingDate,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    ICollection<RecommendationDto> Recommendations);

public sealed record RecommendationDto(
    Guid Id,
    string ActionType,
    DateTime ScheduledFor,
    decimal Amount,
    bool IsCompleted,
    string? Description
);

public sealed record PaginationAgroFieldsResponse(
    ICollection<GetAgroFieldsResponse> Fields,
    int TotalCount);

public class GetAgroFieldsHandler(DatabaseContext context) : IRequestHandler<GetAgroFieldsRequest, PaginationAgroFieldsResponse>
{
    public async Task<PaginationAgroFieldsResponse> Handle(GetAgroFieldsRequest request, CancellationToken cancellationToken)
    {
        var totalCount = await context.AgroFields.AsNoTracking().Where(f => f.IsArchived == request.IsArchived).CountAsync(cancellationToken);

        var fields = await context.AgroFields
            .AsNoTracking()
            .Where(f => f.IsArchived == request.IsArchived)
            .OrderBy(af => af.CreatedAt)
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
                af.Oblast,
                af.ShellingImpactLevel.ToString(),
                af.SowingDate,
                af.CreatedAt,
                af.UpdatedAt,
                af.Recommendations
                    .OrderBy(r => r.ScheduledFor)
                    .Select(r => new RecommendationDto(
                        r.Id,
                        r.ActionType.ToString(),
                        r.ScheduledFor,
                        r.Amount,
                        r.IsCompleted,
                        r.Description
                    ))
                    .ToList()
            ))
            .ToListAsync(cancellationToken);

        return new PaginationAgroFieldsResponse(fields, totalCount);
    }
}
