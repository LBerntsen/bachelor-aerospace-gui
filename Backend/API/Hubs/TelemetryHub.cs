using Domain.Services;
using Domain.Telemetry;
using Microsoft.AspNetCore.SignalR;

namespace API.Hubs;

public class TelemetryHub : Hub
{
    private readonly TelemetryStore _store;
    private readonly SystemStateService _stateService;

    public TelemetryHub(TelemetryStore store, SystemStateService stateService)
    {
        _store = store;
        _stateService = stateService;
    }

    public override async Task OnConnectedAsync()
    {
        var initialData = _store.GetAll();
        await Clients.Caller.SendAsync("initial", initialData);
        await Clients.Caller.SendAsync("stateChanged", _stateService.CurrentState.ToString());
        await base.OnConnectedAsync();
    }
}