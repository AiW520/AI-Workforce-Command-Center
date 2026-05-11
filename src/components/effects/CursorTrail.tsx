"use client";

import { useEffect, useRef } from "react";

interface TrailDot {
  x: number;
  y: number;
  life: number;
  maxLife: number;
  size: number;
  opacity: number;
}

const TRAIL_LENGTH = 20;
const TRAIL_LIFETIME = 600;

export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailRef = useRef<TrailDot[]>([]);
  const mouseRef = useRef({ x: -100, y: -100 });
  const lastTimeRef = useRef(0);
  const animRef = useRef(0);
  const dimsRef = useRef({ w: 0, h: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dimsRef.current = { w, h };
    };

    const handleMouse = (e: MouseEvent) => {
      const now = Date.now();
      const dt = now - lastTimeRef.current;
      lastTimeRef.current = now;

      if (dt > 10 && dt < 100) {
        trailRef.current.push({
          x: e.clientX,
          y: e.clientY,
          life: 0,
          maxLife: TRAIL_LIFETIME,
          size: 3 + Math.random(),
          opacity: 0.8,
        });
        if (trailRef.current.length > TRAIL_LENGTH) {
          trailRef.current.shift();
        }
      }
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouse, { passive: true });

    const animate = () => {
      const { w, h } = dimsRef.current;
      ctx.clearRect(0, 0, w, h);

      const now = Date.now();
      const trail = trailRef.current;

      for (let i = trail.length - 1; i >= 0; i--) {
        const d = trail[i];
        d.life += 16;
        const lifeRatio = d.life / d.maxLife;
        if (lifeRatio >= 1) {
          trail.splice(i, 1);
          continue;
        }

        const alpha = d.opacity * (1 - lifeRatio) * (1 - i / trail.length);
        const size = d.size * (1 - lifeRatio * 0.7);
        const hue = 200 + (1 - lifeRatio) * 60;

        ctx.beginPath();
        ctx.arc(d.x, d.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue}, 100%, 65%, ${alpha})`;
        ctx.fill();

        // Smaller outer glow
        ctx.beginPath();
        ctx.arc(d.x, d.y, size * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue}, 80%, 60%, ${alpha * 0.3})`;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 250 }}
    />
  );
}