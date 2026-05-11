"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ParticleField } from "./ParticleField";
import { AIThoughtStream } from "@/components/consciousness/AIThoughtStream";
import { useMousePosition } from "@/hooks/useMousePosition";

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { normalizedX, normalizedY } = useMousePosition();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.6], [1, 0.9]);
  const textY = useTransform(scrollYProgress, [0, 0.6], [0, 40]);
  const blur = useTransform(scrollYProgress, [0, 0.5], ["blur(0px)", "blur(8px)"]);

  const parallaxX = normalizedX * 18;
  const parallaxY = normalizedY * 18;
  const titleMotionX = parallaxX * 0.25;
  const titleMotionY = useTransform(textY, (v) => parallaxY * 0.25 + v);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden flex items-center justify-center bg-black"
    >
      <ParticleField />
      <AIThoughtStream />

      {/* Cosmic glow orbs */}
      <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-neon-purple/[0.04] rounded-full blur-[150px] animate-pulse-glow" />
      <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-neon-blue/[0.04] rounded-full blur-[120px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-cyan/[0.02] rounded-full blur-[200px]" />

      {/* Animated grid background */}
      <div className="absolute inset-0 grid-bg opacity-25" />

      {/* Hex grid */}
      <div className="absolute inset-0">
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="nexus-hex" width="60" height="52" patternUnits="userSpaceOnUse" patternTransform="scale(1.3)">
              <path d="M30 0L60 17.3v34.6L30 69.3L0 52V17.3z" fill="none" stroke="#4FC3F7" strokeWidth="0.4" opacity="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#nexus-hex)" />
        </svg>
      </div>

      {/* Horizontal scan line effect */}
      <motion.div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-blue/15 to-transparent z-[6] pointer-events-none"
        animate={{ top: ["0%", "100%", "0%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        className="relative z-10 text-center px-4 max-w-6xl mx-auto"
        style={{ opacity, scale, filter: blur }}
      >
        <motion.div style={{ x: titleMotionX, y: titleMotionY }}>
          {/* Status badge */}
          <motion.div
            className="inline-flex items-center gap-3 mb-10 px-5 py-2 glass-panel-light"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-neon-cyan" />
            </span>
            <span className="text-[11px] md:text-xs font-mono text-neon-cyan/70 tracking-[0.35em] uppercase">
              NEXUS AI · CIVILIZATION OS · v4.0
            </span>
          </motion.div>

          {/* Main title */}
          <motion.h1
            className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-[0.03em] leading-[1.02] font-display"
            initial="hidden"
            animate="visible"
          >
            <LineReveal text="THE AGE OF" delay={0.3} />
            <br />
            <span className="text-gradient-neon">
              <LineReveal text="AI CIVILIZATION" delay={0.55} gradient />
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.div
            className="mt-8 md:mt-10 flex flex-col items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <p className="text-base md:text-xl text-white/30 font-light tracking-[0.2em]">
              人类与 AI 协作文明的未来操作系统
            </p>
            <div className="flex items-center gap-4 text-[9px] md:text-[10px] font-mono text-white/15 tracking-[0.3em]">
              <span>ENTERPRISE</span>
              <span className="w-px h-3 bg-white/10" />
              <span>MULTI-AGENT</span>
              <span className="w-px h-3 bg-white/10" />
              <span>AUTONOMOUS</span>
              <span className="w-px h-3 bg-white/10" />
              <span>CIVILIZATION</span>
            </div>
          </motion.div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="mt-12 md:mt-16 flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.5 }}
        >
          <button
            onClick={() => document.getElementById("timeline")?.scrollIntoView({ behavior: "smooth" })}
            className="group relative px-10 py-4 rounded-full overflow-hidden border border-neon-blue/25 hover:border-neon-blue/50 transition-all duration-500"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/10 via-neon-purple/10 to-neon-cyan/5 group-hover:opacity-100 opacity-0 transition-opacity duration-500" />
            <span className="relative text-sm md:text-base font-mono text-neon-blue/80 group-hover:text-white tracking-[0.25em] transition-colors duration-300">
              ENTER NEXUS
            </span>
          </button>

          <button
            onClick={() => document.getElementById("query")?.scrollIntoView({ behavior: "smooth" })}
            className="group px-10 py-4 rounded-full border border-white/[0.06] hover:border-white/15 transition-all duration-500 backdrop-blur-sm"
          >
            <span className="text-sm md:text-base font-mono text-white/35 group-hover:text-white/60 tracking-[0.25em] transition-colors duration-300">
              ASK AI ORACLE
            </span>
          </button>
        </motion.div>
      </motion.div>

      {/* Bottom navigation hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <motion.div
          className="flex flex-col items-center gap-3 cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          onClick={() => document.getElementById("timeline")?.scrollIntoView({ behavior: "smooth" })}
        >
          <span className="text-[9px] font-mono text-white/15 tracking-[0.4em]">SCROLL TO EXPLORE</span>
          <motion.div
            className="w-5 h-9 rounded-full border border-white/8 flex items-start justify-center p-1.5"
          >
            <motion.div
              className="w-1 h-2.5 rounded-full bg-neon-blue/40"
              animate={{ y: [0, 10, 0], opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />
    </section>
  );
}

function LineReveal({
  text,
  delay,
  gradient,
}: {
  text: string;
  delay: number;
  gradient?: boolean;
}) {
  return (
    <>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          className={`inline-block ${gradient ? "" : "text-white"}`}
          variants={{
            hidden: { opacity: 0, y: 80, rotateX: -85, filter: "blur(12px)", scale: 0.8 },
            visible: {
              opacity: 1,
              y: 0,
              rotateX: 0,
              filter: "blur(0px)",
              scale: 1,
              transition: {
                duration: 0.75,
                delay: delay + i * 0.035,
                ease: [0.16, 0.64, 0.24, 0.98],
              },
            },
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </>
  );
}