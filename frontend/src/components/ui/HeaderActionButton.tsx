"use client";

import { forwardRef, type ReactNode } from "react";
import { motion } from "framer-motion";
import GlassTooltip from "./GlassTooltip";
import { cn } from "@/lib/utils";

interface HeaderActionButtonProps {
  icon: ReactNode;
  tooltip: string;
  active?: boolean;
  badge?: number;
  onClick?: () => void;
  className?: string;
}

const HeaderActionButton = forwardRef<HTMLButtonElement, HeaderActionButtonProps>(
  function HeaderActionButton({ icon, tooltip, active = false, badge, onClick, className }, ref) {
    return (
      <GlassTooltip label={tooltip} side="bottom">
        <motion.button
          ref={ref}
          type="button"
          data-interactive
          aria-label={tooltip}
          aria-expanded={active}
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
          whileHover={{ scale: 1.08, y: -2 }}
          whileTap={{ scale: 0.92 }}
          className={cn(
            "relative z-20 p-2 rounded-lg cursor-pointer transition-colors duration-200",
            active
              ? "bg-amd-red/15 text-amd-red border border-amd-red/30 shadow-glow-red"
              : "text-slate-500 hover:text-slate-800 dark:text-white/50 dark:hover:text-white/90 border border-transparent hover:bg-slate-900/5 dark:hover:bg-white/[0.06] hover:border-slate-900/10 dark:hover:border-white/10 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] dark:hover:shadow-[0_0_24px_rgba(239,68,68,0.12)]",
            className
          )}
        >
          <span className="relative z-10 flex items-center justify-center">{icon}</span>
          {badge !== undefined && badge > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-amd-red text-[9px] font-bold text-white flex items-center justify-center border border-white dark:border-[#050a19] pointer-events-none">
              {badge}
            </span>
          )}
        </motion.button>
      </GlassTooltip>
    );
  }
);

export default HeaderActionButton;
