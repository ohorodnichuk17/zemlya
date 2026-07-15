using FluentValidation;
using MediatR;
using Zemlya.Api.Exceptions;
using ValidationException = Zemlya.Api.Exceptions.ValidationException;

namespace Zemlya.Api.Behaviors;

public class ValidationBehavior
    <TRequest, TResponse> 
    (IEnumerable<IValidator<TRequest>>? validators)
    : IPipelineBehavior<TRequest, TResponse>
{
    public async Task<TResponse> Handle(TRequest request
        , RequestHandlerDelegate<TResponse> next
        , CancellationToken cancellationToken)
    {
        if (validators is null || !validators.Any())
        {
            return await next(cancellationToken); 
        }
        
        var ctx = new ValidationContext<TRequest>(request);

        var results = await Task.WhenAll(
            validators.Select(x => 
                x.ValidateAsync(ctx, cancellationToken)));
        
        var failures = results
            .SelectMany(x => x.Errors)
            .Where(x => x != null)
            .ToList();

        if (failures.Any())
        {
            throw new ValidationException(failures.Select(x => new ValidationError(
                Field: x.PropertyName,
                Message: x.ErrorMessage,
                ErrorCode: x.ErrorCode
            )));
        }
        
        return await next(cancellationToken);
    }
}