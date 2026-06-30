using Zemlya.Api.Features.AgroFields;

namespace Zemlya.Api.Features.Recommendations.Generate;

public class ReclamationScheduler
{
    public Recommendation GenerateReclamationRecommendation(AgroField field)
    {
        var targetDate = DateTime.SpecifyKind(DateTime.UtcNow.Date, DateTimeKind.Utc);
        var description = "";
        var materialAmount = 0m; // В тоннах на гектар

        switch (field.ShellingImpactLevel)
        {
            case ShellingImpactLevel.Low:
                materialAmount = 1.5m;
                description = "Рекультивація (Низький рівень ушкоджень): Внести 1.5 т/га перегною або компосту для відновлення ґрунтової мікрофлори, пошкодженої вибуховими хвилями та задимленням.";
                break;
            case ShellingImpactLevel.Medium:
                materialAmount = 2.5m;
                description = "Рекультивація (Середній рівень ушкоджень): Виявлено воронки поруч. Рекомендовано внести 2.5 т/га біочару (деревного вугілля) або вапна для нейтралізації кислих залишків порохових газів та фіксації важких металів у ґрунті.";
                break;
            case ShellingImpactLevel.High:
                materialAmount = 4.0m;
                if (field.CropType == CropType.Sunflower)
                {
                    description = "УВАГА (КРИТИЧНО): Поле зазнало значних обстрілів. Соняшник є активним гіперакумулятором важких металів (Pb, Cd). Продовольче використання врожаю ЗАБОРОНЕНО. Використовуйте посіви виключно для технічних цілей (біопаливо) або як сидерати для фіторемедіації. Рекомендовано внести 4 т/га цеоліту або активованого вугілля.";
                }
                else
                {
                    description = "УВАГА: Прямі влучання снарядів. Високий ризик накопичення токсичних речовин. Рекомендовано внести 4 т/га активованого вугілля або цеоліту для адсорбції важких металів та провести лабораторний аналіз ґрунту перед збором врожаю.";
                }
                break;
        }
        
        return CreateRecommendation(
            fieldId: field.Id,
            scheduledFor: DateTime.SpecifyKind(targetDate, DateTimeKind.Utc).AddHours(12),
            amount: materialAmount,
            description: description);
    }
    
    private static Recommendation CreateRecommendation(
        Guid fieldId,
        DateTime scheduledFor,
        decimal amount,
        string description)
    {
        return new Recommendation
        {
            Id = Guid.NewGuid(),
            FieldId = fieldId,
            ActionType = ActionType.Reclamation,
            ScheduledFor = scheduledFor,
            Amount = amount,
            IsCompleted = false,
            Description = description
        };
    }
}