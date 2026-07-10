"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CursorGlow() {
  const target = useRef({ x: 0, y: 0 });
  const rafId = useRef(0);
  const mounted = useRef(false);
  const [isHoveringCard, setIsHoveringCard] = useState(false);
  const [visible, setVisible] = useState(false);
  const [enabled, setEnabled] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 60, damping: 20, mass: 0.8 });
  const springY = useSpring(y, { stiffness: 60, damping: 20, mass: 0.8 });

  useEffect(() => {
    mounted.current = true;
    setEnabled(window.matchMedia("(pointer: fine)").matches);
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
      setVisible(true);
    };

    const onOver = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest("[data-glow-card]");
      setIsHoveringCard(!!el);
    };

    const onLeave = () => setVisible(false);

    const tick = () => {
      if (!mounted.current) return;
      x.set(target.current.x);
      y.set(target.current.y);
      rafId.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    rafId.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(rafId.current);
      rafId.current = 0;
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[5] hidden md:block"
      style={{ x: springX, y: springY }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
        animate={{
          width: isHoveringCard ? 420 : 320,
          height: isHoveringCard ? 420 : 320,
          opacity: isHoveringCard ? 0.35 : 0.2,
        }}
        transition={{ type: "spring", stiffness: 120, damping: 22 }}
        style={{
          background:
            "radial-gradient(circle, rgba(59,130,246,0.25) 0%, rgba(239,68,68,0.08) 40%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <motion.div
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
        animate={{
          width: isHoveringCard ? 120 : 80,
          height: isHoveringCard ? 120 : 80,
          opacity: isHoveringCard ? 0.5 : 0.3,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        style={{
          background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)",
          filter: "blur(12px)",
        }}
      />
    </motion.div>
  );
}
