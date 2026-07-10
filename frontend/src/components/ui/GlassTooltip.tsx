"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassTooltipProps {
  label: string;
  children: ReactNode;
  side?: "top" | "bottom" | "right" | "left";
  className?: string;
}

export default function GlassTooltip({ label, children, side = "bottom", className }: GlassTooltipProps) {
  const [visible, setVisible] = useState(false);

  const position =
    side === "right"
      ? "left-[calc(100%+10px)] top-1/2 -translate-y-1/2"
      : side === "left"
        ? "right-[calc(100%+10px)] top-1/2 -translate-y-1/2"
        : side === "top"
          ? "bottom-[calc(100%+10px)] left-1/2 -translate-x-1/2"
          : "top-[calc(100%+10px)] left-1/2 -translate-x-1/2";

  return (
    <div
      className={cn("relative inline-flex", className)}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: side === "bottom" ? -6 : side === "top" ? 6 : 0 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: side === "bottom" ? -4 : side === "top" ? 4 : 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "absolute z-[1000] px-3 py-1.5 rounded-lg glass-dropdown border border-amd-blue/20 text-xs font-medium text-theme whitespace-nowrap pointer-events-none shadow-[0_8px_24px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.5)]",
              position
            )}
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
