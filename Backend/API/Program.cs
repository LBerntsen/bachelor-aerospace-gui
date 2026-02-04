using API.HostedServices;
using API.WebSockets;
using Domain.Telemetry;
using SensorReader.Reader;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddSingleton<TelemetryStore>();
builder.Services.AddSingleton<CsvSensorReader>();
builder.Services.AddHostedService<CsvSensorReaderHostedService>();

var app = builder.Build();

app.UseWebSockets();
var random = Random.Shared;
app.Map("/ws", WebSocketHandler.Handle);

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.Run();