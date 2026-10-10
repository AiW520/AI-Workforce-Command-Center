"use client";

import { motion } from "framer-motion";

interface SectionDividerProps {
  label?: string;
}

export function SectionDivider({ label }: SectionDividerProps) {
  return (
    <div className="relative flex items-center justify-center py-4 md:py-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-neon-blue/20 to-transparent" />
      </div>
      {label && (
        <motion.div
          className="relative px-5 py-1 bg-[#101A1E]"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-[11px] font-mono text-[#9EBCB6] uppercase">
            {label}
          </span>
        </motion.div>
      )}
    </div>
  );
}
