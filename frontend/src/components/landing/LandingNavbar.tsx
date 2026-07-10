"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import ThemeToggle from "@/components/theme/ThemeToggle";
import MagneticButton from "@/components/ui/MagneticButton";
import { cn } from "@/lib/utils";

export default function LandingNavbar() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="absolute top-6 inset-x-0 z-50 px-4 sm:px-6 pointer-events-none"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 pointer-events-auto">
        <Link href="/" className="flex items-center gap-3 group min-w-0" data-interactive>
          <div className="relative shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-amd-red via-red-600 to-red-800 rounded-xl flex items-center justify-center font-bold text-white text-[10px] sm:text-[11px] tracking-tighter shadow-glow-red group-hover:scale-105 transition-transform">
              AMD
            </div>
            <motion.div
              className="absolute -inset-1 rounded-xl border border-amd-red/25 pointer-events-none"
              animate={{ opacity: [0.25, 0.55, 0.25] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </div>
          <div className="min-w-0 leading-tight">
            <p className="text-sm sm:text-base font-semibold text-theme tracking-tight truncate">
              ZeroToken Router
            </p>
            <p className="text-[9px] sm:text-[10px] font-mono text-theme-subtle uppercase tracking-[0.2em]">
              Hybrid AI Routing
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <ThemeToggle
            className={cn(
              "!p-0 w-10 h-10 rounded-full",
              "bg-[rgba(247,244,238,0.72)] dark:bg-[rgba(11,17,32,0.72)]",
              "backdrop-blur-md border border-slate-200/70 dark:border-white/10",
              "hover:border-slate-300/80 dark:hover:border-white/20",
              "shadow-[0_4px_20px_rgba(80,120,220,0.1)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.35)]"
            )}
          />

          <MagneticButton>
            <Link
              href="/dashboard"
              data-interactive
              className={cn(
                "inline-flex items-center px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-sm font-semibold",
                "bg-gradient-to-br from-amd-red via-red-600 to-red-700 text-white",
                "shadow-glow-red hover-glow-btn"
              )}
            >
              Launch App
            </Link>
          </MagneticButton>
        </div>
      </div>
    </motion.header>
  );
}
