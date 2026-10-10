"use client";

import { motion, useReducedMotion } from "framer-motion";
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
  const words = title.split(" ");
  const reducedMotion = useReducedMotion();

  return (
    <div className={cn("text-left max-w-3xl", className)}>
      <motion.h2
        className="text-2xl md:text-3xl font-semibold tracking-normal mb-3"
        aria-label={title}
        initial={false}
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {words.map((word, i) => (
          <motion.span
            key={i}
            aria-hidden="true"
            className={cn(
              "inline-block max-w-full mr-[0.25em]",
              gradient && "text-[#D6E8E4]"
            )}
            variants={{
              hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
              visible: {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                transition: {
                  duration: reducedMotion ? 0 : 0.6,
                  delay: reducedMotion ? 0 : delay + i * 0.04,
                  ease: [0.25, 0.46, 0.45, 0.94],
                },
              },
            }}
          >
            {word}
          </motion.span>
        ))}
      </motion.h2>
      {subtitle && (
        <motion.p
          className="text-sm md:text-base text-white/70 leading-relaxed"
          initial={reducedMotion ? false : { opacity: 0, y: 20 }}
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
