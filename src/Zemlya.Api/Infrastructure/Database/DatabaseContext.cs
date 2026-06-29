using Microsoft.EntityFrameworkCore;
using Zemlya.Api.Features.AgroFields;
using Zemlya.Api.Features.Recommendations;

namespace Zemlya.Api.Infrastructure.Database;

public class DatabaseContext : DbContext
{
    public DatabaseContext()
    {
    }

    public DatabaseContext(DbContextOptions<DatabaseContext> options) 
        : base(options)
    {
    }

    public DbSet<AgroField> AgroFields => Set<AgroField>();
    
    public DbSet<Recommendation> Recommendations => Set<Recommendation>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<AgroField>(entity =>
        {
            entity.ToTable("AgroFields");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).HasMaxLength(100).IsRequired();
            entity.Property(e => e.CropType).HasConversion<string>();
            entity.Property(e => e.SoilType).HasConversion<string>();
            entity.Property(e => e.SizeHectares).HasPrecision(10, 2);
            entity.Property(e => e.Latitude).HasPrecision(9, 6);
            entity.Property(e => e.Longitude).HasPrecision(9, 6);
        });
        
        modelBuilder.Entity<Recommendation>(entity =>
        {
            entity.ToTable("Recommendations");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.ActionType).HasConversion<string>();
            entity.Property(e => e.Amount).HasPrecision(10, 2);
            entity.Property(e => e.Description).HasMaxLength(300);
            
            entity.HasOne(e => e.AgroField)
                .WithMany(r => r.Recommendations)
                .HasForeignKey(e => e.FieldId);
        });
    }
}