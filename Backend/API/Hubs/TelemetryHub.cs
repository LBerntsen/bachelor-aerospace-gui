using Domain.Telemetry;
using Microsoft.AspNetCore.SignalR;

namespace API.Hubs;

public class TelemetryHub : Hub
{
    private readonly TelemetryStore _store;

    public TelemetryHub(TelemetryStore store)
    {
        _store = store;
    }

    public override async Task OnConnectedAsync()
    {
        var initialData = _store.GetAll();
        await Clients.Caller.SendAsync("initial", initialData);
        await base.OnConnectedAsync();
    }
}