using Carter;
using MediatR;

namespace Zemlya.Api.Features.AgroFields.Get;

public class GetAgroFieldsEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/fields", async (int Page, int SizeOfPage, ISender sender, CancellationToken cancellationToken) =>
        {
            var result = await sender.Send(new GetAgroFieldsRequest(Page,SizeOfPage), cancellationToken);
            return Results.Ok(result);
        }); 
    }
}
