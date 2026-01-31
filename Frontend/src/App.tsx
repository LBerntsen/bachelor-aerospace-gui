import Testing from "./state/telemetry/testing.tsx";
import WebSocketProvider from "./state/websocket/WebSocketProvider.tsx";

export default function App() {
    return (
        <>
            <WebSocketProvider/>
            <Testing/>
        </>
    );
}