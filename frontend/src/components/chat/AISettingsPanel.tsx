"use client";

import { motion } from "framer-motion";
import { useUISettings, type ThemeMode } from "@/contexts/UISettingsContext";
import { cn } from "@/lib/utils";

const THEME_OPTIONS: { id: ThemeMode; label: string; desc: string }[] = [
  { id: "deep", label: "Deep Space", desc: "Balanced nebula depth" },
  { id: "nebula", label: "Nebula Glow", desc: "Rich particles & glow" },
  { id: "minimal", label: "Minimal Orbit", desc: "Lightweight visuals" },
];

export default function AISettingsPanel() {
  const {
    animationsEnabled,
    particlesEnabled,
    glowIntensity,
    demoMode,
    themeMode,
    setAnimationsEnabled,
    setParticlesEnabled,
    setGlowIntensity,
    setDemoMode,
    setThemeMode,
  } = useUISettings();

  return (
    <div className="p-4">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-theme">AI Controls</h3>
        <p className="text-[10px] text-theme-subtle mt-0.5">Customize console experience</p>
      </div>

      <div className="space-y-3">
        <ToggleRow label="Enable animations" checked={animationsEnabled} onChange={setAnimationsEnabled} />
        <ToggleRow label="Space particles" checked={particlesEnabled} onChange={setParticlesEnabled} />
        <ToggleRow label="Demo mode" checked={demoMode} onChange={setDemoMode} hint="Force offline router responses" />

        <div className="px-3 py-3 rounded-xl bg-slate-900/4 dark:bg-white/[0.03] border border-slate-900/8 dark:border-white/[0.06]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-theme">AI glow intensity</span>
            <span className="text-[10px] font-mono text-amd-red">{glowIntensity}%</span>
          </div>
          <input
            data-interactive
            type="range"
            min={0}
            max={100}
            value={glowIntensity}
            onChange={(e) => setGlowIntensity(Number(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none bg-slate-900/10 dark:bg-white/10 cursor-pointer accent-amd-blue"
          />
        </div>

        <div className="px-3 py-3 rounded-xl bg-slate-900/4 dark:bg-white/[0.03] border border-slate-900/8 dark:border-white/[0.06]">
          <p className="text-xs text-theme mb-2">Theme mode</p>
          <div className="space-y-1.5">
            {THEME_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                data-interactive
                onClick={() => setThemeMode(opt.id)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all cursor-pointer",
                  themeMode === opt.id
                    ? "bg-amd-red/15 border border-amd-red/30 text-slate-900 dark:text-white"
                    : "hover:bg-slate-900/4 dark:hover:bg-white/[0.04] border border-transparent text-theme-muted"
                )}
              >
                <div>
                  <p className="text-xs font-medium">{opt.label}</p>
                  <p className="text-[10px] text-theme-subtle">{opt.desc}</p>
                </div>
                {themeMode === opt.id && (
                  <motion.span layoutId="theme-dot" className="w-2 h-2 rounded-full bg-amd-red" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
  hint,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  hint?: string;
}) {
  return (
    <button
      type="button"
      data-interactive
      onClick={() => onChange(!checked)}
      className="w-full flex items-center justify-between gap-3 px-3 py-3 rounded-xl bg-slate-900/3 dark:bg-white/[0.03] border border-slate-900/8 dark:border-white/[0.06] hover:border-slate-900/12 dark:hover:border-white/12 transition-colors cursor-pointer text-left"
    >
      <div>
        <p className="text-xs text-theme">{label}</p>
        {hint && <p className="text-[10px] text-theme-subtle mt-0.5">{hint}</p>}
      </div>
      <motion.div
        className={cn(
          "w-10 h-5 rounded-full p-0.5 shrink-0 transition-colors",
          checked ? "bg-amd-red" : "bg-slate-900/12 dark:bg-white/15"
        )}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="w-4 h-4 rounded-full bg-white shadow-md"
          animate={{ x: checked ? 20 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </motion.div>
    </button>
  );
}
