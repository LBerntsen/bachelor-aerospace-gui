using API.HostedServices;
using API.Hubs;
using Domain.Telemetry;
using Infrastructure.Persistence;
using Infrastructure.Workers;
using SensorReader.Reader;

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
builder.Services.AddSingleton<CsvSensorReader>();
builder.Services.AddSingleton<InfluxDbRepository>();
builder.Services.AddHostedService<CsvSensorReaderHostedService>();
builder.Services.AddHostedService<SignalRWorker>();
builder.Services.AddHostedService<InfluxWorker>();

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