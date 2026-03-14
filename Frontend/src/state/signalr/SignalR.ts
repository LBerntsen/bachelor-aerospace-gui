import {HubConnectionBuilder} from "@microsoft/signalr";
import type {SensorDataDto} from "./SignalRData.ts";

export const connection = new HubConnectionBuilder()
    .withUrl("http://localhost:5074/telemetryhub")
    .withAutomaticReconnect()
    .build();

export async function startSignalR(onInitialData: (data: SensorDataDto[]) => void, onUpdate: (data: SensorDataDto) => void, onClear: () => void)
{
    connection.on("initial", onInitialData);
    connection.on("update", onUpdate);
    connection.on("clear", onClear);

    try {
        await connection.start();
        console.log("SignalR Connected");
    } catch (err) {
        console.error("SignalR connection error: ", err);
    }
}