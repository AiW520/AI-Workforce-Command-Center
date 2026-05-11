"use client";

import { useMemo, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { GlassCard } from "@/components/core/GlassCard";

interface HeatNode {
  id: string;
  city: string;
  country: string;
  x: number;
  y: number;
  intensity: number;
  agents: number;
  tier: 1 | 2 | 3;
}

const HEAT_NODES: HeatNode[] = [
  { id: "sf", city: "San Francisco", country: "USA", x: 10, y: 32, intensity: 98, agents: 12470, tier: 1 },
  { id: "ny", city: "New York", country: "USA", x: 24, y: 30, intensity: 92, agents: 9840, tier: 1 },
  { id: "lon", city: "London", country: "UK", x: 46, y: 22, intensity: 88, agents: 7650, tier: 1 },
  { id: "ber", city: "Berlin", country: "Germany", x: 50, y: 20, intensity: 72, agents: 4320, tier: 2 },
  { id: "tko", city: "Tokyo", country: "Japan", x: 84, y: 32, intensity: 85, agents: 6890, tier: 1 },
  { id: "sgp", city: "Singapore", country: "Singapore", x: 74, y: 48, intensity: 76, agents: 5210, tier: 2 },
  { id: "sha", city: "Shanghai", country: "China", x: 78, y: 36, intensity: 90, agents: 8950, tier: 1 },
  { id: "bj", city: "Beijing", country: "China", x: 76, y: 28, intensity: 82, agents: 6430, tier: 1 },
  { id: "blr", city: "Bangalore", country: "India", x: 68, y: 44, intensity: 78, agents: 5980, tier: 2 },
  { id: "syd", city: "Sydney", country: "Australia", x: 88, y: 58, intensity: 45, agents: 2100, tier: 3 },
  { id: "tor", city: "Toronto", country: "Canada", x: 22, y: 26, intensity: 65, agents: 3890, tier: 2 },
  { id: "par", city: "Paris", country: "France", x: 48, y: 24, intensity: 60, agents: 3420, tier: 2 },
  { id: "dub", city: "Dubai", country: "UAE", x: 60, y: 40, intensity: 55, agents: 2890, tier: 2 },
  { id: "sel", city: "Seoul", country: "Korea", x: 82, y: 30, intensity: 70, agents: 4560, tier: 2 },
  { id: "ams", city: "Amsterdam", country: "Netherlands", x: 49, y: 19, intensity: 42, agents: 1870, tier: 3 },
  { id: "sp", city: "São Paulo", country: "Brazil", x: 32, y: 62, intensity: 38, agents: 1520, tier: 3 },
  { id: "nbo", city: "Nairobi", country: "Kenya", x: 56, y: 56, intensity: 30, agents: 890, tier: 3 },
  { id: "tlv", city: "Tel Aviv", country: "Israel", x: 55, y: 38, intensity: 52, agents: 2340, tier: 2 },
  { id: "ist", city: "Istanbul", country: "Turkey", x: 53, y: 30, intensity: 40, agents: 1640, tier: 3 },
  { id: "mex", city: "Mexico City", country: "Mexico", x: 18, y: 44, intensity: 35, agents: 1250, tier: 3 },
];

function interpolatePoints(x1: number, y1: number, x2: number, y2: number, steps: number) {
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    pts.push({ x: x1 + (x2 - x1) * t, y: y1 + (y2 - y1) * t });
  }
  return pts;
}

