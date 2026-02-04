using Domain.Models;
using Domain.Telemetry;

namespace SensorReader.Reader;

public class CsvSensorReader
{
    private readonly TelemetryStore _store;

    public CsvSensorReader(TelemetryStore store)
    {
        _store = store;
    }

    public async Task WatchFile(string filePath, CancellationToken cancellationToken)
    {
        using var fs = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.ReadWrite);
        using var reader = new StreamReader(fs);

        // Hoppe over header
        await reader.ReadLineAsync();
        
        // Leser gjennom fil
        while (!reader.EndOfStream)
        {
            var line = await reader.ReadLineAsync();
            if (string.IsNullOrWhiteSpace(line))
                continue;
            
            ProcessLine(line);
        }
        
        // Sett opp file watcher
        var watcher = new FileSystemWatcher(Path.GetDirectoryName(filePath), Path.GetFileName(filePath))
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
                var line = await reader.ReadLineAsync();
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