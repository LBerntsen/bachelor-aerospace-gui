import { useState, useEffect, type JSX } from "react";

type CommandResponse = {
  success: boolean;
  message?: string;
};

export function CommandSender(): JSX.Element {
  const [command, setCommand] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<CommandResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState<string>("");


    const fetchPassword = async () => {
      try {
        const passwordResponse = await fetch("/api/command/key", {
            method: "GET",
            headers: {
                "X-Operator-Password": password
            }
        });
        if (passwordResponse.status == 200){
            return true;
        }
      } 
      catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        console.log("Password fetch error:", err);
      }
      return false;
      
    };

    

  
    const sendCommand = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch(`/api/command/${command}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Operator-Command-Key": password

        },
      });

    if (!res.ok) {
        console.log(`HTTP error: ${res.status}`);
    }

    const data: CommandResponse = await res.json();
    setResponse(data);
    } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
        setLoading(false);
    }
    };

  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
        
        <div className="flex gap-2">
            <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password..."
                className="flex-1 px-3 py-2 rounded-xl border bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
                onClick={fetchPassword}
                disabled={loading}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
                {loading ? "Sending..." : "Send"}
            </button>
        </div>
        <h2 className="text-xl font-semibold">Send Command</h2>

        <div className="flex gap-2">
        <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="Enter command..."
            className="flex-1 px-3 py-2 rounded-xl border bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
            onClick={sendCommand}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        >
            {loading ? "Sending..." : "Send"}
        </button>
        </div>

        {response && (
        <div className="p-3 rounded-xl bg-green-100 text-green-800">
            {response.message ?? "Command sent successfully"}
        </div>
        )}

        {error && (
        <div className="p-3 rounded-xl bg-red-100 text-red-800">
            {error}
        </div>
        )}
    </div>
  );
}
