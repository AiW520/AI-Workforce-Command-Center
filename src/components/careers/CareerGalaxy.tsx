"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CAREER_GALAXY } from "@/lib/data";
import type { CareerRole } from "@/types";

const ORBITS = [
  { radius: 0.32, speed: 0.4, color: "rgba(79,195,247,0.12)" },
  { radius: 0.48, speed: 0.3, color: "rgba(124,77,255,0.1)" },
  { radius: 0.65, speed: 0.2, color: "rgba(0,229,255,0.08)" },
];

export function CareerGalaxy() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedRole, setSelectedRole] = useState<CareerRole | null>(null);
  const [dimensions, setDimensions] = useState({ width: 900, height: 550 });
  const [time, setTime] = useState(0);

  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: Math.min(550, window.innerHeight * 0.65),
        });
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((t) => t + 0.016);
    }, 16);
    return () => clearInterval(interval);
  }, []);

  const centerX = dimensions.width / 2;
  const centerY = dimensions.height / 2;
  const maxRadius = Math.min(centerX, centerY) * 0.8;

  const getPosition = useCallback(
    (role: CareerRole) => {
      const orbitData = ORBITS[role.orbit - 1] || ORBITS[ORBITS.length - 1];
      const radius = maxRadius * orbitData.radius;
      const angle = ((role.angle + time * orbitData.speed * 10) * Math.PI) / 180;
      return {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
      };
    },
    [centerX, centerY, maxRadius, time]
  );

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: dimensions.height }}>
      <svg className="absolute inset-0 w-full h-full z-0">
        <defs>
          <radialGradient id="galaxyCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(124,77,255,0.15)" />
            <stop offset="40%" stopColor="rgba(79,195,247,0.05)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <filter id="starGlow">
            <feGaussianBlur stdDeviation="1.5" />
          </filter>
        </defs>

        <circle cx={centerX} cy={centerY} r={maxRadius * 0.5} fill="url(#galaxyCore)" />

        {ORBITS.map((orbit, i) => (
          <motion.circle
            key={`orbit-${i}`}
            cx={centerX}
            cy={centerY}
            r={maxRadius * orbit.radius}
            fill="none"
            stroke={orbit.color}
            strokeWidth="1"
            strokeDasharray="4 8"
            initial={{ opacity: 0, pathLength: 0 }}
            whileInView={{ opacity: 1, pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2, delay: i * 0.3 }}
          />
        ))}

        {CAREER_GALAXY.map((role) => {
          const pos = getPosition(role);
          const size = 2 + (role.demand / 100) * 4;
          const color = role.category === "Core AI"
            ? "#4FC3F7"
            : role.category === "AI Agent"
            ? "#7C4DFF"
            : role.category === "Frontier"
            ? "#00E5FF"
            : role.salary.max > 400000
            ? "#FFB300"
            : "#B388FF";
          return (
            <motion.circle
              key={role.id}
              cx={pos.x}
              cy={pos.y}
              r={size}
              fill={color}
              opacity={0.7}
              filter="url(#starGlow)"
              animate={{ opacity: [0.5, 0.9, 0.5] }}
              transition={{ duration: 2 + Math.random() * 2, repeat: Infinity }}
            />
          );
        })}
      </svg>

      {CAREER_GALAXY.map((role, i) => {
        const pos = getPosition(role);
        return (
          <CareerNode
            key={role.id}
            role={role}
            x={pos.x}
            y={pos.y}
            isSelected={selectedRole?.id === role.id}
            onClick={() =>
              setSelectedRole(selectedRole?.id === role.id ? null : role)
            }
            index={i}
          />
        );
      })}

      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <div className="relative">
          <motion.div
            className="absolute inset-0 rounded-full bg-neon-purple/10 blur-2xl"
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 border border-neon-blue/20">
            <span className="text-2xl md:text-3xl">⬡</span>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedRole && (
          <motion.div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 w-80 glass-panel p-4"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-mono text-white/90 tracking-wider">
                {selectedRole.title}
              </h3>
              <span className="text-[10px] font-mono text-neon-purple/70">
                {selectedRole.category}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="text-[10px] font-mono text-white/40">
                需求指数:{" "}
                <span className="text-neon-cyan">{selectedRole.demand}%</span>
              </div>
              <div className="text-[10px] font-mono text-white/40">
                增长率:{" "}
                <span className="text-plasma-amber">+{selectedRole.growth}%</span>
              </div>
              <div className="text-[10px] font-mono text-white/40">
                薪资:{" "}
                <span className="text-neon-blue">
                  ${(selectedRole.salary.min / 1000).toFixed(0)}k-$
                  {(selectedRole.salary.max / 1000).toFixed(0)}k
                </span>
              </div>
              <div className="text-[10px] font-mono text-white/40">
                轨道: <span className="text-neon-purple">Orbit-{selectedRole.orbit}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1 mb-2">
              {selectedRole.skills.map((skill) => (
                <span
                  key={skill}
                  className="text-[8px] font-mono px-2 py-0.5 rounded-full bg-neon-blue/5 border border-neon-blue/10 text-neon-blue/60"
                >
                  {skill}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-1">
              {selectedRole.companies.map((company) => (
                <span
                  key={company}
                  className="text-[8px] font-mono text-white/20"
                >
                  {company}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CareerNode({
  role,
  x,
  y,
  isSelected,
  onClick,
  index,
}: {
  role: CareerRole;
  x: number;
  y: number;
  isSelected: boolean;
  onClick: () => void;
  index: number;
}) {
  const demandColor =
    role.demand > 90
      ? "#4FC3F7"
      : role.demand > 80
      ? "#7C4DFF"
      : "#546E7A";
  const glowColor =
    role.growth > 40
      ? "rgba(255,179,0,0.4)"
      : role.growth > 30
      ? "rgba(79,195,247,0.3)"
      : "rgba(124,77,255,0.2)";

  return (
    <motion.div
      className="absolute z-20 cursor-pointer"
      style={{ left: x, top: y, transform: "translate(-50%, -50%)" }}
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, type: "spring" }}
      animate={{ scale: isSelected ? 1.3 : 1 }}
      whileHover={{ scale: 1.2 }}
      onClick={onClick}
    >
      <motion.div
        className="absolute inset-0 rounded-full blur-md"
        style={{ backgroundColor: glowColor }}
        animate={{ opacity: [0, 0.6, 0] }}
        transition={{ duration: 2 + index * 0.5, repeat: Infinity }}
      />
      <div
        className="relative w-5 h-5 md:w-6 md:h-6 rounded-full"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${demandColor}, ${demandColor}30)`,
          border: `1px solid ${demandColor}60`,
          boxShadow: `0 0 ${isSelected ? 12 : 6}px ${glowColor}`,
        }}
      >
        <span
          className="absolute -top-4 left-1/2 -translate-x-1/2 text-[7px] md:text-[8px] font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ color: demandColor }}
        >
          {role.title}
        </span>
      </div>
    </motion.div>
  );
}