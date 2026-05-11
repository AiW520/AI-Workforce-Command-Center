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
        {children}
      </body>
    </html>
  );
}