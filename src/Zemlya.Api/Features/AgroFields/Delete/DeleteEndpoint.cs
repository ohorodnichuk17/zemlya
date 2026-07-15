using Carter;
using MediatR;

namespace Zemlya.Api.Features.AgroFields.Delete;

public class DeleteEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapDelete("/api/fields/{id:guid}", async (Guid Id, ISender sender, CancellationToken cancellationToken) =>
        {
            await sender.Send(new DeleteRequest(Id), cancellationToken);
            return Results.NoContent();
        })
        .RequireAuthorization("OwnerOnly"); 
    }
}
