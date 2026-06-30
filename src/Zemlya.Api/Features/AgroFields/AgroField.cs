using Zemlya.Api.Features.Recommendations;

namespace Zemlya.Api.Features.AgroFields;

public sealed class AgroField
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public CropType CropType { get; set; }
    public SoilType SoilType { get; set; }
    public decimal SizeHectares { get; set; }
    public decimal Latitude { get; set; }
    public decimal Longitude { get; set; }
    public string Oblast { get; set; } = string.Empty;
    public ShellingImpactLevel ShellingImpactLevel { get; set; }
    public DateTime SowingDate { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
    public ICollection<Recommendation> Recommendations { get; set; } = [];
}