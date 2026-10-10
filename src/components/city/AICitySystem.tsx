"use client";

import { Component, Suspense, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { ReactNode, RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Crosshair, Home, Maximize2, Minus, Pause, Play, Plus, Settings2 } from "lucide-react";
import * as THREE from "three";
import { AGENTS, SKILL_TREE } from "@/lib/data";
import { CITIES } from "@/lib/cities";
import { emitSceneSelection, subscribeSceneSelection } from "@/lib/scene-selection";
import type { SceneSelection } from "@/lib/scene-selection";

type Kind = SceneSelection["kind"];
type Point = [number, number, number];
type Quality = "eco" | "balanced" | "high";
type CameraCommand = { action: "home" | "focus" | "top" | "left" | "right" | "up" | "down" | "in" | "out"; nonce: number };
type Entity = { kind: Kind; id: string; name: string; position: Point; color: string };

const COLORS = { agent: "#62E5CF", city: "#F6BA61", skill: "#AFA2FF" };
const pointerOver = (event: ThreeEvent<PointerEvent>) => { event.stopPropagation(); (event.nativeEvent.target as HTMLElement).style.cursor = "pointer"; };
const pointerOut = (event: ThreeEvent<PointerEvent>) => { (event.nativeEvent.target as HTMLElement).style.cursor = "grab"; };
// This is a spatial index of existing records, not a simulation of live deployment.
const ENTITIES: Entity[] = [
  ...CITIES.map((city, i) => ({ kind: "city" as const, id: city.id, name: city.city, position: [((i % 5) - 2) * 6.3, 0, (Math.floor(i / 5) - 1.5) * 6.8] as Point, color: COLORS.city })),
  ...AGENTS.map((agent, i) => ({ kind: "agent" as const, id: agent.id, name: agent.name, position: [(i - 2.5) * 3.3, 0, 17] as Point, color: COLORS.agent })),
  ...SKILL_TREE.map((skill, i) => ({ kind: "skill" as const, id: skill.id, name: skill.name, position: [((i % 6) - 2.5) * 4, 0, -18.2 - Math.floor(i / 6) * 3.6] as Point, color: skill.unlocked ? COLORS.skill : "#77828F" })),
];

function entityFor(selection: SceneSelection | null) {
  return ENTITIES.find((entity) => entity.kind === selection?.kind && entity.id === selection?.id);
}

function SceneLabel({ text, position, color = "#E5F0F0", wide = false }: { text: string; position: Point; color?: string; wide?: boolean }) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512; canvas.height = 96;
    const context = canvas.getContext("2d");
    if (context) {
      context.fillStyle = "rgba(18,30,35,0.96)";
      context.fillRect(0, 0, 512, 96);
      context.font = "600 40px Arial";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillStyle = color;
      context.fillText(text, 256, 48, 488);
    }
    const result = new THREE.CanvasTexture(canvas);
    result.colorSpace = THREE.SRGBColorSpace;
    return result;
  }, [text, color]);
  useEffect(() => () => texture.dispose(), [texture]);
  return <sprite position={position} scale={[wide ? 7 : 4.6, wide ? 1.31 : 0.86, 1]}><spriteMaterial map={texture} depthWrite={false} depthTest={false} /></sprite>;
}

function SelectionBase({ selected, color, radius = 2 }: { selected: boolean; color: string; radius?: number }) {
  return <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
    <ringGeometry args={[radius, radius + (selected ? 0.12 : 0.035), 48]} />
    <meshBasicMaterial color={selected ? "#FFFFFF" : color} transparent opacity={selected ? 1 : 0.28} side={THREE.DoubleSide} />
  </mesh>;
}

function WindowStrips({ positions, width, color, bright = false }: { positions: Point[]; width: number; color: string; bright?: boolean }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    if (!ref.current) return;
    const matrix = new THREE.Matrix4();
    positions.forEach((position, index) => ref.current!.setMatrixAt(index, matrix.makeTranslation(...position)));
    ref.current.instanceMatrix.needsUpdate = true;
    ref.current.computeBoundingSphere();
  }, [positions]);
  return <instancedMesh ref={ref} args={[undefined, undefined, positions.length]}>
    <boxGeometry args={[width, 0.08, 0.02]} />
    <meshStandardMaterial color={color} emissive={color} emissiveIntensity={bright ? 1.2 : 0.5} />
  </instancedMesh>;
}

