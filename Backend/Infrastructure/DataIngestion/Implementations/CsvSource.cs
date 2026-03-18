using Domain.Enums;
using Domain.Interfaces;
using Domain.Models;
using Domain.Telemetry;

namespace Infrastructure.DataIngestion.Implementations;

public class CsvSource : ITelemetrySource
{
    private readonly TelemetryStore _store;
    private CancellationTokenSource? _cancellationTokenSource;
    
    public DataSource Type { get; } = DataSource.Csv;

    public CsvSource(TelemetryStore store)
    {
        _store = store;
    }
    
    public Task StartAsync(CancellationToken cancellationToken)
    {
        _cancellationTokenSource = new CancellationTokenSource();
        WatchFile(_cancellationTokenSource.Token);
        return Task.CompletedTask;
    }

    public async Task StopAsync(CancellationToken cancellationToken)
    {
        if (_cancellationTokenSource != null)
            await _cancellationTokenSource.CancelAsync();
    }

    private async Task WatchFile(CancellationToken cancellationToken)
    {
        var path = Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "..", "DummyData", "output.csv");
        path = Path.GetFullPath(path);

        using var fs = new FileStream(path, FileMode.Open, FileAccess.Read, FileShare.ReadWrite);
        using var reader = new StreamReader(fs);
        
        // Hopper til slutten
        await reader.ReadToEndAsync(cancellationToken);
        
        // Sett opp file watcher
        var watcher = new FileSystemWatcher(Path.GetDirectoryName(path), Path.GetFileName(path))
        {
            NotifyFilter = NotifyFilters.LastWrite | NotifyFilters.Size,
            EnableRaisingEvents = true
        };

        var fileChanged = new AutoResetEvent(false);
        watcher.Changed += (_, _) => fileChanged.Set();
        
        // Venter på nye linjer
        while (!cancellationToken.IsCancellationRequested)
        {
            fileChanged.WaitOne();
            while (!reader.EndOfStream)
            {
                var line = await reader.ReadLineAsync(cancellationToken);
                if (string.IsNullOrWhiteSpace(line))
                    continue;
                ProcessLine(line);
            }
        }
    }

    private void ProcessLine(string line)
    {
        var parts = line.Split(";");
        double value = 0;
            
        if (double.TryParse(parts[3], out var doubleVal))
            value = doubleVal;
        else if (bool.TryParse(parts[3], out var boolVal))
            value = boolVal ? 1 : 0;

        _store.Add(new SensorData(parts[0], parts[2], value));
    }
}