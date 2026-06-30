namespace Zemlya.Api.Features.Recommendations.Generate;

public class AgroClimaticZoneResolver
{
    public UkrainianAgroZone ResolveZone(string oblast)
    {
        var normalized = oblast.Trim().ToLowerInvariant();
        
        return ZoneByOblast.GetValueOrDefault(
            normalized,
            UkrainianAgroZone.ForestSteppe);
    }
    
    private static readonly Dictionary<string, UkrainianAgroZone> ZoneByOblast = new()
    {
        // Полісся
        ["житомирська"] = UkrainianAgroZone.Polissya,
        ["чернігівська"] = UkrainianAgroZone.Polissya,
        ["волинська"] = UkrainianAgroZone.Polissya,
        ["рівненська"] = UkrainianAgroZone.Polissya,
        ["сумська"] = UkrainianAgroZone.Polissya,
        ["київська"] = UkrainianAgroZone.Polissya,

        // Степ
        ["херсонська"] = UkrainianAgroZone.Steppe,
        ["запорізька"] = UkrainianAgroZone.Steppe,
        ["миколаївська"] = UkrainianAgroZone.Steppe,
        ["одеська"] = UkrainianAgroZone.Steppe,
        ["дніпропетровська"] = UkrainianAgroZone.Steppe,
        ["донецька"] = UkrainianAgroZone.Steppe,
        ["луганська"] = UkrainianAgroZone.Steppe,
        ["кіровоградська"] = UkrainianAgroZone.Steppe,
        ["автономна республіка крим"] = UkrainianAgroZone.Steppe,
        ["крим"] = UkrainianAgroZone.Steppe,
    };
}