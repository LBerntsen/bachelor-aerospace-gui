using Domain.Models;
using Domain.Services;
using Domain.Telemetry;
using Infrastructure.Persistence;
using Microsoft.Extensions.Hosting;

namespace Infrastructure.Workers;

public class InfluxWorker : BackgroundService
{
    private readonly SystemStateService _stateService;
    private CancellationTokenSource? _workerTokenSource;
    
    private readonly TelemetryStore _store;
    private readonly InfluxDbRepository _repository;

    public InfluxWorker(SystemStateService stateService, TelemetryStore store, InfluxDbRepository repository)
    {
        _stateService = stateService;
        _stateService.OnStateChanged += HandleModeChanged;
        
        _store = store;
        _repository = repository;
    }

    private void HandleModeChanged(SystemState newState)
    {
        if (newState == SystemState.Live)
            StartWork();
        else
            StopWork();
    }

    private void StartWork()
    {
        if (_workerTokenSource != null && !_workerTokenSource.IsCancellationRequested)
            return;
        _workerTokenSource = new CancellationTokenSource();
        
        _repository.StartNewSession();
        _store.OnUpdate += HandleTelemetryUpdate;
        Console.WriteLine("INFLUXWORKER: START");
    }

    private void StopWork()
    {
        _workerTokenSource?.Cancel();
        _store.OnUpdate -= HandleTelemetryUpdate;
        Console.WriteLine("INFLUXWORKER: STOP");
    }

    private void HandleTelemetryUpdate(SensorData data)
    {
        try
        {
            _repository.WriteSensorData(data);
        }
        catch (Exception e)
        {
            Console.WriteLine("Influx error: " + e);
            throw;
        }
    }

    protected override Task ExecuteAsync(CancellationToken stoppingToken)
    {
        return Task.CompletedTask;
    }
}