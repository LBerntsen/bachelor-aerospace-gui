import TestChart from "../components/TestChart.tsx";
import WebSocketProvider from "../state/websocket/WebSocketProvider.tsx";
import Header from "../components/Header.tsx"
import FuelTank from "../components/FuelTankChart.tsx";
import TextData from "../components/TextData.tsx";
import ChamberTemp from "../components/ChamberTemp.tsx";
import CameraFeed from "../components/VideoStream.tsx";

export function Propulsion(){
    return (
        <div className="bg-[#121212]">
            <WebSocketProvider/>
            <Header pageName="Propulsion"/>
            <div className="grid grid-cols-2 gap-6 w-full p-4">
                <div className="h-screen">
                    <FuelTank></FuelTank>
                </div>
                <div className="h-screen">
                    <div>
                        <ChamberTemp sensorId="Temperature" />
                    </div>
                    <div className=" rounded-2xl bg-[#161616] p-5 border border-[#1e293b] my-4">
                        <div className="uppercase tracking-[0.25em] text-white text-sm font-semibold pb-2">
                            Temperture Combustion chamber
                        </div>
                        <div className="flex justify-between ">
                            <TextData sensorId="Temperature"/>
                            <TextData sensorId="Temperature"/>
                        </div>
                        
                    </div>
                    <div className=" rounded-2xl bg-[#161616] p-5 border border-[#1e293b] my-4">
                        <div className="uppercase tracking-[0.25em] text-white text-sm font-semibold pb-2">
                            Temperture injector
                        </div>
                        <div className="flex justify-between">
                            <TextData sensorId="Temperature"/>
                            <TextData sensorId="Temperature"/>
                        </div>
                        <TestChart sensorId="Temperature"/>
                    </div>
                </div>
                
                
            </div>
        </div>
    )
}