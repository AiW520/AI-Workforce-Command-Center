import type { ReactNode } from "react";

export function DemoDataNotice({ children }: { children?: ReactNode }) {
  return (
    <p className="mb-4 text-xs leading-relaxed text-amber-200/70">
      <span className="font-mono">DEMO · 演示数据</span>
      {children && <span className="ml-2">{children}</span>}
    </p>
  );
}
