import { useSelector } from "react-redux";
import { selectTelemetryValuesById } from "../state/telemetry/telemetrySlice";


type TextDataProps = {
  sensorId: string;
};

const TextData = ({ sensorId }: TextDataProps) => {

    const data = useSelector(selectTelemetryValuesById(sensorId));

    const hasData = data.length > 0;
    const latestValue = data[data.length - 1]?.value;
    const units: Record<string, string> = {
        Temperature: "°C",
        Pressure: "Bar",
        Fuellevel: "%"
    };

    const unit = units[sensorId];


    return (
        <div className="">
            <p className="text-xs text-neutral-500 font-semibold tracking-[0.25em] md-4">
                {sensorId}
            </p>
            <div className="flex items-end gap-4">
                <span className="text-4xl font-semibold text-neutral-100">
                    {!hasData ? "--" : latestValue?.toLocaleString()}
                </span>
                <p className="text-xl text-neutral-100">
                    {!unit ? "": unit}
                </p>
            </div>
        </div>
    );
};

export default TextData;
