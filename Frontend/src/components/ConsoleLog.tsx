import React, { useEffect, useState } from "react";

const hookConsole = (callback: (msg: string) => void) => {
  const originalLog = console.log;
  const originalError = console.error;
  const originalWarn = console.warn;

  console.log = (...args: any[]) => {
    callback(args.join(" "));
    originalLog(...args);
  };

  console.error = (...args: any[]) => {
    callback("❌ " + args.join(" "));
    originalError(...args);
  };

  console.warn = (...args: any[]) => {
    callback("⚠️ " + args.join(" "));
    originalWarn(...args);
  };

  return () => {
    console.log = originalLog;
    console.error = originalError;
    console.warn = originalWarn;
  };
};

const ConsoleViewer: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const unhook = hookConsole((msg) => {
      setLogs((prev) => [...prev, msg]);
    });

    return () => {
      unhook();
    };
  }, []);

  return (
    <div className="bg-black text-green-400 p-4 rounded-2xl h-64 overflow-y-auto font-mono text-sm">
      {logs.length === 0 && <div>No logs yet...</div>}
      {logs.map((log, index) => (
        <div key={index}>{log}</div>
      ))}
    </div>
  );
};

export default ConsoleViewer;
