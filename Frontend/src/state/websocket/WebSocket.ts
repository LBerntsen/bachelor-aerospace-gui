let socket: WebSocket | null = null;

export function connectWebSocket(onMessage: (data: any) => void)
{
    if(socket)
        return socket;

    socket = new WebSocket("ws://localhost:5009");

    socket.onopen = () => {
        console.log("WebSocket connected");
    };

    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        onMessage(message);
    };

    socket.onclose = () => {
        console.log("WebSocket disconnected");
        socket = null;
    };

    return socket;
}