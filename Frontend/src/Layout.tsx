import { Navbar } from "./components/NavBar"
import { Outlet } from "react-router-dom"


export function Layout(){
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
