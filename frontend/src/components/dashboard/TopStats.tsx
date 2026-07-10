"use client";

import { motion } from "framer-motion";
import { Clock, Coins, ShieldCheck, Target } from "lucide-react";
import AnimatedCounter from "./AnimatedCounter";
import { cn } from "@/lib/utils";

const STATS = [
  {
    id: "tokens",
    label: "Tokens Saved",
    value: 1.25,
    decimals: 2,
    suffix: "M",
    icon: Coins,
    iconColor: "text-amd-red",
    valueColor: "text-slate-900 dark:text-white",
    border: "hover:border-amd-red/35 dark:hover:border-amd-red/25",
    gradient: "from-amd-red/8 dark:from-amd-red/10",
    glow: "hover:shadow-[0_6px_20px_rgba(239,68,68,0.1)] dark:hover:shadow-glow-red",
  },
  {
    id: "api",
    label: "API Avoided",
    value: 3421,
    decimals: 0,
    suffix: "",
    icon: ShieldCheck,
    iconColor: "text-amd-red",
    valueColor: "text-slate-900 dark:text-white",
    border: "hover:border-amd-red/35 dark:hover:border-amd-red/25",
    gradient: "from-amd-red/8 dark:from-amd-red/10",
    glow: "hover:shadow-[0_6px_20px_rgba(239,68,68,0.1)] dark:hover:shadow-glow-red",
  },
  {
    id: "accuracy",
    label: "Accuracy",
    value: 19,
    decimals: 0,
    suffix: "/19",
    icon: Target,
    iconColor: "text-amd-red",
    valueColor: "text-amd-red",
    border: "hover:border-amd-red/35 dark:hover:border-amd-red/25",
    gradient: "from-amd-red/6 dark:from-amd-red/10",
    glow: "hover:shadow-[0_6px_20px_rgba(239,68,68,0.1)] dark:hover:shadow-glow-red",
  },
  {
    id: "latency",
    label: "Latency",
    value: 18,
    decimals: 0,
    suffix: "ms",
    icon: Clock,
    iconColor: "text-amd-red",
    valueColor: "text-slate-900 dark:text-white",
    border: "hover:border-amd-red/35 dark:hover:border-amd-red/25",
    gradient: "from-amd-red/8 dark:from-amd-red/10",
    glow: "hover:shadow-[0_6px_20px_rgba(239,68,68,0.1)] dark:hover:shadow-glow-red",
  },
] as const;

export default function TopStats() {
  return (
    <div className="relative z-10 shrink-0 px-5 md:px-8 pb-5">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.id}
            data-glow-card
            data-display-only
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
            whileHover={{ y: -6, scale: 1.035 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "group relative dashboard-stat-card dashboard-surface-card rounded-2xl p-4 md:p-5 overflow-hidden transition-all duration-200 cursor-default select-none",
              stat.border,
              stat.glow
            )}
            onMouseDown={(e) => e.preventDefault()}
          >
            <div className={cn("absolute inset-0 bg-gradient-to-br to-transparent opacity-40 dark:opacity-80", stat.gradient)} />

            <div className="relative z-10">
              <div className="flex items-center justify-between gap-3 mb-4">
                <p className="text-[10px] md:text-[11px] text-theme-subtle uppercase tracking-[0.15em] font-medium leading-snug">
                  {stat.label}
                </p>
                <div className={cn("p-2 rounded-xl bg-slate-900/5 dark:bg-white/[0.04] border border-slate-900/8 dark:border-white/[0.06]", stat.iconColor)}>
                  <stat.icon className="w-4 h-4" strokeWidth={1.75} />
                </div>
              </div>

              <p className="text-2xl md:text-3xl font-semibold font-mono tracking-tight">
                {stat.id === "accuracy" ? (
                  <>
                    <AnimatedCounter value={stat.value} style={{ color: "#ff3b30" }} />
                    <span className="text-theme-subtle text-xl font-normal">/19</span>
                  </>
                ) : (
                  <AnimatedCounter value={stat.value} decimals={stat.decimals} suffix={stat.suffix} className={stat.valueColor} />
                )}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
