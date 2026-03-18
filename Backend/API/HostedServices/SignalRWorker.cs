using API.Hubs;
using Domain.Services;
using Domain.Telemetry;
using Microsoft.AspNetCore.SignalR;

namespace API.HostedServices;

public class SignalRWorker : BackgroundService
{
    private readonly TelemetryStore _store;
    private readonly SystemStateService _stateService;
    private readonly IHubContext<TelemetryHub> _hubContext;

    public SignalRWorker(TelemetryStore store, SystemStateService stateService, IHubContext<TelemetryHub> hubContext)
    {
        _store = store;
        _stateService = stateService;
        _hubContext = hubContext;
    }

    protected override Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _store.OnUpdate += async (data) =>
        {
            await _hubContext.Clients.All.SendAsync("update", data, stoppingToken);
        };

        _store.OnClear += async () =>
        {
            await _hubContext.Clients.All.SendAsync("clear", stoppingToken);
        };

        _stateService.OnStateChanged += async (state) =>
        {
            await _hubContext.Clients.All.SendAsync("stateChanged", state.ToString(), stoppingToken);
        };
        
        return Task.CompletedTask;
    }
}