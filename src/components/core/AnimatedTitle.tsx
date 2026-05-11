"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
  gradient?: boolean;
  delay?: number;
}

export function AnimatedTitle({
  title,
  subtitle,
  className,
  gradient = true,
  delay = 0,
}: AnimatedTitleProps) {
  const chars = title.split("");

  return (
    <div className={cn("text-center", className)}>
      <motion.h2
        className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-wider font-display mb-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {chars.map((char, i) => (
          <motion.span
            key={i}
            className={cn(
              "inline-block",
              gradient && "text-gradient-neon"
            )}
            variants={{
              hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
              visible: {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                transition: {
                  duration: 0.6,
                  delay: delay + i * 0.04,
                  ease: [0.25, 0.46, 0.45, 0.94],
                },
              },
            }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.h2>
      {subtitle && (
        <motion.p
          className="text-lg md:text-xl text-white/50 font-light tracking-widest"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: delay + 0.5 }}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}