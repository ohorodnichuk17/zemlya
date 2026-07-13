using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Zemlya.Api.Exceptions;
using Zemlya.Api.Infrastructure.Auth;
using Zemlya.Api.Infrastructure.Database;

namespace Zemlya.Api.Features.Auth.Login;

public sealed record LoginRequest(
    string Email, 
    string Password) : IRequest<LoginResponse>;

public sealed record LoginResponse(
    string AccessToken,
    string RefreshToken);


public sealed class LoginHandler(
    DatabaseContext dbContext,
    JwtTokenService jwtService,
    IOptions<JwtOptions> jwtOptions,
    ILogger<LoginHandler> logger)
    : IRequestHandler<LoginRequest, LoginResponse>
{
    private readonly JwtOptions _options = jwtOptions.Value;
    
    public async Task<LoginResponse> Handle(LoginRequest request, CancellationToken cancellationToken)
    {
        var user = await dbContext.
            Users.
            FirstOrDefaultAsync(x => x.Email == request.Email, cancellationToken);

        if (user == null)
        {
            logger.LogWarning("Login failed — email not found: {Email}", request.Email);
            throw new UnauthorizedException("Invalid credentials");
        }

        var isPasswordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);

        if (!isPasswordValid)
        {
            logger.LogWarning("Login failed — invalid password for email: {Email}", request.Email);
            throw new UnauthorizedException("Invalid credentials");
        }
        
        var claims = new JwtUserClaims(
            UserId: user.Id,
            Email: user.Email,
            Role: user.Role.ToString(),
            TenantId: user.TenantId);
        
        var accessToken = jwtService.GenerateAccessToken(claims);
        var refreshTokenString = jwtService.GenerateRefreshToken();

        var refreshToken = new RefreshToken
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Token = refreshTokenString,
            ExpiresAt = DateTime.UtcNow.AddDays(_options.RefreshTokenExpiryDays),
            IsRevoked = false
        };
        dbContext.RefreshTokens.Add(refreshToken);
        await dbContext.SaveChangesAsync(cancellationToken);

        logger.LogInformation("User logged in: {Email} | Role: {Role}", user.Email, user.Role);
        return new LoginResponse(accessToken, refreshTokenString);
    }
}