import { LineChart, Line, ResponsiveContainer } from "recharts";
import { useSelector } from "react-redux";
import { selectTelemetryValuesById } from "../state/telemetry/telemetrySlice";

type TinyChartProps = {
  sensorId: string;
};

export default function TinyChart ({ sensorId }: TinyChartProps)
{
  const data = useSelector(selectTelemetryValuesById(sensorId));

  return (
    <div className="w-full h-24">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
        >
          <Line
            type="monotone"
            dataKey="value"
            stroke="#22d3ee"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};