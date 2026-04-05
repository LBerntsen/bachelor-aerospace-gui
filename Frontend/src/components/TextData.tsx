import { useSelector } from "react-redux";
import {selectLatestTelemetryValueById} from "../state/telemetry/telemetrySlice";

type TextDataProps = {
  sensorId: string;
  unit?:string
};

export default function TextData ({ sensorId, unit }: TextDataProps)
{
    const latestValue = useSelector(selectLatestTelemetryValueById(sensorId));

    return (
        <div className="">
            <p className="text-xs text-neutral-500 font-semibold tracking-[0.25em] md-4">
                {sensorId}
            </p>
            <div className="flex items-end gap-4">
                <span className="text-4xl font-semibold text-neutral-100">
                    {latestValue ? latestValue.value.toLocaleString() : "--"}
                </span>
                <p className="text-xl text-neutral-100 tracking-[0.25em]">
                    {unit ? unit : ""}
                </p>
            </div>
        </div>
    );
};