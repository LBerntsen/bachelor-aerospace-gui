import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useSelector } from "react-redux";
import { selectTelemetryValuesById } from "../state/telemetry/telemetrySlice";


type TestChartProps = {
  sensorId: string;
};

const TestChart = ({ sensorId }: TestChartProps) => {

  const rawData = useSelector(selectTelemetryValuesById(sensorId)) || [];

  const data = rawData
    .slice(-100)
    .map((value, index) => ({
      timestamp: Date.now() + index,
      value
    }));


  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis
          dataKey="timestamp"
          type="number"
          domain={['auto', 'auto']}
          tickFormatter={(time) =>
            new Date(time).toLocaleTimeString()
          }
        />

        <YAxis />

        <Tooltip
          labelFormatter={(time) =>
            new Date(time).toLocaleTimeString()
          }
        />

        <Line
          type="monotone"
          dataKey="value"
          stroke="#8884d8"
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TestChart;
