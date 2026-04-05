import { useSelector } from "react-redux";
import {selectLatestTelemetryValueById} from "../state/telemetry/telemetrySlice";

type TextDataProps = {
  sensorId: string;
};

export default function RecoveryStatus ({ sensorId }: TextDataProps)
{
    const latestValue = useSelector(selectLatestTelemetryValueById(sensorId));

    return (
        <div className="">
            <div className={`w-36 h-36 rounded-full flex items-center justify-center border transition-all border-green-300 `}>
                <span className="text-4xl font-semibold text-neutral-100">{latestValue ? latestValue.value.toLocaleString() : "--"}</span>
            </div>
            <p className="text-xl font-semibold text-neutral-100 tracking-[0.25em] mt-2 text-center">{latestValue?.value}</p>
            <p className="text-xl font-semibold text-neutral-100 tracking-[0.25em] mt-2 text-center">{sensorId}</p>
        </div>
    );
};