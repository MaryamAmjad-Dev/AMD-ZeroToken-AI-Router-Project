"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useMountedTheme } from "@/hooks/useMountedTheme";
import { useUISettingsOptional } from "@/contexts/UISettingsContext";

const CLICKABLE_SELECTOR =
  "button, a, input, textarea, select, label, [data-interactive], [data-glow-card], [role='button'], [role='menuitem'], [role='option']";

const PARTICLE_LIFE_MS = 300;

interface ClickRipple {
  id: number;
  x: number;
  y: number;
}

interface BurstParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  born: number;
}

export default function CursorAI() {
  const { isLight } = useMountedTheme();
  const settings = useUISettingsOptional();
  const glowMultiplier = settings?.glowMultiplier ?? 0.7;
  const animationsEnabled = settings?.animationsEnabled !== false;

  const hoverElRef = useRef<HTMLElement | null>(null);
  const particlesRef = useRef<BurstParticle[]>([]);
  const clickIdRef = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [ripples, setRipples] = useState<ClickRipple[]>([]);

  const pointerX = useMotionValue(-100);
  const pointerY = useMotionValue(-100);
  const hover = useMotionValue(0);
  const cursorOpacity = useMotionValue(0);

  const glowX = useSpring(pointerX, { stiffness: 520, damping: 42, mass: 0.35 });
  const glowY = useSpring(pointerY, { stiffness: 520, damping: 42, mass: 0.35 });

  const ringScale = useTransform(hover, [0, 1], [1, 1.22]);
  const ringOpacity = useTransform(hover, [0, 1], [0.35, 1]);
  const glowSize = useTransform(
    hover,
    [0, 1],
    [64 * glowMultiplier + 24, 88 * glowMultiplier + 28]
  );
  const glowOpacity = useTransform(
    hover,
    [0, 1],
    [(isLight ? 0.05 : 0.07) * glowMultiplier + 0.04, (isLight ? 0.09 : 0.12) * glowMultiplier + 0.06]
  );

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(fine && !reduced && animationsEnabled);
  }, [animationsEnabled]);

  useEffect(() => {
    if (!enabled) {
      document.body.classList.remove("ai-cursor-active");
      hoverElRef.current?.classList.remove("ai-cursor-hover-target");
      hoverElRef.current = null;
      return;
    }

    document.body.classList.add("ai-cursor-active");

    const clearHoverTarget = () => {
      hoverElRef.current?.classList.remove("ai-cursor-hover-target");
      hoverElRef.current = null;
    };

    const onMove = (e: MouseEvent) => {
      pointerX.set(e.clientX);
      pointerY.set(e.clientY);
      cursorOpacity.set(1);

      if ((e.target as HTMLElement).closest("[data-display-only]")) {
        hover.set(0);
        if (hoverElRef.current) {
          hoverElRef.current.classList.remove("ai-cursor-hover-target");
          hoverElRef.current = null;
        }
        return;
      }

      const el = (e.target as HTMLElement).closest(CLICKABLE_SELECTOR);
      hover.set(el ? 1 : 0);

      if (hoverElRef.current !== el) {
        hoverElRef.current?.classList.remove("ai-cursor-hover-target");
        if (el instanceof HTMLElement) {
          el.classList.add("ai-cursor-hover-target");
          hoverElRef.current = el;
        } else {
          hoverElRef.current = null;
        }
      }
    };

    const onLeave = () => {
      cursorOpacity.set(0);
      hover.set(0);
      clearHoverTarget();
    };

    const onClick = (e: MouseEvent) => {
      const id = ++clickIdRef.current;
      setRipples((prev) => [...prev, { id, x: e.clientX, y: e.clientY }]);
      window.setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, PARTICLE_LIFE_MS);

      const now = performance.now();
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2 + Math.random() * 0.25;
        const speed = 1.8 + Math.random() * 2.2;
        particlesRef.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          born: now,
        });
      }
      if (particlesRef.current.length > 32) {
        particlesRef.current = particlesRef.current.slice(-32);
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("click", onClick, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("click", onClick);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.body.classList.remove("ai-cursor-active");
      clearHoverTarget();
    };
  }, [enabled, pointerX, pointerY, hover, cursorOpacity]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !enabled) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let running = true;
    let animId = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const draw = (time: number) => {
      if (!running) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current = particlesRef.current.filter((p) => time - p.born < PARTICLE_LIFE_MS);

      for (const p of particlesRef.current) {
        const age = (time - p.born) / PARTICLE_LIFE_MS;
        const life = 1 - age;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.92;
        p.vy *= 0.92;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.2 + life * 1.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 59, 48, ${life * 0.85 * glowMultiplier})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    resize();
    animId = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);

    return () => {
      running = false;
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
      particlesRef.current = [];
    };
  }, [enabled, glowMultiplier]);

  if (!enabled) return null;

  const glowGradient = isLight
    ? "radial-gradient(circle, rgba(255,59,48,0.28) 0%, rgba(229,57,53,0.12) 45%, transparent 72%)"
    : "radial-gradient(circle, rgba(255,59,48,0.32) 0%, rgba(255,106,0,0.1) 45%, transparent 72%)";

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[10000] hidden md:block"
        aria-hidden
      />

      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[10001] hidden md:block"
        style={{ x: glowX, y: glowY, opacity: cursorOpacity }}
      >
        <motion.div
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: glowSize,
            height: glowSize,
            opacity: glowOpacity,
            background: glowGradient,
            filter: "blur(22px)",
          }}
        />
      </motion.div>

      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[10002] hidden md:block"
        style={{ x: pointerX, y: pointerY, opacity: cursorOpacity }}
      >
        <motion.div
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#ff3b30]"
          style={{
            width: 22,
            height: 22,
            scale: ringScale,
            opacity: ringOpacity,
            boxShadow: "0 0 12px rgba(255, 59, 48, 0.35)",
          }}
        />

        <div
          className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-3.5 h-px bg-[#ff3b30]/50"
          aria-hidden
        />
        <div
          className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-px h-3.5 bg-[#ff3b30]/50"
          aria-hidden
        />

        <div
          className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-[7px] h-[7px] rounded-full bg-[#ff3b30]"
          style={{
            boxShadow: isLight
              ? "0 0 8px rgba(255, 59, 48, 0.85), 0 0 2px rgba(255, 255, 255, 0.9)"
              : "0 0 10px rgba(255, 59, 48, 0.95), 0 0 3px rgba(255, 255, 255, 0.45)",
          }}
          aria-hidden
        />
      </motion.div>

      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            className="fixed pointer-events-none z-[10002] hidden md:block rounded-full border border-[#ff3b30]"
            style={{ left: ripple.x, top: ripple.y }}
            initial={{ width: 6, height: 6, x: "-50%", y: "-50%", opacity: 0.75 }}
            animate={{ width: 44, height: 44, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            aria-hidden
          />
        ))}
      </AnimatePresence>
    </>
  );
}
