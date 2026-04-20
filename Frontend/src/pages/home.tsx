import TextData from "../components/TextData.tsx";
import RocketScene from "../components/RocketScene.tsx";
import DirectionText from "../components/DirectionText.tsx";
import ErrorBoundary from "../components/ErrorBoundary.tsx";
import Card from "../components/Card.tsx";
import ConsoleViewer from "../components/ConsoleLog.tsx";
import { CommandSender } from "../components/ConsoleSendCommand.tsx";
import Header from "../components/Header.tsx";

export default function Home() {
  
  return (
    <div className="bg-[#121212] min-h-screen flex flex-col">
      <Header pageName="Dashboard"/>
      
      <Card className="m-4">
        <ConsoleViewer />
        <CommandSender />
      </Card>
    </div>
  );
}