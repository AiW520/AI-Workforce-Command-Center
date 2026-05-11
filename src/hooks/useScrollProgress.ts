"use client";

import { useState, useEffect, useCallback } from "react";

export function useScrollProgress(): {
  progress: number;
  currentSection: number;
  scrollY: number;
  isScrolling: boolean;
} {
  const [progress, setProgress] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = docHeight > 0 ? scrollTop / docHeight : 0;

    setScrollY(scrollTop);
    setProgress(scrollProgress);
    setCurrentSection(
      Math.floor((scrollTop / window.innerHeight) * 10) / 10
    );
    setIsScrolling(true);
  }, []);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      handleScroll();
      clearTimeout(timeout);
      timeout = setTimeout(() => setIsScrolling(false), 150);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timeout);
    };
  }, [handleScroll]);

  return { progress, currentSection, scrollY, isScrolling };
}