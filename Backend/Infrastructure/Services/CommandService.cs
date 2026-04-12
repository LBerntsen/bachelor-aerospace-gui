using System.Net.Sockets;
using System.Text;
using Infrastructure.Services.Interfaces;
using Microsoft.Extensions.Configuration;

namespace Infrastructure.Services;

public class CommandService : ICommandService
{
    private readonly string _commandServerIp;
    private readonly int _commandServerPort;
    
    public CommandService(IConfiguration config)
    {
        _commandServerIp = config["CommandServerIP"];
        string portStr = config["CommandServerPort"];

        if (string.IsNullOrWhiteSpace(_commandServerIp) || !int.TryParse(portStr, out _commandServerPort))
            throw new InvalidOperationException("CommandService: IP or Port for command server is not set!");
        
        Console.WriteLine($"Command server IP is set to {_commandServerIp}");
        Console.WriteLine($"Command server port is set to {_commandServerPort}");
    }
    
    public async Task<bool> SendCommandByIdAsync(int id)
    {
        try
        {
            using var client = new TcpClient();
            await client.ConnectAsync(_commandServerIp, _commandServerPort);

            using var stream = client.GetStream();
            byte[] data = Encoding.UTF8.GetBytes(id.ToString() + Environment.NewLine);
            await stream.WriteAsync(data, 0, data.Length);
         
            Console.WriteLine($"Sending command with id {id} as bytes to server.");
            
            return true;
        }
        catch (Exception e)
        {
            Console.WriteLine($"TCP Error: {e.Message}");
            return false;
        }
    }
}