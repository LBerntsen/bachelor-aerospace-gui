using API.HostedServices;
using API.Hubs;
using Domain.Interfaces;
using Domain.Services;
using Domain.Telemetry;
using Infrastructure.DataIngestion;
using Infrastructure.DataIngestion.Implementations;
using Infrastructure.Persistence;
using Infrastructure.Workers;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("SignalRPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddControllers();
builder.Services.AddSignalR();
builder.Services.AddSingleton<TelemetryStore>();
builder.Services.AddSingleton<InfluxDbRepository>();
builder.Services.AddSingleton<ITelemetrySource, CsvSource>();
builder.Services.AddSingleton<ITelemetrySource, InfluxSource>();
builder.Services.AddSingleton<SourceController>();
builder.Services.AddHostedService<SignalRWorker>();
builder.Services.AddHostedService<InfluxWorker>();
builder.Services.AddSingleton<SystemStateService>();

var app = builder.Build();

app.UseCors("SignalRPolicy");
app.MapHub<TelemetryHub>("/telemetryhub");
app.MapControllers();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.Run();