using MediatR;
using Microsoft.EntityFrameworkCore;
using Zemlya.Api.Exceptions;
using Zemlya.Api.Infrastructure.Database;

namespace Zemlya.Api.Features.Recommendations.Complete;

public sealed record CompleteRecommendationCommand(Guid Id) : IRequest<bool>;

public sealed class CompleteRecommendationHandler(DatabaseContext context) : IRequestHandler<CompleteRecommendationCommand, bool>
{
    public async Task<bool> Handle(CompleteRecommendationCommand request, CancellationToken cancellationToken)
    {
        var recommendation = await context.Recommendations
            .FirstOrDefaultAsync(r => r.Id == request.Id, cancellationToken);

        if (recommendation == null)
        {
            throw new NotFoundException("Recommendation not found");
        }

        recommendation.IsCompleted = true;
        await context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
