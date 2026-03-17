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
    canMap: Record<string, SensorEntry[]>,
    state: string
}

const initialState: telemetryState = {
    canMap: {},
    state: "Offline"
}

const telemetrySlice = createSlice({
    name: "telemetry",
    initialState,
    reducers: {
        setInitialData: (state, action: PayloadAction<SensorData[]>) => {
            action.payload.forEach((entry) => {
               const {timeStamp, id, value} = entry;

                if(!state.canMap[id.toLowerCase()])
                    state.canMap[id.toLowerCase()] = [];
                state.canMap[id.toLowerCase()].push({timeStamp: new Date(timeStamp).getTime(), value: value})
            });
        },
        appendForId: (state, action: PayloadAction<SensorData>) => {
            const {timeStamp, id, value} = action.payload;

            if(!state.canMap[id.toLowerCase()])
                state.canMap[id.toLowerCase()] = [];
            state.canMap[id.toLowerCase()].push({timeStamp: new Date(timeStamp).getTime(), value: value})
        },
        setState: (state, action: PayloadAction<string>) => {
            state.state = action.payload;
        },
        clear: (state) => {
            state.canMap = {};
        }
    }
});

export const {setInitialData, appendForId, setState, clear} = telemetrySlice.actions;
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

export function selectState()
{
    return function(state: RootState): string
    {
        return state.telemetry.state;
    }
}