"use client";

import { MotionConfig, motion, useReducedMotion, useScroll } from "framer-motion";
import { Navigation } from "@/components/core/Navigation";
import { SectionDivider } from "@/components/core/SectionDivider";
import { AnimatedTitle } from "@/components/core/AnimatedTitle";
import { Footer } from "@/components/core/Footer";
import { HeroSection } from "@/components/hero/HeroSection";
import { CivilizationTimeline } from "@/components/timeline/CivilizationTimeline";
import { AgentOrchestrator } from "@/components/agents/AgentOrchestrator";
import { SkillTreeUniverse } from "@/components/skills/SkillTreeUniverse";
import { CITIES } from "@/lib/cities";
import { emitSceneSelection } from "@/lib/scene-selection";
import { InteractiveQuerySystem } from "@/components/interactive/QueryInterface";
import { CommandDashboard } from "@/components/dashboard/CommandDashboard";
import { AgentLogTerminal } from "@/components/dashboard/AgentLogTerminal";
import { GlobalHeatMap } from "@/components/monitoring/GlobalHeatMap";

function MainContent() {
  const { scrollYProgress } = useScroll();
  const reducedMotion = useReducedMotion();

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-neon-blue via-neon-purple to-neon-cyan z-[200] origin-left"
        style={{ scaleX: scrollYProgress }}
        aria-hidden="true"
      />
      <Navigation />

      <a href="#main-content" className="skip-link">跳至主要内容</a>
      <main id="main-content" tabIndex={-1} className="nexus-workspace relative bg-[#0b1518]">
        <HeroSection />

        <SectionDivider label="CIVILIZATION TIMELINE" />
        <section id="timeline" className="relative">
          <div className="absolute inset-0 bg-mesh opacity-30 pointer-events-none" />
          <div className="relative max-w-7xl mx-auto px-4 pb-8">
            <motion.div className="pt-8 md:pt-16" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: "-100px" }}>
              <AnimatedTitle title="文明时间线" subtitle="从智能辅助到人机共生的四个阶段" />
            </motion.div>
          </div>
          <CivilizationTimeline />
        </section>

        <SectionDivider label="AGENT GALAXY" />
        <section id="agents" className="relative py-16 md:py-24">
          <div className="absolute inset-0 bg-mesh opacity-40" />
          <div className="absolute inset-0 grid-bg opacity-15" />
          <div className="relative max-w-7xl mx-auto px-4 md:px-8">
            <AnimatedTitle title="智能体协作网络" subtitle="六个角色，一张协作网络" />
            <motion.div className="mt-8 md:mt-16 glass-panel p-4 md:p-6" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.8 }}>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4 text-[10px] font-mono text-white/45 tracking-[0.15em]">
                <div className="flex items-center gap-2"><span>◎</span><span>DEMO AGENT GALAXY · NEURAL NETWORK</span></div>
                <div className="flex items-center gap-3"><span>STATIC SNAPSHOT</span><span className="text-white/10">|</span><span>6 AGENTS</span></div>
              </div>
              <AgentOrchestrator />
              <div className="flex flex-wrap justify-center gap-4 md:gap-8 mt-4">
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
            <AnimatedTitle title="全球 AI 活动" subtitle="20 座核心城市的演示活动档案" />
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
            <AnimatedTitle title="技能进化网络" subtitle="连接基础能力、工程实践与专业方向" />
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
            <AnimatedTitle title="城市档案" subtitle="城市、活动强度与智能体规模" />
            <motion.div className="mt-8 md:mt-14" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.8 }}>
              <p className="text-sm text-white/60 mb-4">演示城市档案 · 建筑高度映射样本活动强度，空间布局为程序化展示。</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2">
                {CITIES.map((city) => <button type="button" key={city.id} onClick={() => { emitSceneSelection({ kind: "city", id: city.id, source: "city-directory" }); document.getElementById("hero")?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" }); }} className="text-left border-b border-white/10 py-3 hover:border-[#F6BA61]">
                  <span className="block text-sm text-white/85">{city.city}</span>
                  <span className="block text-xs text-white/50 mt-1">{city.country} · {city.agents.toLocaleString()} 演示 Agent</span>
                </button>)}
              </div>
            </motion.div>
          </div>
        </section>

        <SectionDivider label="AI ORACLE" />
        <section id="query" className="relative py-16 md:py-24">
          <div className="absolute inset-0 bg-mesh opacity-40" />
          <div className="absolute inset-0 grid-bg opacity-12" />
          <div className="relative max-w-4xl mx-auto px-4 md:px-8">
            <AnimatedTitle title="知识问答" subtitle="职业、技能与协作架构的预置研究主题" />
            <motion.div className="mt-8 md:mt-14" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.8 }}>
              <InteractiveQuerySystem />
            </motion.div>
          </div>
        </section>

        <SectionDivider label="AI COMMAND CENTER" />
        <section id="dashboard" className="relative py-16 md:py-24">
          <div className="absolute inset-0 bg-mesh opacity-40" />
          <div className="absolute inset-0 grid-bg opacity-12" />
          <div className="relative max-w-7xl mx-auto px-4 md:px-8">
            <AnimatedTitle title="企业 AI 指挥中心" subtitle="任务、资源与智能体状态的演示快照" />
            <motion.div className="mt-8 md:mt-14 space-y-6" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.8 }}>
              <CommandDashboard />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <motion.div className="lg:col-span-2" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
                  <AgentLogTerminal />
                </motion.div>
                <motion.div className="glass-panel p-4 flex flex-col items-center justify-center text-center space-y-3" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 }}>
                  <div className="relative">
                    <motion.div className="w-16 h-16 rounded-full border-2 border-neon-cyan/20 flex items-center justify-center" animate={reducedMotion ? undefined : { rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}>
                      <span className="text-neon-cyan text-xl">◈</span>
                    </motion.div>
                    <motion.div className="absolute inset-0 rounded-full border border-neon-purple/15" animate={reducedMotion ? undefined : { scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 2, repeat: Infinity }} />
                  </div>
                  <div>
                    <p className="text-xs font-mono text-white/40 tracking-[0.15em]">NEXUS OS v4.0</p>
                    <p className="text-[10px] font-mono text-neon-cyan/60 mt-1">DEMO SNAPSHOT</p>
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
            <motion.div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-[10px] font-mono text-white/45" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.8 }}>
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
  return (
    <MotionConfig reducedMotion="user">
      <noscript><style>{`[style*="opacity:0"], [style*="opacity: 0"] { opacity: 1 !important; transform: none !important; filter: none !important; } .timeline-desktop { display: none !important; } .timeline-mobile-list { display: block !important; }`}</style></noscript>
      <MainContent />
    </MotionConfig>
  );
}
