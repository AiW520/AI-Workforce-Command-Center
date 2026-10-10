"use client";

import dynamic from "next/dynamic";
import { ArrowDown, Terminal } from "lucide-react";

const CityScene = dynamic(() => import("@/components/city/AICitySystem").then((module) => module.AICitySystem), {
  ssr: false,
  loading: () => <div className="h-[clamp(400px,calc(100svh-380px),560px)] md:h-[clamp(460px,calc(100svh-360px),650px)] bg-[#607B7B] flex items-center justify-center text-sm text-white/60">正在加载城市视图</div>,
});

export function HeroSection() {
  return (
    <section id="hero" aria-labelledby="nexus-title" className="relative pt-20 md:pt-24 bg-[#607B7B]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-5 flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-mono text-[#FFF1C7] mb-2">NEXUS · 协作文明工作区</p>
          <h1 id="nexus-title" className="text-2xl md:text-4xl font-semibold text-white">全球 AI 协作园区</h1>
          <p className="text-sm text-white/85 mt-2">探索城市、智能体与技能网络的协同关系</p>
        </div>
        <a href="#query" className="inline-flex items-center gap-2 text-xs text-[#80DBCE] hover:text-white py-2"><Terminal size={16} />AI Oracle</a>
      </div>
      <CityScene variant="hero" className="!h-[clamp(400px,calc(100svh-380px),560px)] md:!h-[clamp(460px,calc(100svh-360px),650px)]" />
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <p className="text-white/80">静态演示档案 · 20 城市 / 6 智能体 / 12 技能</p>
        <a href="#timeline" className="inline-flex items-center gap-2 text-white/80 hover:text-[#80DBCE]">文明时间线<ArrowDown size={14} /></a>
      </div>
    </section>
  );
}
