"use client";

import { motion } from "framer-motion";
import StarField from "./StarField";
import NeuralParticles from "./NeuralParticles";
import LightGalaxyScene from "./LightGalaxyScene";
import { useMountedTheme } from "@/hooks/useMountedTheme";
import { useUISettingsOptional } from "@/contexts/UISettingsContext";

export type SpaceTheme = "command" | "analytics" | "routing" | "history";

interface SpaceBackgroundProps {
  theme?: SpaceTheme;
}

const DARK_THEME_CONFIG: Record<
  SpaceTheme,
  {
    nebula1: string;
    nebula2: string;
    nebula3: string;
    gridOpacity: number;
    lineColor: string;
    dotColor: string;
    starDensity: number;
    baseGradient: string;
    vignette: string;
  }
> = {
  command: {
    nebula1: "rgba(239,68,68,0.1)",
    nebula2: "rgba(59,130,246,0.12)",
    nebula3: "rgba(99,102,241,0.07)",
    gridOpacity: 0.35,
    lineColor: "59, 130, 246",
    dotColor: "147, 197, 253",
    starDensity: 1,
    baseGradient: "linear-gradient(180deg, #020108 0%, #0a0e1f 40%, #060612 100%)",
    vignette: "radial-gradient(ellipse 90% 60% at 50% 0%, rgba(15,23,42,0.7) 0%, transparent 65%)",
  },
  analytics: {
    nebula1: "rgba(52,211,153,0.08)",
    nebula2: "rgba(59,130,246,0.14)",
    nebula3: "rgba(168,85,247,0.09)",
    gridOpacity: 0.4,
    lineColor: "52, 211, 153",
    dotColor: "110, 231, 183",
    starDensity: 0.8,
    baseGradient: "linear-gradient(180deg, #020108 0%, #0a0e1f 40%, #060612 100%)",
    vignette: "radial-gradient(ellipse 90% 60% at 50% 0%, rgba(15,23,42,0.7) 0%, transparent 65%)",
  },
  routing: {
    nebula1: "rgba(139,92,246,0.12)",
    nebula2: "rgba(59,130,246,0.1)",
    nebula3: "rgba(239,68,68,0.06)",
    gridOpacity: 0.45,
    lineColor: "139, 92, 246",
    dotColor: "196, 181, 253",
    starDensity: 1.2,
    baseGradient: "linear-gradient(180deg, #020108 0%, #0a0e1f 40%, #060612 100%)",
    vignette: "radial-gradient(ellipse 90% 60% at 50% 0%, rgba(15,23,42,0.7) 0%, transparent 65%)",
  },
  history: {
    nebula1: "rgba(251,191,36,0.07)",
    nebula2: "rgba(59,130,246,0.1)",
    nebula3: "rgba(239,68,68,0.05)",
    gridOpacity: 0.3,
    lineColor: "251, 191, 36",
    dotColor: "253, 224, 71",
    starDensity: 0.9,
    baseGradient: "linear-gradient(180deg, #020108 0%, #0a0e1f 40%, #060612 100%)",
    vignette: "radial-gradient(ellipse 90% 60% at 50% 0%, rgba(15,23,42,0.7) 0%, transparent 65%)",
  },
};

const LIGHT_THEME_CONFIG: Record<SpaceTheme, typeof DARK_THEME_CONFIG.command> = {
  command: {
    nebula1: "rgba(80,120,255,0.38)",
    nebula2: "rgba(139,92,246,0.32)",
    nebula3: "rgba(34,211,238,0.22)",
    gridOpacity: 0.48,
    lineColor: "80, 120, 255",
    dotColor: "59, 130, 246",
    starDensity: 1,
    baseGradient:
      "linear-gradient(155deg, #E8E4DA 0%, #E7ECFF 38%, #DDD7F5 68%, #E8E4DA 88%, #E7ECFF 100%)",
    vignette:
      "radial-gradient(ellipse 100% 70% at 50% 100%, rgba(80,120,255,0.14) 0%, transparent 55%), radial-gradient(ellipse 80% 50% at 50% 0%, rgba(139,92,246,0.1) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 85% 30%, rgba(34,211,238,0.06) 0%, transparent 50%)",
  },
  analytics: {
    nebula1: "rgba(52,211,153,0.32)",
    nebula2: "rgba(80,120,255,0.38)",
    nebula3: "rgba(167,139,250,0.28)",
    gridOpacity: 0.42,
    lineColor: "52, 211, 153",
    dotColor: "34, 211, 238",
    starDensity: 0.95,
    baseGradient:
      "linear-gradient(155deg, #E8E4DA 0%, #E7ECFF 38%, #DDD7F5 68%, #E8E4DA 88%, #E7ECFF 100%)",
    vignette:
      "radial-gradient(ellipse 100% 70% at 50% 100%, rgba(80,120,255,0.14) 0%, transparent 55%), radial-gradient(ellipse 80% 50% at 50% 0%, rgba(139,92,246,0.1) 0%, transparent 60%)",
  },
  routing: {
    nebula1: "rgba(139,92,246,0.38)",
    nebula2: "rgba(80,120,255,0.36)",
    nebula3: "rgba(34,211,238,0.22)",
    gridOpacity: 0.44,
    lineColor: "139, 92, 246",
    dotColor: "167, 139, 250",
    starDensity: 1.05,
    baseGradient:
      "linear-gradient(155deg, #E8E4DA 0%, #E7ECFF 38%, #DDD7F5 68%, #E8E4DA 88%, #E7ECFF 100%)",
    vignette:
      "radial-gradient(ellipse 100% 70% at 50% 100%, rgba(80,120,255,0.14) 0%, transparent 55%), radial-gradient(ellipse 80% 50% at 50% 0%, rgba(139,92,246,0.1) 0%, transparent 60%)",
  },
  history: {
    nebula1: "rgba(251,191,36,0.22)",
    nebula2: "rgba(80,120,255,0.34)",
    nebula3: "rgba(167,139,250,0.26)",
    gridOpacity: 0.4,
    lineColor: "251, 191, 36",
    dotColor: "80, 120, 255",
    starDensity: 0.9,
    baseGradient:
      "linear-gradient(155deg, #E8E4DA 0%, #E7ECFF 38%, #DDD7F5 68%, #E8E4DA 88%, #E7ECFF 100%)",
    vignette:
      "radial-gradient(ellipse 100% 70% at 50% 100%, rgba(80,120,255,0.14) 0%, transparent 55%), radial-gradient(ellipse 80% 50% at 50% 0%, rgba(139,92,246,0.1) 0%, transparent 60%)",
  },
};

