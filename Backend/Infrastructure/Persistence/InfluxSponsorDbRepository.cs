using Domain.Models;
using InfluxDB.Client;
using Microsoft.Extensions.Configuration;

namespace Infrastructure.Persistence;

public class InfluxSponsorDbRepository : InfluxRepositoryBase
{
    private readonly InfluxDBClient _cloudClient;
    private readonly string _cloudBucket;
    private readonly string _cloudOrg;
    
    private string _sessionId;

    public InfluxSponsorDbRepository(IConfiguration config)
    {
        _cloudBucket = config["InfluxDBCloud:Bucket"];
        _cloudOrg = config["InfluxDBCloud:Org"];
        _cloudClient = CreateClient(config, "InfluxDBCloud");
    }
    
    public override void Dispose()
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
        return await QuerySessionDataInternal(_cloudClient, _cloudBucket, _cloudOrg, sessionId);
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

        return MapRecordsToSensorData(tables);
    }
}