import {useDispatch} from "react-redux";
import {useEffect, useRef} from "react";
import type {SensorDataDto} from "../telemetry/Dtos/SensorData.ts";
import {appendForId, setInitialData} from "../telemetry/telemetrySlice.ts";

export default function SponsorDataProvider()
{
    const dispatch = useDispatch();
    const hasFetchedInitial = useRef(false);
    const pollInterval = 1000; // I ms = 1 sekund
    const secondsBack = 3; // Litt overlapp for å unngå hull

     async function initialFetch()
     {
         try {
             const response = await fetch("http://localhost:5074/api/sponsor/live");
             const data: SensorDataDto[] = await response.json();
             dispatch(setInitialData(data));
         }
         catch (e)
         {
             console.error("Could not fetch initial data", e);
         }
     }

     async function pollFetch()
     {
         try {
             const response = await fetch(`http://localhost:5074/api/sponsor/live?secondsBack=${secondsBack}`);
             const data: SensorDataDto[] = await response.json();
             data.forEach((entry) => dispatch(appendForId({timeStamp: entry.timeStamp, id: entry.id, value: entry.value})));
         }
         catch (e)
         {
             console.error("Polling failed", e);
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