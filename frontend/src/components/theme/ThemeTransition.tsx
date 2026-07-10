"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useMountedTheme } from "@/hooks/useMountedTheme";
import { useUISettingsOptional } from "@/contexts/UISettingsContext";

export default function ThemeTransition({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useMountedTheme();
  const settings = useUISettingsOptional();
  const motionOn = settings?.animationsEnabled !== false;

  if (!motionOn) {
    return <div className="h-full w-full">{children}</div>;
  }

  return (
    <motion.div
      key={resolvedTheme ?? "dark"}
      initial={{ opacity: 0.92 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="h-full w-full"
    >
      {children}
    </motion.div>
  );
}
