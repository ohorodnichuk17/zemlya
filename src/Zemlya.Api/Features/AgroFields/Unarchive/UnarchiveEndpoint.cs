using Carter;
using MediatR;
using Microsoft.AspNetCore.Authorization;

namespace Zemlya.Api.Features.AgroFields.Unarchive;

public class UnarchiveEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPatch("/api/fields/{id:guid}/unarchive", [Authorize] async (Guid Id, ISender sender, CancellationToken cancellationToken) =>
        {
            await sender.Send(new UnarchiveRequest(Id));
        });
    }
}
