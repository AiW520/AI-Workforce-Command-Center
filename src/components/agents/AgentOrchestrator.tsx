"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AGENTS } from "@/lib/data";
import { useMousePosition } from "@/hooks/useMousePosition";
import type { Agent } from "@/types";

export function AgentOrchestrator() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const { normalizedX, normalizedY } = useMousePosition();

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const w = containerRef.current.offsetWidth;
        setDimensions({ width: w, height: Math.min(650, window.innerHeight * 0.8) });
      }
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const scaleX = (percent: number) => (percent / 100) * dimensions.width;
  const scaleY = (percent: number) => (percent / 100) * dimensions.height;

  const getPosition = useCallback(
    (agent: Agent) => ({
      x: scaleX(agent.x),
      y: scaleY(agent.y),
    }),
    [scaleX, scaleY]
  );

  const connectionPairs: [Agent, Agent][] = [];
  for (const agent of AGENTS) {
    for (const connId of agent.connections) {
      const target = AGENTS.find((a) => a.id === connId);
      if (
        target &&
        !connectionPairs.some(
          (p) =>
            (p[0].id === agent.id && p[1].id === target.id) ||
            (p[0].id === target.id && p[1].id === agent.id)
        )
      ) {
        connectionPairs.push([agent, target]);
      }
    }
  }

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: dimensions.height }}>
      <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
        <defs>
          <radialGradient id="agentGlowBlue" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(79,195,247,0.3)" />
            <stop offset="100%" stopColor="rgba(79,195,247,0)" />
          </radialGradient>
          <radialGradient id="agentGlowPurple" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(124,77,255,0.3)" />
            <stop offset="100%" stopColor="rgba(124,77,255,0)" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {connectionPairs.map(([from, to], i) => {
          const fromPos = getPosition(from);
          const toPos = getPosition(to);
          return (
            <ConnectionLine
              key={`conn-${i}`}
              x1={fromPos.x}
              y1={fromPos.y}
              x2={toPos.x}
              y2={toPos.y}
              active={from.status === "active" || to.status === "active"}
            />
          );
        })}

        {connectionPairs.map(([from, to], i) => (
          <DataParticle
            key={`particle-${i}`}
            from={getPosition(from)}
            to={getPosition(to)}
            index={i}
          />
        ))}
      </svg>

      {AGENTS.map((agent) => {
        const pos = getPosition(agent);
        return (
          <AgentNode
            key={agent.id}
            agent={agent}
            x={pos.x}
            y={pos.y}
            isSelected={selectedAgent?.id === agent.id}
            onClick={() => setSelectedAgent(selectedAgent?.id === agent.id ? null : agent)}
          />
        );
      })}

      <AnimatePresence>
        {selectedAgent && (
          <AgentDetailPanel
            agent={selectedAgent}
            position={getPosition(selectedAgent)}
            containerWidth={dimensions.width}
            onClose={() => setSelectedAgent(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function ConnectionLine({
  x1,
  y1,
  x2,
  y2,
  active,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  active: boolean;
}) {
  const id = `connection-${x1}-${y1}-${x2}-${y2}`;
  return (
    <g>
      <motion.line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={active ? "rgba(79,195,247,0.2)" : "rgba(79,195,247,0.06)"}
        strokeWidth={active ? 1.5 : 0.8}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{
          pathLength: 1,
          opacity: 1,
          stroke: active
            ? ["rgba(79,195,247,0.2)", "rgba(124,77,255,0.2)", "rgba(79,195,247,0.2)"]
            : "rgba(79,195,247,0.06)",
        }}
        transition={{
          pathLength: { duration: 1.5, delay: 0.3 },
          stroke: { duration: 3, repeat: Infinity },
        }}
        filter="url(#glow)"
      />
    </g>
  );
}

function DataParticle({
  from,
  to,
  index,
}: {
  from: { x: number; y: number };
  to: { x: number; y: number };
  index: number;
}) {
  return (
    <motion.circle
      r={3}
      fill="rgba(79,195,247,0.8)"
      filter="url(#glow)"
      initial={{ cx: from.x, cy: from.y }}
      animate={{
        cx: [from.x, to.x, from.x],
        cy: [from.y, to.y, from.y],
        opacity: [0, 1, 0],
      }}
      transition={{
        duration: 3 + index * 1.3,
        repeat: Infinity,
        delay: index * 0.7,
        ease: "easeInOut",
      }}
    />
  );
}

function AgentNode({
  agent,
  x,
  y,
  isSelected,
  onClick,
}: {
  agent: Agent;
  x: number;
  y: number;
  isSelected: boolean;
  onClick: () => void;
}) {
  const statusColors: Record<string, string> = {
    active: "#4FC3F7",
    processing: "#7C4DFF",
    idle: "#546E7A",
    error: "#FF1744",
  };

  const statusGlow: Record<string, string> = {
    active: "shadow-neon-blue",
    processing: "shadow-neon-purple",
    idle: "",
    error: "shadow-[#FF1744]",
  };

  const color = statusColors[agent.status];

  return (
    <motion.div
      className="absolute z-10 cursor-pointer"
      style={{ left: x, top: y, transform: "translate(-50%, -50%)" }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: isSelected ? 1.15 : 1,
        opacity: 1,
      }}
      whileHover={{ scale: 1.1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      onClick={onClick}
    >
      <div
        className={`relative w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center ${statusGlow[agent.status]}`}
        style={{
          background: `radial-gradient(circle at 30% 30%, ${color}33, transparent 70%)`,
        }}
      >
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ border: `1.5px solid ${color}40` }}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ border: `1px solid ${color}20` }}
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />

        <div
          className="relative w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center backdrop-blur-sm"
          style={{
            background: `linear-gradient(135deg, ${color}15, ${color}05)`,
            border: `1px solid ${color}30`,
          }}
        >
          <span
            className="text-lg md:text-xl"
            style={{ color }}
          >
            {agent.icon}
          </span>
        </div>

        {agent.status === "active" && (
          <motion.div
            className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-neon-cyan"
            animate={{ opacity: [0.5, 1, 0.5], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
        {agent.status === "processing" && (
          <motion.div
            className="absolute -top-1 -right-1 w-12 h-12 rounded-full border border-neon-purple/40"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        )}
      </div>

      <div className="text-center mt-2">
        <p className="text-[10px] md:text-xs font-mono text-neon-blue/80 tracking-[0.15em] whitespace-nowrap">
          {agent.name}
        </p>
      </div>
    </motion.div>
  );
}

function AgentDetailPanel({
  agent,
  position,
  containerWidth,
  onClose,
}: {
  agent: Agent;
  position: { x: number; y: number };
  containerWidth: number;
  onClose: () => void;
}) {
  const panelX = position.x > containerWidth / 2 ? position.x - 320 : position.x + 60;

  return (
    <motion.div
      className="absolute z-30 w-72 glass-panel p-4"
      style={{ left: Math.max(10, Math.min(panelX, containerWidth - 300)), top: position.y - 80 }}
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 20 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-white/30 hover:text-white/60 transition-colors text-lg"
      >
        ×
      </button>

      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl" style={{ color: agent.status === "active" ? "#4FC3F7" : agent.status === "processing" ? "#7C4DFF" : "#546E7A" }}>
          {agent.icon}
        </span>
        <div>
          <h3 className="text-sm font-mono text-white/90 tracking-wider">{agent.name}</h3>
          <p className="text-[10px] font-mono text-neon-blue/60">{agent.role}</p>
        </div>
      </div>

      <p className="text-xs text-white/50 mb-4 leading-relaxed">{agent.description}</p>

      <div className="space-y-2">
        {[
          { label: "Tasks", value: agent.metrics.tasksCompleted.toLocaleString(), color: "#4FC3F7" },
          { label: "Accuracy", value: `${agent.metrics.accuracy}%`, color: "#7C4DFF" },
          { label: "Latency", value: `${agent.metrics.latency}ms`, color: "#00E5FF" },
        ].map((metric) => (
          <div key={metric.label} className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-white/40">{metric.label}</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: metric.color }}
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min(100, (parseFloat(metric.value) / 15000) * 100)}%`,
                  }}
                  transition={{ duration: 1, delay: 0.3 }}
                />
              </div>
              <span className="text-xs font-mono text-white/70 w-16 text-right">{metric.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-white/5">
        <span className="text-[9px] font-mono text-white/20 uppercase tracking-[0.2em]">
          Status: <span className="text-neon-cyan">{agent.status.toUpperCase()}</span>
        </span>
      </div>
    </motion.div>
  );
}