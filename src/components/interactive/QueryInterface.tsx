"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/core/GlassCard";
import { cn } from "@/lib/utils";
import { DemoDataNotice } from "@/components/core/DemoDataNotice";
import { SendHorizontal, RotateCcw } from "lucide-react";

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
    timestamp: "demo-snapshot",
    steps: [
      { agent: "Orchestrator", action: "分析查询意图", status: "complete", result: "职业发展路径查询" },
      { agent: "Research Agent", action: "匹配预置主题", status: "complete", result: "本地演示知识库" },
      { agent: "Data Oracle", action: "展示示例观点", status: "complete", result: "未检索外部数据" },
      { agent: "Strategist", action: "整理预置建议", status: "complete", result: "演示回答已就绪" },
    ],
    insights: [
      "Multi-Agent 架构、系统评估与安全是示例学习方向",
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

const PRESET_INSIGHTS: Record<string, string[]> = {
  "未来最有价值的 AI 技能是什么？": QUERY_DATABASE.default.insights,
  "AI Agent 如何改变企业架构？": ["以任务编排连接研发、研究和审查角色", "在关键审批处保留人工决策", "以权限隔离和审计日志管理工具调用", "先从明确、可评估的工作流开始"],
  "2026 年最热门的 AI 职业是什么？": ["本原型展示 Agent Engineer、ML Engineer 与 AI Product 等职业", "需求和薪资为示例，不代表 2026 年招聘统计", "可结合行业、地区和个人经验评估职业选择"],
  "Multi-Agent 系统如何运作？": ["Orchestrator 分派任务并协调工作流", "Researcher、Coder 与 Analyst 处理专业子任务", "Quality Sentinel 执行质量与安全审查", "共享状态、失败重试和预算限制决定系统可靠性"],
  "AI 安全与对齐的重要性？": ["按最小权限开放工具和数据访问", "对关键操作设置人工审批和审计", "使用评估与红队测试检查系统输出", "持续监控失败模式与行为变化"],
};

export function InteractiveQuerySystem() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<QueryResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRefs = useRef<ReturnType<typeof setTimeout>[]>([]);
  const processingRef = useRef(false);

  useEffect(() => () => timerRefs.current.forEach(clearTimeout), []);

  const simulateQuery = useCallback((q: string) => {
    if (processingRef.current) return;
    processingRef.current = true;
    setIsProcessing(true);
    setCurrentStep(0);
    setResult(null);
    timerRefs.current.forEach(clearTimeout);
    timerRefs.current = [];

    const data = {
      ...QUERY_DATABASE.default,
      query: q.trim(),
      insights: PRESET_INSIGHTS[q.trim()] ?? ["此问题暂无预置演示回答。", "当前 Oracle 没有连接语言模型或外部检索服务。"],
      relatedNodes: PRESET_INSIGHTS[q.trim()] ? QUERY_DATABASE.default.relatedNodes : [],
    };
    const steps = data.steps;
    let stepIndex = 0;

    const advanceStep = () => {
      if (stepIndex < steps.length) {
        setCurrentStep(stepIndex + 1);
        stepIndex++;
        timerRefs.current.push(setTimeout(advanceStep, 900));
      } else {
        setIsProcessing(false);
        processingRef.current = false;
        setResult(data);
      }
    };

    timerRefs.current.push(setTimeout(advanceStep, 400));
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

  const resetQuery = () => {
    timerRefs.current.forEach(clearTimeout);
    timerRefs.current = [];
    processingRef.current = false;
    setIsProcessing(false);
    setCurrentStep(0);
    setResult(null);
    setQuery("");
    inputRef.current?.focus();
  };

  return (
    <div className="space-y-6">
      <DemoDataNotice>Oracle 使用预置回答和模拟推理链，不连接外部检索或实时运营数据。</DemoDataNotice>
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
              aria-label="Oracle 演示查询"
              disabled={isProcessing}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="向 AI 文明系统提问..."
              className="w-full pl-10 pr-28 py-3.5 bg-black/20 border border-neon-blue/15 rounded-lg text-sm font-mono text-white/80 placeholder:text-white/55 focus:border-neon-blue/40 focus:outline-none focus:ring-1 focus:ring-neon-blue/20 transition-all backdrop-blur-sm"
            />
            <button
              type="submit"
              aria-label="提交问题"
              title="提交问题"
              disabled={!query.trim() || isProcessing}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-lg bg-neon-blue/10 border border-neon-blue/20 text-neon-blue text-xs font-mono hover:bg-neon-blue/20 disabled:opacity-30 transition-all"
            >
              {isProcessing ? "处理中" : <SendHorizontal size={18} />}
            </button>
          </div>
          <button type="button" onClick={resetQuery} aria-label={isProcessing ? "取消查询" : "清空查询"} title={isProcessing ? "取消查询" : "清空查询"} className="p-3 text-white/75 hover:text-white border border-white/20 rounded disabled:opacity-40" disabled={!query && !result && !isProcessing}><RotateCcw size={18} /></button>
        </div>

        {/* Suggested queries */}
        <div className="flex flex-wrap gap-2 mt-3">
          {SUGGESTED_QUERIES.map((q) => (
            <button
              key={q}
              type="button"
              disabled={isProcessing}
              onClick={() => handleSuggestion(q)}
              className="text-[10px] font-mono px-3 py-1 rounded bg-white/[0.02] border border-white/[0.04] text-white/60 hover:text-neon-blue/80 hover:border-neon-blue/15 transition-all disabled:opacity-30"
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
              DEMO WORKFLOW
            </div>
            {QUERY_DATABASE.default.steps.map((step, i) => {
              const isActive = i === currentStep - 1;
              const isDone = i < currentStep;
              return (
                <motion.div
                  key={i}
                  className={cn(
                    "flex flex-wrap items-center gap-3 py-2 px-3 rounded-lg transition-all",
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
            <p role="status" className="mb-4 text-sm text-white/70 break-words">演示回答 · {result.query}</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Insights */}
              <GlassCard>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-neon-purple">◈</span>
                  <span className="text-[10px] font-mono text-white/40 tracking-normal">
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
                  <span className="text-[10px] font-mono text-white/40 tracking-normal">
                    RELATED SKILL NETWORK
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.relatedNodes.map((node, i) => (
                    <motion.span
                      key={node.name}
                      className={cn(
                        "text-[11px] font-mono px-2.5 py-1 rounded-full border transition-colors",
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
