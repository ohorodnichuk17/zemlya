using MediatR;
using Microsoft.EntityFrameworkCore;
using Zemlya.Api.Exceptions;
using Zemlya.Api.Infrastructure.Database;

namespace Zemlya.Api.Features.AgroFields.Unarchive;

public sealed record UnarchiveRequest(Guid Id) : IRequest;
public class UnarchiveHandler(DatabaseContext context) : IRequestHandler<UnarchiveRequest>
{
    public async Task Handle(UnarchiveRequest request, CancellationToken cancellationToken)
    {
        var agroField = await context.AgroFields.FirstOrDefaultAsync(af => af.Id == request.Id, cancellationToken);

        if (agroField == null)
        {
            throw new NotFoundException("Agro field isn't find");
        }
        if (!agroField.IsArchived)
        {
            throw new NotFoundException("Agro field is already archived");
        }

        agroField.IsArchived = false;

        await context.SaveChangesAsync(cancellationToken);
    }
}
