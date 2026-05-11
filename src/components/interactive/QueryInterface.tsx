"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/core/GlassCard";
import { cn } from "@/lib/utils";

interface QueryResult {
  id: string;
  query: string;
  timestamp: string;
  steps: {
    agent: string;
    action: string;
    status: "thinking" | "complete" | "error";
    result?: string;
  }[];
  insights: string[];
  relatedNodes: { name: string; category: string }[];
}

const QUERY_DATABASE: Record<string, QueryResult> = {
  default: {
    id: "q-001",
    query: "未来最有价值的 AI 技能是什么？",
    timestamp: new Date().toISOString(),
    steps: [
      { agent: "Orchestrator", action: "分析查询意图", status: "complete", result: "职业发展路径查询" },
      { agent: "Research Agent", action: "检索全球 AI 趋势数据", status: "complete", result: "2,847 数据源匹配" },
      { agent: "Data Oracle", action: "技能市场需求分析", status: "complete", result: "12 维度交叉分析完成" },
      { agent: "Strategist", action: "生成职业路径建议", status: "complete", result: "4 条最优路径" },
    ],
    insights: [
      "Multi-Agent 架构师需求增长 340%",
      "Prompt Engineering 成为基础必备技能",
      "AI + 垂直领域专家复合型人才稀缺",
      "Agent 安全与 Alignment 成为核心护城河",
    ],
    relatedNodes: [
      { name: "Multi-Agent Systems", category: "Engineering" },
      { name: "RAG Architecture", category: "Infrastructure" },
      { name: "AI Safety", category: "Governance" },
      { name: "LLM Engineering", category: "Core AI" },
      { name: "AI Product Design", category: "Product" },
      { name: "Autonomous Workflow", category: "Automation" },
    ],
  },
};

const SUGGESTED_QUERIES = [
  "未来最有价值的 AI 技能是什么？",
  "AI Agent 如何改变企业架构？",
  "2026 年最热门的 AI 职业是什么？",
  "Multi-Agent 系统如何运作？",
  "AI 安全与对齐的重要性？",
];

