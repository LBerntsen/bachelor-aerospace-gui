using Domain.Models;
using InfluxDB.Client;
using InfluxDB.Client.Api.Domain;
using InfluxDB.Client.Writes;
using Microsoft.Extensions.Configuration;

namespace Infrastructure.Persistence;

public class InfluxDbRepository : IDisposable
{
    private readonly InfluxDBClient _localClient;
    private readonly WriteApi _localApi;
    private readonly string _localBucket;
    private readonly string _localOrg;
    
    private readonly InfluxDBClient _cloudClient;
    private readonly WriteApi _cloudApi;
    private readonly string _cloudBucket;
    private readonly string _cloudOrg;
    
    private string _sessionId;

    public InfluxDbRepository(IConfiguration config)
    {
        var localUrl = config["InfluxDBLocal:Url"] ?? "http://localhost:8086";
        var localToken = config["InfluxDBLocal:Token"];
        _localBucket = config["InfluxDBLocal:Bucket"];
        _localOrg = config["InfluxDBLocal:Org"];

        var localOptions = new InfluxDBClientOptions.Builder()
            .Url(localUrl)
            .AuthenticateToken(localToken.ToCharArray())
            .Build();

        WriteOptions realtimeWriteOptions = new WriteOptions
        {
            BatchSize = 50,
            FlushInterval = 1000,
            RetryInterval = 3000
        };

        _localClient = InfluxDBClientFactory.Create(localOptions);
        _localApi = _localClient.GetWriteApi(realtimeWriteOptions);
        
        var cloudUrl = config["InfluxDBCloud:Url"];
        var cloudToken = config["InfluxDBCloud:Token"];
        _cloudBucket = config["InfluxDBCloud:Bucket"];
        _cloudOrg = config["InfluxDBCloud:Org"];

        var cloudOptions = new InfluxDBClientOptions.Builder()
            .Url(cloudUrl)
            .AuthenticateToken(cloudToken.ToCharArray())
            .Build();

        _cloudClient = InfluxDBClientFactory.Create(cloudOptions);
        _cloudApi = _cloudClient.GetWriteApi(realtimeWriteOptions);
    }
    
    public void Dispose()
    {
        _localClient.Dispose();
        _cloudClient.Dispose();
    }

    public void StartNewSession()
    {
        _sessionId = $"session_{DateTime.Now:yyyy-MM-dd_HH-mm-ss}";
    }
    
    public void WriteSensorData(SensorData data)
    {
        var point = PointData
            .Measurement("telemetry")
            .Tag("session_id", _sessionId)
            .Tag("sensor_id", data.Id.ToLower())
            .Field("value", data.Value)
            .Timestamp(DateTime.Parse(data.TimeStamp).ToUniversalTime(), WritePrecision.Ns);
        
        _localApi.WritePoint(point, _localBucket, _localOrg);
        _cloudApi.WritePoint(point, _cloudBucket, _cloudOrg);
    }

    public async Task<List<string>> GetSessionsAsync()
    {
        var query = $@"
            from(bucket: ""{_localBucket}"")
            |> range(start: 0)
            |> keep(columns: [""session_id""])
            |> distinct(column: ""session_id"")";

        var tables = await _localClient.GetQueryApi().QueryAsync(query, _localOrg);

        return tables
            .SelectMany(table => table.Records)
            .Select(record => record.GetValueByKey("session_id")?.ToString())
            .Where(s => !string.IsNullOrEmpty(s))
            .ToList();
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
        from(bucket: ""{_localBucket}"")
        |> range(start: 0)
        |> filter(fn: (r) => r.session_id == ""{sessionId}"")
        |> v1.fieldsAsCols()
        |> group()
        |> sort(columns: [""_time""])";
    
        var tables = await _localClient.GetQueryApi().QueryAsync(query, _localOrg);

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