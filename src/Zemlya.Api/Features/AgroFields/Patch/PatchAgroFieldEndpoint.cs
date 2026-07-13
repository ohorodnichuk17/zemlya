using Carter;
using MediatR;



namespace Zemlya.Api.Features.AgroFields.Patch;

public class PatchAgroFieldEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {        
        app.MapPatch("/api/fields/{id:guid}", async (Guid id, PatchOperation<AgroField>[] operation, ISender sender, CancellationToken cancellationToken) =>
        {
            var patch = PatchOperation<AgroField>.ConvertToJsonPatchDocument(operation);
            var result = await sender.Send(new PatchAgroFieldRequest(id, patch), cancellationToken);
            return Results.Ok(result);
        });
    }
}
