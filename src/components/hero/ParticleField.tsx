"use client";

import { useRef, useEffect, useCallback } from "react";
import { randomBetween } from "@/lib/utils";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  hue: number;
  life: number;
  maxLife: number;
}

const PARTICLE_COUNT = 100;
const CONNECTION_DISTANCE = 100;
const MOUSE_RADIUS = 150;
const MOUSE_FORCE = 0.25;
const CONNECTION_SKIP_FRAMES = 2;

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const dimensionsRef = useRef({ width: 0, height: 0 });
  const frameRef = useRef(0);

  const initParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: randomBetween(0, width),
        y: randomBetween(0, height),
        vx: randomBetween(-0.4, 0.4),
        vy: randomBetween(-0.4, 0.4),
        size: randomBetween(1, 3),
        opacity: randomBetween(0.15, 0.6),
        hue: randomBetween(195, 275),
        life: randomBetween(0, 300),
        maxLife: randomBetween(200, 500),
      });
    }
    particlesRef.current = particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dimensionsRef.current = { width, height };

      if (particlesRef.current.length === 0) {
        initParticles(width, height);
      }
    };

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    resize();
    initParticles(window.innerWidth, window.innerHeight);

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouse, { passive: true });

    const animate = () => {
      frameRef.current++;
      const { width, height } = dimensionsRef.current;
      const particles = particlesRef.current;
      const mouse = mouseRef.current;
      const drawConnections = frameRef.current % CONNECTION_SKIP_FRAMES === 0;

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      const len = particles.length;
      for (let i = 0; i < len; i++) {
        const p = particles[i];

        p.life++;
        if (p.life > p.maxLife) {
          p.x = randomBetween(0, width);
          p.y = randomBetween(0, height);
          p.life = 0;
          p.maxLife = randomBetween(200, 500);
          p.opacity = randomBetween(0.12, 0.55);
        }

        const lifePhase = p.life / p.maxLife;
        const fadeIn = Math.min(1, lifePhase * 5);
        const fadeOut = Math.max(0, 1 - (lifePhase - 0.7) / 0.3);
        const currentOpacity = p.opacity * Math.min(fadeIn, fadeOut);

        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const distToMouse = Math.sqrt(dx * dx + dy * dy);

        if (distToMouse < MOUSE_RADIUS && distToMouse > 0) {
          const force = (1 - distToMouse / MOUSE_RADIUS) * MOUSE_FORCE;
          p.vx -= (dx / distToMouse) * force;
          p.vy -= (dy / distToMouse) * force;
        }

        p.vx *= 0.997;
        p.vy *= 0.997;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 65%, ${currentOpacity})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${currentOpacity * 0.1})`;
        ctx.fill();
      }

      if (drawConnections) {
        for (let i = 0; i < len; i++) {
          for (let j = i + 1; j < len; j++) {
            const a = particles[i];
            const b = particles[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < CONNECTION_DISTANCE) {
              const alpha = (1 - dist / CONNECTION_DISTANCE) * 0.25;
              const avgHue = (a.hue + b.hue) / 2;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.strokeStyle = `hsla(${avgHue}, 70%, 60%, ${alpha})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
      cancelAnimationFrame(animationRef.current);
    };
  }, [initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-auto"
      style={{ zIndex: 0 }}
    />
  );
}