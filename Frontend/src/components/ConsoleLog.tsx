import {useLogger} from "../context/LoggerContext.tsx";

export default function ConsoleViewer() {
  const {logs} = useLogger()

  return (
    <div className="bg-black text-green-400 p-4 rounded-2xl h-64 overflow-y-auto font-mono text-sm">
      {logs.length === 0 && <div>No logs yet...</div>}
      {logs.map((log, index) => (
        <div key={index}>{log}</div>
      ))}
    </div>
  );
};