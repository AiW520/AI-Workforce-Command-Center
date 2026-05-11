export interface Agent {
  id: string;
  name: string;
  role: string;
  status: "active" | "processing" | "idle" | "error";
  x: number;
  y: number;
  connections: string[];
  icon: string;
  description: string;
  metrics: {
    tasksCompleted: number;
    accuracy: number;
    latency: number;
  };
}

export interface SkillNode {
  id: string;
  name: string;
  category: string;
  level: number;
  progress: number;
  x: number;
  y: number;
  prerequisites: string[];
  unlocked: boolean;
  icon: string;
  energy: number;
}

export interface CareerRole {
  id: string;
  title: string;
  category: string;
  demand: number;
  salary: { min: number; max: number; currency: string };
  skills: string[];
  orbit: number;
  angle: number;
  growth: number;
  companies: string[];
}

export interface DashboardMetrics {
  activeAgents: number;
  tasksInQueue: number;
  completedToday: number;
  systemHealth: number;
  tokenUsage: number;
  avgResponseTime: number;
  successRate: number;
  uptime: number;
}

export interface DataPoint {
  time: string;
  value: number;
  label: string;
}

export interface OrbitalPath {
  radius: number;
  speed: number;
  opacity: number;
  color: string;
}

export interface Particle {
  id: number;
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

export interface ConnectionLine {
  from: { x: number; y: number };
  to: { x: number; y: number };
  active: boolean;
  strength: number;
  id: string;
}