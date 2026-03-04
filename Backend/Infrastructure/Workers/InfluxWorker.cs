using Domain.Telemetry;
using Infrastructure.Persistence;
using Microsoft.Extensions.Hosting;

namespace Infrastructure.Workers;

public class InfluxWorker : BackgroundService
{
    private readonly TelemetryStore _store;
    private readonly InfluxDbRepository _repository;

    public InfluxWorker(TelemetryStore store, InfluxDbRepository repository)
    {
        _store = store;
        _repository = repository;
    }

    protected override Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _store.OnUpdate += async (data) =>
        {
            try
            {
                await _repository.WriteSensorDataAsync(data);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        };

        return Task.CompletedTask;
    }
}