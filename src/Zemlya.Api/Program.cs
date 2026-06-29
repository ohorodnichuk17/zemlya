using Microsoft.EntityFrameworkCore;
using Zemlya.Api.Abstractions;
using Zemlya.Api.Infrastructure.Database;
using Zemlya.Api.Infrastructure.Weather;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<DatabaseContext>(options =>
    options.UseNpgsql(connectionString));

// Add services to the container.
builder.Services.AddHttpClient<IWeatherService, WeatherService>();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
