import { Outlet } from "react-router-dom"
import Navbar from "./components/NavBar.tsx";
import ReplayController from "./components/ReplayController.tsx";
import { isOperator } from "./state/utility.ts";

export default function Layout(){
    return (
        <>
            <div className="bg-black">
                <div className="flex min-h-screen">
                    <div className="flex flex-col mx-2 gap-4 divide-y divide-white/10">
                        <Navbar/>
                        {isOperator() && <ReplayController/>}
                    </div>
                    <main className="flex-1">
                        <Outlet/>
                    </main>
                </div>
            </div>
        </>
    )
}
