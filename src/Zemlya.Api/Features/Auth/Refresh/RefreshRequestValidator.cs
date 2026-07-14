using FluentValidation;

namespace Zemlya.Api.Features.Auth.Refresh;

public sealed class RefreshRequestValidator : AbstractValidator<RefreshRequest>
{
    public RefreshRequestValidator()
    {
        RuleFor(x => x.AccessToken)
            .NotEmpty();
        
        RuleFor(x => x.RefreshToken)
            .NotEmpty();
    }
}