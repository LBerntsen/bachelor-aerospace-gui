import TestChart from "../components/TestChart.tsx";
import Header from "../components/Header.tsx"
import TextData from "../components/TextData.tsx";
import FuelTank from "../components/FuelTankChart.tsx";
import CameraFeed from "../components/VideoStream.tsx";
import { BarChart } from "recharts";
import ChamberTemp from "../components/ChamberTemp.tsx";
import { Card } from "../components/Card.tsx";
import  RocketScene  from "../components/RocketScene.tsx"
import DirectionText from "../components/DirectionText.tsx";
import ErrorBoundary from "../components/ErrorBoundary.tsx";

export function Home(){
    return (
        <div className="">
        <Card className="">
            <ErrorBoundary className="text-4xl font-semibold text-neutral-100" fallback="There was an error loading the Rocket model">
            <div className="">
                
                <div className="absolute z-10">
                    <Card className="mt-2">
                        <DirectionText sensorId="Yaw" enhet="°" />
                    </Card>
                    <Card className="mt-2">
                        <DirectionText sensorId="Pitch" enhet="°"/>
                    </Card>
                    <Card className="mt-2">
                        <DirectionText sensorId="Roll" enhet="°"/>
                    </Card>
                    <Card className="mt-2">
                        <TextData sensorId="Altitude" enhet="m/s"/>
                    </Card>
                </div>
                
            </div>
            
                <div className="h-100">
                    <RocketScene />
                </div>
            </ErrorBoundary>
        </Card>
        </div>
        
    )
}