import {useDispatch} from "react-redux";
import {useEffect, useRef} from "react";
import type {SensorDataDto} from "../telemetry/Dtos/SensorData.ts";
import {appendForId, setInitialData, setState} from "../telemetry/telemetrySlice.ts";
import {backendUrl} from "../utility.ts";

export default function SponsorDataProvider()
{
    const dispatch = useDispatch();
    const hasFetchedInitial = useRef(false);
    const pollInterval = 1000; // I ms = 1 sekund
    const secondsBack = 3; // Litt overlapp for å unngå hull

     async function initialFetch()
     {
         try {
             const response = await fetch(`${backendUrl}/api/sponsor/live`);
             const data: SensorDataDto[] = await response.json();
             dispatch(setInitialData(data));
             dispatch(setState("Live"));
         }
         catch (e)
         {
             console.error("Could not fetch initial data", e);
             dispatch(setState("Offline"));
         }
     }

     async function pollFetch()
     {
         try {
             const response = await fetch(`${backendUrl}/api/sponsor/live?secondsBack=${secondsBack}`);
             const data: SensorDataDto[] = await response.json();
             data.forEach((entry) => dispatch(appendForId({timeStamp: entry.timeStamp, id: entry.id, value: entry.value})));
             dispatch(setState("Live"));
         }
         catch (e)
         {
             console.error("Polling failed", e);
             dispatch(setState("Offline"));
         }
     }

    useEffect(() => {
        if(!hasFetchedInitial.current)
        {
            initialFetch();
            hasFetchedInitial.current = true;
        }

        const interval = setInterval(pollFetch, pollInterval);
        return () => clearInterval(interval);
    }, [dispatch]);

     return null;
}