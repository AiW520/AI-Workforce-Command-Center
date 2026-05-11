const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        space: {
          deep: "#030712",
          dark: "#0A0A1A",
          mid: "#111827",
          light: "#1E293B",
        },
        neon: {
          blue: "#4FC3F7",
          cyan: "#00E5FF",
          purple: "#7C4DFF",
          violet: "#B388FF",
          pink: "#FF4081",
        },
        quantum: {
          blue: "#0D47A1",
          cyan: "#006064",
          purple: "#311B92",
          dark: "#12062A",
        },
        plasma: {
          amber: "#FFB300",
          lime: "#76FF03",
          crimson: "#FF1744",
          gold: "#FFD700",
        },
        hud: {
          grid: "rgba(79,195,247,0.08)",
          line: "rgba(79,195,247,0.15)",
          text: "rgba(79,195,247,0.7)",
          glow: "rgba(124,77,255,0.4)",
        },
      },
      fontFamily: {
        mono: ["var(--font-geist-mono)", "JetBrains Mono", "monospace"],
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
        display: ["Orbitron", "Rajdhani", "monospace"],
      },
      animation: {
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        "data-flow": "dataFlow 2s linear infinite",
        "orbit": "orbit 20s linear infinite",
        "orbit-fast": "orbit 10s linear infinite",
        "orbit-slow": "orbit 40s linear infinite",
        "node-pulse": "nodePulse 2s ease-in-out infinite",
        "scan-line": "scanLine 4s linear infinite",
        "flicker": "flicker 0.15s infinite alternate",
        "energy-flow": "energyFlow 3s ease-in-out infinite",
        "grid-scroll": "gridScroll 20s linear infinite",
        "spin-slow": "spin 8s linear infinite",
        "holo-rotate": "holoRotate 12s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "data-pulse": "dataPulse 1.5s ease-in-out infinite",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(79,195,247,0.3)" },
          "50%": { boxShadow: "0 0 60px rgba(124,77,255,0.7)" },
        },
        dataFlow: {
          "0%": { strokeDashoffset: "1000" },
          "100%": { strokeDashoffset: "0" },
        },
        orbit: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        nodePulse: {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.3)" },
        },
        scanLine: {
          "0%": { top: "0%" },
          "100%": { top: "100%" },
        },
        flicker: {
          "0%": { opacity: "0.8" },
          "100%": { opacity: "1" },
        },
        energyFlow: {
          "0%, 100%": { opacity: "0.3", filter: "blur(8px)" },
          "50%": { opacity: "0.8", filter: "blur(2px)" },
        },
        gridScroll: {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "0 200px" },
        },
        holoRotate: {
          "0%, 100%": { transform: "rotateY(-5deg) rotateX(2deg)" },
          "50%": { transform: "rotateY(5deg) rotateX(-2deg)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        dataPulse: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(79,195,247,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(79,195,247,0.05) 1px, transparent 1px)",
        "grid-pattern-md":
          "linear-gradient(rgba(79,195,247,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(79,195,247,0.08) 1px, transparent 1px)",
        "gradient-radial":
          "radial-gradient(circle, var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "glass-glow":
          "linear-gradient(135deg, rgba(79,195,247,0.05) 0%, rgba(124,77,255,0.05) 50%, rgba(0,229,255,0.05) 100%)",
      },
      backgroundSize: {
        "grid-sm": "40px 40px",
        "grid-md": "80px 80px",
        "grid-lg": "120px 120px",
      },
      boxShadow: {
        "neon-blue": "0 0 30px rgba(79,195,247,0.3), 0 0 60px rgba(79,195,247,0.1)",
        "neon-purple": "0 0 30px rgba(124,77,255,0.3), 0 0 60px rgba(124,77,255,0.1)",
        "neon-cyan": "0 0 30px rgba(0,229,255,0.3), 0 0 60px rgba(0,229,255,0.1)",
        "hud":
          "inset 0 1px 0 rgba(255,255,255,0.05), 0 0 40px rgba(79,195,247,0.08)",
        "glass": "0 8px 32px rgba(0,0,0,0.4)",
      },
    },
  },
  plugins: [],
};

export default config;