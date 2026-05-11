"use client";

import { motion } from "framer-motion";

interface SectionDividerProps {
  label?: string;
}

export function SectionDivider({ label }: SectionDividerProps) {
  return (
    <div className="relative flex items-center justify-center py-8 md:py-16">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-neon-blue/20 to-transparent" />
      </div>
      {label && (
        <motion.div
          className="relative px-8 py-2 glass-panel-light"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-xs md:text-sm font-mono text-neon-blue/60 tracking-[0.3em] uppercase neon-text">
            {label}
          </span>
        </motion.div>
      )}
      <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-1 h-1 bg-neon-blue rounded-full shadow-neon-blue animate-pulse-glow" />
    </div>
  );
}