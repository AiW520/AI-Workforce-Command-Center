"use client";

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function CityBuildings() {
  const count = 40;
  const buildings = useMemo(() => {
    const arr: {
      x: number;
      z: number;
      w: number;
      h: number;
      d: number;
      hue: number;
      glow: number;
    }[] = [];
    const radius = 12;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
      const r = radius + (Math.random() - 0.5) * 4;
      arr.push({
        x: Math.cos(angle) * r,
        z: Math.sin(angle) * r,
        w: 0.3 + Math.random() * 0.7,
        h: 1.5 + Math.random() * 4.5,
        d: 0.3 + Math.random() * 0.7,
        hue: 190 + Math.random() * 80,
        glow: 0.15 + Math.random() * 0.3,
      });
    }
    return arr;
  }, []);

  return (
    <group position={[0, -1.5, 0]}>
      {buildings.map((b, i) => (
        <mesh key={i} position={[b.x, b.h / 2, b.z]}>
          <boxGeometry args={[b.w, b.h, b.d]} />
          <meshStandardMaterial
            color={new THREE.Color(`hsl(${b.hue}, 70%, 30%)`)}
            emissive={new THREE.Color(`hsl(${b.hue}, 100%, 50%)`)}
            emissiveIntensity={b.glow}
            roughness={0.4}
            metalness={0.7}
            transparent
            opacity={0.9}
          />
        </mesh>
      ))}
    </group>
  );
}

function DataRings() {
  const rings = useMemo(
    () => [
      { radius: 5, y: 0.2, hue: 190 },
      { radius: 7, y: 0.6, hue: 210 },
      { radius: 9, y: 1.1, hue: 225 },
      { radius: 11, y: 1.7, hue: 240 },
      { radius: 13, y: 2.4, hue: 255 },
    ],
    []
  );

  return (
    <>
      {rings.map((ring, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, ring.y, 0]}>
          <torusGeometry args={[ring.radius, 0.015, 8, 128]} />
          <meshBasicMaterial
            color={new THREE.Color(`hsl(${ring.hue}, 100%, 60%)`)}
            transparent
            opacity={0.2}
          />
        </mesh>
      ))}
    </>
  );
}

function DataFlowParticles() {
  const groupRef = useRef<THREE.Group>(null);
  const count = 150;
  const particles = useMemo(() => {
    const arr: { angle: number; radius: number; y: number; speed: number; hue: number }[] = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        angle: Math.random() * Math.PI * 2,
        radius: 3 + Math.random() * 14,
        y: (Math.random() - 0.5) * 6,
        speed: 0.003 + Math.random() * 0.007,
        hue: 190 + Math.random() * 70,
      });
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const children = groupRef.current.children;
    const len = children.length;
    for (let i = 0; i < len; i++) {
      const p = particles[i];
      p.angle += p.speed * delta * 10;
      children[i].position.x = Math.cos(p.angle) * p.radius;
      children[i].position.z = Math.sin(p.angle) * p.radius;
    }
  });

  return (
    <group ref={groupRef}>
      {particles.map((p, i) => (
        <mesh key={i} position={[Math.cos(p.angle) * p.radius, p.y, Math.sin(p.angle) * p.radius]}>
          <sphereGeometry args={[0.03, 3, 3]} />
          <meshBasicMaterial
            color={new THREE.Color(`hsl(${p.hue}, 100%, 70%)`)}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
}

function CentralCore() {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.004;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.04;
    }
    if (glowRef.current) {
      glowRef.current.rotation.y -= 0.003;
      const s = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.04;
      glowRef.current.scale.setScalar(s);
    }
  });

  return (
    <>
      <mesh ref={meshRef} position={[0, -0.2, 0]}>
        <icosahedronGeometry args={[0.7, 1]} />
        <meshStandardMaterial
          color="#4FC3F7"
          emissive="#7C4DFF"
          emissiveIntensity={0.5}
          roughness={0.15}
          metalness={0.8}
        />
      </mesh>
      <mesh ref={glowRef} position={[0, -0.2, 0]}>
        <icosahedronGeometry args={[1.2, 1]} />
        <meshBasicMaterial
          color="#4FC3F7"
          transparent
          opacity={0.06}
          wireframe
        />
      </mesh>
    </>
  );
}

function SkyFloor() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
        <planeGeometry args={[36, 36]} />
        <meshBasicMaterial color="#050510" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.98, 0]}>
        <planeGeometry args={[28, 28, 28, 28]} />
        <meshBasicMaterial color="#4FC3F7" transparent opacity={0.05} wireframe />
      </mesh>
    </>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 10, 0]} intensity={2.5} color="#4FC3F7" distance={25} />
      <pointLight position={[12, 4, 12]} intensity={1.2} color="#7C4DFF" distance={20} />
      <pointLight position={[-12, 3, -10]} intensity={1} color="#00E5FF" distance={18} />
      <directionalLight position={[5, 15, 5]} intensity={0.4} color="#ffffff" />

      <SkyFloor />
      <CityBuildings />
      <DataRings />
      <CentralCore />
      <DataFlowParticles />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.25}
        maxPolarAngle={Math.PI / 2.1}
        minPolarAngle={Math.PI / 4.5}
      />
    </>
  );
}

export function AICitySystem() {
  return (
    <div className="relative w-full h-[450px] md:h-[580px] lg:h-[660px]">
      <div className="absolute inset-0 bg-gradient-to-b from-space-deep/0 via-space-deep/30 to-space-deep/90 z-10 pointer-events-none" />

      <Suspense
        fallback={
          <div className="absolute inset-0 flex items-center justify-center text-neon-blue/40 font-mono text-xs animate-pulse">
            INITIALIZING CITY RENDER...
          </div>
        }
      >
        <Canvas
          dpr={[1, 1.25]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
          camera={{ position: [14, 10, 10], fov: 50 }}
          style={{ background: "radial-gradient(ellipse at 50% 40%, #0D1320, #030712)" }}
          performance={{ min: 0.5 }}
        >
          <Scene />
        </Canvas>
      </Suspense>

      <div className="absolute top-4 left-4 z-20 pointer-events-none">
        <div className="glass-panel-light px-3 py-1.5 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" />
          <span className="text-[9px] font-mono text-neon-cyan/70 tracking-[0.15em]">
            NEXUS CITY · LIVE
          </span>
        </div>
      </div>
      <div className="absolute bottom-4 right-4 z-20 pointer-events-none">
        <div className="glass-panel-light px-3 py-1.5">
          <span className="text-[9px] font-mono text-white/20 tracking-[0.1em]">
            NODES: 1,247 · STREAMS: 842 · AGENTS: 47
          </span>
        </div>
      </div>
    </div>
  );
}