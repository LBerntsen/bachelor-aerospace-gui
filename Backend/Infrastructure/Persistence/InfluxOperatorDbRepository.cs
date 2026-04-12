using Domain.Models;
using InfluxDB.Client;
using InfluxDB.Client.Api.Domain;
using InfluxDB.Client.Writes;
using Microsoft.Extensions.Configuration;

namespace Infrastructure.Persistence;

public class InfluxOperatorDbRepository : InfluxRepositoryBase
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

    public InfluxOperatorDbRepository(IConfiguration config)
    {
        _localBucket = config["InfluxDBLocal:Bucket"];
        _localOrg = config["InfluxDBLocal:Org"];
        
        WriteOptions realtimeWriteOptions = new WriteOptions
        {
            BatchSize = 50,
            FlushInterval = 1000,
            RetryInterval = 3000
        };
        
        _localClient = CreateClient(config, "InfluxDBLocal");
        _localApi = _localClient.GetWriteApi(realtimeWriteOptions);
        
        _cloudBucket = config["InfluxDBCloud:Bucket"];
        _cloudOrg = config["InfluxDBCloud:Org"];
        
        _cloudClient = CreateClient(config,  "InfluxDBCloud");
        _cloudApi = _cloudClient.GetWriteApi(realtimeWriteOptions);
    }
    
    public override void Dispose()
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
        
        ExecuteWrite(point, _localApi, _localBucket, _localOrg, "local");
        ExecuteWrite(point, _cloudApi, _cloudBucket, _cloudOrg, "cloud");
    }

    public void ExecuteWrite(PointData point, WriteApi writeApi, string bucket, string org, string apiTag)
    {
        try
        {
            writeApi.WritePoint(point, bucket, org);
        }
        catch (Exception e)
        {
            Console.WriteLine($"Could not write point to {apiTag} database {e.Message}");
        }
    }

    public async Task<List<string>> GetSessionsAsync()
    {
        try
        {
            return await ExecuteGetSessionsQueryAsync(_cloudClient, _cloudBucket, _cloudOrg);
        }
        catch (Exception e)
        {
            Console.WriteLine("Failed getting session data from cloud client, trying local...");
            return await ExecuteGetSessionsQueryAsync(_localClient, _localBucket, _localOrg);
        }
    }

    private async Task<List<string>> ExecuteGetSessionsQueryAsync(InfluxDBClient client, string bucket, string org)
    {
        var query = $@"
            from(bucket: ""{bucket}"")
            |> range(start: 0)
            |> keep(columns: [""session_id""])
            |> distinct(column: ""session_id"")";

        var tables = await client.GetQueryApi().QueryAsync(query, org);

        return tables
            .SelectMany(table => table.Records)
            .Select(record => record.GetValueByKey("session_id")?.ToString())
            .Where(s => !string.IsNullOrEmpty(s))
            .ToList();
    }
    
    public async Task<List<SensorData>> GetSessionDataAsync(string sessionId)
    {
        try
        {
            return await QuerySessionDataInternal(_cloudClient, _cloudBucket, _cloudOrg, sessionId);
        }
        catch (Exception e)
        {
            Console.WriteLine("Failed getting session data from cloud client, trying local...");
            return await QuerySessionDataInternal(_localClient, _localBucket, _localOrg, sessionId);
        }
    }
}