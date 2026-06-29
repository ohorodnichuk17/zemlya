using Carter;

namespace Zemlya.Api.Middleware;

public static class DependencyInjection
{
    extension(IServiceCollection services)
    {
        public IServiceCollection AddPresentation()
        {
            services.AddCORS();
            services.AddMediatR(config => config.RegisterServicesFromAssembly(typeof(Program).Assembly));
            services.AddCarter();
            return services;
        }
        private IServiceCollection AddCORS()
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



}
