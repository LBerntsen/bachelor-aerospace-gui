import { Canvas } from "@react-three/fiber";
import { OrbitControls, Bounds } from "@react-three/drei";
import RocketModel from "./RocketModel";

export default function RocketScene() {
  return (
    <Canvas camera={{ position: [0, 0, 0], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} />

      <Bounds fit clip observe>
        <RocketModel
          sensorIdPitch="Pitch"
          sensorIdRoll="Roll"
          sensorIdYaw="Yaw"
        />
      </Bounds>

      <OrbitControls />
    </Canvas>
  );
}