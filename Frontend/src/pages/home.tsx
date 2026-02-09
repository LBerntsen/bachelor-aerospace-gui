import TestChart from "../components/TestChart.tsx";
import WebSocketProvider from "../state/websocket/WebSocketProvider.tsx";
import Header from "../components/Header.tsx"
import TextData from "../components/TextData.tsx";

export function Home(){
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
                    <div>
                        <TextData sensorId="Roll"/>
                        <TextData sensorId="Pitch"/>
                        <TextData sensorId="Yaw"/>
                    </div>
                    <TestChart sensorId="Climbrate" />
                    <TestChart sensorId="Altitude"/>
                    <TestChart sensorId="Pressure"/>
                    <TestChart sensorId="Temperature"/>
            </div>
        </div>
        
    )
}