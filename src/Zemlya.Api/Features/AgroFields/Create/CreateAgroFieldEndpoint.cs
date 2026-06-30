using Carter;
using MediatR;

namespace Zemlya.Api.Features.AgroFields.Create;

public class CreateAgroFieldEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/fields", async (CreateAgroFieldRequest request,
            ISender sender,
            CancellationToken cancellationToken) =>
        {
            var result = await sender.Send(request, cancellationToken);
            return Results.Created();
        });
    }
}
