using Microsoft.EntityFrameworkCore;
using Zemlya.Api.Abstractions;
using Zemlya.Api.Features.AgroFields;
using Zemlya.Api.Features.Auth;
using Zemlya.Api.Features.Recommendations;

namespace Zemlya.Api.Infrastructure.Database;

public class DatabaseContext : DbContext
{
    private readonly Guid? _currentTenantId;
    
    public DatabaseContext()
    {
    }

    public DatabaseContext(
        DbContextOptions<DatabaseContext> options
        , ITenantProvider tenantProvider) 
        : base(options)
    {
        _currentTenantId = tenantProvider.GetCurrentTenantId();
    }

    public DbSet<AgroField> AgroFields => Set<AgroField>();
    
    public DbSet<Recommendation> Recommendations => Set<Recommendation>();

    public DbSet<Tenant> Tenants => Set<Tenant>();

    public DbSet<User> Users => Set<User>();
    
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<AgroField>(entity =>
        {
            entity.ToTable("AgroFields").HasQueryFilter(f => !f.IsDeleted);
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).HasMaxLength(100).IsRequired();
            entity.Property(e => e.CropType).HasConversion<string>();
            entity.Property(e => e.SoilType).HasConversion<string>();
            entity.Property(e => e.SizeHectares).HasPrecision(10, 2);
            entity.Property(e => e.Latitude).HasPrecision(9, 6);
            entity.Property(e => e.Longitude).HasPrecision(9, 6);
            entity.Property(e => e.Oblast).HasMaxLength(100).IsRequired();
            entity.Property(e => e.ShellingImpactLevel).HasConversion<string>();
            entity.Property(e => e.SowingDate).IsRequired();
<<<<<<< HEAD

=======
            
            entity.HasOne(e => e.Tenant)
                .WithMany(t => t.Fields)
                .HasForeignKey(e => e.TenantId);
            
            entity.HasQueryFilter(f =>
                !f.IsDeleted &&
                (_currentTenantId == null || f.TenantId == _currentTenantId));
>>>>>>> main
        });
        
        modelBuilder.Entity<Recommendation>(entity =>
        {
            entity.ToTable("Recommendations");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.ActionType).HasConversion<string>();
            entity.Property(e => e.Amount).HasPrecision(10, 2);
            entity.Property(e => e.Description).HasMaxLength(1000);
            
            entity.HasOne(e => e.AgroField)
                .WithMany(r => r.Recommendations)
                .HasForeignKey(e => e.FieldId);
        });
        
        modelBuilder.Entity<Tenant>(entity =>
        {
            entity.ToTable("Tenants");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).HasMaxLength(100).IsRequired();
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("Users");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Email).HasMaxLength(100).IsRequired();
            entity.Property(e => e.PasswordHash).HasMaxLength(500).IsRequired();
            entity.Property(e => e.Role).HasConversion<string>();
           
            entity.HasOne(e => e.Tenant)
                .WithMany(u => u.Users)
                .HasForeignKey(e => e.TenantId);
        });

        modelBuilder.Entity<RefreshToken>(entity =>
        {
            entity.ToTable("RefreshTokens");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Token).HasMaxLength(500).IsRequired();
            entity.HasIndex(e => e.Token).IsUnique();
            entity.Property(e => e.ExpiresAt).IsRequired();
            entity.HasOne(e => e.User)
                .WithMany(u => u.RefreshTokens)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}