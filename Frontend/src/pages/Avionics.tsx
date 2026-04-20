import TextData from "../components/TextData.tsx";
import RocketScene from "../components/RocketScene.tsx";
import DirectionText from "../components/DirectionText.tsx";
import ErrorBoundary from "../components/ErrorBoundary.tsx";
import Card from "../components/Card.tsx";
import TestChart from "../components/TestChart.tsx";
import Header from "../components/Header.tsx";

export default function avionics() {
  
  return (
    <div className="bg-[#121212] min-h-screen flex flex-col">
      <Header pageName="Avionics"/>
        <div>
          
          <Card className="m-4">
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
                    <TextData sensorId="Altitude" unit="m" />
                  </Card>
                </div>
                <div className="absolute right-8 z-10 flex flex-col gap-2">
                  <Card className="mt-2">
                    <DirectionText sensorId="M1pos" unit="" />
                  </Card>
                  <Card className="mt-2">
                    <DirectionText sensorId="M2pos" unit="" />
                  </Card>
                </div>
              </div>

              <div className="h-100">
                <RocketScene />
              </div>
            </ErrorBoundary>
          </Card>
        </div>
        <div className=" flex gap-4 mr-4 ml-4">   
          <TestChart sensorId="Temperature" unit="°C"/>
          <TestChart sensorId="Climbrate" unit="m/s"/>
        </div>
    </div>
  );
}