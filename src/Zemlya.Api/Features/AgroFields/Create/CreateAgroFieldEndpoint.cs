using Carter;
using MediatR;
using Microsoft.AspNetCore.Authorization;

namespace Zemlya.Api.Features.AgroFields.Create;

public class CreateAgroFieldEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/fields", [Authorize] async (CreateAgroFieldRequest request,
            ISender sender,
            CancellationToken cancellationToken) =>
        {
            var result = await sender.Send(request, cancellationToken);
            return Results.Created();
        });
    }
}
