import { useSelector } from "react-redux";
import { selectTelemetryValuesById } from "../state/telemetry/telemetrySlice";

type EventLogProps = {
  sensorId: string;
};

const EventLog = ({ sensorId }: EventLogProps) => {
  const data = useSelector(selectTelemetryValuesById(sensorId));

  return (
    <div className="flex flex-col">
      <p className="text-xs text-neutral-500 font-semibold tracking-[0.25em] mb-3">
        {sensorId}
      </p>

      <div className="max-h-64 overflow-y-auto flex flex-col gap-2 ">
        {data.length === 0 ? (
          <span className="text-neutral-500 text-sm">No events</span>
        ) : (
          data.map((entry, index) => (
            <div
              key={index}
              className=" mr-4 text-neutral-200 text-sm flex justify-between border-b border-neutral-800 pb-1"
            >
              <span>
                {new Date(entry.timeStamp).toLocaleTimeString()}
              </span>
              <span className="font-semibold">
                {entry.value}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EventLog;