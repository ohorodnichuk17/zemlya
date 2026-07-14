using Carter;
using MediatR;
using Microsoft.AspNetCore.Authorization;

namespace Zemlya.Api.Features.Recommendations.Complete;

public class CompleteRecommendationEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/recommendations/{id:guid}/complete", [Authorize] async (Guid id, ISender sender, CancellationToken cancellationToken) =>
        {
            var success = await sender.Send(new CompleteRecommendationCommand(id), cancellationToken);
            return success ? Results.Ok(new { Success = true }) : Results.NotFound(new { Message = "Рекомендацію не знайдено" });
        });
    }
}
