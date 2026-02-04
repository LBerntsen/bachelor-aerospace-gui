import Testing from "./state/telemetry/testing.tsx";
import WebSocketProvider from "./state/websocket/WebSocketProvider.tsx";
import TestChart from "./components/TestChart.tsx";
import Input from "./components/Input.tsx";
export default function App() {
    return (
        <>
            <WebSocketProvider/>
            <TestChart sensorId="sensor2"/>
            <Input/>
        </>
    );
}