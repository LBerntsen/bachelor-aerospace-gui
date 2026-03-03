import {useDispatch} from "react-redux";
import {useEffect} from "react";
import {startSignalR} from "./SignalR.ts";
import {appendForId, setInitialData} from "../telemetry/telemetrySlice.ts";
import type {SensorDataDto} from "./SignalRData.ts";

export default function SignalRProvider()
{
    const dispatch = useDispatch();

    function onInitialData(initialData: SensorDataDto[])
    {
        dispatch(setInitialData(initialData));
    }

    function onUpdate(dataEntry: SensorDataDto)
    {
        dispatch(appendForId({timeStamp: dataEntry.timeStamp, id: dataEntry.id, value: dataEntry.value}));
    }

    useEffect(() => {
        startSignalR(onInitialData, onUpdate);
    }, [dispatch]);

    return null;
}