export function GlobalHeatMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  // Generate simplified continent outlines as path strings
  const gridDots = useMemo(() => {
    const dots: { x: number; y: number; opacity: number }[] = [];
    for (let x = 5; x <= 95; x += 2.5) {
      for (let y = 15; y <= 68; y += 2.5) {
        // Simple landmass check
        const land = (
          (x > 8 && x < 32 && y > 24 && y < 52) ||  // Americas
          (x > 44 && x < 58 && y > 16 && y < 36) ||  // Europe
          (x > 52 && x < 62 && y > 36 && y < 44) ||  // Middle East
          (x > 64 && x < 72 && y > 36 && y < 50) ||  // India
          (x > 72 && x < 90 && y > 26 && y < 48) ||  // East Asia
          (x > 84 && x < 92 && y > 52 && y < 64) ||  // Australia
          (x > 50 && x < 62 && y > 50 && y < 62) ||  // Africa
          (x > 16 && x < 24 && y > 22 && y < 28)     // Canada
        );
        if (land) {
          dots.push({ x, y, opacity: 0.3 + Math.random() * 0.4 });
        }
      }
    }
    return dots;
  }, []);

  return (
    <div ref={containerRef}>
      <GlassCard className="p-4 md:p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-neon-cyan">◎</span>
            <h3 className="text-xs font-mono text-white/60 tracking-[0.15em]">
              GLOBAL AI ACTIVITY HEATMAP
            </h3>
          </div>
          <div className="flex items-center gap-3 text-[8px] font-mono text-white/15">
            {[
              { color: "#4FC3F7", label: "Tier-1" },
              { color: "#7C4DFF", label: "Tier-2" },
              { color: "#546E7A", label: "Tier-3" },
            ].map((item) => (
              <span key={item.label} className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                {item.label}
              </span>
            ))}
          </div>
        </div>

        {/* Map */}
        <div className="relative w-full aspect-[2/1] max-h-[320px] overflow-hidden rounded-lg bg-black/20">
          {/* Grid dots background */}
          <svg viewBox="0 0 100 70" preserveAspectRatio="xMidYMid meet" className="w-full h-full">
            <defs>
              <filter id="heatGlow">
                <feGaussianBlur stdDeviation="0.4" />
              </filter>
              <radialGradient id="heatPulse" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(79,195,247,0.6)" />
                <stop offset="100%" stopColor="rgba(79,195,247,0)" />
              </radialGradient>
            </defs>

            {/* Grid dots */}
            {gridDots.map((dot, i) => (
              <motion.circle
                key={i}
                cx={dot.x}
                cy={dot.y}
                r={0.15}
                fill="rgba(79,195,247,0.3)"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: dot.opacity * 0.7 } : {}}
                transition={{ delay: i * 0.0005 }}
              />
            ))}

            {/* Glow circles for nodes */}
            {HEAT_NODES.map((node) => (
              <g key={node.id}>
                {isInView && (
                  <>
                    <motion.circle
                      cx={node.x}
                      cy={node.y}
                      r={node.tier === 1 ? 4 : node.tier === 2 ? 2.8 : 1.8}
                      fill="url(#heatPulse)"
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 2 + Math.random() * 2, repeat: Infinity }}
                    />
                    <motion.circle
                      cx={node.x}
                      cy={node.y}
                      r={node.tier === 1 ? 0.6 : node.tier === 2 ? 0.45 : 0.3}
                      fill={node.tier === 1 ? "#4FC3F7" : node.tier === 2 ? "#7C4DFF" : "#546E7A"}
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{
                        duration: 1.5 + Math.random() * 1.5,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                      }}
                      filter="url(#heatGlow)"
                    />
                  </>
                )}
              </g>
            ))}

            {/* Connection lines between tier-1 cities */}
            {isInView &&
              HEAT_NODES.filter((n) => n.tier === 1).map((node, i, arr) => {
                return arr.slice(i + 1).map((target, j) => (
                  <motion.line
                    key={`${node.id}-${target.id}`}
                    x1={node.x}
                    y1={node.y}
                    x2={target.x}
                    y2={target.y}
                    stroke="rgba(79,195,247,0.08)"
                    strokeWidth="0.3"
                    strokeDasharray="1 3"
                    initial={{ pathLength: 0 }}
                    animate={isInView ? { pathLength: 1 } : {}}
                    transition={{ delay: (i + j) * 0.1, duration: 1.5 }}
                  />
                ));
              })}
          </svg>

          {/* Node labels on hover areas - rendered as positioned divs */}
          <motion.div className="absolute inset-0 pointer-events-none">
            {HEAT_NODES.filter((n) => n.tier <= 2).map((node) => (
              <motion.div
                key={node.id}
                className="absolute text-[7px] font-mono text-white/15 tracking-wide whitespace-nowrap"
                style={{
                  left: `${node.x}%`,
                  top: `${(node.y / 70) * 100}%`,
                  transform: "translate(-50%, -150%)",
                }}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 0.7 } : {}}
                transition={{ delay: 0.8 + Math.random() * 0.4 }}
              >
                {node.city}
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Stats bar */}
        <motion.div
          className="mt-4 grid grid-cols-4 gap-2"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
        >
          {[
            { value: "20", label: "CITIES" },
            { value: "76.5K", label: "TOTAL AGENTS" },
            { value: "98%", label: "SFO INTENSITY" },
            { value: "5.2M", label: "API CALLS/DAY" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-[10px] md:text-xs font-mono font-bold text-neon-blue/70">
                {stat.value}
              </div>
              <div className="text-[7px] font-mono text-white/15 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </GlassCard>
    </div>
  );
}