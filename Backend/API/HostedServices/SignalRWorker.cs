using API.Hubs;
using Domain.Models;
using Domain.Telemetry;
using Microsoft.AspNetCore.SignalR;

namespace API.HostedServices;

public class SignalRWorker : BackgroundService
{
    private readonly TelemetryStore _store;
    private readonly IHubContext<TelemetryHub> _hubContext;

    public SignalRWorker(TelemetryStore store, IHubContext<TelemetryHub> hubContext)
    {
        _store = store;
        _hubContext = hubContext;
    }

    protected override Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _store.OnUpdate += async (data) =>
        {
            await _hubContext.Clients.All.SendAsync("update", data, stoppingToken);
        };
        return Task.CompletedTask;
    }
}