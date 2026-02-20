import TestChart from "../components/TestChart.tsx";
import WebSocketProvider from "../state/websocket/WebSocketProvider.tsx";
import Header from "../components/Header.tsx"
import TextData from "../components/TextData.tsx";
import FuelTank from "../components/FuelTankChart.tsx";
import CameraFeed from "../components/VideoStream.tsx";
import { BarChart } from "recharts";
import ChamberTemp from "../components/ChamberTemp.tsx";

export function Home(){
    return (
        <div className="bg-[#121212]">
            <WebSocketProvider/>
            <Header pageName="Dashboard"/>           
            <div  className="p-2" style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "20px",
                    padding: "20px"
                }}>
                    <div>
                        <CameraFeed/>
                    </div>
                    <div>
                        <TextData sensorId="Roll"/>
                        <TextData sensorId="Pitch"/>
                        <TextData sensorId="Yaw"/>
                    </div>
                    <TestChart sensorId="N20Den"/>

            </div>
        </div>
        
    )
}