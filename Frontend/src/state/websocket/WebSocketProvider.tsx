import {useDispatch} from "react-redux";
import {useEffect} from "react";
import {connectWebSocket} from "./WebSocket.ts";
import {appendForId} from "../telemetry/telemetrySlice.ts";
import type {WebSocketData} from "./WebSocketData.ts";

export default function WebSocketProvider()
{
    const dispatch = useDispatch();

    useEffect(() => {
        connectWebSocket((message: WebSocketData) => {
           if(message.type === "initial")
           {
               message.data.forEach((dataEntry) => {
                  dispatch(appendForId({timeStamp: dataEntry.TimeStamp, id: dataEntry.Id, value: dataEntry.Value}));
               });
           }
           else if(message.type === "update")
           {
               dispatch(appendForId({timeStamp: message.data.TimeStamp, id: message.data.Id, value: message.data.Value}))
           }
        });
    }, [dispatch]);

    return null;
}