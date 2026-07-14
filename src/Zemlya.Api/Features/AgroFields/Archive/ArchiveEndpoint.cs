using Carter;
using MediatR;
using Microsoft.AspNetCore.Authorization;

namespace Zemlya.Api.Features.AgroFields.Archive;

public class ArchiveEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPatch("/api/fields/{id:guid}/archive", [Authorize] async (Guid id, ISender sender, CancellationToken cancellationToken) =>
        {
            await sender.Send(new ArchiveRequest(id), cancellationToken);
        });
    }
}
