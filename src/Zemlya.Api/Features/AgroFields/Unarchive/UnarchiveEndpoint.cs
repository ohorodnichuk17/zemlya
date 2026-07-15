using Carter;
using MediatR;

namespace Zemlya.Api.Features.AgroFields.Unarchive;

public class UnarchiveEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPatch("/api/fields/{id:guid}/unarchive", async (Guid Id, ISender sender, CancellationToken cancellationToken) =>
        {
            await sender.Send(new UnarchiveRequest(Id));
            return Results.NoContent();
        })
        .RequireAuthorization("OwnerOnly"); 
    }
}
