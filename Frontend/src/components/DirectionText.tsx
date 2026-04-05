import { useSelector } from "react-redux";
import {selectLatestTelemetryValueById} from "../state/telemetry/telemetrySlice";

interface DirectionTextProps
{
  sensorId: string
  unit?: string
}

export default function DirectionText ({ sensorId, unit }: DirectionTextProps)
{
    const latestValue = useSelector(selectLatestTelemetryValueById(sensorId));

    return (
        <div className="">
            <p className="text-xs text-neutral-500 font-semibold tracking-[0.25em] md-4">{sensorId}</p>
            <div className="flex items-end">
                <span className="text-4xl font-semibold text-neutral-100">{latestValue ? ((latestValue.value / 1000) * Math.PI / 180).toLocaleString() : "--"}</span>
                <p className="text-4xl text-neutral-100">{unit ? unit : ""}</p>
            </div>
        </div>
    );
};