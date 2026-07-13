using Carter;
using MediatR;

namespace Zemlya.Api.Features.Auth.Register;

public class RegisterEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/auth/register", async (RegisterRequest request,
            ISender sender,
            CancellationToken cancellationToken) =>
        {
            var response = await sender.Send(request, cancellationToken);
            return Results.Created(
                $"/api/auth/register/{response.UserId}"
                , response);
        })
        .Produces<RegisterResponse>(StatusCodes.Status201Created)
        .Produces(StatusCodes.Status409Conflict)
        .Produces(StatusCodes.Status400BadRequest)
        .WithTags("Auth");
    }
}