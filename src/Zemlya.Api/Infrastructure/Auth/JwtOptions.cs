namespace Zemlya.Api.Infrastructure.Auth;

public sealed class JwtOptions
{
    public string Issuer { get; init; } = "zemlya-api";
    public string Audience { get; init; } = "zemlya-client";
    public string SigningKey { get; init; } = null!;
    public int AccessTokenExpiryMinutes { get; init; } = 15;
    public int RefreshTokenExpiryDays { get; init; } = 7;
}