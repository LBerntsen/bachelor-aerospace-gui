import { useGLTF } from "@react-three/drei";
import { useSelector } from "react-redux";
import {selectLatestTelemetryValueById} from "../state/telemetry/telemetrySlice";

type Props = {
  sensorIdRoll: string;
  sensorIdYaw: string;
  sensorIdPitch: string;
};

export default function RocketModel({ sensorIdRoll, sensorIdPitch, sensorIdYaw }: Props) {
    const rollEntry = useSelector(selectLatestTelemetryValueById(sensorIdRoll));
    const pitchEntry = useSelector(selectLatestTelemetryValueById(sensorIdPitch));
    const yawEntry = useSelector(selectLatestTelemetryValueById(sensorIdYaw));

    const roll = (rollEntry?.value ?? 0 / 1000) * Math.PI / 180;
    const pitch = (pitchEntry?.value ?? 0 / 1000) * Math.PI / 180;
    const yaw = (yawEntry?.value ?? 0 / 1000) * Math.PI / 180;

    const { scene } = useGLTF("/rocket.glb");

    return (
        <group scale={0.01} rotation={[pitch, yaw, roll]} rotation-order="ZYX">
            <group>
            <primitive object={scene} />
            </group>
        </group>
    );
}