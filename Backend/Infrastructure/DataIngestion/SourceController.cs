using Domain.Enums;
using Domain.Interfaces;
using Domain.Telemetry;

namespace Infrastructure.DataIngestion;

public class SourceController
{
    private readonly TelemetryStore _store;
    private readonly IEnumerable<ITelemetrySource> _sources;
    private ITelemetrySource? _currentSource;
    private readonly SemaphoreSlim _lock = new SemaphoreSlim(1, 1);

    public SourceController(TelemetryStore store, IEnumerable<ITelemetrySource> sources)
    {
        _store = store;
        _sources = sources;
    }

    public async Task SwitchTo(DataSource sourceType)
    {
        await _lock.WaitAsync();

        try
        {
            if (_currentSource?.Type == sourceType)
                return;

        
            if (_currentSource != null)
            {
                await _currentSource.StopAsync(CancellationToken.None);
                Console.WriteLine($"INGESTION: Stoppet {_currentSource.Type}");
                _currentSource = null;
            }

            var newSource = _sources.FirstOrDefault(source => source.Type == sourceType);

            if (newSource != null)
            {
                _store.Clear();
                await newSource.StartAsync(CancellationToken.None);
                Console.WriteLine($"INGESTION: Starter {sourceType}");
                _currentSource = newSource;
                Console.WriteLine($"INGESTION: Byttet til {_currentSource.Type}");
            }
        }
        finally
        {
            _lock.Release();
        }
    }
}