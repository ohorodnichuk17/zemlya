using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.JsonPatch.Operations;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Zemlya.Api.Features.AgroFields;

public class PatchOperation<T> where T : class
{
    public required string op { get; set; }
    public required string path { get; set; }
    public required string value { get; set; }

    public static JsonPatchDocument<T> ConvertToJsonPatchDocument(PatchOperation<T>[] operations)
    {
        if (operations.Any(o => String.IsNullOrEmpty(o.op) || String.IsNullOrEmpty(o.path)))
            throw new InvalidOperationException("Invalid parameters were entered in the PatchOperations object.");

        string operationsString = JsonConvert.SerializeObject(operations);
        Console.WriteLine(operationsString);
        if(String.IsNullOrEmpty(operationsString))
            throw new InvalidOperationException("'operationsString' is null.");

        return JsonConvert.DeserializeObject<JsonPatchDocument<T>>(operationsString)!;
    }
}