export function InteractiveQuerySystem() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<QueryResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const simulateQuery = useCallback((q: string) => {
    setIsProcessing(true);
    setCurrentStep(0);
    setResult(null);

    const data = QUERY_DATABASE.default;
    const steps = data.steps;
    let stepIndex = 0;

    const advanceStep = () => {
      if (stepIndex < steps.length) {
        setCurrentStep(stepIndex + 1);
        stepIndex++;
        setTimeout(advanceStep, 800 + Math.random() * 600);
      } else {
        setIsProcessing(false);
        setResult(data);
      }
    };

    setTimeout(advanceStep, 400);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      simulateQuery(query);
    }
  };

  const handleSuggestion = (q: string) => {
    setQuery(q);
    simulateQuery(q);
    inputRef.current?.focus();
  };

  return (
    <div className="space-y-6">
      {/* Query Input */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neon-blue/50 text-sm">
              ◈
            </div>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="向 AI 文明系统提问..."
              className="w-full pl-10 pr-16 py-3.5 bg-black/20 border border-neon-blue/15 rounded-xl text-sm font-mono text-white/80 placeholder:text-white/15 focus:border-neon-blue/40 focus:outline-none focus:ring-1 focus:ring-neon-blue/20 transition-all backdrop-blur-sm"
            />
            <button
              type="submit"
              disabled={!query.trim() || isProcessing}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-lg bg-neon-blue/10 border border-neon-blue/20 text-neon-blue text-xs font-mono hover:bg-neon-blue/20 disabled:opacity-30 transition-all"
            >
              {isProcessing ? "···" : "EXECUTE"}
            </button>
          </div>
        </div>

        {/* Suggested queries */}
        <div className="flex flex-wrap gap-2 mt-3">
          {SUGGESTED_QUERIES.map((q) => (
            <button
              key={q}
              onClick={() => handleSuggestion(q)}
              className="text-[10px] font-mono px-3 py-1 rounded-full bg-white/[0.02] border border-white/[0.04] text-white/25 hover:text-neon-blue/60 hover:border-neon-blue/15 transition-all"
            >
              {q}
            </button>
          ))}
        </div>
      </form>

      {/* Processing animation */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            className="glass-panel p-4 space-y-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex items-center gap-2 mb-3 text-[10px] font-mono text-neon-cyan/60">
              <span className="animate-pulse">◎</span>
              AGENT REASONING CHAIN
            </div>
            {QUERY_DATABASE.default.steps.map((step, i) => {
              const isActive = i === currentStep - 1;
              const isDone = i < currentStep;
              return (
                <motion.div
                  key={i}
                  className={cn(
                    "flex items-center gap-3 py-2 px-3 rounded-lg transition-all",
                    isActive && "bg-neon-blue/5 border border-neon-blue/10",
                    isDone && "opacity-60"
                  )}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full",
                      isActive ? "bg-neon-cyan animate-pulse" : isDone ? "bg-neon-blue/50" : "bg-white/10"
                    )}
                  />
                  <span className="text-[10px] font-mono text-neon-blue/80 w-28">
                    {step.agent}
                  </span>
                  <span className="text-[10px] font-mono text-white/40">
                    {step.action}
                  </span>
                  {isDone && step.result && (
                    <motion.span
                      className="text-[10px] font-mono text-neon-cyan/60 ml-auto"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      ✓ {step.result}
                    </motion.span>
                  )}
                  {isActive && (
                    <span className="ml-auto flex space-x-1">
                      {[0, 1, 2].map((d) => (
                        <motion.span
                          key={d}
                          className="w-1 h-1 rounded-full bg-neon-cyan"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 0.8, delay: d * 0.15, repeat: Infinity }}
                        />
                      ))}
                    </span>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {result && !isProcessing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Insights */}
              <GlassCard>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-neon-purple">◈</span>
                  <span className="text-[10px] font-mono text-white/40 tracking-[0.15em]">
                    AI INSIGHTS
                  </span>
                </div>
                <div className="space-y-3">
                  {result.insights.map((insight, i) => (
                    <motion.div
                      key={i}
                      className="flex items-start gap-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.15 }}
                    >
                      <span className="text-neon-cyan text-xs mt-0.5">◆</span>
                      <span className="text-xs text-white/60 leading-relaxed">
                        {insight}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>

              {/* Related Nodes */}
              <GlassCard>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-neon-cyan">⬢</span>
                  <span className="text-[10px] font-mono text-white/40 tracking-[0.15em]">
                    RELATED SKILL NETWORK
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.relatedNodes.map((node, i) => (
                    <motion.span
                      key={node.name}
                      className={cn(
                        "text-[9px] font-mono px-2.5 py-1 rounded-full border transition-colors",
                        node.category === "Engineering"
                          ? "border-neon-blue/15 text-neon-blue/60 hover:bg-neon-blue/10"
                          : node.category === "Core AI"
                          ? "border-neon-purple/15 text-neon-purple/60 hover:bg-neon-purple/10"
                          : node.category === "Governance"
                          ? "border-plasma-amber/15 text-plasma-amber/60 hover:bg-plasma-amber/10"
                          : "border-white/10 text-white/40 hover:bg-white/5"
                      )}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.08 }}
                    >
                      {node.name}
                    </motion.span>
                  ))}
                </div>

                {/* Skill linkage visualization */}
                <div className="mt-4 flex items-center justify-center">
                  <svg width="100%" height="60" viewBox="0 0 280 60">
                    {result.relatedNodes.map((node, i) => {
                      const angle = (i / result.relatedNodes.length) * Math.PI * 2;
                      const cx = 140 + Math.cos(angle) * 25;
                      const cy = 30 + Math.sin(angle) * 20;
                      return (
                        <g key={i}>
                          <motion.line
                            x1={140} y1={30} x2={cx} y2={cy}
                            stroke="rgba(79,195,247,0.2)"
                            strokeWidth="0.5"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ delay: i * 0.1 }}
                          />
                          <motion.circle
                            cx={cx} cy={cy} r="3"
                            fill="#4FC3F7"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: i * 0.1 + 0.3 }}
                          />
                        </g>
                      );
                    })}
                    <circle cx="140" cy="30" r="5" fill="#7C4DFF" opacity="0.8">
                      <animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite" />
                    </circle>
                  </svg>
                </div>
              </GlassCard>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}