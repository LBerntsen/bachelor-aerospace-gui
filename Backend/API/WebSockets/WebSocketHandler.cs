using System.Net.WebSockets;
using System.Text;
using System.Text.Json;

namespace API.WebSockets;

public class WebSocketHandler
{
    private static readonly Random _random = Random.Shared;

    public static async Task Handle(HttpContext context)
    {
        if (!context.WebSockets.IsWebSocketRequest)
        {
            context.Response.StatusCode = StatusCodes.Status400BadRequest;
            return;
        }

        using var webSocket = await context.WebSockets.AcceptWebSocketAsync();
     
        // Initial data
        var initialMessage = new
        {
            type = "initial",
            data = new[]
            {
                new { id = "sensor1", value = 12 },
                new { id = "sensor2", value = 99 },
                new { id = "sensor3", value = 42 },
                new { id = "test", value = 123 },
                new { id = "pokpwoekf", value = 42340 },
                new { id = "test1231254536436", value = 123 },
                new { id = "sensor1", value = 55212 },
                new { id = "sensor2", value = 122221 },
                new { id = "sensor2", value = 11112 }
            }
        };

        await SendJsonAsync(webSocket, initialMessage);
        
        // Updates
        while (webSocket.State == WebSocketState.Open)
        {
            var updateMessage = new
            {
                type = "update",
                data = new
                {
                    id = "sensor2",
                    value = _random.Next()
                }
            };

            await SendJsonAsync(webSocket, updateMessage);
            await Task.Delay(1000);
        }
    }

    private static async Task SendJsonAsync(WebSocket socket, object payload)
    {
        var json = JsonSerializer.Serialize(payload);
        var bytes = Encoding.UTF8.GetBytes(json);

        await socket.SendAsync(bytes, WebSocketMessageType.Text, true, CancellationToken.None);
    }
}