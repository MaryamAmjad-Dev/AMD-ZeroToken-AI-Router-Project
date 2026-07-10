"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import GlassTooltip from "./GlassTooltip";
import ClickRipple from "./ClickRipple";
import { cn } from "@/lib/utils";

interface InteractiveIconButtonProps {
  icon: ReactNode;
  tooltip: string;
  active?: boolean;
  badge?: number;
  showDot?: boolean;
  onClick?: () => void;
  className?: string;
  tooltipSide?: "top" | "bottom" | "right" | "left";
}

export default function InteractiveIconButton({
  icon,
  tooltip,
  active = false,
  badge,
  showDot = false,
  onClick,
  className,
  tooltipSide = "bottom",
}: InteractiveIconButtonProps) {
  return (
    <GlassTooltip label={tooltip} side={tooltipSide}>
      <ClickRipple
        onClick={onClick}
        aria-label={tooltip}
        aria-expanded={active}
        className={cn(
          "p-2 rounded-lg text-white/40 hover:text-white/90 cursor-pointer transition-colors",
          active ? "bg-amd-red/15 text-amd-red border border-amd-red/30 shadow-glow-red" : "hover:bg-white/5",
          className
        )}
      >
        <span className="relative flex items-center justify-center">
          {icon}
          {showDot && badge !== 0 && (
            <motion.span
              className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amd-red border border-[#0B1120]"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
          {badge !== undefined && badge > 0 && (
            <motion.span
              key={badge}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-amd-red text-[9px] font-bold text-white flex items-center justify-center border border-[#0B1120]"
            >
              {badge}
            </motion.span>
          )}
        </span>
      </ClickRipple>
    </GlassTooltip>
  );
}
