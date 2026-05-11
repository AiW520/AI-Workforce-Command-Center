"use client";

import { useRef, useEffect, useCallback } from "react";
import { randomBetween } from "@/lib/utils";

interface ThoughtParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  hue: number;
  pulse: number;
  pulseSpeed: number;
}

interface ThoughtStream {
  id: number;
  text: string;
  x: number;
  y: number;
  speed: number;
  opacity: number;
  fontSize: number;
  wave: number;
  waveSpeed: number;
}

const THOUGHTS = [
  "[Orchestrator] Reasoning chain active · 47 nodes",
  "[Memory Core] Context synced · 128K tokens",
  "[Vision AI] Neural analysis · 99.7% confidence",
  "[Workflow Engine] Task orchestration · 12 agents",
  "[RAG System] Knowledge retrieval · 2.4M vectors",
  "[Security AI] Threat scan · All systems nominal",
  "[Multi-Agent] Swarm consensus · 94% agreement",
  "[Inference] Chain-of-thought · Depth 8 reasoning",
  "[Scheduler] Priority queue · 1283 tasks pending",
  "[Knowledge Graph] Entity linking · 850M nodes",
];

const PARTICLE_COUNT = 40;

export function AIThoughtStream() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<ThoughtParticle[]>([]);
  const streamsRef = useRef<ThoughtStream[]>([]);
  const timeRef = useRef(0);
  const animRef = useRef(0);
  const dimsRef = useRef({ w: 0, h: 0 });

  const initStreams = useCallback((w: number, h: number) => {
    const streams: ThoughtStream[] = THOUGHTS.map((text, i) => ({
      id: i,
      text,
      x: randomBetween(-200, w + 200),
      y: randomBetween(40, h - 80),
      speed: randomBetween(0.25, 0.6),
      opacity: randomBetween(0.06, 0.13),
      fontSize: randomBetween(10, 12),
      wave: randomBetween(0, Math.PI * 2),
      waveSpeed: randomBetween(0.002, 0.005),
    }));
    streamsRef.current = streams;
  }, []);

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
      initStreams(w, h);

      if (particlesRef.current.length === 0) {
        const particles: ThoughtParticle[] = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          particles.push({
            x: randomBetween(0, w),
            y: randomBetween(0, h),
            vx: randomBetween(-0.3, 0.3),
            vy: randomBetween(-0.3, 0.3),
            size: randomBetween(1, 2),
            opacity: randomBetween(0.08, 0.3),
            hue: randomBetween(195, 275),
            pulse: randomBetween(0, Math.PI * 2),
            pulseSpeed: randomBetween(0.01, 0.03),
          });
        }
        particlesRef.current = particles;
      }
    };

    resize();
    window.addEventListener("resize", resize);

    const animate = () => {
      timeRef.current++;
      const { w, h } = dimsRef.current;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      const particles = particlesRef.current;
      const pLen = particles.length;
      for (let i = 0; i < pLen; i++) {
        const p = particles[i];
        p.x += p.vx + Math.sin(timeRef.current * 0.02 + i) * 0.15;
        p.y += p.vy + Math.cos(timeRef.current * 0.015 + i) * 0.1;
        p.pulse += p.pulseSpeed;
        const pulseAlpha = p.opacity * (0.6 + 0.4 * Math.sin(p.pulse));

        if (p.x < -30) p.x = w + 30;
        if (p.x > w + 30) p.x = -30;
        if (p.y < -30) p.y = h + 30;
        if (p.y > h + 30) p.y = -30;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 65%, ${pulseAlpha})`;
        ctx.fill();
      }

      const streams = streamsRef.current;
      const sLen = streams.length;
      for (let i = 0; i < sLen; i++) {
        const s = streams[i];
        s.x += s.speed;
        s.wave += s.waveSpeed;
        const waveY = Math.sin(s.wave) * 10;

        if (s.x > w + 300) {
          s.x = randomBetween(-300, -80);
          s.y = randomBetween(30, h - 50);
        }

        const alpha = s.opacity * (0.7 + 0.3 * Math.sin(timeRef.current * 0.025 + s.id));
        ctx.font = `${s.fontSize}px "JetBrains Mono", monospace`;
        ctx.fillStyle = `hsla(200, 80%, 70%, ${alpha})`;
        ctx.textBaseline = "middle";

        const textWidth = ctx.measureText(s.text).width;
        ctx.fillText(s.text, s.x - textWidth / 2, s.y + waveY);
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animRef.current);
    };
  }, [initStreams]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 5 }}
    />
  );
}