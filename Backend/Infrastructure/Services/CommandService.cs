using System.Net.Sockets;
using System.Text;
using Domain.DTOs;
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
    
    public async Task<CommandResponseDto> SendCommandByIdAsync(int id)
    {
        try
        {
            using var client = new TcpClient();
            await client.ConnectAsync(_commandServerIp, _commandServerPort);

            using var stream = client.GetStream();
            byte[] data = Encoding.UTF8.GetBytes(id.ToString() + Environment.NewLine);
            await stream.WriteAsync(data, 0, data.Length);
         
            Console.WriteLine($"Sending command with id {id} as bytes to server, waiting for response...");

            var buffer = new byte[1024];

            var readTask = stream.ReadAsync(buffer, 0, buffer.Length);
            var readTimeout = Task.Delay(3000);

            if (await Task.WhenAny(readTask, readTimeout) != readTask)
            {
                Console.WriteLine("TCP Error: Response timeout");
                return new CommandResponseDto(false, 408, "Response timeout");
            }

            int bytesRead = await readTask;

            if (bytesRead == 0)
            {
                Console.WriteLine("TCP Error: Server closed the connection without response!");
                return new CommandResponseDto(false, 500, "Server closed the connection without response");
            }

            var response = Encoding.UTF8.GetString(buffer, 0, bytesRead);
            Console.WriteLine($"Response from server: {response}");
            
            return new CommandResponseDto(true, 200, response);
        }
        catch (Exception e)
        {
            Console.WriteLine($"TCP Error: {e.Message}");
            return new CommandResponseDto(false, 500, e.Message);
        }
    }
}