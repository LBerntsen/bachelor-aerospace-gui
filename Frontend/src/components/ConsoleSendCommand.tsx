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
    async function sendCommand() {
        logger.log(`Sending command:`, command);

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
                <div className="flex flex-col gap-2 w-full max-w-md">
                    <input className="border rounded-lg w-full p-2" value={command} placeholder="Enter command..." onChange={validateCommandInput}/>
                    <div className="flex gap-2">
                        <Button buttonTitle={"Send kommand"} disabled={command.length === 0} onClick={sendCommand} />
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
