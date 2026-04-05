import { BarChart, Bar, ResponsiveContainer,YAxis } from 'recharts';
import {selectLatestTelemetryValueById} from "../state/telemetry/telemetrySlice";
import { useSelector } from "react-redux";

type FuelTankProps = {
  sensorId: string;
  fuelColor: string;
};

export default function FuelTank ({ sensorId, fuelColor }: FuelTankProps)
{
    const latestEntry = useSelector(selectLatestTelemetryValueById(sensorId));
    const chartData = latestEntry ? [latestEntry.value] : [];

    return (
        <>
            <div className='flex h-full items-stretch'>
                <div className="w-50  border-2 border-slate-800 rounded-[20px] p-2.5 bg-[#111]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} width={20}/>
                        <Bar dataKey="value" fill={fuelColor} background={{ fill: '#222' }} />
                    </BarChart>
                </ResponsiveContainer>
                </div>
            </div>
        </>
    );
}