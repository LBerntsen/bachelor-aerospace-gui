import {useSelector} from "react-redux";
import {selectLatestTelemetryValueById, selectTelemetryValuesById} from "./telemetrySlice.ts";

export default function Testing()
{
    const testList = useSelector(selectTelemetryValuesById("altitude"));
    const testLatest = useSelector(selectLatestTelemetryValueById("altitude"));

    return (
        <div>
            <h1>WebSocket Live Messages</h1>
            <button onClick={() => console.log(testList, testLatest)}>test</button>
            <p>latest time: {testLatest.timeStamp}</p>
            <p>latest value: {testLatest.value}</p>
            <p>lengde: {testList.length}</p>
            <ol className="border-4 border-green-500">
                {testList.map((val) => (
                    <li>{val.timeStamp} <span className={"bg-blue-300"}>{val.value}</span></li>
                ))}
            </ol>
        </div>
);
}