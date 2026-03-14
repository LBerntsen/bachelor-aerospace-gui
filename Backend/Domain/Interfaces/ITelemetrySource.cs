using Domain.Enums;

namespace Domain.Interfaces;

public interface ITelemetrySource
{
    DataSource Type { get; }
    Task StartAsync(CancellationToken cancellationToken);
    Task StopAsync(CancellationToken cancellationToken);
}