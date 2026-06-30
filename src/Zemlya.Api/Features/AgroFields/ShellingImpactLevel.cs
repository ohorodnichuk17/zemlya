namespace Zemlya.Api.Features.AgroFields;

public enum ShellingImpactLevel
{
    None = 0,       // Без впливу
    Low = 1,        // Низький (близькість до обстрілів, поодинокі уламки)
    Medium = 2,     // Середній (наявність воронок на сусідніх ділянках)
    High = 3        // Високий (пряме попадання снарядів, хімічне забруднення)
}
