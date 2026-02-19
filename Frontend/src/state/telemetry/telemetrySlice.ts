import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {RootState} from "../store.ts";

interface SensorData
{
    timeStamp: string
    id: string
    value: number
}

interface SensorEntry
{
    timeStamp: number
    value: number
}

interface telemetryState {
    canMap: Record<string, SensorEntry[]>
}

const initialState: telemetryState = {
    canMap: {}
}

const telemetrySlice = createSlice({
    name: "telemetry",
    initialState,
    reducers: {
        appendForId: (state, action: PayloadAction<SensorData>) => {
            const {timeStamp, id, value} = action.payload;

            if(!state.canMap[id.toLowerCase()])
                state.canMap[id.toLowerCase()] = [];
            state.canMap[id.toLowerCase()].push({timeStamp: new Date(timeStamp).getTime(), value: value})
        }
    }
});

export const {appendForId} = telemetrySlice.actions;
export default telemetrySlice.reducer;

export function selectTelemetryValuesById(id: string)
{
    return function (state: RootState): SensorEntry[]
    {
        return state.telemetry.canMap[id.toLowerCase()] ?? [];
    }
}

export function selectLatestTelemetryValueById(id: string)
{
    return function (state: RootState): SensorEntry
    {
        return state.telemetry.canMap[id.toLowerCase()]?.at(-1) ?? {timeStamp: new Date().getTime(), value: -1};
    }
}