function CityDistrict({ entity, index, selected, select, high }: { entity: Entity; index: number; selected: boolean; select: (entity: Entity) => void; high: boolean }) {
  const city = CITIES[index];
  const height = 2.2 + city.intensity / 24;
  const [hovered, setHovered] = useState(false);
  const form = index % 4;
  const facade = ["#D0DCDD", "#9CB9BB", "#C9C2B3", "#ADBDCB"][form];
  const windows = useMemo(() => [0, 1, 2].flatMap((building) => Array.from({ length: Math.floor((height - building * 0.75) / 0.65) }, (_, floor) => [(building - 1) * 1.15, floor * 0.65 + 0.69, (building % 2) * 0.95 + 0.182] as Point)), [height]);
  return <group position={entity.position} onPointerOver={(event) => { pointerOver(event); setHovered(true); }} onPointerOut={(event) => { pointerOut(event); setHovered(false); }} onClick={(event) => { event.stopPropagation(); select(entity); }}>
    <mesh position={[0, 0.12, 0]} receiveShadow><boxGeometry args={[4.7, 0.24, 4.5]} /><meshStandardMaterial color={selected ? "#607C77" : "#425557"} roughness={0.88} /></mesh>
    <SelectionBase selected={selected} color={entity.color} radius={2.45} />
    {[0, 1, 2].map((building) => <group key={building} position={[(building - 1) * 1.15, 0.24, (building % 2) * 0.95 - 0.35]}>
      <mesh position={[0, (height - building * 0.75) / 2, 0]} castShadow={high} receiveShadow>{form === 1 ? <cylinderGeometry args={[0.46, 0.6, height - building * 0.75, 12]} /> : <boxGeometry args={[form === 2 ? 1.03 : 0.86, height - building * 0.75, 1.05]} />}<meshStandardMaterial color={selected ? "#F2F5E8" : facade} metalness={0.23} roughness={0.57} /></mesh>
      <mesh position={[0, height - building * 0.75 + 0.16, 0]}><boxGeometry args={[0.7, 0.3, 0.8]} /><meshStandardMaterial color="#243F48" metalness={0.65} roughness={0.4} /></mesh>
    </group>)}
    {form === 0 && <mesh position={[0, height * 0.65, 0.1]} castShadow={high}><boxGeometry args={[3.3, 0.27, 0.48]} /><meshStandardMaterial color="#49747D" metalness={0.4} roughness={0.4} /></mesh>}
    {form === 1 && <mesh position={[0, height + 0.42, 0.6]}><sphereGeometry args={[0.69, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#6FB9BC" metalness={0.3} roughness={0.3} /></mesh>}
    {form === 2 && <mesh position={[-1.15, height + 0.36, -0.35]} rotation={[0, Math.PI / 4, 0]}><coneGeometry args={[0.85, 0.64, 4]} /><meshStandardMaterial color="#778C96" metalness={0.5} roughness={0.4} /></mesh>}
    {form === 3 && <group position={[0, height + 0.3, 0.6]}><mesh rotation={[0.24, 0, 0]}><boxGeometry args={[2.2, 0.12, 1.1]} /><meshStandardMaterial color="#335F79" metalness={0.6} roughness={0.3} /></mesh><mesh position={[0, 0.2, 0]}><boxGeometry args={[0.06, 0.08, 1.1]} /><meshBasicMaterial color="#BCD9DE" /></mesh></group>}
    <WindowStrips positions={windows} width={0.71} color={entity.color} bright={selected} />
    <mesh position={[1.35, 1.08, 1.25]} rotation={[0, Math.PI / 4, 0]} castShadow={high}><cylinderGeometry args={[0.48, 0.62, 1.75, 6]} /><meshStandardMaterial color="#E5C591" metalness={0.4} roughness={0.65} /></mesh>
    <mesh position={[1.35, 2.05, 1.25]}><cylinderGeometry args={[0.08, 0.08, 0.35, 8]} /><meshStandardMaterial emissive={entity.color} emissiveIntensity={1} color={entity.color} /></mesh>
    {[-1.7, -0.5, 0.7].map((x, tree) => <group key={tree} position={[x, 0.26, 1.6]}><mesh position={[0, 0.32, 0]}><cylinderGeometry args={[0.06, 0.08, 0.6, 5]} /><meshStandardMaterial color="#8B7D68" /></mesh><mesh position={[0, 0.9, 0]} castShadow={high}><icosahedronGeometry args={[0.45 + tree * 0.04, 1]} /><meshStandardMaterial color={["#658F79", "#7EAA85", "#557E72"][tree]} roughness={0.95} /></mesh></group>)}
    {(selected || hovered) && <SceneLabel text={entity.name} position={[0, height + 1.6, 0]} color="#FFFFFF" />}
  </group>;
}

function RobotAgent({ entity, index, selected, select, moving, high }: { entity: Entity; index: number; selected: boolean; select: (entity: Entity) => void; moving: boolean; high: boolean }) {
  const head = useRef<THREE.Group>(null);
  const rotor = useRef<THREE.Group>(null);
  useFrame(({ clock }, delta) => {
    if (!moving) return;
    if (head.current) head.current.rotation.y = Math.sin(clock.elapsedTime * 0.65 + index) * 0.32;
    if (rotor.current) rotor.current.rotation.y += delta * 2;
  });
  return <group position={entity.position} onPointerOver={pointerOver} onPointerOut={pointerOut} onClick={(event) => { event.stopPropagation(); select(entity); }}>
    <mesh position={[0, 0.2, 0]} receiveShadow><cylinderGeometry args={[1.1, 1.15, 0.4, 16]} /><meshStandardMaterial color="#223A40" metalness={0.6} roughness={0.5} /></mesh>
    <SelectionBase selected={selected} color={entity.color} radius={1.22} />
    <mesh position={[0, 1.03, 0]} castShadow={high}><boxGeometry args={[0.85, 1.15, 0.65]} /><meshStandardMaterial color={selected ? "#F6FFFD" : "#CAD8D3"} metalness={0.38} roughness={0.32} /></mesh>
    <mesh position={[0, 1.12, 0.337]}><boxGeometry args={[0.46, 0.35, 0.025]} /><meshStandardMaterial color="#123B36" emissive={entity.color} emissiveIntensity={selected ? 1.4 : 0.3} /></mesh>
    {[-1, 1].map((side) => <group key={side} position={[side * 0.62, 1.1, 0]}>
      <mesh rotation={[0, 0, side * 0.1]} castShadow={high}><boxGeometry args={[0.24, 0.85, 0.3]} /><meshStandardMaterial color="#91A8A6" metalness={0.6} roughness={0.42} /></mesh>
      <mesh position={[side * 0.03, -0.49, 0]}><sphereGeometry args={[0.15, 12, 8]} /><meshStandardMaterial color={entity.color} emissive={entity.color} emissiveIntensity={0.35} /></mesh>
    </group>)}
    {[-1, 1].map((side) => <mesh key={side} position={[side * 0.23, 0.47, 0.09]} castShadow={high}><boxGeometry args={[0.28, 0.42, 0.49]} /><meshStandardMaterial color="#819B9B" metalness={0.45} roughness={0.4} /></mesh>)}
    <group ref={head} position={[0, 1.97, 0]}>
      <mesh castShadow={high}><boxGeometry args={[0.79, 0.66, 0.64]} /><meshStandardMaterial color="#DCE7DF" metalness={0.4} roughness={0.3} /></mesh>
      <mesh position={[0, 0.05, 0.325]}><boxGeometry args={[0.68, 0.21, 0.018]} /><meshStandardMaterial color="#183A3D" emissive={entity.color} emissiveIntensity={0.25} /></mesh>
      {[-1, 1].map((side) => <mesh key={side} position={[side * 0.17, 0.05, 0.342]}><boxGeometry args={[0.13, 0.055, 0.018]} /><meshBasicMaterial color={entity.color} /></mesh>)}
      <mesh position={[0.27, 0.49, 0]}><cylinderGeometry args={[0.025, 0.025, 0.35, 8]} /><meshStandardMaterial color="#DCE7DF" /></mesh>
    </group>
    <group ref={rotor} position={[0, 2.9, 0]}><mesh><torusGeometry args={[0.52, 0.035, 6, 24]} /><meshBasicMaterial color={entity.color} /></mesh><mesh rotation={[0, 0, Math.PI / 2]}><boxGeometry args={[0.03, 1.05, 0.03]} /><meshBasicMaterial color={entity.color} /></mesh></group>
    {selected && <SceneLabel text={entity.name} position={[0, 3.55, 0]} color="#FFFFFF" />}
  </group>;
}

function SkillCampus({ entity, index, selected, select, high }: { entity: Entity; index: number; selected: boolean; select: (entity: Entity) => void; high: boolean }) {
  const skill = SKILL_TREE[index];
  const windows = useMemo(() => [-1, 0, 1].flatMap((rack) => [0, 1, 2, 3, 4].map((shelf) => [rack * 0.74, shelf * 0.34 + 0.67, 0.429] as Point)), []);
  return <group position={entity.position} onPointerOver={pointerOver} onPointerOut={pointerOut} onClick={(event) => { event.stopPropagation(); select(entity); }}>
    <mesh position={[0, 0.15, 0]} receiveShadow><boxGeometry args={[2.9, 0.3, 2.35]} /><meshStandardMaterial color="#303142" roughness={0.9} /></mesh>
    <SelectionBase selected={selected} color={entity.color} radius={1.58} />
    {[-1, 0, 1].map((rack) => <group key={rack} position={[rack * 0.74, 0.35, 0]}>
      <mesh position={[0, 1, 0]} castShadow={high}><boxGeometry args={[0.64, 2, 0.83]} /><meshStandardMaterial color={skill.unlocked ? "#4A4C67" : "#323947"} metalness={0.6} roughness={0.4} /></mesh>
    </group>)}
    <WindowStrips positions={windows} width={0.48} color={entity.color} bright={selected} />
    <mesh position={[0, 2.56, 0]}><boxGeometry args={[2.45 * skill.progress / 100, 0.08, 0.16]} /><meshBasicMaterial color={entity.color} /></mesh>
    {selected && <SceneLabel text={entity.name} position={[0, 3.3, 0]} color="#FFFFFF" />}
  </group>;
}

function Transit({ moving, quality }: { moving: boolean; quality: Quality }) {
  const ships = useRef<THREE.Group>(null);
  const elapsed = useRef(0);
  const curves = useMemo(() => Array.from({ length: 7 }, (_, i) => {
    const x = (i - 3) * 4.2;
    return new THREE.CatmullRomCurve3([new THREE.Vector3(x, 4.5, 20), new THREE.Vector3(x + 3, 7.5, 8), new THREE.Vector3(x - 2, 8, -8), new THREE.Vector3(x, 4.2, -23)]);
  }), []);
  useFrame((_, delta) => {
    if (!moving || !ships.current) return;
    elapsed.current += Math.min(delta, 0.1);
    ships.current.children.forEach((ship, i) => {
      const t = (elapsed.current * 0.035 + i / curves.length) % 1;
      ship.position.copy(curves[i].getPointAt(t));
      ship.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), curves[i].getTangentAt(t));
    });
  });
  return <>
    {quality !== "eco" && curves.map((curve, i) => <mesh key={i}><tubeGeometry args={[curve, 32, 0.012, 3, false]} /><meshBasicMaterial color="#74B3BF" transparent opacity={0.24} /></mesh>)}
    <group ref={ships}>{curves.map((curve, i) => <group key={i} position={curve.getPointAt(i / curves.length)}>
      <mesh><boxGeometry args={[0.26, 0.19, 0.71]} /><meshStandardMaterial color="#E5D6B0" metalness={0.4} roughness={0.45} /></mesh>
      <mesh position={[0, 0.03, 0]}><boxGeometry args={[0.88, 0.055, 0.25]} /><meshStandardMaterial color="#5C9EAC" metalness={0.6} roughness={0.35} /></mesh>
      <mesh position={[0, 0, -0.41]}><boxGeometry args={[0.17, 0.12, 0.13]} /><meshBasicMaterial color="#F8BA57" /></mesh>
    </group>)}</group>
  </>;
}

function EntityRelations({ selection }: { selection: SceneSelection | null }) {
  const paths = useMemo(() => {
    const current = entityFor(selection);
    if (!current || current.kind === "city") return [];
    const ids = current.kind === "agent" ? AGENTS.find((agent) => agent.id === current.id)?.connections : SKILL_TREE.find((skill) => skill.id === current.id)?.prerequisites;
    return (ids ?? []).flatMap((id) => {
      const target = ENTITIES.find((item) => item.kind === current.kind && item.id === id);
      if (!target) return [];
      const from = new THREE.Vector3(...current.position).add(new THREE.Vector3(0, 2.6, 0));
      const to = new THREE.Vector3(...target.position).add(new THREE.Vector3(0, 2.6, 0));
      const midpoint = from.clone().lerp(to, 0.5).add(new THREE.Vector3(0, 1.2, 0));
      return [{ id, color: current.color, curve: new THREE.CatmullRomCurve3([from, midpoint, to]) }];
    });
  }, [selection]);
  return <group>{paths.map((path) => <mesh key={path.id}><tubeGeometry args={[path.curve, 24, 0.045, 6, false]} /><meshBasicMaterial color={path.color} /></mesh>)}</group>;
}

function Infrastructure() {
  return <>
    <mesh position={[0, -0.42, -1.6]} receiveShadow><boxGeometry args={[37, 0.8, 49]} /><meshStandardMaterial color="#182A30" roughness={0.85} metalness={0.25} /></mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.86, 0]}><planeGeometry args={[180, 180]} /><meshStandardMaterial color="#607B7B" roughness={0.8} /></mesh>
    {[-22, 22].map((x) => <group key={`water-${x}`}><mesh position={[x, -0.66, -1.5]}><boxGeometry args={[5, 0.25, 54]} /><meshStandardMaterial color="#3F9198" metalness={0.46} roughness={0.24} /></mesh><mesh position={[x, -0.39, -1.5]}><boxGeometry args={[0.13, 0.03, 50]} /><meshBasicMaterial color="#B5D1CB" transparent opacity={0.28} /></mesh>{[-15, 0, 15].map((z) => <mesh key={z} position={[x, -0.03, z]}><boxGeometry args={[8, 0.2, 1.3]} /><meshStandardMaterial color="#B2B9A6" roughness={0.8} /></mesh>)}</group>)}
    {[-26, 26].map((x) => <group key={`park-${x}`}>{Array.from({ length: 13 }, (_, i) => <group key={i} position={[x + (i % 2) * 1.4, -0.4, (i - 6) * 4]}><mesh position={[0, 0.6, 0]}><cylinderGeometry args={[0.08, 0.12, 1.2, 6]} /><meshStandardMaterial color="#8F8570" /></mesh><mesh position={[0, 1.7, 0]}><icosahedronGeometry args={[0.85, 1]} /><meshStandardMaterial color={i % 2 ? "#81A38D" : "#577D71"} roughness={0.9} /></mesh></group>)}</group>)}
    {[-15.8, -9.45, -3.15, 3.15, 9.45, 15.8].map((x) => <group key={x}>
      <mesh position={[x, 0.015, -0.2]}><boxGeometry args={[0.7, 0.04, 34]} /><meshStandardMaterial color="#0F1B22" roughness={0.9} /></mesh>
      <mesh position={[x, 0.042, -0.2]}><boxGeometry args={[0.04, 0.015, 34]} /><meshBasicMaterial color="#5B9393" /></mesh>
    </group>)}
    {[-13.65, -6.8, 0, 6.8, 13.65].map((z) => <group key={z}>
      <mesh position={[0, 0.015, z]}><boxGeometry args={[35, 0.04, 0.75]} /><meshStandardMaterial color="#0F1B22" roughness={0.9} /></mesh>
      <mesh position={[0, 0.042, z]}><boxGeometry args={[35, 0.015, 0.04]} /><meshBasicMaterial color="#5B9393" /></mesh>
    </group>)}
    {[-18, 18].map((x) => <mesh key={x} position={[x, -0.08, -1.7]}><boxGeometry args={[0.12, 0.4, 48]} /><meshStandardMaterial color="#56AEB0" emissive="#56AEB0" emissiveIntensity={0.4} /></mesh>)}
    <SceneLabel text="AGENT / 06" position={[0, 0.85, 20]} color="#A9E2D5" wide />
    <SceneLabel text="SKILLS / 12" position={[0, 0.85, -24.5]} color="#D4CBF4" wide />
  </>;
}

