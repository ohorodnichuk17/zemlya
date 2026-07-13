using Zemlya.Api.Features.AgroFields;

namespace Zemlya.Api.Features.Recommendations;

public class Recommendation
{
    public Guid Id { get; set; }
    public Guid FieldId { get; set; }
    public AgroField AgroField { get; set; } = null!;
    
    public ActionType ActionType { get; set; }
    public DateTime ScheduledFor { get; set; }
    public decimal Amount { get; set; } // (Liters/Kg per Hectare)
    public bool IsCompleted { get; set; }
    public string? Description { get; set; }
    public bool IsDeleted { get; set; } = false;
}