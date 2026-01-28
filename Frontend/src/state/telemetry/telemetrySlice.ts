import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {RootState} from "../store.ts";

interface appendForIdDto {
    id: string
    value: number
}

interface telemetryState {
    canMap: Record<string, number[]>
}

const initialState: telemetryState = {
    canMap: {}
}

const telemetrySlice = createSlice({
    name: "telemetry",
    initialState,
    reducers: {
        appendForId: (state, action: PayloadAction<appendForIdDto>) => {
            const {id, value} = action.payload;

            if(!state.canMap[id])
                state.canMap[id] = [];
            state.canMap[id].push(value);
        }
    }
});

export const {appendForId} = telemetrySlice.actions;
export default telemetrySlice.reducer;

export function selectTelemetryValuesById(id: string)
{
    return function (state: RootState)
    {
        return state.telemetry.canMap[id] ?? [];
    }
}

export function selectLatestTelemetryValueById(id: string)
{
    return function (state: RootState)
    {
        return state.telemetry.canMap[id]?.at(-1) ?? -1
    }
}