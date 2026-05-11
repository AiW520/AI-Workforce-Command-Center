"use client";

import { useRef, useEffect, useCallback } from "react";

export function useAnimationFrame(
  callback: (deltaTime: number, elapsed: number) => void,
  active: boolean = true
) {
  const requestRef = useRef<number>(0);
  const previousTimeRef = useRef<number>(0);
  const elapsedRef = useRef<number>(0);

  const animate = useCallback(
    (time: number) => {
      if (previousTimeRef.current !== 0) {
        const deltaTime = (time - previousTimeRef.current) / 1000;
        elapsedRef.current += deltaTime;
        callback(deltaTime, elapsedRef.current);
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    },
    [callback]
  );

  useEffect(() => {
    if (!active) {
      previousTimeRef.current = 0;
      return;
    }
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [animate, active]);
}