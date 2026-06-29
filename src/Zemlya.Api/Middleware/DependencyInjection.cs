namespace Zemlya.Api.Middleware;

public static class DependencyInjection
{
    public static IServiceCollection AddPresentation(this IServiceCollection services)
    {
        services.AddCORS();
        return services;
    }
    private static IServiceCollection AddCORS(this IServiceCollection services)
    {
        services.AddCors(options =>
        {
            options.AddPolicy("CustomCORS", builder =>
            {
                builder.AllowAnyOrigin()
                       .AllowAnyMethod()
                       .AllowAnyHeader();
            });
        });
        return services;
    }
}
