import { BarChart, Bar, ResponsiveContainer } from "recharts";
import { useSelector } from "react-redux";
import { selectTelemetryValuesById } from "../state/telemetry/telemetrySlice";

type BarChartProps = {
  sensorId: string;
};

const TinyBarChart = ({ sensorId }: BarChartProps) => {
  const data = useSelector(selectTelemetryValuesById(sensorId));

  return (
    <div className="w-75 h-21">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TinyBarChart;