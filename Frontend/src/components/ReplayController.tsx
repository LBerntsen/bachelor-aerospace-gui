import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectState } from "../state/telemetry/telemetrySlice";
import { useLogger } from "../context/LoggerContext";
import { backendUrl } from "../state/utility";
import Button from "./Buttons";

export default function ReplayController()
{
    const [replays, setReplays] = useState<string[]>([]);
    const [selectedReplay, setSelectedReplay] = useState("");
    const state = useSelector(selectState());
    const logger = useLogger();

    async function startLive()
    {
        await fetch(`${backendUrl}/api/state/live`, { method: "POST" });
        logger.log("State: Live");
    }

    async function setIdle()
    {
        await fetch(`${backendUrl}/api/state/stop`, { method: "POST" });
        logger.log("State: Idle");
    }

    async function getReplays()
    {
        try
        {
            const res = await fetch(`${backendUrl}/api/replay`);
            const data = await res.json();
            setReplays(data);
        }
        catch (err)
        {
            logger.error("Failed to fetch replays:", err);
        }
    }

    async function startReplay()
    {
        if (!selectedReplay)
        {
            alert("Velg replay først!");
            return;
        }

        await fetch(`${backendUrl}/api/state/replay/${selectedReplay}`, {
            method: "POST",
        });

        logger.log("Replay started:", selectedReplay);
    }

    useEffect(() => {
        getReplays();
    }, [state]);

    return (
        <div className="mb-6 flex flex-col gap-3">
            <Button buttonTitle="Start Live" onClick={startLive} className="hover:shadow-green-400"/>
            <Button buttonTitle="Stop" onClick={setIdle} className="hover:shadow-red-400"/>
            <select value={selectedReplay} onChange={(e) => setSelectedReplay(e.target.value)} className="border border-neutral-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white">
                <option value="">Velg replay</option>
                {replays.map((r, i) => (
                    <option key={i} value={r}>
                        {r}
                    </option>
                ))}
            </select>
            <Button buttonTitle="Start Replay" onClick={startReplay} disabled={!selectedReplay}/>
        </div>
    );
}