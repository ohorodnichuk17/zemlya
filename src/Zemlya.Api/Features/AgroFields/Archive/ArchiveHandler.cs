using MediatR;
using Microsoft.EntityFrameworkCore;
using Zemlya.Api.Abstractions;
using Zemlya.Api.Infrastructure.Database;

namespace Zemlya.Api.Features.AgroFields.Archive;

public sealed record ArchiveRequest(Guid Id) : IRequest;
public class ArchiveHandler(DatabaseContext context, ITenantProvider tenantProvider) : IRequestHandler<ArchiveRequest>
{
    public async Task Handle(ArchiveRequest request, CancellationToken cancellationToken)
    {
        var tenatId = tenantProvider.GetCurrentTenantId();
        var agroField = await context.AgroFields.FirstOrDefaultAsync(af => af.Id == request.Id, cancellationToken);        

        if (agroField == null)
            throw new KeyNotFoundException("Agro field isn't find");
        if (agroField.TenantId != tenatId)
            throw new KeyNotFoundException("You haven't access");
        if (agroField.IsArchived == true)
            throw new KeyNotFoundException("Agro field is already archived");

        agroField.IsArchived = true;

        await context.SaveChangesAsync(cancellationToken);
    }
}
