using Carter;
using MediatR;
using Microsoft.AspNetCore.Authorization;

namespace Zemlya.Api.Features.Analytics.Get;

public class GetDashboardEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/fields/{id:guid}/dashboard", [Authorize] async (Guid id, IMediator mediator) =>
        {
            var response = await mediator.Send(new GetDashboardQuery(id));
            return Results.Ok(response);
        });
    }
}