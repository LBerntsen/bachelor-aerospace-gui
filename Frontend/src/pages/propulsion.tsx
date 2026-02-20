import TestChart from "../components/TestChart.tsx";
import WebSocketProvider from "../state/websocket/WebSocketProvider.tsx";
import Header from "../components/Header.tsx"
import FuelTank from "../components/FuelTankChart.tsx";
import TextData from "../components/TextData.tsx";
import ChamberTemp from "../components/ChamberTemp.tsx";
import CameraFeed from "../components/VideoStream.tsx";
import { Card } from "../components/Card.tsx";
import TinyBarChart from "../components/BarChart.tsx";

export function Propulsion(){
    return (
        <div className="bg-[#121212] min-h-screen flex flex-col">
            <WebSocketProvider/>
            <Header pageName="Propulsion"/>
            <div className="flex flex-1 items-stretch">
                <Card className="m-4 flex gap-4">
                    <FuelTank sensorId="fuellevel" fuelColor="#f59e0b"></FuelTank>
                    <div className="my-4">
                        <p className="uppercase tracking-[0.25em] text-white font-semibold mb-4"> Fuel</p>
                        <TextData sensorId="Fuellevel"/>
                    </div>
                    <FuelTank sensorId="fuellevel" fuelColor="#3b82f6"></FuelTank>
                    <div className="my-4">
                        <p className="uppercase tracking-[0.25em] text-white font-semibold mb-4"> Oxidizer </p>
                        <TextData sensorId="Fuellevel"/>
                    </div>
                </Card>
                <div className="flex-1">
                    <Card className="m-4 flex flex-col items-center">
                        <ChamberTemp sensorId="Temperature"/>
                        <TinyBarChart sensorId="Temperature"/>
                    </Card>
                    <Card className="m-4 ">
                        <p className="uppercase tracking-[0.25em] text-white font-semibold mb-4"> Temperature Combustion Chamber</p>
                        <div className="flex justify-between">
                            <TextData sensorId="Temperature"/>
                            <TextData sensorId="Temperature"/>
                        </div>
                    </Card>
                    <Card className="m-4 ">
                        <p className="uppercase tracking-[0.25em] text-white ont-semibold mb-4"> Temperature Injector</p>
                        <div className="flex justify-between">
                            <TextData sensorId="Temperature"/>
                            <TextData sensorId="Temperature"/>
                        </div>
                    </Card>
                </div>

            </div>
            <Card className="flex justify-between rounded-none">
                <TextData sensorId="Yaw"/>
                <TextData sensorId="Roll"/>
                <TextData sensorId="Yaw"/>
            </Card>
        </div>
    )
}   