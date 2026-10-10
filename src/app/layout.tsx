import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NEXUS AI CIVILIZATION | 未来 AI 文明操作系统",
  description:
    "面向 2035 年的人类与 AI 协作文明操作系统。多智能体协作 · 自主工作流 · AI 城市 · 企业指挥中心 · 数字文明。",
  keywords: [
    "NEXUS AI", "AI Civilization", "AI操作系统", "多智能体",
    "Agent Galaxy", "AI指挥中心", "数字文明", "未来科技",
  ],
  authors: [{ name: "NEXUS AI Civilization" }],
  openGraph: {
    title: "NEXUS AI CIVILIZATION — The Age of AI Civilization",
    description: "人类与 AI 协作文明的未来操作系统",
    type: "website",
    locale: "zh_CN",
  },
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className="dark">
      <body className="min-h-screen bg-black antialiased">
        <noscript>
          <style>{`[style*="opacity:0"], [style*="opacity: 0"] { opacity: 1 !important; filter: none !important; transform: none !important; }
            .timeline-desktop { display: none !important; }
            .timeline-mobile-list { display: block !important; }
            .no-script-links { padding: 16px; display: flex; flex-wrap: wrap; gap: 16px; background: #0B1721; color: #80DBCE; }
          `}</style>
          <nav className="no-script-links" aria-label="静态内容导航">
            <a href="#timeline">文明时间线</a><a href="#agents">Agent</a><a href="#skills">技能</a><a href="#heatmap">城市</a><a href="#dashboard">指挥中心</a>
          </nav>
        </noscript>
        {children}
      </body>
    </html>
  );
}
