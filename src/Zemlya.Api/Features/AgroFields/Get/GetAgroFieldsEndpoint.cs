using Carter;
using MediatR;

namespace Zemlya.Api.Features.AgroFields.Get;

public class GetAgroFieldsEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/agro-fields", async (ISender sender, CancellationToken cancellationToken) =>
        {
            var result = await sender.Send(new GetAgroFieldsRequest(), cancellationToken);
            return Results.Ok(result);
        }); 
    }
}
