import { useSelector } from "react-redux";
import { selectTelemetryValuesById } from "../state/telemetry/telemetrySlice";


type TextDataProps = {
  sensorId: string;

};

const RecoveryStatus = ({ sensorId }: TextDataProps) => {

    const data = useSelector(selectTelemetryValuesById(sensorId));
    const latestValue = data[data.length - 1]?.value;
    const hasData = data.length > 0;
    return (
        <div className="">
            <div className={`w-36 h-36 rounded-full flex items-center justify-center border transition-all border-green-300 `}>
                <span className="text-4xl font-semibold text-neutral-100">
                    {!hasData ? "--" : latestValue?.toLocaleString()}
                </span>
            </div>
            <p className="text-xl font-semibold text-neutral-100 tracking-[0.25em] mt-2 text-center">
                {latestValue } 
            </p>
            <p className="text-xl font-semibold text-neutral-100 tracking-[0.25em] mt-2 text-center">
                {sensorId}
            </p>
        </div>
    );
};

export default RecoveryStatus;
