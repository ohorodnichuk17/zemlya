using System.Text.Json.Serialization;

namespace Zemlya.Api.Features.Auth;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum UserRole
{
    Owner = 1,
    Agronomist = 2,
    Auditor = 3
}