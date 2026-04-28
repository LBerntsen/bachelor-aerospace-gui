import {type ChangeEvent, useState} from "react";
import Button from "./Buttons.tsx";
import { backendUrl } from "../state/utility.ts";
import {useLogger} from "../context/LoggerContext.tsx";

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
    const logger = useLogger();

    async function authenticate() {
        logger.log("Authenticating...");
        try {
            const authenticatedResponse = await fetch(`${backendUrl}/api/command`, {
                method: "GET",
                headers: {
                    "X-Operator-Command-Key": password
                }
            });

            if (authenticatedResponse.ok) {
                setAuthenticated(true);
                logger.log("Authentication successful");
            } else {
                setAuthenticated(false);
                logger.error("Authentication failed");
            }

        } catch (err) {
            logger.error("Error while authenticating:", err);
            setAuthenticated(false);
        }
    }
    async function sendCommand(aCommandName: string, aCommand: string) {
        if (!confirm(`Are you sure want to send the "${aCommandName}" command?`))
            return;
     
        logger.log(`Sending command:`, aCommand);

        try
        {
            const response = await fetch(`${backendUrl}/api/command/${aCommand}`,
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
                logger.log(result.message);
            else
                logger.error(result.message);

        }
        catch (err)
        {
            logger.error("Error while sending a command: ", err);
        }
    }

    function logout()
    {
        setAuthenticated(false);
        setPassword("");
    }

    function validateCommandInput(event: ChangeEvent<HTMLInputElement>)
    {
        const value = event.target.value;
        if (/^\d*$/.test(value)) {
            setCommand(value);
        }
    }

    return (
        <div className="text-white">
            {authenticated ? (
                <div className="flex flex-col gap-2 w-full">
                    <div className="flex gap-2">
                        <input className="border rounded-lg flex-2 p-2" value={command} placeholder="Enter command..." onChange={validateCommandInput}/>
                        <Button className="flex-1" buttonTitle={"Send kommand"} disabled={command.length === 0} onClick={() => sendCommand(command, command)} />
                        <Button className="flex-1" buttonTitle={"Logg ut"} onClick={logout} />
                    </div>
                    <div className="flex gap-2 w-full">
                        <Button buttonTitle="Abort" onClick={() => sendCommand("Abort", "1")}/>
                        <Button buttonTitle="Launch" onClick={() => sendCommand("Launch", "2")}/>
                        <Button buttonTitle="Turn off engine" onClick={() => sendCommand("Turn off engine", "3")}/>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-2 w-full">
                    <input type={"password"} className="border rounded-lg w-full p-2" value={password} placeholder="Enter password..." onChange={(e) => setPassword(e.currentTarget.value)}/>
                    <Button buttonTitle={"Logg inn"} onClick={authenticate} />
                </div>
            )}
        </div>
    );
}
