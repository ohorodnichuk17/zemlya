using Carter;
using MediatR;

namespace Zemlya.Api.Features.AgroFields.Archive;

public class ArchiveEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPatch("/api/fields/{id:guid}/archive", async (Guid id, ISender sender, CancellationToken cancellationToken) =>
        {
            await sender.Send(new ArchiveRequest(id), cancellationToken);
            return Results.NoContent();
        })
        .RequireAuthorization("OwnerOnly"); 
    }
}
