import phoenixLogo from "../assets/Pheonix_logo.jpg";
import {selectState} from "../state/telemetry/telemetrySlice.ts";
import {useSelector} from "react-redux";
import { NavLink } from "react-router-dom";

export default function Navbar(){
    return (
        <div className=" ">
            <div className="flex flex-col bg-black sm:gap-6 sm:py-4">
            <div className="flex flex-row items-center font-bold">
                <img className="rounded-lg" width={64}src={phoenixLogo}/>
                <div>
                    <div className="flex justify-center gap-4 items-center">
                        <h1 className="text-white text-xl">Phoenix 2</h1>
                        <BackendState/>
                    </div>
                    <h1 className="text-white text-xs ">Ground Control System</h1>
                </div>
            </div>
                <div className="sm:gap-6 flex flex-col">
                    <NavLink to="/" end className={({ isActive }) => `text-white p-2 rounded tracking-[0.25em] transition-colors ${isActive ? "bg-[#1e293b]" : "hover:bg-[#1e293b]"}`}>Dashboard</NavLink>
                    <NavLink to="/propulsion" className={({ isActive }) => `text-white p-2 rounded tracking-[0.25em] transition-colors ${isActive ? "bg-[#1e293b]" : "hover:bg-[#1e293b]"}`}>Propulsion</NavLink>
                    <NavLink to="/avionics" className={({ isActive }) => `text-white p-2 rounded tracking-[0.25em] transition-colors ${isActive ? "bg-[#1e293b]" : "hover:bg-[#1e293b]"}`}>Avionics</NavLink>
                    <NavLink to="/recovery" className={({ isActive }) => `text-white p-2 rounded tracking-[0.25em] transition-colors ${isActive ? "bg-[#1e293b]" : "hover:bg-[#1e293b]"}`}>Recovery</NavLink>
                    <NavLink to="/mission_archive" className={({ isActive }) => `text-white p-2 rounded tracking-[0.25em] transition-colors ${isActive ? "bg-[#1e293b]" : "hover:bg-[#1e293b]"}`}>Mission Archive</NavLink>
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