using Carter;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Zemlya.Api.Features.AgroFields.Delete;

public class DeleteEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapDelete("api/fields/{id:guid}", [Authorize] async (Guid Id, ISender sender, CancellationToken cancellationToken) =>
        {
            await sender.Send(new DeleteRequest(Id));
        });
    }
}
