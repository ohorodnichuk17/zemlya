using Carter;
using MediatR;
using Microsoft.AspNetCore.Authorization;


namespace Zemlya.Api.Features.AgroFields.Patch;

public class PatchAgroFieldEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {        
        app.MapPatch("/api/fields/{id:guid}", [Authorize] async (Guid id, PatchOperation<AgroField>[] operation, ISender sender, CancellationToken cancellationToken) =>
        {
            var patch = PatchOperation<AgroField>.ConvertToJsonPatchDocument(operation);
            var result = await sender.Send(new PatchAgroFieldRequest(id, patch), cancellationToken);
            return Results.Ok(result);
        });
    }
}
