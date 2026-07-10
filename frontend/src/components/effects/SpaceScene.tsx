"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import SpaceBackground, { type SpaceTheme } from "./SpaceBackground";
import FloatingParticles from "./FloatingParticles";
import OrbitRings from "./OrbitRings";
import { useMountedTheme } from "@/hooks/useMountedTheme";
import { useUISettingsOptional } from "@/contexts/UISettingsContext";

const DARK_ORBIT: Record<SpaceTheme, { ring: string; planet: string }> = {
  command: { ring: "rgba(59,130,246,0.12)", planet: "rgba(59,130,246,0.3)" },
  analytics: { ring: "rgba(52,211,153,0.1)", planet: "rgba(52,211,153,0.28)" },
  routing: { ring: "rgba(139,92,246,0.12)", planet: "rgba(139,92,246,0.3)" },
  history: { ring: "rgba(251,191,36,0.08)", planet: "rgba(251,191,36,0.22)" },
};

const LIGHT_ORBIT: Record<SpaceTheme, { ring: string; planet: string }> = {
  command: { ring: "rgba(80,120,255,0.48)", planet: "rgba(59,130,246,0.75)" },
  analytics: { ring: "rgba(52,211,153,0.42)", planet: "rgba(34,211,238,0.65)" },
  routing: { ring: "rgba(139,92,246,0.45)", planet: "rgba(139,92,246,0.65)" },
  history: { ring: "rgba(245,158,11,0.38)", planet: "rgba(251,191,36,0.6)" },
};

interface SpaceSceneProps {
  theme?: SpaceTheme;
}

export default function SpaceScene({ theme = "command" }: SpaceSceneProps) {
  const { isLight } = useMountedTheme();
  const settings = useUISettingsOptional();
  const orbit = isLight ? LIGHT_ORBIT[theme] : DARK_ORBIT[theme];
  const parallaxX = useMotionValue(0);
  const parallaxY = useMotionValue(0);
  const bgX = useSpring(parallaxX, { stiffness: 40, damping: 26 });
  const bgY = useSpring(parallaxY, { stiffness: 40, damping: 26 });
  const mounted = useRef(false);

  const glowMultiplier = settings?.glowMultiplier ?? 0.7;
  const themeMode = settings?.themeMode ?? "deep";
  const animationsEnabled = settings?.animationsEnabled !== false;
  const particleCount = settings?.particleCount ?? 22;
  const showOrbits = settings?.themeMode !== "minimal";
  const fxOpacity = isLight
    ? (0.58 + glowMultiplier * 0.22) * (themeMode === "nebula" ? 1.12 : themeMode === "minimal" ? 0.75 : 1)
    : 1;

  useEffect(() => {
    mounted.current = true;
    if (!animationsEnabled || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onMove = (e: MouseEvent) => {
      if (!mounted.current) return;
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      parallaxX.set(((e.clientX - cx) / cx) * 5);
      parallaxY.set(((e.clientY - cy) / cy) * 4);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      mounted.current = false;
      window.removeEventListener("mousemove", onMove);
    };
  }, [parallaxX, parallaxY, animationsEnabled]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <motion.div className="absolute inset-0" style={animationsEnabled ? { x: bgX, y: bgY } : undefined}>
        <SpaceBackground theme={theme} />
      </motion.div>

      {particleCount > 0 && (
        <div className="absolute inset-0" style={{ opacity: fxOpacity }}>
          <FloatingParticles count={particleCount} light={isLight} />
        </div>
      )}

      {showOrbits && (
        <div className="absolute inset-0" style={{ opacity: fxOpacity }}>
          <OrbitRings color={orbit.ring} planetColor={orbit.planet} light={isLight} />
        </div>
      )}

      <div
        className="absolute inset-0"
        style={{
          background: isLight
            ? "radial-gradient(ellipse 70% 50% at 42% 38%, rgba(80,120,255,0.08) 0%, transparent 55%), radial-gradient(ellipse 55% 45% at 68% 52%, rgba(139,92,246,0.07) 0%, transparent 50%), radial-gradient(ellipse 75% 55% at 50% 50%, transparent 30%, rgba(80,120,255,0.06) 100%)"
            : "radial-gradient(ellipse 70% 50% at 50% 50%, transparent 30%, rgba(2,1,8,0.5) 100%)",
        }}
      />
    </div>
  );
}
