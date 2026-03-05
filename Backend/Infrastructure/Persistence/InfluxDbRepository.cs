using Domain.Models;
using InfluxDB.Client;
using InfluxDB.Client.Api.Domain;
using InfluxDB.Client.Writes;
using Microsoft.Extensions.Configuration;

namespace Infrastructure.Persistence;

public class InfluxDbRepository : IDisposable
{
    private readonly InfluxDBClient _client;
    private readonly WriteApi _writeApi;
    private readonly string _bucket;
    private readonly string _org;
    private readonly string _sessionId;

    public InfluxDbRepository(IConfiguration config)
    {
        var url = config["InfluxDB:Url"] ?? "http://localhost:8086";
        var token = config["InfluxDB:Token"];
        _bucket = config["InfluxDB:Bucket"];
        _org = config["InfluxDB:Org"];

        var options = new InfluxDBClientOptions.Builder()
            .Url(url)
            .AuthenticateToken(token.ToCharArray())
            .Build();

        _client = InfluxDBClientFactory.Create(options);
        
        _writeApi = _client.GetWriteApi(new WriteOptions
        {
            BatchSize = 50,
            FlushInterval = 1000,
            RetryInterval = 3000
        });
        
        _sessionId = $"session_{DateTime.Now:yyyy-MM-dd_HH-mm}";
    }
    
    public void Dispose() => _client.Dispose();

    public void WriteSensorData(SensorData data)
    {
        var point = PointData
            .Measurement("telemetry")
            .Tag("session_id", _sessionId)
            .Tag("sensor_id", data.Id.ToLower())
            .Field("value", data.Value)
            .Timestamp(DateTime.Parse(data.TimeStamp).ToUniversalTime(), WritePrecision.Ns);
        
        _writeApi.WritePoint(point, _bucket, _org);
    }

    public async Task<List<string>> GetSessionsAsync()
    {
        var query = $@"
            import ""influxdata/influxdb/v1""
            v1.tagValues(bucket: ""{_bucket}"", tag: ""session_id"")";

        var tables = await _client.GetQueryApi().QueryAsync(query, _org);

        return tables
            .SelectMany(table => table.Records)
            .Select(record => record.GetValue().ToString() ?? "Unknown Session")
            .ToList();
    }
}