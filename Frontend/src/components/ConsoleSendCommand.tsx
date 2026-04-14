import { useState, type JSX } from "react";
import Button from "./Buttons.tsx";
import { backendUrl } from "../state/utility.ts";

export function CommandSender(): JSX.Element {

  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [command, setCommand] = useState("");
    async function authenticate() {
        console.log("Authenticating with password:", password);
        try {
        const passwordResponse = await fetch(`${backendUrl}/api/command`, {
            method: "GET",
            headers: {
                "X-Operator-Command-Key": password
            }
        });

        if (passwordResponse.ok) {
            setAuthenticated(true);
            console.log("Authentication successful");
        } else {
            setAuthenticated(false);
            console.error("Authentication failed: Invalid password");
        }

        } catch (err) {
            console.error("Password fetch error:", err);
            setAuthenticated(false);
        }
    }
    async function sendCommand() {
        console.log("Sending command:", command);

        try {
            const response = await fetch(
                `${backendUrl}/api/command?command=${encodeURIComponent(command)}`,
                {
                    method: "GET",
                    headers: {
                        "X-Operator-Command-Key": password
                    }
                }
            );

            if (!response.ok) {
                const text = await response.text();
                console.error("Failed to send command:", response.status, text);
            } else {
                console.log("Command sent successfully");
            }
        } catch (err) {
            console.error("Command send error:", err);
        }
    }

    function logout()
    {
        setAuthenticated(false);
        setPassword("");
    }

    return (
        <div className="text-white">
            {authenticated ? (
                <div className="flex flex-col gap-2 w-full max-w-md">
                    <input
                        className="border w-full p-2"
                        value={command}
                        placeholder="Enter command..."
                        onChange={(e) => setCommand(e.currentTarget.value)}
                    />

                    <div className="flex gap-2">
                        <Button buttonTitle={"Send kommand"} onClick={sendCommand} />
                        <Button buttonTitle={"Logg ut"} onClick={logout} />
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-2 w-full max-w-md">

                    <input
                        className="border w-full p-2"
                        value={password}
                        placeholder="Enter password..."
                        onChange={(e) => setPassword(e.currentTarget.value)}
                    />

                    <Button buttonTitle={"Logg inn"} onClick={authenticate} />
                </div>
            )}
        </div>
    );
}
