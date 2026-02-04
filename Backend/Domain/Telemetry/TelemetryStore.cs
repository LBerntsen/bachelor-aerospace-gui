using System.Collections.Concurrent;
using Domain.Models;

namespace Domain.Telemetry;

public class TelemetryStore
{
    private readonly ConcurrentQueue<SensorData> _data = new();

    public event Action<SensorData>? OnUpdate;
    
    public IReadOnlyCollection<SensorData> GetAll() => _data;

    public void Add(SensorData item)
    {
        _data.Enqueue(item);
        OnUpdate?.Invoke(item);
    }
}