import {useDispatch} from "react-redux";
import {useEffect} from "react";
import {connectWebSocket} from "./WebSocket.ts";
import {appendForId} from "../telemetry/telemetrySlice.ts";

export default function WebSocketProvider()
{
    const dispatch = useDispatch();

    useEffect(() => {
        connectWebSocket((message) => {
           if(message.type === "initial")
           {
               message.data.forEach((item: {id: string, value: number }) => {
                   dispatch(appendForId({id: item.id, value: item.value}));
               });
           }
        });
    }, [dispatch]);

    return null;
}