import { Outlet } from "react-router-dom"
import Navbar from "./components/NavBar.tsx";

export default function Layout(){
    return (
        <>
            <div className="bg-black">
                <div className="flex min-h-screen">
                    <Navbar/>
                    <main className="flex-1">
                        <Outlet/>
                    </main>
                </div>
            </div>
        </>
    )
}
