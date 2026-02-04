import Testing from "./state/telemetry/testing.tsx";
import WebSocketProvider from "./state/websocket/WebSocketProvider.tsx";
import TestChart from "./components/TestChart.tsx";
export default function App() {
    return (
        <>
            <Testing/>
            <WebSocketProvider/>
            
        </>
    );
}