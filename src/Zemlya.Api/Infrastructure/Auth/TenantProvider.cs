using Zemlya.Api.Abstractions;

namespace Zemlya.Api.Infrastructure.Auth;

public class TenantProvider(IHttpContextAccessor accessor)
    : ITenantProvider
{
    public Guid? GetCurrentTenantId()
    {
        var claim = accessor.HttpContext?
            .User
            .FindFirst("tenantId");
        
        return claim != null ? Guid.Parse(claim.Value) : null;
    }
}