"use client";

import { useState, useEffect, useRef } from "react";
import { useInView } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  delay?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  formatter?: (value: number) => string;
  style?: React.CSSProperties;
}

export function AnimatedCounter({
  value,
  duration = 1.5,
  delay = 0,
  className = "",
  style,
  prefix = "",
  suffix = "",
  decimals = 0,
  formatter,
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    const startTime = performance.now() + delay * 1000;
    let raf: number;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      if (elapsed < 0) {
        raf = requestAnimationFrame(animate);
        return;
      }

      const progress = Math.min(elapsed / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = eased * value;

      setDisplayValue(current);
      if (progress < 1) {
        raf = requestAnimationFrame(animate);
      }
    };

    setTimeout(() => {
      raf = requestAnimationFrame(animate);
    }, delay * 1000);

    return () => cancelAnimationFrame(raf);
  }, [isInView, value, duration, delay]);

  const formatted = formatter
    ? formatter(displayValue)
    : `${prefix}${displayValue.toFixed(decimals)}${suffix}`;

  return (
    <span ref={ref} className={className} style={style}>
      {formatted}
    </span>
  );
}