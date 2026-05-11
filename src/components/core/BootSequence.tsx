"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BootLog {
  id: number;
  module: string;
  message: string;
  status: "ok" | "warn" | "info";
}

const BOOT_LOGS: BootLog[] = [
  { id: 1, module: "KERNEL", message: "Initializing quantum compute substrate...", status: "ok" },
  { id: 2, module: "MEMORY", message: "Loading neural memory banks... 128K context window", status: "ok" },
  { id: 3, module: "NETWORK", message: "Establishing agent mesh network... 47 nodes detected", status: "ok" },
  { id: 4, module: "ORCHESTRATOR", message: "Booting multi-agent orchestration engine...", status: "info" },
  { id: 5, module: "RAG", message: "Indexing knowledge graph... 2.4M vectors loaded", status: "ok" },
  { id: 6, module: "SECURITY", message: "Verifying enclave integrity... SHA-256 passed", status: "ok" },
  { id: 7, module: "VISION", message: "Calibrating neural perception modules...", status: "info" },
  { id: 8, module: "WORKFLOW", message: "Loading autonomous workflow pipelines...", status: "ok" },
  { id: 9, module: "LEARNING", message: "Initializing RLHF feedback loops...", status: "warn" },
  { id: 10, module: "CIVILIZATION", message: "NEXUS OS v4.0 online... All systems nominal", status: "ok" },
];

export function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [visibleLogs, setVisibleLogs] = useState<BootLog[]>([]);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"booting" | "ready" | "exiting">("booting");
  const logIndexRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (logIndexRef.current < BOOT_LOGS.length) {
        setVisibleLogs((prev) => [...prev, BOOT_LOGS[logIndexRef.current]]);
        setProgress(((logIndexRef.current + 1) / BOOT_LOGS.length) * 100);
        logIndexRef.current++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setPhase("ready");
          setTimeout(() => {
            setPhase("exiting");
            setTimeout(onComplete, 800);
          }, 800);
        }, 400);
      }
    }, 200 + Math.random() * 150);

    return () => clearInterval(interval);
  }, [onComplete]);

  const statusChars: Record<string, string> = {
    ok: "OK",
    warn: "WARN",
    info: "INFO",
  };

  const statusColors: Record<string, string> = {
    ok: "text-neon-cyan",
    warn: "text-plasma-amber",
    info: "text-neon-blue/60",
  };

  return (
    <AnimatePresence>
      {phase !== "exiting" && (
        <motion.div
          className="fixed inset-0 z-[300] flex items-center justify-center bg-black"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Background grid */}
          <div className="absolute inset-0">
            <svg className="w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="boot-hex" width="40" height="34.6" patternUnits="userSpaceOnUse" patternTransform="scale(1.5)">
                  <path d="M20 0L40 11.5v23.1L20 46.1L0 34.6V11.5z" fill="none" stroke="#4FC3F7" strokeWidth="0.3" opacity="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#boot-hex)" />
            </svg>
          </div>

          <div className="absolute inset-0 bg-gradient-to-b from-space-deep/50 to-black" />

          {/* Scan line */}
          <motion.div
            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-blue/10 to-transparent pointer-events-none"
            animate={{ top: ["0%", "100%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />

          {/* Center content */}
          <div className="relative z-10 w-full max-w-2xl px-6">
            {/* NEXUS Logo */}
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className="inline-block text-5xl md:text-6xl text-neon-blue"
                animate={{
                  textShadow: [
                    "0 0 20px rgba(79,195,247,0.3)",
                    "0 0 40px rgba(124,77,255,0.5)",
                    "0 0 20px rgba(79,195,247,0.3)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ◈
              </motion.div>
              <motion.h1
                className="mt-3 text-xl md:text-2xl font-mono font-bold text-neon-blue/80 tracking-[0.3em]"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                NEXUS AI CIVILIZATION
              </motion.h1>
              <p className="mt-2 text-[10px] font-mono text-white/20 tracking-[0.4em]">
                OPERATING SYSTEM v4.0
              </p>
            </motion.div>

            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[9px] font-mono text-white/20 tracking-[0.2em]">
                  SYSTEM INITIALIZATION
                </span>
                <span className="text-[9px] font-mono text-neon-blue/60">
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="h-0.5 bg-white/[0.04] rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-neon-blue via-neon-purple to-neon-cyan"
                  style={{ width: `${progress}%` }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                />
              </div>
              {/* Mini segments */}
              <div className="flex gap-1 mt-1.5">
                {BOOT_LOGS.map((_, i) => (
                  <motion.div
                    key={i}
                    className="h-0.5 flex-1 rounded-full"
                    initial={{ background: "rgba(255,255,255,0.03)" }}
                    animate={{
                      background:
                        i < visibleLogs.length
                          ? "rgba(79,195,247,0.5)"
                          : "rgba(255,255,255,0.03)",
                    }}
                    transition={{ duration: 0.3 }}
                  />
                ))}
              </div>
            </div>

            {/* Boot log */}
            <div className="glass-panel-light p-4 font-mono text-[10px] md:text-[11px] leading-relaxed max-h-[200px] overflow-hidden">
              {visibleLogs.map((log) => (
                <motion.div
                  key={log?.id || Math.random()}
                  className="flex items-start gap-2 py-0.5"
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-white/15 shrink-0">[{log?.module || "UNKNOWN"}]</span>
                  <span className="text-white/30 flex-1">{log?.message || "..."}</span>
                  <span className={`${statusColors[log?.status || "info"]} shrink-0`}>
                    [{statusChars[log?.status || "info"]}]
                  </span>
                </motion.div>
              ))}
              {visibleLogs.length < BOOT_LOGS.length && (
                <motion.span
                  className="inline-block text-neon-blue/60"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  ▮
                </motion.span>
              )}
            </div>

            {/* System info bars */}
            {progress > 50 && (
              <motion.div
                className="mt-4 grid grid-cols-4 gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                {[
                  { label: "CPU", val: "32%" },
                  { label: "MEM", val: "48%" },
                  { label: "NET", val: "12Gbps" },
                  { label: "GPU", val: "78%" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-[8px] font-mono text-white/12">{stat.label}</div>
                    <div className="text-[9px] font-mono text-white/20 mt-0.5">{stat.val}</div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Ready state */}
            <AnimatePresence>
              {phase === "ready" && (
                <motion.div
                  className="mt-6 text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.span
                    className="inline-block px-6 py-2 rounded-full bg-neon-blue/5 border border-neon-blue/20 text-neon-blue text-xs font-mono tracking-[0.3em]"
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                  >
                    ◈ ENTERING NEXUS ◈
                  </motion.span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}