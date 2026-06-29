using Zemlya.Api.Abstractions;

namespace Zemlya.Api.Features.AgroFields.CreateField;

internal sealed class CreateAgroFieldEndpoint : IApiEndpoint
{
    public void MapEndpoint(WebApplication app)
    {
        app.MapPost("/api/agro-fields", async (IHandler<CreateAgroFieldRequest,string> handler,
            CreateAgroFieldRequest command, 
            CancellationToken cancellationToken) =>
        {
            var result = await handler.HandleAsync(command,cancellationToken);
            return Results.Created();
        });
    }
}
