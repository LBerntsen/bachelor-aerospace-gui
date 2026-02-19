import { BarChart, Bar, ResponsiveContainer, CartesianGrid,YAxis } from 'recharts';
import { selectTelemetryValuesById } from "../state/telemetry/telemetrySlice";
import { useSelector } from "react-redux";



type FuelTankProps = {
  sensorId: string;
};




const FuelTank = ({ sensorId }: FuelTankProps) => {

    const rawData = useSelector(selectTelemetryValuesById(sensorId));

    const data = rawData.map(d => ({
    ...d,
    timeStamp: new Date(d.timeStamp).getTime(),
    }));

    return (
    <>
        <div className='flex h-3/4 items-stretch rounded-2xl bg-[#161616] p-5 border border-[#1e293b]'>
            <div className="w-50  border-2 border-slate-800 rounded-[20px] p-2.5 bg-[#111]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart width={100} height={260} data={data}>
                <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} width={20}/>
                    <Bar dataKey="fuel" fill="orange" background={{ fill: '#222' }}/>
                </BarChart>
            </ResponsiveContainer>
            </div>  
            <div className='pl-4 '>
                <p className=" text-neutral-500 font-semibold tracking-[0.25em]">
                    Fuel level
                </p>
                <div className='font-bold text-white text-5xl'>
                    65%
                </div>

                <div className="py-4">
                    <div className='bg-[#161616] p-2 border my-2  border-[#1e293b]'>
                        <p className=" text-neutral-500 font-semibold tracking-[0.25em]">
                            Turbopump inlet pressure
                        </p>
                        <div className='flex justify-between'>
                            <span className="text-xl font-semibold text-neutral-100">
                            Waiting for data...
                            </span>
                            <p className="text-xl font-semibold text-neutral-100">
                                Bar
                            </p>
                        </div>
                    </div>
                    <div className='bg-[#161616] p-2 border my-2 border-[#1e293b]'>
                        <p className=" tracking-[0.25em] text-neutral-500 font-semibold">
                            Turbopump outlet pressure
                        </p>
                        <div className='flex justify-between'>
                            <span className="text-xl font-semibold text-neutral-100">
                            Waiting for data...
                            </span>
                            <p className="text-xl font-semibold text-neutral-100">
                                Bar
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    </>
  );
};

export default FuelTank;
