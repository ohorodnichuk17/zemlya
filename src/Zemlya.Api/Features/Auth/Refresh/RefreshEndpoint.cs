using Carter;
using MediatR;

namespace Zemlya.Api.Features.Auth.Refresh;

public class RefreshEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/auth/refresh", async (
            RefreshRequest request,
            ISender sender,
            CancellationToken cancellationToken) =>
        {
            var response = await sender.Send(request, cancellationToken);
            return TypedResults.Ok(response);
        })
        .Produces<RefreshResponse>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status401Unauthorized)
        .WithTags("Auth")
        .AllowAnonymous();
    }
}