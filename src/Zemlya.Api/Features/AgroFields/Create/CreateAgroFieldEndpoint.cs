using Carter;
using MediatR;
using Zemlya.Api.Abstractions;

namespace Zemlya.Api.Features.AgroFields.CreateField;

public class CreateAgroFieldEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/agro-fields", async (CreateAgroFieldRequest request,
            ISender sender,
            CancellationToken cancellationToken) =>
        {
            var result = await sender.Send(request, cancellationToken);
            return Results.Created();
        });
    }
}
