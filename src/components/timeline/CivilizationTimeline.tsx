"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface Era {
  year: string;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  glowColor: string;
  metrics: { label: string; value: string }[];
}

const ERAS: Era[] = [
  {
    year: "2025",
    title: "AI Assistant Era",
    subtitle: "智能辅助时代",
    description: "AI 成为个人效率工具，Copilot 嵌入开发工作流，Prompt Engineering 成为核心技能。企业开始部署 AI 辅助系统。",
    color: "#4FC3F7",
    glowColor: "rgba(79,195,247,0.3)",
    metrics: [
      { label: "AI Adoption", value: "34%" },
      { label: "Agent Autonomy", value: "L2" },
      { label: "Human-AI Ratio", value: "10:1" },
    ],
  },
  {
    year: "2027",
    title: "Autonomous Agent Era",
    subtitle: "自主智能体时代",
    description: "Multi-Agent 系统兴起，AI 能够自主完成复杂工作流。RAG + Tool Calling 成为标准架构，Agent 开始独立执行企业任务。",
    color: "#00E5FF",
    glowColor: "rgba(0,229,255,0.3)",
    metrics: [
      { label: "AI Adoption", value: "62%" },
      { label: "Agent Autonomy", value: "L3" },
      { label: "Human-AI Ratio", value: "5:1" },
    ],
  },
  {
    year: "2030",
    title: "AI Enterprise Society",
    subtitle: "AI 企业社会",
    description: "AI Agent 成为企业核心劳动力，人类转向战略决策。AI 驱动的企业操作系统取代传统 ERP，全球 AI 经济成型。",
    color: "#7C4DFF",
    glowColor: "rgba(124,77,255,0.3)",
    metrics: [
      { label: "AI Adoption", value: "87%" },
      { label: "Agent Autonomy", value: "L4" },
      { label: "Human-AI Ratio", value: "1:3" },
    ],
  },
  {
    year: "2035",
    title: "Human × AI Civilization",
    subtitle: "人机协作文明",
    description: "AI 与人类深度共生，形成全新的数字文明形态。AI 不再是被使用的工具，而是文明的共同构建者与协作者。",
    color: "#B388FF",
    glowColor: "rgba(179,136,255,0.3)",
    metrics: [
      { label: "AI Adoption", value: "99%" },
      { label: "Agent Autonomy", value: "L5" },
      { label: "Human-AI Ratio", value: "1:50" },
    ],
  },
];

export function CivilizationTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ height: `${ERAS.length * 100}vh` }}
    >
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        {/* Background glow changing with era */}
        {ERAS.map((era, i) => {
          const eraStart = i / ERAS.length;
          const eraEnd = (i + 1) / ERAS.length;
          const glowOpacity = useTransform(
            scrollYProgress,
            [eraStart, eraStart + 0.02, eraEnd - 0.02, eraEnd],
            [0, 1, 1, 0]
          );
          return (
            <motion.div
              key={era.year}
              className="absolute inset-0 transition-colors duration-500"
              style={{
                background: `radial-gradient(ellipse at 50% 50%, ${era.glowColor}, transparent 70%)`,
                opacity: glowOpacity,
              }}
            />
          );
        })}

        {/* Grid background */}
        <div className="absolute inset-0 grid-bg opacity-15" />

        {/* Center timeline line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-neon-blue/20 to-transparent" />

        <div className="relative w-full max-w-6xl mx-auto px-4 md:px-8">
          <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-full">
            {/* Progress indicator on timeline */}
            <motion.div
              className="absolute -top-8 left-1/2 -translate-x-1/2 z-30"
              style={{
                top: useTransform(scrollYProgress, [0, 1], ["5%", "95%"]),
              }}
            >
              <div className="relative flex items-center justify-center">
                <motion.div
                  className="absolute w-8 h-8 rounded-full bg-neon-blue/20 blur-xl"
                  animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.6, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <div className="relative w-4 h-4 rounded-full bg-neon-blue border-2 border-neon-cyan shadow-neon-blue z-10" />
              </div>
            </motion.div>

            {ERAS.map((era, i) => {
              const isLeft = i % 2 === 0;
              const eraStart = i / ERAS.length;
              const eraEnd = (i + 1) / ERAS.length;
              const eraMid = (eraStart + eraEnd) / 2;

              const opacity = useTransform(
                scrollYProgress,
                [eraStart, eraStart + 0.05, eraEnd - 0.05, eraEnd],
                [0.15, 1, 1, 0.15]
              );
              const scale = useTransform(
                scrollYProgress,
                [eraStart, eraStart + 0.05, eraEnd - 0.05, eraEnd],
                [0.85, 1, 1, 0.85]
              );
              const x = useTransform(
                scrollYProgress,
                [eraStart, eraMid, eraEnd],
                [isLeft ? -30 : 30, 0, isLeft ? -30 : 30]
              );
              const filter = useTransform(
                scrollYProgress,
                [eraStart, eraStart + 0.05, eraEnd - 0.05, eraEnd],
                ["blur(3px)", "blur(0px)", "blur(0px)", "blur(3px)"]
              );

              return (
                <motion.div
                  key={era.year}
                  className={cn(
                    "absolute top-1/2 -translate-y-1/2 w-full max-w-md",
                    isLeft ? "left-0 text-right" : "right-0 text-left"
                  )}
                  style={{
                    top: useTransform(
                      scrollYProgress,
                      [eraStart, eraEnd],
                      ["0%", "100%"]
                    ),
                    opacity,
                    scale,
                    x,
                    filter,
                    transform: isLeft
                      ? undefined
                      : undefined,
                  }}
                >
                  <div
                    className={cn(
                      "glass-panel p-5 md:p-6",
                      isLeft ? "mr-12 md:mr-16" : "ml-12 md:ml-16"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="text-2xl md:text-3xl font-mono font-bold tracking-wider"
                        style={{ color: era.color, textShadow: `0 0 20px ${era.glowColor}` }}
                      >
                        {era.year}
                      </span>
                      <div
                        className="h-px flex-1"
                        style={{
                          background: `linear-gradient(${isLeft ? "270deg" : "90deg"}, ${era.color}30, transparent)`,
                        }}
                      />
                    </div>
                    <h3 className="text-sm md:text-base font-mono text-white/90 tracking-[0.1em] mb-1">
                      {era.title}
                    </h3>
                    <p className="text-[10px] md:text-xs font-mono text-neon-blue/60 mb-3">
                      {era.subtitle}
                    </p>
                    <p className="text-[11px] md:text-xs text-white/40 leading-relaxed mb-3">
                      {era.description}
                    </p>
                    <div className={cn("flex gap-3", isLeft ? "justify-end" : "justify-start")}>
                      {era.metrics.map((m) => (
                        <div key={m.label} className="text-center">
                          <div
                            className="text-xs md:text-sm font-mono font-bold"
                            style={{ color: era.color }}
                          >
                            {m.value}
                          </div>
                          <div className="text-[8px] font-mono text-white/20 mt-0.5">
                            {m.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Connector dot on timeline */}
                  <div
                    className={cn(
                      "absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2",
                      isLeft ? "right-0" : "left-0"
                    )}
                    style={{
                      backgroundColor: era.color,
                      borderColor: era.color,
                      boxShadow: `0 0 15px ${era.glowColor}`,
                      [isLeft ? "right" : "left"]: isLeft ? "-5px" : "-5px",
                    }}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Year counter */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 glass-panel-light px-6 py-2 z-30"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-4">
            {ERAS.map((era) => (
              <span
                key={era.year}
                className="text-[10px] font-mono text-white/30"
              >
                {era.year}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}