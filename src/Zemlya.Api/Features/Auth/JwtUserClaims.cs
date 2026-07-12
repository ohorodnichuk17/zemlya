namespace Zemlya.Api.Features.Auth;

public sealed record JwtUserClaims(
    Guid UserId,
    string Email,
    string Role,
    Guid TenantId);