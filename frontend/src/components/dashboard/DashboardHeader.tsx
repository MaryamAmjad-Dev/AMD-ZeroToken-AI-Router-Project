"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";

export default function DashboardHeader() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="shrink-0 px-5 md:px-8 pt-5 md:pt-6 pb-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-amd-red animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.4)] animate-icon-glow" />
            <span className="text-[11px] font-mono text-theme-subtle uppercase tracking-[0.2em]">
              AMD ROCm · Hybrid Inference
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight leading-tight">
            <span className="text-theme">Zero Token </span>
            <span className="text-amd-red">Hybrid AI Router</span>
          </h1>
          <p className="mt-2 text-sm text-theme-muted max-w-xl leading-relaxed">
            Intelligent 3-layer routing — regex pruning, semantic cache, and XGBoost classification —
            routes queries locally at zero cost or escalates to cloud only when needed.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl dashboard-surface-card">
            <Zap className="w-4 h-4 text-amd-red" />
            <span className="text-xs font-mono text-theme-muted">L1 → L2 → L3</span>
          </div>
          <div className="px-3 py-2 rounded-xl bg-amd-red/10 border border-amd-red/20">
            <span className="text-xs font-mono font-medium text-amd-red">19/19 Accurate</span>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
