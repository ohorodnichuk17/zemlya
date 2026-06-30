using Carter;
using Microsoft.EntityFrameworkCore;
using Zemlya.Api.Abstractions;
using Zemlya.Api.Features.Recommendations.Services;
using Zemlya.Api.Infrastructure.Database;
using Zemlya.Api.Infrastructure.Weather;

namespace Zemlya.Api.Extensions;

public static class DependencyInjection
{
    extension(IServiceCollection services)
    {
        public IServiceCollection AddPresentation()
        {
            services.AddCors();
            services.AddMediatR(config => config.RegisterServicesFromAssembly(typeof(Program).Assembly));
            services.AddCarter();
            return services;
        }

        private IServiceCollection AddCors()
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


        public IServiceCollection AddPersistence(IConfiguration configuration)
        {
            var connectionString = configuration.GetConnectionString("DefaultConnection");
            services.AddDbContext<DatabaseContext>(options =>
                options.UseNpgsql(connectionString));
        
            return services;
        }

        public IServiceCollection AddInfrastructureServices()
        {
            services.AddHttpClient<IWeatherService, MockWeatherService>();
            services.AddTransient<AgroClimaticZoneResolver>();
            services.AddTransient<CropGrowthStageResolver>();
            services.AddTransient<ForecastAggregator>();
            services.AddTransient<ReclamationScheduler>();
            services.AddTransient<IrrigationScheduler>();
            services.AddTransient<FertilizationScheduler>();
            services.AddTransient<ZemlyaEngine>();
        
            return services;
        }
    }

}
