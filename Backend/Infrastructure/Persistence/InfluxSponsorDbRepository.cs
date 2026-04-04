using Domain.Models;
using InfluxDB.Client;
using Microsoft.Extensions.Configuration;

namespace Infrastructure.Persistence;

public class InfluxSponsorDbRepository : IDisposable
{
    private readonly InfluxDBClient _cloudClient;
    private readonly string _cloudBucket;
    private readonly string _cloudOrg;
    
    private string _sessionId;

    public InfluxSponsorDbRepository(IConfiguration config)
    {
        var cloudUrl = config["InfluxDBCloud:Url"];
        var cloudToken = config["InfluxDBCloud:Token"];
        _cloudBucket = config["InfluxDBCloud:Bucket"];
        _cloudOrg = config["InfluxDBCloud:Org"];

        var cloudOptions = new InfluxDBClientOptions.Builder()
            .Url(cloudUrl)
            .AuthenticateToken(cloudToken.ToCharArray())
            .Build();

        _cloudClient = InfluxDBClientFactory.Create(cloudOptions);
    }
    
    public void Dispose()
    {
        _cloudClient.Dispose();
    }

    public async Task<string?> GetLatestSessionIdAsync()
    {
        var query = $@"
            from(bucket: ""{_cloudBucket}"")
            |> range(start: -7d) 
            |> filter(fn: (r) => r._measurement == ""telemetry"")
            |> last() 
            |> keep(columns: [""session_id""])";

        var tables = await _cloudClient.GetQueryApi().QueryAsync(query, _cloudOrg);

        return tables
            .SelectMany(table => table.Records)
            .Select(record => record.GetValueByKey("session_id")?.ToString())
            .FirstOrDefault();
    }

    public async Task<List<SensorData>> GetSessionDataAsync(string sessionId)
    {
        var query = $@"
        import ""influxdata/influxdb/v1""
        from(bucket: ""{_cloudBucket}"")
        |> range(start: 0)
        |> filter(fn: (r) => r.session_id == ""{sessionId}"")
        |> v1.fieldsAsCols()
        |> group()
        |> sort(columns: [""_time""])";
    
        var tables = await _cloudClient.GetQueryApi().QueryAsync(query, _cloudOrg);

        return tables
            .SelectMany(table => table.Records)
            .Select(record => {
                var time = record.GetTime()?.ToDateTimeUtc().ToString("O") ?? DateTime.UtcNow.ToString("O");
                var id = record.GetValueByKey("sensor_id")?.ToString() ?? "unknown";
                
                var val = record.GetValueByKey("value");
                double doubleVal = val != null ? Convert.ToDouble(val) : 0.0;
                
                return new SensorData(time, id, doubleVal);
            })
            .ToList();
    }

    public async Task<List<SensorData>> GetCurrentSessionDataAsync()
    {
        string sessionId = await GetLatestSessionIdAsync();
        
        if (string.IsNullOrEmpty(sessionId))
            return new List<SensorData>();
        
        _sessionId = sessionId;
        return await GetSessionDataAsync(sessionId);
    }

    public async Task<List<SensorData>> PollRecentDataAsync(int secondsBack)
    {
        var query = $@"
        import ""influxdata/influxdb/v1""
        from(bucket: ""{_cloudBucket}"")
        |> range(start: -{secondsBack}s) 
        |> filter(fn: (r) => r._measurement == ""telemetry"")
        |> filter(fn: (r) => r.session_id == ""{_sessionId}"")
        |> v1.fieldsAsCols()
        |> group()
        |> sort(columns: [""_time""])";

        var tables = await _cloudClient.GetQueryApi().QueryAsync(query, _cloudOrg);

        return tables
            .SelectMany(table => table.Records)
            .Select(record =>
            {
                var time = record.GetTime()?.ToDateTimeUtc().ToString("O") ?? DateTime.UtcNow.ToString("O");
                var id = record.GetValueByKey("sensor_id")?.ToString() ?? "Unknown";
                var val = record.GetValueByKey("value");
                return new SensorData(time, id, val != null ? Convert.ToDouble(val) : 0.0);
            })
            .ToList();
    }
}