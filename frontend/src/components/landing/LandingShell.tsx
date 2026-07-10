"use client";

import { type ReactNode } from "react";
import SpaceScene from "@/components/effects/SpaceScene";
import ThemeTransition from "@/components/theme/ThemeTransition";
import { useCardGlowTracking } from "@/hooks/useCardGlowTracking";

interface LandingShellProps {
  children: ReactNode;
}

export default function LandingShell({ children }: LandingShellProps) {
  useCardGlowTracking();
  return (
    <ThemeTransition>
      <div className="landing-page relative min-h-screen text-slate-900 dark:text-[#FAFAFA] selection:bg-amd-red/30 overflow-x-hidden">
        <SpaceScene theme="command" />
        <div className="relative z-10">{children}</div>
      </div>
    </ThemeTransition>
  );
}
