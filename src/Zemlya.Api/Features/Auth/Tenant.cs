using Zemlya.Api.Features.AgroFields;

namespace Zemlya.Api.Features.Auth;

public sealed class Tenant
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    
    public ICollection<User> Users { get; set; } = [];
    public ICollection<AgroField> Fields { get; set; } = [];
}