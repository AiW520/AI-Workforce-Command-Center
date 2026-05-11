"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { DASHBOARD_METRICS, TASK_DISTRIBUTION, AGENTS } from "@/lib/data";
import { GlassCard } from "@/components/core/GlassCard";
import { AnimatedCounter } from "@/components/effects/AnimatedCounter";

export function CommandDashboard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const metrics = [
    {
      label: "ACTIVE AGENTS",
      rawValue: DASHBOARD_METRICS.activeAgents,
      unit: "AGENTS",
      color: "#4FC3F7",
      icon: "◈",
    },
    {
      label: "TASK QUEUE",
      rawValue: DASHBOARD_METRICS.tasksInQueue,
      unit: "PENDING",
      color: "#7C4DFF",
      icon: "◫",
    },
    {
      label: "COMPLETED TODAY",
      rawValue: DASHBOARD_METRICS.completedToday,
      unit: "DONE",
      color: "#00E5FF",
      icon: "◆",
    },
    {
      label: "SYSTEM HEALTH",
      rawValue: DASHBOARD_METRICS.systemHealth,
      unit: "%",
      color: "#76FF03",
      icon: "⬢",
      decimals: 1,
    },
    {
      label: "TOKEN USAGE",
      rawValue: DASHBOARD_METRICS.tokenUsage / 1000000,
      unit: "M TOKENS",
      color: "#FFB300",
      icon: "◇",
      decimals: 1,
    },
    {
      label: "SUCCESS RATE",
      rawValue: DASHBOARD_METRICS.successRate,
      unit: "%",
      color: "#4FC3F7",
      icon: "◎",
      decimals: 1,
    },
  ];

  return (
    <div ref={containerRef} className="w-full space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-cyan" />
            </span>
            <span className="text-[10px] font-mono text-neon-cyan tracking-[0.15em]">
              SYSTEM LIVE
            </span>
          </div>
          <span className="text-[10px] font-mono text-white/20">|</span>
          <span className="text-[10px] font-mono text-white/30">{time} UTC</span>
        </div>

        <div className="flex items-center gap-4">
          {["CPU: 32%", "MEM: 48%", "NET: 12Gbps"].map((stat) => (
            <span key={stat} className="text-[9px] font-mono text-white/20 hidden sm:block">
              {stat}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        {metrics.map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.08, duration: 0.5 }}
          >
            <GlassCard hover className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-mono text-white/30 tracking-[0.15em]">
                  {metric.label}
                </span>
                <span style={{ color: metric.color, fontSize: "0.75rem" }}>
                  {metric.icon}
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <AnimatedCounter
                  value={metric.rawValue}
                  decimals={metric.decimals ?? 0}
                  delay={i * 0.12}
                  duration={1.8}
                  className="text-2xl md:text-3xl font-mono font-bold tracking-tight"
                  style={{ color: metric.color }}
                />
                <span className="text-[9px] font-mono text-white/20">
                  {metric.unit}
                </span>
              </div>
              <div className="mt-2 h-0.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${metric.color}, ${metric.color}60)`,
                  }}
                  initial={{ width: 0 }}
                  animate={
                    isInView
                      ? {
                          width: `${Math.min(100, (metric.rawValue < 100 ? metric.rawValue : 85 + Math.random() * 15))}%`,
                        }
                      : {}
                  }
                  transition={{ delay: i * 0.1 + 0.5, duration: 1, ease: "easeOut" }}
                />
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-mono text-white/60 tracking-[0.2em]">
                TASK DISTRIBUTION 24H
              </h3>
              <span className="text-[9px] font-mono text-neon-blue/60">
                REAL-TIME
              </span>
            </div>

            <div className="relative h-48 md:h-56">
              <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(79,195,247,0.3)" />
                    <stop offset="50%" stopColor="rgba(124,77,255,0.1)" />
                    <stop offset="100%" stopColor="rgba(79,195,247,0)" />
                  </linearGradient>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#4FC3F7" />
                    <stop offset="50%" stopColor="#7C4DFF" />
                    <stop offset="100%" stopColor="#00E5FF" />
                  </linearGradient>
                </defs>

                {TASK_DISTRIBUTION.map((point, i, arr) => {
                  if (i === 0) return null;
                  const prev = arr[i - 1];
                  const x1 = ((i - 1) / (arr.length - 2)) * 600;
                  const x2 = (i / (arr.length - 2)) * 600;
                  const maxVal = Math.max(...arr.map((p) => p.value));
                  const y1 = 200 - (prev.value / maxVal) * 160;
                  const y2 = 200 - (point.value / maxVal) * 160;

                  return (
                    <motion.line
                      key={i}
                      x1={x1}
                      y1={y2}
                      x2={x2}
                      y2={y2}
                      stroke="url(#lineGrad)"
                      strokeWidth="2"
                      initial={{ pathLength: 0 }}
                      animate={isInView ? { pathLength: 1 } : {}}
                      transition={{ delay: 1 + i * 0.05, duration: 0.8 }}
                    />
                  );
                })}

                <motion.path
                  d={`M 0 ${200 - (TASK_DISTRIBUTION[0].value / 1000) * 160} ${TASK_DISTRIBUTION.map(
                    (p, i) =>
                      `L ${(i / (TASK_DISTRIBUTION.length - 1)) * 600} ${200 - (p.value / 1000) * 160}`
                  ).join(" ")} L 600 200 L 0 200 Z`}
                  fill="url(#areaGrad)"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ delay: 1.5, duration: 0.8 }}
                />
              </svg>

              <div className="flex justify-between mt-2">
                {["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"].map((t) => (
                  <span key={t} className="text-[8px] font-mono text-white/15">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <GlassCard>
            <h3 className="text-xs font-mono text-white/60 tracking-[0.2em] mb-4">
              AGENT STATUS
            </h3>
            <div className="space-y-3">
              {AGENTS.map((agent, i) => {
                const statusColor =
                  agent.status === "active"
                    ? "#4FC3F7"
                    : agent.status === "processing"
                    ? "#7C4DFF"
                    : agent.status === "error"
                    ? "#FF1744"
                    : "#546E7A";
                return (
                  <motion.div
                    key={agent.id}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 1 + i * 0.08 }}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span style={{ color: statusColor }}>{agent.icon}</span>
                      <span className="text-[10px] font-mono text-white/60 truncate">
                        {agent.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <motion.span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: statusColor }}
                        animate={
                          agent.status === "active"
                            ? { opacity: [0.5, 1, 0.5] }
                            : {}
                        }
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                      <span
                        className="text-[8px] font-mono"
                        style={{ color: statusColor }}
                      >
                        {agent.status.toUpperCase()}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t border-white/5">
              <div className="flex items-center justify-between text-[9px] font-mono text-white/20">
                <span>UPTIME</span>
                <span className="text-neon-cyan">{DASHBOARD_METRICS.uptime}%</span>
              </div>
              <div className="mt-1.5 h-0.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-neon-cyan to-neon-blue"
                  initial={{ width: 0 }}
                  animate={isInView ? { width: `${DASHBOARD_METRICS.uptime}%` } : {}}
                  transition={{ delay: 1.5, duration: 1 }}
                />
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      <motion.div
        className="h-px w-full bg-gradient-to-r from-transparent via-neon-blue/10 to-transparent"
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ delay: 1.8, duration: 0.6 }}
      />
    </div>
  );
}