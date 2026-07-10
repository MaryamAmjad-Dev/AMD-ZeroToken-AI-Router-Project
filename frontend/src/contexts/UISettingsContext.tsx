"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type ThemeMode = "deep" | "nebula" | "minimal";

export interface UISettings {
  animationsEnabled: boolean;
  particlesEnabled: boolean;
  glowIntensity: number;
  demoMode: boolean;
  themeMode: ThemeMode;
}

interface UISettingsContextValue extends UISettings {
  setAnimationsEnabled: (v: boolean) => void;
  setParticlesEnabled: (v: boolean) => void;
  setGlowIntensity: (v: number) => void;
  setDemoMode: (v: boolean) => void;
  setThemeMode: (v: ThemeMode) => void;
  glowMultiplier: number;
  particleCount: number;
}

const STORAGE_KEY = "zerotoken-ui-settings";

const DEFAULTS: UISettings = {
  animationsEnabled: true,
  particlesEnabled: true,
  glowIntensity: 70,
  demoMode: false,
  themeMode: "deep",
};

const THEME_PARTICLES: Record<ThemeMode, number> = {
  deep: 22,
  nebula: 32,
  minimal: 12,
};

const UISettingsContext = createContext<UISettingsContextValue | null>(null);

function loadSettings(): UISettings {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return DEFAULTS;
  }
}

export function UISettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<UISettings>(DEFAULTS);

  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.style.setProperty(
      "--ai-glow-strength",
      String(settings.glowIntensity / 100)
    );
  }, [settings.glowIntensity]);

  const persist = useCallback((patch: Partial<UISettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const setAnimationsEnabled = useCallback((v: boolean) => persist({ animationsEnabled: v }), [persist]);
  const setParticlesEnabled = useCallback((v: boolean) => persist({ particlesEnabled: v }), [persist]);
  const setGlowIntensity = useCallback(
    (v: number) => persist({ glowIntensity: Math.max(0, Math.min(100, v)) }),
    [persist]
  );
  const setDemoMode = useCallback((v: boolean) => persist({ demoMode: v }), [persist]);
  const setThemeMode = useCallback((v: ThemeMode) => persist({ themeMode: v }), [persist]);

  const value = useMemo<UISettingsContextValue>(
    () => ({
      ...settings,
      setAnimationsEnabled,
      setParticlesEnabled,
      setGlowIntensity,
      setDemoMode,
      setThemeMode,
      glowMultiplier: settings.glowIntensity / 100,
      particleCount: settings.particlesEnabled ? THEME_PARTICLES[settings.themeMode] : 0,
    }),
    [
      settings,
      setAnimationsEnabled,
      setParticlesEnabled,
      setGlowIntensity,
      setDemoMode,
      setThemeMode,
    ]
  );

  return <UISettingsContext.Provider value={value}>{children}</UISettingsContext.Provider>;
}

export function useUISettings() {
  const ctx = useContext(UISettingsContext);
  if (!ctx) throw new Error("useUISettings must be used within UISettingsProvider");
  return ctx;
}

export function useUISettingsOptional() {
  return useContext(UISettingsContext);
}
