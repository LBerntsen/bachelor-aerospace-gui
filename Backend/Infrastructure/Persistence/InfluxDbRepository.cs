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

    public InfluxDbRepository(IConfiguration config)
    {
        var url = config["InfluxDB:Url"] ?? "http://localhost:8086";
        var token = config["InfluxDB:Token"];
        _bucket = config["InfluxDB:Bucket"];
        _org = config["InfluxDB:Org"];

        var options = new InfluxDBClientOptions.Builder()
            .Url(url)
            .AuthenticateToken(token.ToCharArray()) // Sikrer riktig auth-metode
            .Build();

        _client = InfluxDBClientFactory.Create(options);

        // Setter opp Batching for å unngå "Context Canceled" feil på Mac/Docker
        _writeApi = _client.GetWriteApi(new WriteOptions
        {
            BatchSize = 50,         // Sender i pakker på 50 punkter
            FlushInterval = 1000,   // Eller hvert sekund
            RetryInterval = 3000    // Ventetid ved feil
        });
    }

    public async Task WriteSensorDataAsync(SensorData data)
    {
        var point = PointData
            .Measurement("telemetry")
            .Tag("sensor_id", data.Id.ToLower())
            .Field("value", data.Value)
            .Timestamp(DateTime.Parse(data.TimeStamp).ToUniversalTime(), WritePrecision.Ns);
        
        _writeApi.WritePoint(point, _bucket, _org);
    }

    public void Dispose() => _client.Dispose();
}