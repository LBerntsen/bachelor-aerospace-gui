import { useSelector } from "react-redux";
import {selectLatestTelemetryValueById} from "../state/telemetry/telemetrySlice";

interface ChamberTempProps
{
  sensorId: string
}

export default function ChamberTemp ({ sensorId }: ChamberTempProps)
{
    const latestValue = useSelector(selectLatestTelemetryValueById(sensorId));

    let status = "Normal";
    let statusStyles = "border-emerald-400/30 bg-emerald-500/10 text-emerald-300";
    let dotColor = "bg-emerald-400";

    if(latestValue)
    {
        if (latestValue.value > 20) {
            status = "Warning";
            statusStyles = "border-orange-400/30 bg-orange-500/10 text-orange-300";
            dotColor = "bg-orange-400";
        }

        if (latestValue.value > 100) {
            status = "Danger";
            statusStyles = "border-red-400/30 bg-red-500/10 text-red-300";
            dotColor = "bg-red-400";
        }
    }

    return (
        <div className="">
            <p className="uppercase tracking-[0.25em] text-white text-xl font-semibold">Combustion chamber</p>
            <div className="flex items-baseline gap-3 mt-4 justify-center">
                <span className="text-7xl font-bold text-white items-center">{latestValue ? latestValue.value.toLocaleString() : "--"}</span>
                <span className="text-2xl font-semibold text-white items-center">°C</span>
            </div>
            <div className="mt-6 flex justify-center">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border font-semibold text-sm ${statusStyles}`}>
                    <div className={`w-2 h-2 rounded-full ${dotColor}`}/>
                    {status}
                </div>
            </div>
        </div>
    );
}