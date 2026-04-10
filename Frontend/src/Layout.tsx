import { Outlet } from "react-router-dom"
import Navbar from "./components/NavBar.tsx";
import { useState, useEffect } from "react";
import Button from "./components/Buttons.tsx";

export default function Layout(){
    const [replays, setReplays] = useState<string[]>([]);
    const [selectedReplay, setSelectedReplay] = useState("");
    
    const BASE_URL = "http://localhost:8087/api";
    
    //  Start LIVE
    const startLive = async () => {
        await fetch(`${BASE_URL}/state/live`, { method: "POST" });
        console.log("Live started");
    };
    
    // Stop LIVE/Replay
    const stopLive = async () => {
        await fetch(`${BASE_URL}/state/stop`, { method: "POST" });
        console.log("Live/Replay stopped");
    };
    
    // Get replays
    const getReplays = async () => {
        try {
        const res = await fetch(`${BASE_URL}/replay`);
        const data = await res.json();
        setReplays(data);
        console.log(data);
        } catch (err) {
        console.error("Failed to fetch replays:", err);
        }
    };
    
    // Start replay
    const startReplay = async () => {
        if (!selectedReplay) {
        alert("Velg replay først!");
        return;
        }
    
        await fetch(`${BASE_URL}/state/replay/${selectedReplay}`, {
        method: "POST",
        });
    
        console.log("Replay started:", selectedReplay);
    };
    
    // AUTO FETCH ON LOAD
    useEffect(() => {
        getReplays();
    }, []);
    
    return (
        <>
            <div className="bg-black">
                <div className="flex min-h-screen">
                    <div className="mr-2 ml-2">
                        <Navbar/>
                        <div className="border-t border-white/10 my-4" />
                        {/* CONTROL PANEL */}
                        <div className="mb-6 flex flex-col gap-3">
                            <Button buttonTitle="Start Live" onClick={startLive} className="hover:shadow-green-400"/>

                            <Button buttonTitle="Stop" onClick={stopLive} className="hover:shadow-red-400"/>

                            {/* <Button buttonTitle="Refresh Replays" onClick={getReplays} /> */}

                            <select
                                value={selectedReplay}
                                onChange={(e) => setSelectedReplay(e.target.value)}
                                className="
                                border border-neutral-300
                                p-2 rounded-lg
                                focus:outline-none focus:ring-2 focus:ring-blue-400
                                bg-white
                                "
                            >
                                <option value="">Velg replay</option>
                                {replays.map((r, i) => (
                                <option key={i} value={r}>
                                    {r}
                                </option>
                                ))}
                            </select>

                            <Button
                                buttonTitle="Start Replay"
                                onClick={startReplay}
                                disabled={!selectedReplay}
                            />
                        </div>
                    </div>
                    <main className="flex-1">
                        <Outlet/>
                    </main>
                </div>
            </div>
        </>
    )
}