function CameraRig({ selection, command, orbit, reduced, autoTour }: { selection: SceneSelection | null; command: CameraCommand; orbit: RefObject<OrbitControlsImpl>; reduced: boolean; autoTour: boolean }) {
  const { camera, invalidate } = useThree();
  const destination = useRef<{ camera: THREE.Vector3; target: THREE.Vector3 } | null>(null);
  useEffect(() => {
    const controls = orbit.current;
    if (!controls) return;
    const entity = entityFor(selection);
    const target = entity ? new THREE.Vector3(...entity.position).add(new THREE.Vector3(0, 1.8, 0)) : new THREE.Vector3(0, 1, -1);
    if (command.action === "focus" || command.action === "home" || command.action === "top") {
      const position = command.action === "home" ? new THREE.Vector3(...(window.innerWidth < 600 ? [44, 42, 66] as Point : [30, 33, 39] as Point)) : command.action === "top" ? new THREE.Vector3(0, 57, 3) : target.clone().add(new THREE.Vector3(7, 5.5, 8));
      const cameraTarget = command.action === "focus" ? target : new THREE.Vector3(0, 1, -1);
      if (reduced) { camera.position.copy(position); controls.target.copy(cameraTarget); controls.update(); }
      else destination.current = { camera: position, target: cameraTarget };
    } else {
      destination.current = null;
      const offset = camera.position.clone().sub(controls.target);
      const spherical = new THREE.Spherical().setFromVector3(offset);
      if (command.action === "left") spherical.theta -= 0.22;
      if (command.action === "right") spherical.theta += 0.22;
      if (command.action === "up") spherical.phi = Math.max(0.15, spherical.phi - 0.16);
      if (command.action === "down") spherical.phi = Math.min(Math.PI / 2.08, spherical.phi + 0.16);
      if (command.action === "in") spherical.radius = Math.max(5, spherical.radius * 0.82);
      if (command.action === "out") spherical.radius = Math.min(86, spherical.radius * 1.2);
      camera.position.copy(controls.target).add(new THREE.Vector3().setFromSpherical(spherical));
      controls.update();
    }
    invalidate();
  }, [camera, command, invalidate, orbit, reduced, selection]);
  useFrame((_, delta) => {
    const controls = orbit.current;
    if (!controls) return;
    const desired = destination.current;
    if (desired) {
      const step = 1 - Math.exp(-delta * 5);
      camera.position.lerp(desired.camera, step);
      controls.target.lerp(desired.target, step);
      controls.update();
      if (camera.position.distanceTo(desired.camera) < 0.025) destination.current = null;
      else invalidate();
    }
  });
  return <OrbitControls ref={orbit} makeDefault enablePan enableDamping={!reduced} dampingFactor={0.09} minDistance={5} maxDistance={86} maxPolarAngle={Math.PI / 2.08} minPolarAngle={0.12} autoRotate={autoTour} autoRotateSpeed={0.2} onStart={() => { destination.current = null; }} />;
}

