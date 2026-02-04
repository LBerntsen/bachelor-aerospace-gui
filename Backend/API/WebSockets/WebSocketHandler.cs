using System.Net.WebSockets;
using System.Text;
using System.Text.Json;
using Domain.Models;
using Domain.Telemetry;

namespace API.WebSockets;

public class WebSocketHandler
{
    public static async Task Handle(HttpContext context)
    {
        if (!context.WebSockets.IsWebSocketRequest)
        {
            context.Response.StatusCode = StatusCodes.Status400BadRequest;
            return;
        }

        var store = context.RequestServices.GetRequiredService<TelemetryStore>();
        using var webSocket = await context.WebSockets.AcceptWebSocketAsync();
     
        // Initial data
        await SendJsonAsync(webSocket, new
        {
            type = "initial",
            data = store.GetAll()
        });
        
        // Update
        async void OnStoreUpdate(SensorData item)
        {
            var message = new
            {
                type = "update",
                data = item
            };

            await SendJsonAsync(webSocket, message);
        }

        store.OnUpdate += OnStoreUpdate;

        while (webSocket.State == WebSocketState.Open)
        {
            await Task.Delay(1);
        }

        store.OnUpdate -= OnStoreUpdate;
    }

    private static async Task SendJsonAsync(WebSocket socket, object payload)
    {
        var json = JsonSerializer.Serialize(payload);
        var bytes = Encoding.UTF8.GetBytes(json);

        await socket.SendAsync(bytes, WebSocketMessageType.Text, true, CancellationToken.None);
    }
}