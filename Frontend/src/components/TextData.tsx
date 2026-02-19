import { useSelector } from "react-redux";
import { selectTelemetryValuesById } from "../state/telemetry/telemetrySlice";


type TestChartProps = {
  sensorId: string;
};

const TextData = ({ sensorId }: TestChartProps) => {

    const data = useSelector(selectTelemetryValuesById(sensorId));

    const hasData = data.length > 0;
    const latestValue = data[data.length - 1]?.value;



    return (
        <div className="">
            <p className="text-xs text-neutral-500 font-semibold tracking-[0.25em]">
                {sensorId}
            </p>
            <span className="text-4xl font-semibold text-neutral-100">
                {!hasData ? "Waiting for data..." : latestValue?.toLocaleString()}
            </span>
            
        </div>
    );
};

export default TextData;
