import { useSelector } from "react-redux";
import { selectTelemetryValuesById } from "../state/telemetry/telemetrySlice";


type TextDataProps = {
  sensorId: string;
  enhet?:string
};

const DirectionText = ({ sensorId, enhet }: TextDataProps) => {

    const data = useSelector(selectTelemetryValuesById(sensorId));

    const hasData = data.length > 0;
    const datalatest = data[data.length - 1]?.value;
    const latestValue = (datalatest / 1000) * Math.PI / 180;



    return (
        <div className="">
            <p className="text-xs text-neutral-500 font-semibold tracking-[0.25em] md-4">
                {sensorId}
            </p>
            <div className="flex items-end">
                <span className="text-4xl font-semibold text-neutral-100">
                    {!hasData ? "--" : latestValue?.toLocaleString()}
                </span>
                <p className="text-4xl text-neutral-100">
                    {!enhet ? "": enhet}
                </p>
            </div>
        </div>
    );
};

export default DirectionText;
