using System.Net;
using System.Net.Sockets;
using System.Text;
using Domain.Enums;
using Domain.Interfaces;
using Domain.Models;
using Domain.Telemetry;

namespace Infrastructure.DataIngestion.Implementations;

public class TcpSource : ITelemetrySource
{
    private readonly TelemetryStore _store;
    private CancellationTokenSource? _cancellationTokenSource;
    private const int Port = 8088;
    
    public DataSource Type { get; } = DataSource.Tcp;

    public TcpSource(TelemetryStore store)
    {
        _store = store;
    }
    
    public Task StartAsync(CancellationToken cancellationToken)
    {
        _cancellationTokenSource = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
        Task.Run(() => StartServer(_cancellationTokenSource.Token), _cancellationTokenSource.Token);
        return Task.CompletedTask;
    }

    public async Task StopAsync(CancellationToken cancellationToken)
    {
        if (_cancellationTokenSource != null)
            await _cancellationTokenSource.CancelAsync();
    }

    private async Task StartServer(CancellationToken cancellationToken)
    {
        var listener = new TcpListener(IPAddress.Any, Port);
        listener.Start();
        Console.WriteLine($"Backend TCP server lytter på port {Port}...");

        try
        {
            while (!cancellationToken.IsCancellationRequested)
            {
                using var client = await listener.AcceptTcpClientAsync(cancellationToken);
                Console.WriteLine("Backend TCP server klient koblet til!");

                using var stream = client.GetStream();
                using var reader = new StreamReader(stream, Encoding.UTF8);

                while (!reader.EndOfStream && !cancellationToken.IsCancellationRequested)
                {
                    var line = await reader.ReadLineAsync(cancellationToken);
                    if(!string.IsNullOrWhiteSpace(line))
                        ProcessLine(line);
                }
                
                Console.WriteLine("Backend TCP server klient koblet fra!");
            }
        }
        catch (OperationCanceledException) { }
        catch (Exception e)
        {
            Console.WriteLine($"Backend TCP server feil: ${e.Message}");
            throw;
        }
        finally
        {
            listener.Stop();
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