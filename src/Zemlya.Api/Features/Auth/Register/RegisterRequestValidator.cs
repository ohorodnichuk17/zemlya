using FluentValidation;

namespace Zemlya.Api.Features.Auth.Register;

public sealed class RegisterRequestValidator : AbstractValidator<RegisterRequest>
{
    public RegisterRequestValidator()
    {
        RuleFor(x => x.FarmName)
            .NotEmpty().WithErrorCode("farm_name_empty")
            .MaximumLength(100).WithErrorCode("farm_name_too_long");

        RuleFor(x => x.Email)
            .NotEmpty().WithErrorCode("email_empty")
            .EmailAddress().WithErrorCode("email_invalid")
            .MaximumLength(100).WithErrorCode("email_too_long");

        RuleFor(x => x.Password)
            .NotEmpty().WithErrorCode("password_empty")
            .MinimumLength(8).WithErrorCode("password_too_short")
            .Matches("[A-Z]").WithErrorCode("password_no_uppercase")
            .Matches("[0-9]").WithErrorCode("password_no_digit")
            .Matches("[^a-zA-Z0-9]").WithErrorCode("password_no_special");

        RuleFor(x => x.Role)
            .IsInEnum().WithErrorCode("role_invalid");
    }
}