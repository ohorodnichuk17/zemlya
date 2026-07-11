namespace Zemlya.Api.Abstractions;

public interface ITenantProvider
{
    Guid? GetCurrentTenantId();
}