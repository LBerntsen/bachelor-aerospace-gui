using Domain.Enums;
using Domain.Interfaces;
using Domain.Models;
using Domain.Services;
using Domain.Telemetry;
using Infrastructure.Persistence;

namespace Infrastructure.DataIngestion.Implementations;

public class InfluxSource : ITelemetrySource
{
    private readonly InfluxDbRepository _repository;
    private readonly TelemetryStore _store;
    private readonly SystemStateService _stateService;
    private CancellationTokenSource? _cancellationTokenSource;
    
    public DataSource Type { get; } = DataSource.Influx;

    public InfluxSource(InfluxDbRepository repository, TelemetryStore store, SystemStateService stateService)
    {
        _repository = repository;
        _store = store;
        _stateService = stateService;
    }
    
    public Task StartAsync(CancellationToken cancellationToken)
    {
        _cancellationTokenSource = new CancellationTokenSource();
        RunReplay(_cancellationTokenSource.Token);
        return Task.CompletedTask;
    }

    public async Task StopAsync(CancellationToken cancellationToken)
    {
        if (_cancellationTokenSource != null)
            await _cancellationTokenSource.CancelAsync();
    }

    private async Task RunReplay(CancellationToken cancellationToken)
    {
        string sessionId = _stateService.ActiveReplaySessionId;
        if (string.IsNullOrEmpty(sessionId))
            return;
        
        _store.Clear();

        List<SensorData> dataPoints = await _repository.GetSessionDataAsync(sessionId);
        Console.WriteLine($"REPLAY: Fant {dataPoints.Count} punkter for {sessionId}");

        foreach (SensorData point in dataPoints)
        {
            if (cancellationToken.IsCancellationRequested)
                break;

            _store.Add(point);

            await Task.Delay(1, cancellationToken); // fjerne når timing er på plass, må først få skikkelig data
        }
    }
}