using Carter;
using MediatR;
using Microsoft.AspNetCore.Authorization;

namespace Zemlya.Api.Features.AgroFields.Get;

public class GetAgroFieldsEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/fields", [Authorize] async (int Page, int SizeOfPage,bool IsArchived, ISender sender, CancellationToken cancellationToken) =>
        {
            var result = await sender.Send(new GetAgroFieldsRequest(IsArchived,Page,SizeOfPage), cancellationToken);
            return Results.Ok(result);
        }); 
    }
}
