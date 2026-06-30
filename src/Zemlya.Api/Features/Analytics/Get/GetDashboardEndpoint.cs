using Carter;
using MediatR;

namespace Zemlya.Api.Features.Analytics.Get;

public class GetDashboardEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/fields/{id:guid}/dashboard", async (Guid id, IMediator mediator) =>
        {
            var response = await mediator.Send(new GetDashboardQuery(id));
            return Results.Ok(response);
        });
    }
}