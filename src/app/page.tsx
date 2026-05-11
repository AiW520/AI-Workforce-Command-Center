"use client";

import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Navigation } from "@/components/core/Navigation";
import { SectionDivider } from "@/components/core/SectionDivider";
import { AnimatedTitle } from "@/components/core/AnimatedTitle";
import { Footer } from "@/components/core/Footer";
import { BootSequence } from "@/components/core/BootSequence";
import { HeroSection } from "@/components/hero/HeroSection";
import { CivilizationTimeline } from "@/components/timeline/CivilizationTimeline";
import { AgentOrchestrator } from "@/components/agents/AgentOrchestrator";
import { SkillTreeUniverse } from "@/components/skills/SkillTreeUniverse";
import { AICitySystem } from "@/components/city/AICitySystem";
import { InteractiveQuerySystem } from "@/components/interactive/QueryInterface";
import { CommandDashboard } from "@/components/dashboard/CommandDashboard";
import { AgentLogTerminal } from "@/components/dashboard/AgentLogTerminal";
import { GlobalHeatMap } from "@/components/monitoring/GlobalHeatMap";
import { CursorTrail } from "@/components/effects/CursorTrail";

function MainContent() {
  const { scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-neon-blue via-neon-purple to-neon-cyan z-[200] origin-left"
        style={{ scaleX: progressWidth }}
      />
      <CursorTrail />
      <Navigation />

      <main className="relative bg-black">
        <HeroSection />

        <SectionDivider label="CIVILIZATION TIMELINE" />
        <section id="timeline" className="relative">
          <div className="absolute inset-0 bg-mesh opacity-30 pointer-events-none" />
          <div className="relative max-w-7xl mx-auto px-4 pb-8">
            <motion.div className="pt-8 md:pt-16" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: "-100px" }}>
              <AnimatedTitle title="AI Civilization Timeline" subtitle="从 AI 辅助到人机共生 · 见证数字文明演进" />
            </motion.div>
          </div>
          <CivilizationTimeline />
        </section>

        <SectionDivider label="AGENT GALAXY" />
        <section id="agents" className="relative py-16 md:py-24">
          <div className="absolute inset-0 bg-mesh opacity-40" />
          <div className="absolute inset-0 grid-bg opacity-15" />
          <div className="absolute top-1/3 -left-20 w-96 h-96 bg-neon-purple/[0.03] rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-neon-blue/[0.03] rounded-full blur-[80px]" />
          <div className="relative max-w-7xl mx-auto px-4 md:px-8">
            <AnimatedTitle title="AI Agent Galaxy" subtitle="多智能体协作宇宙 · 星际网络 · 实时推理 · 数据交换" />
            <motion.div className="mt-8 md:mt-16 glass-panel p-4 md:p-6" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.8 }}>
              <div className="flex items-center justify-between mb-4 text-[10px] font-mono text-white/15 tracking-[0.15em]">
                <div className="flex items-center gap-2"><span>◎</span><span>LIVE AGENT GALAXY · NEURAL NETWORK</span></div>
                <div className="flex items-center gap-3"><span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" />REALTIME</span><span className="text-white/10">|</span><span>6 NODES · 10 CONNECTIONS</span></div>
              </div>
              <AgentOrchestrator />
              <div className="flex justify-center gap-8 mt-4">
                {[{ color: "#4FC3F7", label: "ACTIVE" }, { color: "#7C4DFF", label: "PROCESSING" }, { color: "#546E7A", label: "IDLE" }].map((item) => (
                  <div key={item.label} className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color, boxShadow: `0 0 6px ${item.color}40` }} /><span className="text-[9px] font-mono text-white/15">{item.label}</span></div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <SectionDivider label="GLOBAL AI ACTIVITY" />
        <section id="heatmap" className="relative py-12 md:py-20">
          <div className="absolute inset-0 bg-mesh opacity-30" />
          <div className="relative max-w-7xl mx-auto px-4 md:px-8">
            <AnimatedTitle title="Global AI Activity Map" subtitle="世界 20 个 AI 核心城市 · 实时智能体分布 · 数据流密度" />
            <motion.div className="mt-8 md:mt-14" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.8 }}>
              <GlobalHeatMap />
            </motion.div>
          </div>
        </section>

        <SectionDivider label="SKILL EVOLUTION" />
        <section id="skills" className="relative py-16 md:py-24">
          <div className="absolute inset-0 bg-mesh opacity-40" />
          <div className="absolute inset-0 grid-bg-sm opacity-10" />
          <div className="relative max-w-7xl mx-auto px-4 md:px-8">
            <AnimatedTitle title="Human × AI Skill Evolution" subtitle="未来 AI 工程师能力进化树 · 动态技能网络 · 能量流动" />
            <motion.div className="mt-8 md:mt-16 glass-panel p-4 md:p-6" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.8 }}>
              <div className="flex items-center gap-2 mb-4 text-[10px] font-mono text-white/15 tracking-[0.12em]"><span>⬡</span><span>SKILL NETWORK · ENERGY FLOW ACTIVE</span></div>
              <SkillTreeUniverse />
            </motion.div>
          </div>
        </section>

        <SectionDivider label="AI CIVILIZATION CITY" />
        <section id="city" className="relative py-12 md:py-20">
          <div className="absolute inset-0 bg-mesh opacity-30" />
          <div className="relative max-w-7xl mx-auto px-4 md:px-8">
            <AnimatedTitle title="Nexus AI City" subtitle="未来 AI 数据城市 · 建筑间数据流动 · 智能基础设施" />
            <motion.div className="mt-8 md:mt-14 glass-panel overflow-hidden p-0" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.8 }}>
              <AICitySystem />
            </motion.div>
          </div>
        </section>

        <SectionDivider label="AI ORACLE" />
        <section id="query" className="relative py-16 md:py-24">
          <div className="absolute inset-0 bg-mesh opacity-40" />
          <div className="absolute inset-0 grid-bg opacity-12" />
          <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-neon-blue/[0.02] rounded-full blur-[80px]" />
          <div className="relative max-w-4xl mx-auto px-4 md:px-8">
            <AnimatedTitle title="AI Oracle Interface" subtitle="向 AI 文明提问 · 动态推理可视化 · 知识网络生成" />
            <motion.div className="mt-8 md:mt-14" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.8 }}>
              <InteractiveQuerySystem />
            </motion.div>
          </div>
        </section>

        <SectionDivider label="AI COMMAND CENTER" />
        <section id="dashboard" className="relative py-16 md:py-24">
          <div className="absolute inset-0 bg-mesh opacity-40" />
          <div className="absolute inset-0 grid-bg opacity-12" />
          <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-neon-purple/[0.03] rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/3 w-[350px] h-[350px] bg-neon-blue/[0.03] rounded-full blur-[80px]" />
          <div className="relative max-w-7xl mx-auto px-4 md:px-8">
            <AnimatedTitle title="Enterprise AI Command Center" subtitle="军事级 AI 控制台 · 实时监控 · 智能决策 · 任务调度" />
            <motion.div className="mt-8 md:mt-14 space-y-6" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.8 }}>
              <CommandDashboard />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <motion.div className="lg:col-span-2" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
                  <AgentLogTerminal />
                </motion.div>
                <motion.div className="glass-panel p-4 flex flex-col items-center justify-center text-center space-y-3" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 }}>
                  <div className="relative">
                    <motion.div className="w-16 h-16 rounded-full border-2 border-neon-cyan/20 flex items-center justify-center" animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}>
                      <span className="text-neon-cyan text-xl">◈</span>
                    </motion.div>
                    <motion.div className="absolute inset-0 rounded-full border border-neon-purple/15" animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 2, repeat: Infinity }} />
                  </div>
                  <div>
                    <p className="text-xs font-mono text-white/40 tracking-[0.15em]">NEXUS OS v4.0</p>
                    <p className="text-[10px] font-mono text-neon-cyan/40 mt-1">ALL SYSTEMS OPERATIONAL</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[{ label: "UPTIME", value: "99.99%" }, { label: "THROUGHPUT", value: "124/min" }].map((s) => (
                      <div key={s.label} className="text-center"><div className="text-[8px] font-mono text-white/15">{s.label}</div><div className="text-[11px] font-mono text-neon-blue/60 mt-0.5">{s.value}</div></div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        <SectionDivider />
        <motion.div className="relative py-16 md:py-24 text-center px-4" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <div className="absolute inset-0 bg-mesh opacity-40" />
          <div className="relative max-w-3xl mx-auto">
            <motion.p className="text-xl md:text-3xl font-light text-white/50 tracking-[0.1em] leading-relaxed" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
              我们不是在构建网页。<br />我们在构建<span className="text-gradient-neon font-normal"> 未来 AI 文明的操作系统 </span>。
            </motion.p>
            <motion.div className="mt-8 flex items-center justify-center gap-3 text-[10px] font-mono text-white/15" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.8 }}>
              <span>NEXUS AI CIVILIZATION</span><span className="w-px h-3 bg-white/10" /><span>OS v4.0</span><span className="w-px h-3 bg-white/10" />
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-neon-cyan" />ALL SYSTEMS NOMINAL</span>
            </motion.div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </>
  );
}

export default function HomePage() {
  const [bootComplete, setBootComplete] = useState(false);

  return (
    <>
      <BootSequence onComplete={() => setBootComplete(true)} />
      {bootComplete && <MainContent />}
    </>
  );
}