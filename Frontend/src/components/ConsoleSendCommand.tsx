import { useState } from "react";
import Button from "./Buttons.tsx";
import { backendUrl } from "../state/utility.ts";

interface CommandResponseDto
{
    isSuccessful: boolean
    code: number
    message: string
}

export function CommandSender() {
    const [authenticated, setAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [command, setCommand] = useState("");

    async function authenticate() {
        console.log("Authenticating...");
        try {
            const authenticatedResponse = await fetch(`${backendUrl}/api/command`, {
                method: "GET",
                headers: {
                    "X-Operator-Command-Key": password
                }
            });

            if (authenticatedResponse.ok) {
                setAuthenticated(true);
                console.log("Authentication successful");
            } else {
                setAuthenticated(false);
                console.error("Authentication failed");
            }

        } catch (err) {
            console.error("Error while authenticating:", err);
            setAuthenticated(false);
        }
    }
    async function sendCommand() {
        console.log("Sending command:", command);

        try
        {
            const response = await fetch(`${backendUrl}/api/command/${command}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "Application/Json",
                        "X-Operator-Command-Key": password
                    }
                }
            );

            const result: CommandResponseDto = await response.json();

            if(response.ok)
                console.log(result.message);
            else
                console.error(result.message);

        }
        catch (err)
        {
            console.error("Error while sending a command: ", err);
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
                    <input className="border rounded-lg w-full p-2" value={command} placeholder="Enter command..." onChange={(e) => setCommand(e.currentTarget.value)}/>
                    <div className="flex gap-2">
                        <Button buttonTitle={"Send kommand"} onClick={sendCommand} />
                        <Button buttonTitle={"Logg ut"} onClick={logout} />
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-2 w-full max-w-md">
                    <input type={"password"} className="border rounded-lg w-full p-2" value={password} placeholder="Enter password..." onChange={(e) => setPassword(e.currentTarget.value)}/>
                    <Button buttonTitle={"Logg inn"} onClick={authenticate} />
                </div>
            )}
        </div>
    );
}
