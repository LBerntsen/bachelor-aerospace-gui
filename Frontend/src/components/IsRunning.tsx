import { useSelector } from "react-redux";
import { selectTelemetryValuesById } from "../state/telemetry/telemetrySlice";


type TestChartProps = {
  sensorId: string;
};

const IsRunning = ({ sensorId }: TestChartProps) => {

const rawData = useSelector(selectTelemetryValuesById(sensorId));

const data = rawData.map(d => ({
  ...d,
  timeStamp: new Date(d.timeStamp).getTime(),
}));

const latestValue = data[data.length - 1]?.value;
  return (
          <div className="">
            <span className={`text-sm font-semibold ${latestValue === 1 ? "text-green-400" : "text-red-500"}`}>
                {latestValue === 1 ? "Online" : "Offline"}
            </span>
            
      </div>
  );
};

export default IsRunning;
