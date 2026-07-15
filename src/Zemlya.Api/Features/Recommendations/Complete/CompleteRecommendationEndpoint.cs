using Carter;
using MediatR;

namespace Zemlya.Api.Features.Recommendations.Complete;

public class CompleteRecommendationEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/recommendations/{id:guid}/complete", async (Guid id, ISender sender, CancellationToken cancellationToken) =>
        {
            var success = await sender.Send(new CompleteRecommendationCommand(id), cancellationToken);
            return Results.Ok(new { Success = true });
        })
        .RequireAuthorization("CanWrite"); 
    }
}
