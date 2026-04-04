import Header from "../components/Header.tsx"
import TextData from "../components/TextData.tsx";
import { Card } from "../components/Card.tsx";
import RecoveryStatus from "../components/RecoveryStatus.tsx";
import TinyChart from "../components/TinyChart.tsx";
import EventLog from "../components/EventLog.tsx";

export function Recovery(){
    return(
        <>
            <div className="bg-[#121212]">
            <Header pageName="Recovery"/>
            </div>
            <div className="m-4">
                <div className="grid grid-cols-[1fr_auto]">
                    <div>
                        <Card className="">
                            <p className="uppercase tracking-[0.25em] text-white font-semibold mb-4">
                                Recovery
                            </p>
                            <div className="flex justify-between">
                                <RecoveryStatus sensorId="Fueling"/>
                                <RecoveryStatus sensorId="IDLE"/>
                                <RecoveryStatus sensorId="Fire"/>
                                <RecoveryStatus sensorId="Status7"/>
                            </div>
                        </Card>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <Card className=" ">
                                <TextData sensorId="Altitude" enhet="METERS"/>
                                <div className="m-4">
                                    <TinyChart sensorId="Climbrate"/>
                                </div>
                            </Card>
                            <Card className="">
                                <TextData sensorId="Climbrate" enhet="M/S"/>
                                <div className="m-4">
                                    <TinyChart sensorId="Climbrate"/>
                                </div>  
                            </Card>
                            
                        </div>
                    </div>
                    <div className="w-64">
                    <Card className="ml-4 pl-5 pr-5 h-72 overflow-y-auto">
                        <p className="uppercase tracking-[0.25em] text-white font-semibold mb-4">
                            Statues
                        </p>
                        <div>
                            <TextData sensorId="Status1"/>
                            <TextData sensorId="Status2"/>
                            <TextData sensorId="Status3"/>
                            <TextData sensorId="Status4"/>
                            <TextData sensorId="Status5"/>
                            <TextData sensorId="Status6"/>
                            <TextData sensorId="Status7"/>
                        </div>
                    </Card>
                    <Card className="mt-4 ml-4">
                        <EventLog sensorId="isRunning"/>
                    </Card>
                    </div>
                </div>
                
            </div>
            
        </>
    )   
}