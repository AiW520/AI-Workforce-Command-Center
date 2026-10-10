"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { GlassCard } from "@/components/core/GlassCard";
import { DemoDataNotice } from "@/components/core/DemoDataNotice";
import { CITIES as HEAT_NODES } from "@/lib/cities";
import { emitSceneSelection, subscribeSceneSelection } from "@/lib/scene-selection";

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
  const [selectedCity, setSelectedCity] = useState("sf");
  useEffect(() => subscribeSceneSelection((selection) => {
    if (selection.kind === "city" && HEAT_NODES.some((city) => city.id === selection.id)) {
      setSelectedCity(selection.id);
    }
  }), []);
  const city = HEAT_NODES.find((node) => node.id === selectedCity)!;

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
          dots.push({ x, y, opacity: 0.3 + ((x * 7 + y * 3) % 4) * 0.1 });
        }
      }
    }
    return dots;
  }, []);

  return (
    <div ref={containerRef}>
      <GlassCard className="p-4 md:p-5">
        <DemoDataNotice>城市规模与活动强度为原型静态样本。</DemoDataNotice>
        <div className="flex flex-wrap gap-3 items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-neon-cyan">◎</span>
            <h3 className="text-xs font-mono text-white/60 tracking-normal">
              GLOBAL AI ACTIVITY HEATMAP
            </h3>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-mono text-white/55">
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
              <g key={node.id} onClick={() => { setSelectedCity(node.id); emitSceneSelection({ kind: "city", id: node.id, source: "dom" }); }} style={{ cursor: "pointer" }}>
                <title>{`${node.city} · ${node.agents.toLocaleString()} demo agents`}</title>
                <circle cx={node.x} cy={node.y} r={2} fill="transparent" />
                {selectedCity === node.id && <circle cx={node.x} cy={node.y} r={2} fill="none" stroke="#FFB300" strokeWidth={0.4} />}
                {isInView && (
                  <>
                    <motion.circle
                      cx={node.x}
                      cy={node.y}
                      r={node.tier === 1 ? 4 : node.tier === 2 ? 2.8 : 1.8}
                      fill="url(#heatPulse)"
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 2 + (node.agents % 4) * 0.25, repeat: Infinity }}
                    />
                    <motion.circle
                      cx={node.x}
                      cy={node.y}
                      r={node.tier === 1 ? 0.6 : node.tier === 2 ? 0.45 : 0.3}
                      fill={node.tier === 1 ? "#4FC3F7" : node.tier === 2 ? "#7C4DFF" : "#546E7A"}
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{
                        duration: 1.5 + (node.intensity % 3) * 0.25,
                        repeat: Infinity,
                        delay: (node.x + node.y) % 2,
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
                className="absolute text-[11px] font-mono text-white/55 tracking-wide whitespace-nowrap"
                style={{
                  left: `${node.x}%`,
                  top: `${(node.y / 70) * 100}%`,
                  transform: "translate(-50%, -150%)",
                }}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 0.7 } : {}}
                transition={{ delay: 0.8 + (node.x % 4) * 0.1 }}
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
            { value: `${(HEAT_NODES.reduce((total, node) => total + node.agents, 0) / 1000).toFixed(1)}K`, label: "DEMO AGENTS" },
            { value: "98%", label: "SFO INTENSITY" },
            { value: "STATIC", label: "DATA SOURCE" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-[10px] md:text-xs font-mono font-bold text-neon-blue/70">
                {stat.value}
              </div>
              <div className="text-[11px] font-mono text-white/55 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </motion.div>
        <div className="mt-4 flex flex-col gap-2">
          <label htmlFor="city-selection" className="text-xs text-white/60">城市</label>
          <select id="city-selection" value={selectedCity} onChange={(event) => { setSelectedCity(event.target.value); emitSceneSelection({ kind: "city", id: event.target.value, source: "dom" }); }} className="w-full bg-[#111820] border border-white/20 rounded p-2 text-sm text-white">
            {HEAT_NODES.map((node) => <option key={node.id} value={node.id}>{node.city} · {node.country}</option>)}
          </select>
          <p aria-live="polite" className="text-xs text-white/60">{city.city} · {city.agents.toLocaleString()} 个演示 Agent · 活动强度 {city.intensity}% · Tier {city.tier}</p>
        </div>
      </GlassCard>
    </div>
  );
}
