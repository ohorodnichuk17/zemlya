using Carter;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using Zemlya.Api.Abstractions;
using Zemlya.Api.Features.Recommendations.Services;
using Zemlya.Api.Infrastructure.Auth;
using Zemlya.Api.Infrastructure.Database;
using Zemlya.Api.Infrastructure.Weather;
using Zemlya.Api.Middlewares;


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
            services.AddControllers().AddNewtonsoftJson();
            services.AddTransient<ExceptionHandlingMiddleware>();
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

        public IServiceCollection AddInfrastructureServices(IConfiguration configuration)
        {
            services.Configure<JwtOptions>(configuration.GetSection("Jwt"));
            
            services.AddHttpClient<IWeatherService, MockWeatherService>();
            services.AddTransient<AgroClimaticZoneResolver>();
            services.AddTransient<CropGrowthStageResolver>();
            services.AddTransient<ForecastAggregator>();
            services.AddTransient<ReclamationScheduler>();
            services.AddTransient<IrrigationScheduler>();
            services.AddTransient<FertilizationScheduler>();
            services.AddTransient<JwtTokenService>();
            services.AddScoped<IZemlyaEngine, ZemlyaEngine>();
            services.AddHttpContextAccessor();
            services.AddScoped<ITenantProvider, TenantProvider>();
        
            return services;
        }
        public IServiceCollection AddJwtBearer(IConfiguration configuration)
        {
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = configuration["Jwt:Issuer"],
                    ValidAudience = configuration["Jwt:Audience"],
                    ClockSkew = TimeSpan.Zero,
                    IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(configuration["Jwt:SigningKey"]!)),

                };
            });
            services.AddAuthorization(conf =>
            {
                conf.DefaultPolicy = new AuthorizationPolicyBuilder(JwtBearerDefaults.AuthenticationScheme)
                    .RequireAuthenticatedUser()
                    .Build();
            });
            return services;
        }
        

    }
}