export default function SpaceBackground({ theme = "command" }: SpaceBackgroundProps) {
  const { isLight } = useMountedTheme();
  const settings = useUISettingsOptional();
  const config = isLight ? LIGHT_THEME_CONFIG[theme] : DARK_THEME_CONFIG[theme];
  const glowMultiplier = settings?.glowMultiplier ?? 0.7;
  const themeMode = settings?.themeMode ?? "deep";
  const animationsEnabled = settings?.animationsEnabled !== false;

  const lightNebulaOpacity = (themeMode === "nebula" ? 0.52 : themeMode === "minimal" ? 0.32 : 0.46) * (0.85 + glowMultiplier * 0.3);
  const lightNeuralOpacity = (0.5 + glowMultiplier * 0.35) * (themeMode === "nebula" ? 1.15 : themeMode === "minimal" ? 0.65 : 1);
  const showNeural = themeMode !== "minimal" || glowMultiplier > 0.2;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="absolute inset-0" style={{ background: config.baseGradient }} />

      {isLight && <LightGalaxyScene />}

      <StarField density={config.starDensity} light={isLight} />

      <div
        className="absolute inset-0"
        style={{
          opacity: config.gridOpacity,
          backgroundImage: `
            linear-gradient(rgba(80,120,255,${isLight ? 0.14 : 0.04}) 1px, transparent 1px),
            linear-gradient(90deg, rgba(80,120,255,${isLight ? 0.14 : 0.04}) 1px, transparent 1px)
          `,
          backgroundSize: "56px 56px",
        }}
      />

      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full"
        style={{
          background: `radial-gradient(circle, ${config.nebula1} 0%, transparent 70%)`,
          top: "-25%",
          right: "-15%",
          filter: isLight ? "blur(120px)" : "blur(70px)",
          opacity: isLight ? lightNebulaOpacity : 1,
        }}
        animate={animationsEnabled ? { x: [0, 50, 0], y: [0, 40, 0], rotate: [0, 15, 0] } : undefined}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[650px] h-[650px] rounded-full"
        style={{
          background: `radial-gradient(circle, ${config.nebula2} 0%, transparent 70%)`,
          bottom: "-20%",
          left: "-10%",
          filter: isLight ? "blur(120px)" : "blur(70px)",
          opacity: isLight ? lightNebulaOpacity : 1,
        }}
        animate={animationsEnabled ? { x: [0, -40, 0], y: [0, -50, 0] } : undefined}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          background: `radial-gradient(circle, ${config.nebula3} 0%, transparent 70%)`,
          top: "35%",
          left: "30%",
          filter: isLight ? "blur(120px)" : "blur(90px)",
          opacity: isLight ? lightNebulaOpacity : 1,
        }}
        animate={animationsEnabled ? { x: [0, 60, -30, 0], y: [0, -40, 30, 0] } : undefined}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
      />

      {showNeural && (
        <div style={{ opacity: isLight ? lightNeuralOpacity : 1 }} className="absolute inset-0">
          <NeuralParticles lineColor={config.lineColor} dotColor={config.dotColor} light={isLight} />
        </div>
      )}

      <div className="absolute inset-0" style={{ background: config.vignette }} />
    </div>
  );
}
