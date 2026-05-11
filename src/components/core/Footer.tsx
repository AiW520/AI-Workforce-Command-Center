"use client";

import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer className="relative py-16 md:py-24 border-t border-neon-blue/[0.04]">
      <div className="absolute inset-0 bg-mesh opacity-30" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
          <div>
            <motion.div
              className="flex items-center gap-2 mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <span className="text-neon-blue text-xl">◈</span>
              <span className="text-sm font-mono text-neon-blue/70 tracking-[0.2em]">
                NEXUS
              </span>
            </motion.div>
            <motion.p
              className="text-xs text-white/25 leading-relaxed max-w-xs"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
            >
              NEXUS AI CIVILIZATION — 面向 2035 年的人类与 AI 协作文明操作系统。
              多智能体 · 自主协作 · 数字文明。
            </motion.p>
          </div>

          <div>
            <h4 className="text-[10px] font-mono text-white/20 tracking-[0.3em] uppercase mb-4">
              Civilization Sections
            </h4>
            <div className="space-y-2">
              {[
                "AI Civilization Timeline",
                "Agent Galaxy Network",
                "Skill Evolution Tree",
                "Nexus AI City",
                "AI Oracle Interface",
                "Enterprise Command Center",
              ].map((section, i) => (
                <motion.p
                  key={section}
                  className="text-xs text-white/20 hover:text-neon-blue/50 transition-colors cursor-pointer font-mono tracking-wide"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  {section}
                </motion.p>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-mono text-white/20 tracking-[0.3em] uppercase mb-4">
              Technology Stack
            </h4>
            <div className="flex flex-wrap gap-2">
              {[
                "Next.js 14",
                "TypeScript",
                "Three.js",
                "R3F",
                "Framer Motion",
                "Canvas API",
                "SVG Engine",
                "TailwindCSS",
              ].map((tech, i) => (
                <motion.span
                  key={tech}
                  className="text-[9px] font-mono px-2.5 py-1 rounded-full bg-white/[0.015] border border-white/[0.03] text-white/15"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </div>
        </div>

        <motion.div
          className="mt-12 pt-8 border-t border-white/[0.02] flex flex-col sm:flex-row items-center justify-between gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <span className="text-[9px] font-mono text-white/12">
            © 2035 NEXUS AI CIVILIZATION · OS v4.0 · All Systems Nominal
          </span>
          <div className="flex items-center gap-4">
            <span className="text-[8px] font-mono text-white/08">NEXUS·LINK·ESTABLISHED</span>
            <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan/30 animate-pulse" />
          </div>
        </motion.div>
      </div>
    </footer>
  );
}