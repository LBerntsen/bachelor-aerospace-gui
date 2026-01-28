import {useDispatch, useSelector} from "react-redux";

export default function Testing()
{
    const testList = useSelector(selectTelemetryValuesById("testing"));
    const testLatest = useSelector(selectLatestTelemetryValueById("testing"));
    const dispatch = useDispatch();

    return (
        <>
            <button onClick={() => dispatch(appendForId({id: "testing", value: Math.floor(Math.random() * 100)}))}>click to add new number</button>
            <p>latest value: {testLatest}</p>
            <ol>
                {testList.map((val) => (
                    <li>{val}</li>
                ))}
            </ol>
        </>
);
}

import {appendForId, selectLatestTelemetryValueById, selectTelemetryValuesById} from "./telemetrySlice.ts";
