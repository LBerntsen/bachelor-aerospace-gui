using Domain.Enums;
using Domain.Interfaces;
using Domain.Models;
using Domain.Services;
using Domain.Telemetry;
using Infrastructure.Persistence;

namespace Infrastructure.DataIngestion.Implementations;

public class InfluxSource : ITelemetrySource
{
    private readonly InfluxOperatorDbRepository _repository;
    private readonly TelemetryStore _store;
    private readonly SystemStateService _stateService;
    private CancellationTokenSource? _cancellationTokenSource;
    
    public DataSource Type { get; } = DataSource.Influx;

    public InfluxSource(InfluxOperatorDbRepository repository, TelemetryStore store, SystemStateService stateService)
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
        
        var sessionStartRealTime = DateTime.Parse(dataPoints[0].TimeStamp).ToUniversalTime();
        var watch = System.Diagnostics.Stopwatch.StartNew();

        for (int i = 0; i < dataPoints.Count; i++)
        {
            if (cancellationToken.IsCancellationRequested)
                break;

            var currentPoint = dataPoints[i];
            
            var pointTime = DateTime.Parse(currentPoint.TimeStamp).ToUniversalTime();
            var targetOffsetMs = (pointTime - sessionStartRealTime).TotalMilliseconds;
            
            while (watch.Elapsed.TotalMilliseconds < targetOffsetMs)
            {
                var diff = targetOffsetMs - watch.Elapsed.TotalMilliseconds;
            
                if (diff > 16) 
                    await Task.Delay(1, cancellationToken); 
                else 
                    await Task.Yield(); 

                if (cancellationToken.IsCancellationRequested)
                    return;
            }
            
            _store.Add(currentPoint);
        }
    
        watch.Stop();
        Console.WriteLine("REPLAY: Ferdig.");
    }
}