function World({ selection, select, moving, quality, command, orbit, reduced, autoTour }: { selection: SceneSelection | null; select: (entity: Entity) => void; moving: boolean; quality: Quality; command: CameraCommand; orbit: RefObject<OrbitControlsImpl>; reduced: boolean; autoTour: boolean }) {
  const high = quality === "high";
  return <>
    <color attach="background" args={["#607B7B"]} />
    <fog attach="fog" args={["#607B7B", 90, 190]} />
    <ambientLight intensity={0.65} />
    <hemisphereLight args={["#E4F4F4", "#23313B", 1.6]} />
    <directionalLight position={[15, 30, 5]} intensity={2.9} color="#FFE7C5" castShadow={high} shadow-mapSize={high ? [1024, 1024] : [256, 256]} shadow-camera-left={-30} shadow-camera-right={30} shadow-camera-top={30} shadow-camera-bottom={-30} shadow-camera-far={90} shadow-bias={-0.001} />
    <directionalLight position={[-20, 12, -18]} intensity={1.7} color="#9DCEEA" />
    <Infrastructure />
    {ENTITIES.map((entity) => {
      const selected = entity.kind === selection?.kind && entity.id === selection?.id;
      if (entity.kind === "city") return <CityDistrict key={`city-${entity.id}`} entity={entity} index={CITIES.findIndex((city) => city.id === entity.id)} selected={selected} select={select} high={high} />;
      if (entity.kind === "agent") return <RobotAgent key={`agent-${entity.id}`} entity={entity} index={AGENTS.findIndex((agent) => agent.id === entity.id)} selected={selected} select={select} moving={moving} high={high} />;
      return <SkillCampus key={`skill-${entity.id}`} entity={entity} index={SKILL_TREE.findIndex((skill) => skill.id === entity.id)} selected={selected} select={select} high={high} />;
    })}
    <Transit moving={moving} quality={quality} />
    <EntityRelations selection={selection} />
    <CameraRig selection={selection} command={command} orbit={orbit} reduced={reduced} autoTour={autoTour} />
  </>;
}

class RendererBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

function detailFor(entity: Entity | undefined) {
  if (!entity) return { title: "全球协作园区", subtitle: "20 城市 · 6 智能体 · 12 技能", metric: "静态演示档案", href: "#city" };
  if (entity.kind === "agent") {
    const agent = AGENTS.find((item) => item.id === entity.id)!;
    return { title: agent.name, subtitle: agent.role, metric: `${agent.metrics.tasksCompleted.toLocaleString()} 项任务 · ${agent.metrics.accuracy}% 准确率`, href: "#agents" };
  }
  if (entity.kind === "skill") {
    const skill = SKILL_TREE.find((item) => item.id === entity.id)!;
    return { title: skill.name, subtitle: `${skill.category} / 等级 ${skill.level} / ${skill.unlocked ? "已解锁" : "未解锁"}`, metric: `${skill.progress}% 进度 · ${skill.prerequisites.length} 项前置技能`, href: "#skills" };
  }
  const city = CITIES.find((item) => item.id === entity.id)!;
  return { title: city.city, subtitle: `${city.country} / 等级 ${city.tier}`, metric: `${city.agents.toLocaleString()} 智能体 · ${city.intensity}% 活动强度`, href: "#heatmap" };
}

export function AICitySystem({ variant = "hero", className = "" }: { variant?: "hero" | "city"; className?: string }) {
  const [selection, setSelection] = useState<SceneSelection | null>(null);
  const [kind, setKind] = useState<Kind>("city");
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [reduced, setReduced] = useState(false);
  const [motion, setMotion] = useState(true);
  const [tour, setTour] = useState(false);
  const [quality, setQuality] = useState<Quality>("balanced");
  const [visible, setVisible] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const [mobile, setMobile] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [command, setCommand] = useState<CameraCommand>({ action: "home", nonce: 0 });
  const root = useRef<HTMLDivElement>(null);
  const orbit = useRef<OrbitControlsImpl>(null);
  const frame = useRef<HTMLDivElement>(null);
  const sequence = useRef(0);
  const entity = entityFor(selection);
  const detail = detailFor(entity);
  const moving = motion && !reduced && visible && pageVisible;
  const sendCommand = useCallback((action: CameraCommand["action"]) => setCommand({ action, nonce: ++sequence.current }), []);
  const applySelection = useCallback((next: SceneSelection) => {
    if (!entityFor(next)) return;
    setSelection(next); setKind(next.kind); setTour(false);
    setCommand({ action: "focus", nonce: ++sequence.current });
  }, []);
  const select = useCallback((next: Entity) => emitSceneSelection({ kind: next.kind, id: next.id, source: "scene" }), []);
  useEffect(() => subscribeSceneSelection(applySelection), [applySelection]);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => { setReduced(query.matches); if (query.matches) { setMotion(false); setTour(false); } };
    update(); query.addEventListener("change", update);
    const test = document.createElement("canvas");
    try {
      const context = test.getContext("webgl2") || test.getContext("webgl");
      setWebgl(Boolean(context));
      context?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch { setWebgl(false); }
    setMobile(window.innerWidth < 600);
    if (window.innerWidth < 600) setQuality("eco");
    const visibility = () => setPageVisible(!document.hidden);
    visibility(); document.addEventListener("visibilitychange", visibility);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "100px" });
    if (root.current) observer.observe(root.current);
    return () => { query.removeEventListener("change", update); observer.disconnect(); document.removeEventListener("visibilitychange", visibility); };
  }, []);
  const keyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!(event.target instanceof HTMLElement) || /INPUT|SELECT|BUTTON|A/.test(event.target.tagName)) return;
    const actions: Record<string, CameraCommand["action"]> = { ArrowLeft: "left", ArrowRight: "right", ArrowUp: "up", ArrowDown: "down", "+": "in", "=": "in", "-": "out", Home: "home", f: "focus" };
    if (actions[event.key]) { event.preventDefault(); setTour(false); sendCommand(actions[event.key]); }
    if (event.key === "Escape") { setSelection(null); sendCommand("home"); }
  };
  const iconButton = (label: string, action: () => void, icon: ReactNode, pressed?: boolean, disabled = false) => <button type="button" aria-label={label} title={label} aria-pressed={pressed} disabled={disabled} onClick={action} className="city-icon-control">{icon}</button>;

  return <div ref={root} data-testid="immersive-scene" data-motion={moving ? "active" : "paused"} data-quality={quality} className={`nexus-scene relative w-full ${variant === "hero" ? "h-[640px] md:h-[680px]" : "h-[580px]"} ${className}`}>
    <div ref={frame} data-testid="scene-viewport" className="absolute inset-0 outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan" tabIndex={0} role="region" aria-label="Nexus AI City 三维场景，相机控制" onKeyDown={keyDown}>
      {webgl === true ? <RendererBoundary onFailure={() => setWebgl(false)}><Suspense fallback={null}><Canvas aria-label="Nexus AI City 3D canvas" dpr={quality === "eco" ? 1 : quality === "high" ? [1, 1.5] : [1, 1.35]} shadows={quality === "high"} frameloop={moving ? "always" : "demand"} camera={{ position: mobile ? [44, 42, 66] : [30, 33, 39], fov: 44, near: 0.1, far: 200 }} gl={{ antialias: quality !== "eco", alpha: false, powerPreference: "high-performance" }} style={{ cursor: "grab" }} onCreated={({ gl }) => { gl.domElement.addEventListener("webglcontextlost", (event) => { event.preventDefault(); setWebgl(false); }, { once: true }); }}><World selection={selection} select={select} moving={moving} quality={quality} command={command} orbit={orbit} reduced={reduced} autoTour={tour && moving} /></Canvas></Suspense></RendererBoundary> : <div className="absolute inset-x-0 top-[108px] sm:top-[74px] bottom-[190px] flex justify-center px-4 overflow-y-auto overscroll-contain"><div className="max-w-xl w-full"><p className="text-xs text-[#F6BA61] mb-4">{webgl === null ? "正在加载城市" : "WebGL 不可用 · 可访问实体视图"}</p><div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pb-3">{ENTITIES.filter((item) => item.kind === kind).map((item) => <button key={item.id} className="text-left p-3 border border-white/15 bg-white/5 rounded text-xs text-white/80 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-neon-cyan" onClick={() => select(item)} aria-pressed={entity?.id === item.id}>{item.name}</button>)}</div></div></div>}
    </div>
    <div className="city-toolbar absolute z-20 top-3 left-3 right-3 flex flex-wrap items-center gap-2 pointer-events-none">
      <div className="city-control-surface pointer-events-auto flex items-center gap-1 p-1" role="group" aria-label="实体类型">{(["city", "agent", "skill"] as Kind[]).map((item) => <button key={item} onClick={() => { setKind(item); const first = ENTITIES.find((e) => e.kind === item); if (first) select(first); }} type="button" aria-pressed={kind === item} className={`px-2 sm:px-3 py-2 text-[10px] sm:text-xs rounded ${kind === item ? "bg-white/15 text-white" : "text-white/55 hover:text-white"}`}>{item === "city" ? "城市" : item === "agent" ? "Agent" : "技能"}</button>)}</div>
      <label className="city-control-surface pointer-events-auto flex min-w-0"><span className="sr-only">选择实体</span><select aria-label="选择实体" value={selection?.kind === kind ? selection.id : ""} onChange={(event) => { const next = ENTITIES.find((item) => item.kind === kind && item.id === event.target.value); if (next) select(next); else { setSelection(null); setTour(false); sendCommand("home"); } }} className="bg-transparent text-white/85 text-[11px] sm:text-xs px-2 py-3 w-[142px] sm:w-[190px] min-w-0 outline-none"><option value="">{kind === "city" ? "全部城市" : kind === "agent" ? "全部 Agent" : "全部技能"}</option>{ENTITIES.filter((item) => item.kind === kind).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
      <div className="city-control-surface pointer-events-auto flex items-center p-1 sm:ml-auto gap-1">
        <label><span className="sr-only">画质</span><select aria-label="画质" value={quality} onChange={(event) => setQuality(event.target.value as Quality)} className="bg-transparent text-[10px] text-white/75 py-2 px-1 outline-none"><option value="eco">节能</option><option value="balanced">标准</option><option value="high">精细</option></select></label>
        {iconButton(reduced ? "已遵循系统减少动效设置" : motion ? "暂停场景运动" : "恢复场景运动", () => setMotion((value) => !value), motion ? <Pause size={16} /> : <Play size={16} />, motion, reduced || !webgl)}
      </div>
    </div>
    <div className="absolute z-20 bottom-3 left-3 right-3 flex flex-col sm:flex-row sm:items-end gap-2 pointer-events-none">
      <div className="city-control-surface city-entity-detail pointer-events-auto p-3 min-w-0 sm:w-[300px]" aria-live="polite" data-testid="scene-detail">
        <div className="text-[11px] font-mono text-[#F6BA61] flex items-center gap-2"><span className="w-1.5 h-1.5 bg-[#F6BA61] rounded-full" />演示工作区</div>
        <h2 className="mt-1 text-sm sm:text-base font-medium text-white break-words">{detail.title}</h2><p className="text-[10px] sm:text-[11px] text-white/65 mt-1 break-words">{detail.subtitle}</p><p className="text-[11px] text-white/45 mt-1">{detail.metric}</p>
        <a href={detail.href} className="inline-flex items-center gap-2 text-xs text-[#A6E6D9] mt-2 hover:text-white">{entity ? "打开实体详情" : "城市概览"}<ArrowRight size={14} /></a>
      </div>
      <div className="city-control-surface pointer-events-auto flex items-center gap-0.5 p-1 sm:ml-auto max-w-full overflow-x-auto" role="group" aria-label="相机控制">
        {iconButton("复位相机", () => { setSelection(null); setTour(false); sendCommand("home"); }, <Home size={16} />)}
        {iconButton("聚焦所选实体", () => { setTour(false); sendCommand("focus"); }, <Crosshair size={16} />)}
        {iconButton(tour ? "停止巡航" : "相机巡航", () => { setTour((value) => !value); setMotion(true); }, tour ? <Pause size={16} /> : <Play size={16} />, tour, reduced || !webgl)}
        {iconButton("更多相机控制", () => setToolsOpen((value) => !value), <Settings2 size={16} />, toolsOpen)}
        {toolsOpen && <>
        {iconButton("俯视城市", () => { setTour(false); sendCommand("top"); }, <Maximize2 size={16} />)}
        {iconButton("相机左转", () => sendCommand("left"), <ArrowLeft size={16} />)}
        {iconButton("相机右转", () => sendCommand("right"), <ArrowRight size={16} />)}
        {iconButton("相机上移", () => sendCommand("up"), <ArrowUp size={16} />)}
        {iconButton("相机下移", () => sendCommand("down"), <ArrowDown size={16} />)}
        {iconButton("放大", () => sendCommand("in"), <Plus size={16} />)}
        {iconButton("缩小", () => sendCommand("out"), <Minus size={16} />)}
        </>}
      </div>
    </div>
    <style jsx global>{`
      .nexus-scene { background: #607B7B; }
      .city-control-surface { background: rgba(10, 21, 28, 0.9); border: 1px solid rgba(179, 211, 216, 0.22); border-radius: 6px; backdrop-filter: blur(14px); }
      .city-icon-control { display: inline-flex; width: 40px; height: 40px; min-width: 40px; flex: 0 0 40px; align-items: center; justify-content: center; color: #DBE9E9; border-radius: 4px; }
      .city-icon-control:hover, .city-icon-control[aria-pressed=true] { background: rgba(120, 200, 196, 0.15); color: #FFF; }
      .city-icon-control:disabled { opacity: 0.35; cursor: not-allowed; }
      .city-icon-control:focus-visible, .city-toolbar button:focus-visible, .city-toolbar select:focus-visible { outline: 2px solid #62E5CF; outline-offset: 1px; }
      .city-toolbar select option { background: #122731; color: #FFF; }
      .city-entity-detail p { font-size: 12px; }
      .city-control-surface[aria-label="相机控制"] { flex-wrap: wrap; max-width: 480px; overflow-x: visible; }
      @media (max-width: 639px) { .city-entity-detail { width: 100%; padding: 9px 12px; } .city-entity-detail > div, .city-entity-detail > p:last-of-type { display: none; } .city-entity-detail h2 { margin-top: 0; } .city-entity-detail a { margin-top: 4px; } }
    `}</style>
  </div>;
}
