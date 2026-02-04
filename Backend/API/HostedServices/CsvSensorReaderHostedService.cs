using SensorReader.Reader;

namespace API.HostedServices;

public class CsvSensorReaderHostedService : BackgroundService
{
    private readonly CsvSensorReader _reader;

    public CsvSensorReaderHostedService(CsvSensorReader reader)
    {
        _reader = reader;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var path = Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "..", "DummyData", "output.csv");
        path = Path.GetFullPath(path);
        await _reader.WatchFile(path, stoppingToken);
    }
}