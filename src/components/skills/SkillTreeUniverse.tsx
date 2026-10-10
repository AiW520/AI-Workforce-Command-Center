"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SKILL_TREE } from "@/lib/data";
import { DemoDataNotice } from "@/components/core/DemoDataNotice";
import { emitSceneSelection, subscribeSceneSelection } from "@/lib/scene-selection";
import type { SkillNode } from "@/types";

export function SkillTreeUniverse() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 900, height: 500 });
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  useEffect(() => subscribeSceneSelection((selection) => {
    if (selection.kind === "skill") setSelectedSkill(selection.id);
  }), []);
  const selectSkill = (id: string) => {
    setSelectedSkill(id);
    emitSceneSelection({ kind: "skill", id, source: "dom" });
  };

  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: Math.min(520, window.innerHeight * 0.6),
        });
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const scaleX = (pct: number) => (pct / 100) * dimensions.width;
  const scaleY = (pct: number) => (pct / 100) * dimensions.height;

  return (
    <div>
    <DemoDataNotice>技能等级、解锁状态和进度为原型样本。</DemoDataNotice>
    <div ref={containerRef} className="relative w-full hidden md:block" style={{ height: dimensions.height }}>
      <svg className="absolute inset-0 w-full h-full z-0">
        <defs>
          <linearGradient id="skillFlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(79,195,247,0.3)" />
            <stop offset="50%" stopColor="rgba(124,77,255,0.3)" />
            <stop offset="100%" stopColor="rgba(0,229,255,0.3)" />
          </linearGradient>
          <filter id="skillGlow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {SKILL_TREE.map((skill) =>
          skill.prerequisites.map((preReqId) => {
            const prereq = SKILL_TREE.find((s) => s.id === preReqId);
            if (!prereq) return null;
            return (
              <g key={`${prereq.id}-${skill.id}`}>
                <motion.line
                  x1={scaleX(prereq.x)}
                  y1={scaleY(prereq.y)}
                  x2={scaleX(skill.x)}
                  y2={scaleY(skill.y)}
                  stroke="url(#skillFlow)"
                  strokeWidth={1.5}
                  opacity={skill.unlocked ? 0.5 : 0.15}
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: 0.2 }}
                  filter="url(#skillGlow)"
                />
                <motion.circle
                  r={2.5}
                  fill={skill.unlocked ? "#4FC3F7" : "#546E7A"}
                  initial={{ cx: scaleX(prereq.x), cy: scaleY(prereq.y), opacity: 0 }}
                  animate={{
                    cx: [scaleX(prereq.x), scaleX(skill.x), scaleX(prereq.x)],
                    cy: [scaleY(prereq.y), scaleY(skill.y), scaleY(prereq.y)],
                    opacity: [0, 0.8, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: (skill.level + prereq.level) % 4 * 0.5,
                    ease: "easeInOut",
                  }}
                />
              </g>
            );
          })
        )}
      </svg>

      {SKILL_TREE.map((skill, i) => (
        <motion.button
          key={skill.id}
          type="button"
          aria-label={`${skill.name}，等级 ${skill.level}，演示进度 ${skill.progress}%`}
          aria-pressed={selectedSkill === skill.id}
          className="absolute z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon-cyan"
          style={{
            left: scaleX(skill.x),
            top: scaleY(skill.y),
            transform: "translate(-50%, -50%)",
          }}
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
          onMouseEnter={() => setHoveredSkill(skill.id)}
          onMouseLeave={() => setHoveredSkill(null)}
          onFocus={() => setHoveredSkill(skill.id)}
          onBlur={() => setHoveredSkill(null)}
          onClick={() => selectSkill(skill.id)}
        >
          <SkillNodeCard skill={skill} isHovered={hoveredSkill === skill.id || selectedSkill === skill.id} />
        </motion.button>
      ))}
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2" aria-label="技能选择">
      {SKILL_TREE.map((skill) => <button key={skill.id} type="button" aria-pressed={selectedSkill === skill.id} onClick={() => selectSkill(skill.id)} className={`text-left text-xs p-2 border rounded break-words ${selectedSkill === skill.id ? "border-neon-cyan text-neon-cyan" : "border-white/15 text-white/60"}`}><span>{skill.name}</span><span className="block text-[10px] opacity-70">Lv.{skill.level} · {skill.progress}% · {skill.unlocked ? "已解锁" : "未解锁"}</span><span className="block text-[10px] opacity-70">{skill.category}</span></button>)}
    </div>
    </div>
  );
}

function SkillNodeCard({
  skill,
  isHovered,
}: {
  skill: SkillNode;
  isHovered: boolean;
}) {
  const color = skill.unlocked ? "#4FC3F7" : "#37474F";
  const glowColor = skill.unlocked ? "rgba(79,195,247,0.5)" : "rgba(55,71,79,0.3)";

  return (
    <motion.div
      className="relative cursor-pointer"
      animate={{ scale: isHovered ? 1.15 : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <motion.div
        className="absolute inset-0 rounded-full blur-xl"
        style={{ backgroundColor: glowColor }}
        animate={{
          opacity: skill.unlocked ? [0.1, 0.3, 0.1] : 0.05,
          scale: [0.8, 1.2, 0.8],
        }}
        transition={{ duration: 2 + (skill.level % 3) * 0.25, repeat: Infinity }}
      />

      <div
        className="relative w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${color}30, ${color}08)`,
          border: `1.5px solid ${color}50`,
          boxShadow: `0 0 ${isHovered ? 25 : 12}px ${glowColor}`,
        }}
      >
        <span className="text-lg md:text-xl" style={{ color }}>
          {skill.icon}
        </span>

        {skill.unlocked && (
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              fill="none"
              stroke={color}
              strokeWidth="1.5"
              strokeDasharray={`${skill.progress * 2.83} 283`}
              opacity={0.4}
            />
          </svg>
        )}
      </div>

      <div className="text-center mt-1.5 w-16 md:w-36 -ml-2 md:-ml-10">
        <p
          className="text-[11px] md:text-[10px] font-mono break-words"
          style={{ color }}
        >
          {skill.name}
        </p>
      </div>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-32 md:w-40 glass-panel p-3 z-20 hidden md:block"
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
          >
            <p className="text-[10px] font-mono text-neon-blue/90 mb-1">{skill.name}</p>
            <div className="flex items-center gap-2 mb-1">
              <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-neon-blue to-neon-purple"
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.progress}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>
              <span className="text-[11px] font-mono text-neon-cyan">{skill.progress}%</span>
            </div>
            <span className="text-[11px] font-mono text-white/55 uppercase">
              Lv.{skill.level} · {skill.category}
            </span>
            <div className="mt-1.5 flex items-center gap-1">
              <div
                className="w-full h-0.5 rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${color}00, ${color}50, ${color}00)`,
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
