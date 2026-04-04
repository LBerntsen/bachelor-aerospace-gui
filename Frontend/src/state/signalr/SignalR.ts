import {HubConnectionBuilder} from "@microsoft/signalr";
import type {SensorDataDto} from "../telemetry/Dtos/SensorData.ts";
import {backendUrl} from "../utility.ts";

export const connection = new HubConnectionBuilder()
    .withUrl(`${backendUrl}/telemetryhub`)
    .withAutomaticReconnect()
    .build();

export async function startSignalR(onInitialData: (data: SensorDataDto[]) => void, onUpdate: (data: SensorDataDto) => void, onStateChanged: (state: string) => void, onClear: () => void)
{
    connection.on("initial", onInitialData);
    connection.on("update", onUpdate);
    connection.on("stateChanged", onStateChanged);
    connection.on("clear", onClear);

    try {
        await connection.start();
        console.log("SignalR Connected");
    } catch (err) {
        console.error("SignalR connection error: ", err);
    }
}