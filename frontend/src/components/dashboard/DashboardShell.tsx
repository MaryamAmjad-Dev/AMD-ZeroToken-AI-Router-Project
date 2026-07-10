"use client";

import { type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import SpaceScene from "@/components/effects/SpaceScene";
import { type SpaceTheme } from "@/components/effects/SpaceBackground";
import Sidebar from "@/components/dashboard/Sidebar";
import ThemeTransition from "@/components/theme/ThemeTransition";
import { UISettingsProvider, useUISettingsOptional } from "@/contexts/UISettingsContext";
import { useCardGlowTracking } from "@/hooks/useCardGlowTracking";

interface DashboardShellProps {
  children: ReactNode;
  theme?: SpaceTheme;
}

function ShellInner({ children, theme }: DashboardShellProps) {
  const pathname = usePathname();
  const settings = useUISettingsOptional();
  const motionEnabled = settings?.animationsEnabled !== false;
  useCardGlowTracking();

  return (
    <ThemeTransition>
      <div className="relative h-screen flex overflow-hidden text-slate-900 dark:text-[#FAFAFA] selection:bg-amd-red/30">
        <SpaceScene theme={theme} />
        <Sidebar />
        <AnimatePresence mode="wait">
          <motion.main
            key={pathname}
            initial={motionEnabled ? { opacity: 0, y: 6 } : false}
            animate={{ opacity: 1, y: 0 }}
            exit={motionEnabled ? { opacity: 0, y: -4 } : undefined}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden"
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </div>
    </ThemeTransition>
  );
}

export default function DashboardShell({ children, theme = "command" }: DashboardShellProps) {
  return (
    <UISettingsProvider>
      <ShellInner theme={theme}>{children}</ShellInner>
    </UISettingsProvider>
  );
}
