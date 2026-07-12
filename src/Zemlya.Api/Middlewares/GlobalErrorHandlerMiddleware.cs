using Newtonsoft.Json;

namespace Zemlya.Api.Middlewares;

public class GlobalErrorHandlerMiddleware : IMiddleware
{
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
		try
		{
			await next(context);
		}
		catch (Exception exception)
		{
			await HandleError(context, exception);
		}
    }
    private async Task HandleError(HttpContext context, Exception exception)
    {
		context.Response.ContentType = "application/json";
		context.Response.StatusCode = exception switch
		{
			UnauthorizedAccessException => StatusCodes.Status401Unauthorized,
			KeyNotFoundException => StatusCodes.Status404NotFound,
			InvalidOperationException => StatusCodes.Status400BadRequest,
			_ => StatusCodes.Status500InternalServerError
		};

		object response = new ApiResponse(context.Response.StatusCode, exception.Message);

		await context.Response.WriteAsync(JsonConvert.SerializeObject(response));
    }
}
public record ApiResponse(int StatusCode, string ErrorMessage);