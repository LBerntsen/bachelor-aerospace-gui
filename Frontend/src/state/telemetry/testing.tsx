import {useDispatch, useSelector} from "react-redux";
import {appendForId, selectLatestTelemetryValueById, selectTelemetryValuesById} from "./telemetrySlice.ts";

export default function Testing()
{
    const testList = useSelector(selectTelemetryValuesById("sensor2"));
    const testLatest = useSelector(selectLatestTelemetryValueById("sensor2"));
    const dispatch = useDispatch();

    return (
        <div className="bg-red-500">
            <h1>WebSocket Live Messages</h1>
            <button className="bg-blue-300" onClick={() => dispatch(appendForId({id: "testing", value: Math.floor(Math.random() * 100)}))}>click to add new number</button>
            <p>latest value: {testLatest}</p>
            <ol className="border-4 border-green-500">
                {testList.map((val) => (
                    <li>{val}</li>
                ))}
            </ol>
        </div>
);
}