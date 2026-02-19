import { useSelector } from "react-redux";
import { selectTelemetryValuesById } from "../state/telemetry/telemetrySlice";


type ChamberTempProps = {
  sensorId: string;
};

const ChamberTemp = ({ sensorId }: ChamberTempProps) => {

    const rawData = useSelector(selectTelemetryValuesById(sensorId));

    const data = rawData.map(d => ({
    ...d,
    timeStamp: new Date(d.timeStamp).getTime(),
    }));

    const hasData = data.length > 0;
    const latestValue = data[data.length - 1]?.value;

    let status = "Normal";
    let statusStyles = "border-emerald-400/30 bg-emerald-500/10 text-emerald-300";
    let dotColor = "bg-emerald-400";

    if (latestValue > 20) {
        status = "Warning";
        statusStyles = "border-orange-400/30 bg-orange-500/10 text-orange-300";
        dotColor = "bg-orange-400";
    }

    if (latestValue > 100) {
        status = "Danger";
        statusStyles = "border-red-400/30 bg-red-500/10 text-red-300";
        dotColor = "bg-red-400";
    }



    return (
    <div className="relative overflow-hidden rounded-2xl p-8 border border-[#1e293b] bg-[#161616]">

        <p className="uppercase tracking-[0.25em] text-white text-sm font-semibold">
            Combustion chamber
        </p>

        <div className="flex items-baseline gap-3 mt-4 justify-center">
            <span className="text-7xl font-bold text-white items-center">
                {!hasData ? "--" : latestValue?.toLocaleString()}
            </span>

            <span className="text-2xl font-semibold text-white items-center">
                °C
            </span>
        </div>

        <div className="mt-6 flex justify-center">
            <div className={`
                inline-flex items-center gap-2 px-4 py-2 rounded-full border
                font-semibold text-sm
                ${statusStyles}
            `}>
                <div className={`w-2 h-2 rounded-full ${dotColor}`} />
                {status}
            </div>
        </div>

    </div>
);

};

export default ChamberTemp;
