using MediatR;
using Microsoft.EntityFrameworkCore;
using Zemlya.Api.Abstractions;
using Zemlya.Api.Infrastructure.Auth;
using Zemlya.Api.Infrastructure.Database;

namespace Zemlya.Api.Features.AgroFields.Delete;

public sealed record DeleteRequest(Guid Id) : IRequest;
public class DeleteHandler(DatabaseContext context, ITenantProvider tenantProvider) : IRequestHandler<DeleteRequest>
{
    public async Task Handle(DeleteRequest request, CancellationToken cancellationToken)
    {
        var tenatId = tenantProvider.GetCurrentTenantId();
        var agroField = await context.AgroFields.FirstOrDefaultAsync(af => af.Id == request.Id, cancellationToken);

        if (agroField == null)
        {
            throw new KeyNotFoundException("Agro field isn't find");
        }
        if (agroField.TenantId != tenatId)
        {
            throw new KeyNotFoundException("You haven't access");
        }
        agroField.IsDeleted = true;
        if (agroField.Recommendations.Any())
        {
            var recomendations = context.Recommendations.Where(r => agroField.Recommendations.Contains(r));

            foreach (var r in recomendations)
            {
                r.IsDeleted = true;
            }
        }
        await context.SaveChangesAsync(cancellationToken);
    }
}
