using System.Text.Encodings.Web;
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
            ValidationException => StatusCodes.Status400BadRequest,
            _                      => StatusCodes.Status500InternalServerError
        };

        var errorCode = exception switch
        {
            DomainException de => de.ErrorCode,
            _ => "internal_server_error"
        };

        IEnumerable<ValidationErrorResponse>? validationErrors = exception is ValidationException ve
            ? ve.Errors.Select(x => new ValidationErrorResponse(x.Field, x.Message, x.ErrorCode))
            : null;

        var response = new ErrorResponse(
            StatusCode: context.Response.StatusCode,
            Error: exception.Message,
            ErrorCode: errorCode,
            Errors: validationErrors);

        var json = JsonSerializer.Serialize(response, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping
        });

        await context.Response.WriteAsync(json);
    }
}

public sealed record ValidationErrorResponse(string Field, string Message, string ErrorCode);

public sealed record ErrorResponse(
    int StatusCode, 
    string Error, 
    string ErrorCode,
    IEnumerable<ValidationErrorResponse>? Errors = null);