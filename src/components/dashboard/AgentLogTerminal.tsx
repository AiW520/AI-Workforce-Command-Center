"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/core/GlassCard";
import { DemoDataNotice } from "@/components/core/DemoDataNotice";

interface LogEntry {
  id: number;
  timestamp: string;
  agent: string;
  icon: string;
  action: string;
  result: string;
  color: string;
}

const AGENT_ICONS: Record<string, { icon: string; color: string }> = {
  orchestrator: { icon: "◈", color: "#4FC3F7" },
  researcher: { icon: "◎", color: "#00E5FF" },
  coder: { icon: "◇", color: "#7C4DFF" },
  analyst: { icon: "△", color: "#B388FF" },
  strategist: { icon: "▽", color: "#FFB300" },
  sentinel: { icon: "▣", color: "#76FF03" },
};

const LOG_TEMPLATES = [
  { agent: "orchestrator", action: "Task distributed", result: "T-{N} → Researcher" },
  { agent: "researcher", action: "Knowledge retrieved", result: "{N} sources matched" },
  { agent: "coder", action: "Code generation", result: "{N} lines · TypeScript" },
  { agent: "analyst", action: "Pattern detected", result: "confidence {N}%" },
  { agent: "strategist", action: "Strategy computed", result: "{N} optimal paths" },
  { agent: "sentinel", action: "Security scan", result: "{N} checks passed" },
  { agent: "orchestrator", action: "Workflow orchestrated", result: "{N} agents in sync" },
  { agent: "researcher", action: "RAG query executed", result: "{N}ms retrieval" },
  { agent: "coder", action: "Architecture validated", result: "coverage {N}%" },
  { agent: "analyst", action: "Anomaly flagged", result: "threshold {N}σ exceeded" },
  { agent: "strategist", action: "Decision tree pruned", result: "{N} branches reduced" },
  { agent: "sentinel", action: "Compliance check", result: "ISO 42001 · {N}% passed" },
  { agent: "orchestrator", action: "Memory consolidated", result: "{N} context tokens" },
  { agent: "researcher", action: "Paper analyzed", result: "arxiv-{N} · summarized" },
  { agent: "coder", action: "Test suite executed", result: "{N} tests · all green" },
  { agent: "analyst", action: "Trend forecasted", result: "horizon {N} months" },
];

function generateLog(id: number): LogEntry {
  const template = LOG_TEMPLATES[id % LOG_TEMPLATES.length];
  const n = template.result.includes("%") ? 95 + id % 5 : template.result.includes("σ") ? 3 : 100 + (id * 137) % 9000;
  const result = template.result.replace("{N}", n.toLocaleString());
  const agentInfo = AGENT_ICONS[template.agent];
  const now = new Date();
  const time = now.toTimeString().slice(0, 8);

  return {
    id,
    timestamp: time,
    agent: template.agent,
    icon: agentInfo.icon,
    action: template.action,
    result,
    color: agentInfo.color,
  };
}

export function AgentLogTerminal() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [paused, setPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);

  useEffect(() => {
    if (idRef.current === 0) {
      const initial: LogEntry[] = [];
      for (let i = 0; i < 8; i++) initial.push(generateLog(idRef.current++));
      setLogs(initial);
    }
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const interval = setInterval(() => {
      setLogs((prev) => {
        const next = [...prev, generateLog(idRef.current++)];
        return next.slice(-50);
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [paused]);

  useEffect(() => {
    if (containerRef.current && !showAll) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs, showAll]);

  const displayLogs = showAll ? logs : logs.slice(-8);

  return (
    <GlassCard className="h-full flex flex-col">
      <DemoDataNotice>浏览器模拟日志，未连接 Agent 服务。</DemoDataNotice>
      <div className="flex flex-wrap gap-2 items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-neon-cyan">◫</span>
          <h3 className="text-xs font-mono text-white/60 tracking-normal">
            AGENT LOG STREAM
          </h3>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" />
            <span className="text-[11px] font-mono text-neon-cyan/50">DEMO</span>
          </span>
        </div>
        <button type="button" onClick={() => setPaused(!paused)} aria-pressed={paused} className="text-xs text-white/60">{paused ? "继续" : "暂停"}</button>
        <button type="button"
          onClick={() => setShowAll(!showAll)}
          className="text-[11px] font-mono text-white/55 hover:text-neon-blue/60 transition-colors"
        >
          {showAll ? "COMPACT" : "ALL LOGS"}
        </button>
      </div>

      <div
        ref={containerRef}
        className={`flex-1 font-mono text-[10px] leading-relaxed space-y-0.5 overflow-hidden ${
          showAll ? "overflow-y-auto" : ""
        }`}
        style={{ maxHeight: showAll ? "300px" : "auto" }}
      >
        <AnimatePresence initial={false}>
          {displayLogs.map((log) => (
            <motion.div
              key={log.id}
              className="flex items-start gap-2 py-0.5 px-1.5 rounded hover:bg-white/[0.02] transition-colors"
              initial={{ opacity: 0, x: -10, height: 0 }}
              animate={{ opacity: 1, x: 0, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-white/10 shrink-0">{log.timestamp}</span>
              <span className="shrink-0" style={{ color: log.color }}>
                {log.icon}
              </span>
              <span className="text-white/50 min-w-0 break-words">{log.agent}.{log.action}</span>
              <span className="text-white/40 flex-1 min-w-0 text-right truncate">
                {log.result}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Stats row */}
      <div className="mt-3 pt-3 border-t border-white/[0.03] flex items-center justify-between text-[11px] font-mono text-white/55">
        <span>LOGS: {logs.length}</span>
        <span>DEMO REPLAY</span>
        <span>{paused ? "PAUSED" : "SIMULATED"}</span>
      </div>
    </GlassCard>
  );
}
