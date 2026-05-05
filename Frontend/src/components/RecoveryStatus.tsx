import { useSelector } from "react-redux";
import { selectLatestTelemetryValueById } from "../state/telemetry/telemetrySlice";

type TextDataProps = {
  sensorId: string;
};

export default function RecoveryStatus({ sensorId }: TextDataProps) {
    const latestValue = useSelector(selectLatestTelemetryValueById(sensorId));

    const value = latestValue?.value;

    const statusText =
        value === 1 ? "Running" : value === 0 ? "Not running" : "--";
    const statusColor =
        value === 1 ? "border-green-300" : value === 0 ? "border-red-500" : "border-gray-500";

  return (
    <div>
      <div className={`w-36 h-36 rounded-full flex items-center justify-center border transition-all ${statusColor}`} >
        <span className="text-xl font-semibold text-neutral-100 text-center">
          {statusText}
        </span>
      </div>

      <p className="text-xl font-semibold text-neutral-100 tracking-[0.25em] mt-2 text-center">
        {sensorId}
      </p>
    </div>
  );
}