using MediatR;
using Microsoft.EntityFrameworkCore;
using Zemlya.Api.Abstractions;
using Zemlya.Api.Infrastructure.Database;

namespace Zemlya.Api.Features.AgroFields.Unarchive;

public sealed record UnarchiveRequest(Guid Id) : IRequest;
public class UnarchiveHandler(DatabaseContext context, ITenantProvider tenantProvider) : IRequestHandler<UnarchiveRequest>
{
    public async Task Handle(UnarchiveRequest request, CancellationToken cancellationToken)
    {
        var tenatId = tenantProvider.GetCurrentTenantId();
        var agroField = await context.AgroFields.FirstOrDefaultAsync(af => af.Id == request.Id, cancellationToken);

        if (agroField == null)
            throw new KeyNotFoundException("Agro field isn't find");
        if (agroField.TenantId != tenatId)
            throw new KeyNotFoundException("You haven't access");
        if (agroField.IsArchived == false)
            throw new KeyNotFoundException("Agro field is already archived");

        agroField.IsArchived = false;

        await context.SaveChangesAsync(cancellationToken);
    }
}
