using BCrypt.Net;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Zemlya.Api.Exceptions;
using Zemlya.Api.Infrastructure.Auth;
using Zemlya.Api.Infrastructure.Database;

namespace Zemlya.Api.Features.Auth.Register;

public sealed record RegisterRequest(
    string FarmName,
    string Email,
    string Password,
    UserRole Role) : IRequest<RegisterResponse>;

public sealed record RegisterResponse(
    Guid UserId,
    string AccessToken,
    string RefreshToken);

public sealed class RegisterHandler(
    DatabaseContext dbContext,
    JwtTokenService jwtService,
    IOptions<JwtOptions> options,
    ILogger<RegisterHandler> logger)
    : IRequestHandler<RegisterRequest, RegisterResponse>
{
    private readonly JwtOptions _options = options.Value;
    
    public async Task<RegisterResponse> Handle(RegisterRequest request, CancellationToken cancellationToken)
    {
        var emailExists = await dbContext.Users.AnyAsync(x => x.Email == request.Email, cancellationToken);
        if (emailExists)
        {
            logger.LogWarning("Registration attempt with already existing email: {Email}", request.Email);
            throw new ConflictException("Email already exists.", "email_already_exists");
        }

        var existingTenant = await dbContext.Tenants
            .FirstOrDefaultAsync(x => x.Name == request.FarmName, cancellationToken);

        Tenant tenant;

        if (request.Role == UserRole.Owner)
        {
            if (existingTenant != null)
            {
                logger.LogWarning("Farm name already exists: {FarmName}", request.FarmName);
                throw new ConflictException("Farm already exists.", "farm_already_exists");
            }

            tenant = new Tenant
            {
                Id = Guid.NewGuid(),
                Name = request.FarmName,
                CreatedAt = DateTime.UtcNow,
            };
            dbContext.Tenants.Add(tenant);
        }
        else
        {
            if (existingTenant == null)
            {
                logger.LogWarning("Farm not found for joining: {FarmName}", request.FarmName);
                throw new NotFoundException("Farm not found.", "farm_not_found");
            }

            tenant = existingTenant;
        }

        var hash = BCrypt.Net.BCrypt.HashPassword(request.Password);

        
        var user = new User
        {
            Id = Guid.NewGuid(),
            TenantId = tenant.Id,
            Email =  request.Email,
            PasswordHash =  hash,
            Role = request.Role,
            CreatedAt =  DateTime.UtcNow
        };
        
        var refreshTokenString = jwtService.GenerateRefreshToken();
        
        var refreshToken = new RefreshToken
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Token =  refreshTokenString,
            ExpiresAt = DateTime.UtcNow.AddDays(_options.RefreshTokenExpiryDays),
            IsRevoked = false
        };
        
        dbContext.Users.Add(user);
        dbContext.RefreshTokens.Add(refreshToken);
        await dbContext.SaveChangesAsync(cancellationToken);
        
        logger.LogInformation(
            "New tenant registered: {FarmName} | User: {Email} | Role: {Role} | TenantId: {TenantId}",
            request.FarmName, request.Email, request.Role, tenant.Id);

        var claims = new JwtUserClaims(
            UserId: user.Id,
            Email: user.Email,
            Role: user.Role.ToString(),
            TenantId: user.TenantId);
        
        var accessToken = jwtService.GenerateAccessToken(claims);
        
        return new RegisterResponse(user.Id, accessToken, refreshToken.Token);
    }
}