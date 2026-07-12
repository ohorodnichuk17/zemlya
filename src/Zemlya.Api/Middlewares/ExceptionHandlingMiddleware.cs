using System.Text.Json;
using Zemlya.Api.Exceptions;

namespace Zemlya.Api.Middlewares;

public class ExceptionHandlingMiddleware(
    ILogger<ExceptionHandlingMiddleware> logger
    ) : IMiddleware
{
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        try
        {
            await next(context);
        }
        catch (Exception exception)
        {
            logger.LogError(exception, "Unhandled exception: {Message}", exception.Message);
            await HandleError(context, exception);
        }
    }

    private static async Task HandleError(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = exception switch
        {
            ConflictException      => StatusCodes.Status409Conflict,
            NotFoundException      => StatusCodes.Status404NotFound,
            UnauthorizedException  => StatusCodes.Status401Unauthorized,
            _                      => StatusCodes.Status500InternalServerError
        };

        var response = new ErrorResponse(
            StatusCode: context.Response.StatusCode,
            Error: exception.Message);

        var json = JsonSerializer.Serialize(response, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        await context.Response.WriteAsync(json);
    }
}

public sealed record ErrorResponse(int StatusCode, string Error);