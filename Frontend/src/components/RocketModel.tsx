import { useGLTF } from "@react-three/drei";
import { useSelector } from "react-redux";
import { selectTelemetryValuesById } from "../state/telemetry/telemetrySlice";
import { useMemo } from "react";
import { useRef } from "react";
import * as THREE from "three";

type Props = {
  sensorIdRoll: string;
  sensorIdYaw: string;
  sensorIdPitch: string;
};

export default function RocketModel({ sensorIdRoll, sensorIdPitch, sensorIdYaw }: Props) {
    const rollEntries = useSelector(selectTelemetryValuesById(sensorIdRoll));
    const pitchEntries = useSelector(selectTelemetryValuesById(sensorIdPitch));
    const yawEntries = useSelector(selectTelemetryValuesById(sensorIdYaw));

    const roll = ((rollEntries?.at(-1)?.value ?? 0) / 1000) * Math.PI / 180;
    const pitch = ((pitchEntries?.at(-1)?.value ?? 0) / 1000) * Math.PI / 180;
    const yaw = ((yawEntries?.at(-1)?.value ?? 0) / 1000) * Math.PI / 180;


    const { scene } = useGLTF("/rockett.glb");

    return (
    <group scale={0.01} rotation={[pitch, yaw, roll]} rotation-order="ZYX">
        <group>
        <primitive object={scene} />
        </group>
    </group>
    );
}