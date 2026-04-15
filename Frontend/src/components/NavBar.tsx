import {Link} from "react-router-dom"
import phoenixLogo from "../assets/Pheonix_logo.jpg";
import {selectState} from "../state/telemetry/telemetrySlice.ts";
import {useSelector} from "react-redux";

export default function Navbar(){
    return (
        <div className=" ">
            <div className="flex flex-col bg-black p-8 sm:gap-6 sm:py-4">
            <div className="flex flex-row items-center font-bold">
                <img className="rounded-lg" width={64}src={phoenixLogo}/>
                <div>
                    <div className="flex justify-center gap-4 items-center">
                        <h1 className="text-white text-xl">Phoenix 2</h1>
                        <div className="min-w-20 text-center">
                            <BackendState />
                        </div>
                    </div>
                    <h1 className="text-white text-xs ">Ground Control System</h1>
                </div>
            </div>
                <div className="sm:gap-6 flex flex-col">
                    <Link to ="/" className="text-white hover:bg-[#1e293b] p-2 rounded tracking-[0.25em]">Dashboard </Link>
                    <Link to ="/propulsion" className="text-white hover:bg-[#1e293b] p-2 rounded tracking-[0.25em]">Propulsion </Link>
                    <Link to ="/" className="text-white hover:bg-[#1e293b] p-2 rounded tracking-[0.25em]">Avionics</Link>
                    <Link to ="/recovery" className="text-white hover:bg-[#1e293b] p-2 rounded tracking-[0.25em]">Recovery</Link>
                    <Link to ="/" className="text-white hover:bg-[#1e293b] p-2 rounded tracking-[0.25em]">Mission Archive</Link>
                </div>
            </div>
        </div>
    )
}

function BackendState()
{
    const state = useSelector(selectState());
    const color = state === "Offline" ? "text-red-500" : "text-green-400";

    return (
        <div className="flex items-center">
            <p className={`text-sm font-semibold ${color}`}>{state}</p>
        </div>
    );
}