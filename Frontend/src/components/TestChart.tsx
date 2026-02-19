import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useSelector } from "react-redux";
import { selectTelemetryValuesById } from "../state/telemetry/telemetrySlice";


type TestChartProps = {
  sensorId: string;
};

const TestChart = ({ sensorId }: TestChartProps) => {

const data = useSelector(selectTelemetryValuesById(sensorId));

const latestValue = data[data.length - 1]?.value;



  return (
      <div className="relative w-full h-80 rounded-2xl bg-[#161616] p-5 border border-[#1e293b]">
          <div className="absolute top-5 right-5 z-10">
            <p className="text-xs text-neutral-500 font-semibold">
              {sensorId}
            </p>

            <div className="flex items-start gap-2 mt-1">
              <span className="text-4xl font-semibold ">
                {latestValue?.toLocaleString() ?? "--"}
              </span>

              <span className="text-neutral-400 text-sm">m</span>
            </div>
      </div>
      <div className="pt-16 h-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="timeStamp"
              type="number"
              domain={['dataMin', 'dataMax']}
              tickFormatter={(time) =>
                new Date(time).toLocaleTimeString()
              }
              label={{
                value: "Time",
                position: "insideBottom",
                offset: -5
              }}
            />
            <YAxis
            label={{
              value: sensorId,
              angle: -90,
              position: "insideLeft"
            }}
            />

            <Tooltip
              labelFormatter={(time) =>
                new Date(time).toLocaleTimeString()
              }
              
            />
            <CartesianGrid
              stroke="#1e293b"
              vertical={false}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#22d3ee"
              
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TestChart;
