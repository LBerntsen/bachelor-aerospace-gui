
import Card from "../components/Card.tsx";
import ConsoleViewer from "../components/ConsoleLog.tsx";
import { CommandSender } from "../components/ConsoleSendCommand.tsx";
import Header from "../components/Header.tsx";
import { isOperator } from "../state/utility.ts";

export default function Home() {
  
  return (
    <div className="bg-[#121212] min-h-screen flex flex-col">
      <Header pageName="Dashboard"/>
      {isOperator() ? (
        <Card className="m-4 space-y-2">
          <ConsoleViewer />
          <CommandSender />
        </Card>
      ) : (
        <div className="w-full h-screen flex flex-col justify-center items-center">
          <p className="text-white text-5xl">Welcome to the Phoenix 2 launch!</p>
          <p className="text-white text-4xl">Select a dashboard to view</p>
        </div>
      )}
    </div>
  );
}