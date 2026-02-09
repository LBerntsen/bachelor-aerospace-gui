import TestChart from "../components/TestChart.tsx";
import WebSocketProvider from "../state/websocket/WebSocketProvider.tsx";
import Header from "../components/Header.tsx"

export function Telemetry(){
    return (
        <div className="bg-[#121212]">
            <WebSocketProvider/>
            <Header/>
            <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "20px",
                    padding: "20px"
                }}>
                    <TestChart sensorId="Climbrate" />
            </div>
        </div>
        
    )
}