"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Menu, X, Network } from "lucide-react";

const NAV_ITEMS = [
  { id: "hero", label: "协作园区", icon: "01" },
  { id: "timeline", label: "文明时间线", icon: "02" },
  { id: "agents", label: "智能体", icon: "03" },
  { id: "heatmap", label: "全球活动", icon: "04" },
  { id: "skills", label: "技能进化", icon: "05" },
  { id: "city", label: "城市档案", icon: "06" },
  { id: "query", label: "知识问答", icon: "07" },
  { id: "dashboard", label: "指挥中心", icon: "08" },
];

export function Navigation() {
  const [active, setActive] = useState("hero");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    menuRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = NAV_ITEMS.map((item) => document.getElementById(item.id));
      const scrollPos = window.scrollY + window.innerHeight / 3;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPos) {
          setActive(NAV_ITEMS[i].id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && mobileOpen) {
        setMobileOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileOpen]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
      el.tabIndex = -1;
      el.focus({ preventScroll: true });
      setMobileOpen(false);
    }
  };

  return (
    <>
      <motion.nav
        aria-label="Primary navigation"
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "bg-[#122126]/95 border-b border-white/15 py-2.5 backdrop-blur-xl"
            : "bg-[#122126]/95 border-b border-white/15 py-3.5"
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          <button
            onClick={() => scrollTo("hero")}
            aria-label="Return to NEXUS home"
            className="flex items-center gap-2.5 group"
          >
            <Network size={22} className="text-[#A3E1D1]" />
            <span className="text-sm font-semibold text-white group-hover:text-neon-blue transition-colors">
              NEXUS
            </span>
          </button>

          <div className="hidden md:flex items-center gap-0.5">
            {NAV_ITEMS.slice(1).map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={cn(
                  "relative px-3 py-2 text-xs transition-all duration-300 rounded",
                  active === item.id
                    ? "text-[#B5EBDA] bg-[#B5EBDA]/10"
                    : "text-white/75 hover:text-white hover:bg-white/5"
                )}
                aria-current={active === item.id ? "page" : undefined}
              >
                {item.label}
                {active === item.id && (
                  <motion.div
                    className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-neon-blue shadow-neon-blue"
                    layoutId="nav-dot"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          <button
            ref={toggleRef}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            className="md:hidden text-white/85 hover:text-neon-blue transition-colors p-3"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            ref={menuRef}
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            onKeyDown={(event) => {
              if (event.key !== "Tab") return;
              const buttons = Array.from(menuRef.current?.querySelectorAll<HTMLButtonElement>("button") ?? []);
              const first = buttons[0];
              const last = buttons[buttons.length - 1];
              if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last?.focus();
              } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first?.focus();
              }
            }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/98 backdrop-blur-2xl md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex flex-col gap-3">
              <button type="button" onClick={() => { setMobileOpen(false); toggleRef.current?.focus(); }} className="self-end p-3 text-white/85" aria-label="关闭导航菜单"><X size={22} /></button>
              {NAV_ITEMS.map((item, i) => (
                <motion.button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={cn(
                    "text-lg px-6 py-3 rounded transition-all text-left",
                    active === item.id
                      ? "text-neon-blue bg-neon-blue/5"
                      : "text-white/80"
                  )}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
