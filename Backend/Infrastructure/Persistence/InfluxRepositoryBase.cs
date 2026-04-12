using Domain.Models;
using InfluxDB.Client;
using InfluxDB.Client.Core.Flux.Domain;
using Microsoft.Extensions.Configuration;

namespace Infrastructure.Persistence;

public abstract class InfluxRepositoryBase : IDisposable
{
    protected InfluxDBClient CreateClient(IConfiguration config, string section)
    {
        var url = config[$"{section}:Url"];
        var token = config[$"{section}:Token"];
        return new InfluxDBClient(url, token);
    }
    
    protected List<SensorData> MapRecordsToSensorData(List<FluxTable> tables)
    {
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

    protected async Task<List<SensorData>> QuerySessionDataInternal(InfluxDBClient client, string bucket, string org,
        string sessionId)
    {
        var query = $@"
            import ""influxdata/influxdb/v1""
            from(bucket: ""{bucket}"")
            |> range(start: 0)
            |> filter(fn: (r) => r.session_id == ""{sessionId}"")
            |> v1.fieldsAsCols()
            |> group()
            |> sort(columns: [""_time""])";

        var tables = await client.GetQueryApi().QueryAsync(query, org);
        return MapRecordsToSensorData(tables);
    }

    public abstract void Dispose();
}