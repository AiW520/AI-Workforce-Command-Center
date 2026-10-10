"use client";

const ERAS = [
  { year: "2025", title: "AI Assistant Era", subtitle: "智能辅助时代", description: "AI 成为个人效率工具，Copilot 嵌入开发工作流，Prompt Engineering 成为核心技能。企业开始部署 AI 辅助系统。", color: "#A3DDD0", adoption: "34%", autonomy: "L2", ratio: "10:1" },
  { year: "2027", title: "Autonomous Agent Era", subtitle: "自主智能体时代", description: "Multi-Agent 系统兴起，AI 能够自主完成复杂工作流。RAG + Tool Calling 成为标准架构，Agent 开始独立执行企业任务。", color: "#B4D5E4", adoption: "62%", autonomy: "L3", ratio: "5:1" },
  { year: "2030", title: "AI Enterprise Society", subtitle: "AI 企业社会", description: "AI Agent 成为企业核心劳动力，人类转向战略决策。AI 驱动的企业操作系统取代传统 ERP，全球 AI 经济成型。", color: "#E3CAA0", adoption: "87%", autonomy: "L4", ratio: "1:3" },
  { year: "2035", title: "Human × AI Civilization", subtitle: "人机协作文明", description: "AI 与人类深度共生，形成全新的数字文明形态。AI 不再是被使用的工具，而是文明的共同构建者与协作者。", color: "#CDBFE5", adoption: "99%", autonomy: "L5", ratio: "1:50" },
];

export function CivilizationTimeline() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pb-6">
      <p className="text-xs text-white/65 mb-7">未来文明叙事 · 以下指标为情景假设</p>
      <ol className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8" aria-label="AI civilization timeline">
        {ERAS.map((era) => (
          <li key={era.year} className="min-w-0 border-t-2 pt-5" style={{ borderColor: era.color }}>
            <p className="text-3xl font-mono font-semibold mb-4" style={{ color: era.color }}>{era.year}</p>
            <h3 className="text-lg font-medium text-white">{era.subtitle}</h3>
            <p className="text-xs text-white/60 mt-1">{era.title}</p>
            <p className="text-sm text-white/75 mt-4 leading-relaxed min-h-[116px]">{era.description}</p>
            <dl className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-white/15">
              {[{ label: "AI 普及", value: era.adoption }, { label: "自主程度", value: era.autonomy }, { label: "人机比例", value: era.ratio }].map((metric) => (
                <div key={metric.label}><dt className="text-xs text-white/60">{metric.label}</dt><dd className="text-base font-mono mt-1" style={{ color: era.color }}>{metric.value}</dd></div>
              ))}
            </dl>
          </li>
        ))}
      </ol>
    </div>
  );
}
