using System.Net;
using API.Extensions;
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

bool isSponsor = builder.Configuration.IsSponsorMode();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.SetIsOriginAllowed(_ => true)
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi

if (!isSponsor)
{
    builder.Services.AddSignalR();
    builder.Services.AddSingleton<ITelemetrySource, TcpSource>();
    builder.Services.AddSingleton<ITelemetrySource, CsvSource>();
    builder.Services.AddSingleton<ITelemetrySource, InfluxSource>();
    builder.Services.AddHostedService<SignalRWorker>();
    builder.Services.AddHostedService<InfluxWorker>();
    builder.Services.AddSingleton<SystemStateService>();
    builder.Services.AddSingleton<SourceController>();
    builder.Services.AddSingleton<TelemetryStore>();
    builder.Services.AddSingleton<InfluxOperatorDbRepository>();
}

builder.Services.AddSingleton<InfluxSponsorDbRepository>();
builder.Services.AddOpenApi();
builder.Services.AddControllers();

var app = builder.Build();

app.UseCors();

if (!isSponsor)
{
    app.MapHub<TelemetryHub>("/telemetryhub");
}

app.MapControllers();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.Run();