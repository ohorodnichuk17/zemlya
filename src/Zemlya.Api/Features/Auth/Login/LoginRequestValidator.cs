using FluentValidation;

namespace Zemlya.Api.Features.Auth.Login;

public sealed class LoginRequestValidator : AbstractValidator<LoginRequest>
{
    public LoginRequestValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithErrorCode("email_empty")
            .EmailAddress().WithErrorCode("email_invalid");

        RuleFor(x => x.Password)
            .NotEmpty().WithErrorCode("password_empty")
            .MinimumLength(8).WithErrorCode("password_too_short");
    }
}