import TextData from "../components/TextData.tsx";
import RocketScene from "../components/RocketScene.tsx";
import DirectionText from "../components/DirectionText.tsx";
import ErrorBoundary from "../components/ErrorBoundary.tsx";
import Card from "../components/Card.tsx";
import ConsoleViewer from "../components/ConsoleLog.tsx";
import { CommandSender } from "../components/ConsoleSendCommand.tsx";

export default function Home() {
  
  return (
    <div>
      <Card>
        <ErrorBoundary
          className="text-4xl font-semibold text-neutral-100"
          fallback="There was an error loading the Rocket model"
        >
          <div>
            <div className="absolute z-10">
              <Card className="mt-2">
                <DirectionText sensorId="Yaw" unit="°" />
              </Card>
              <Card className="mt-2">
                <DirectionText sensorId="Pitch" unit="°" />
              </Card>
              <Card className="mt-2">
                <DirectionText sensorId="Roll" unit="°" />
              </Card>
              <Card className="mt-2">
                <TextData sensorId="Altitude" unit="m/s" />
              </Card>
            </div>
          </div>

          <div className="h-100">
            <RocketScene />
          </div>
        </ErrorBoundary>
        <ConsoleViewer />
        <CommandSender />
        
      </Card>
    </div>
  );
}