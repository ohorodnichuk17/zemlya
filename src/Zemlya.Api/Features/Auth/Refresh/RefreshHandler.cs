using System.IdentityModel.Tokens.Jwt;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Zemlya.Api.Exceptions;
using Zemlya.Api.Infrastructure.Auth;
using Zemlya.Api.Infrastructure.Database;

namespace Zemlya.Api.Features.Auth.Refresh;

public sealed record RefreshRequest(
    string AccessToken,
    string RefreshToken) : IRequest<RefreshResponse>;

public sealed record RefreshResponse(
    string AccessToken,
    string RefreshToken);

public sealed class RefreshHandler(
    DatabaseContext dbContext,
    JwtTokenService jwtService,
    IOptions<JwtOptions> jwtOptions,
    ILogger<RefreshHandler> logger)
    : IRequestHandler<RefreshRequest, RefreshResponse>
{
    private readonly JwtOptions _options = jwtOptions.Value;
    
    public async Task<RefreshResponse> Handle(RefreshRequest request, CancellationToken cancellationToken)
    {
        var principal = jwtService.ValidateToken(request.AccessToken) 
                        ?? throw new UnauthorizedException("Invalid access token");
        
        var userIdString = principal.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;

        if (!Guid.TryParse(userIdString, out var userId))
        {
            throw new UnauthorizedException("Invalid user id");
        }
        
        var storedToken = await dbContext.RefreshTokens
            .FirstOrDefaultAsync(x => x.Token == request.RefreshToken &&
                                      x.UserId == userId, cancellationToken);

        if (storedToken is null)
        {
            throw new UnauthorizedException("Invalid refresh token");
        }
        if (storedToken.IsRevoked)
        {
            throw new UnauthorizedException("Refresh token has been revoked");
        }
        if (storedToken.ExpiresAt < DateTime.UtcNow)
        {
            throw new UnauthorizedException("Refresh token has expired");
        }

        storedToken.IsRevoked = true;

        var user = await dbContext .Users
            .FindAsync(userId, cancellationToken) ??
                   throw new UnauthorizedException("User not found");
        
        var claims = new JwtUserClaims(
            UserId: user.Id,
            Email: user.Email,
            Role: user.Role.ToString(),
            TenantId: user.TenantId);

        var newAccessToken = jwtService.GenerateAccessToken(claims);
        var newRefreshTokenString = jwtService.GenerateRefreshToken();

        var newRefreshToken = new RefreshToken
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Token = newRefreshTokenString,
            ExpiresAt = DateTime.UtcNow.AddDays(_options.RefreshTokenExpiryDays),
            IsRevoked = false
        };
        dbContext.RefreshTokens.Add(newRefreshToken);
        await dbContext.SaveChangesAsync(cancellationToken);
        
        logger.LogInformation("Token refreshed for user: {Email}", user.Email);
        return new RefreshResponse(newAccessToken, newRefreshTokenString);
    }
}