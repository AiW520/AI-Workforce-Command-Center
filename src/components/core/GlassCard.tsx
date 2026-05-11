"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  neon?: boolean;
  scan?: boolean;
}

export function GlassCard({
  children,
  className,
  hover = false,
  neon = false,
  scan = false,
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass-panel p-6 relative overflow-hidden",
        hover && "transition-all duration-300 hover:scale-[1.02] hover:shadow-neon-blue",
        neon && "neon-border",
        scan && "scan-overlay",
        className
      )}
    >
      {children}
    </div>
  );
}