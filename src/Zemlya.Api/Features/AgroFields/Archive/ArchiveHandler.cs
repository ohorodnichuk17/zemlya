using MediatR;
using Microsoft.EntityFrameworkCore;
using Zemlya.Api.Infrastructure.Database;

namespace Zemlya.Api.Features.AgroFields.Archive;

public sealed record ArchiveRequest(Guid Id) : IRequest;
public class ArchiveHandler(DatabaseContext context) : IRequestHandler<ArchiveRequest>
{
    public async Task Handle(ArchiveRequest request, CancellationToken cancellationToken)
    {
        var agroField = await context.AgroFields.FirstOrDefaultAsync(af => af.Id == request.Id, cancellationToken);

        if (agroField == null)
            throw new KeyNotFoundException("Agro field isn't find");
        if(agroField.IsArchived == true)
            throw new KeyNotFoundException("Agro field is already archived");

        agroField.IsArchived = true;

        await context.SaveChangesAsync(cancellationToken);
    }
}
