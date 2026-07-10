"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, Cloud, Cpu, Database, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: "prompt", label: "Prompt Input", icon: MessageSquare },
  { id: "cache", label: "Semantic Cache", icon: Database },
  { id: "local", label: "Local Qwen", icon: Cpu },
  { id: "fallback", label: "Fireworks Fallback", icon: Cloud },
] as const;

export default function LandingPipeline() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % STEPS.length);
    }, 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="px-4 sm:px-6 max-w-5xl mx-auto pb-20 sm:pb-28">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="dashboard-surface-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-white/[0.08]"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-theme-subtle mb-1">
              Live Router Flow
            </p>
            <h2 className="text-lg sm:text-xl font-semibold text-theme">Intelligent Query Pipeline</h2>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amd-red/10 border border-amd-red/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amd-red animate-pulse" />
            <span className="text-[10px] font-mono text-amd-red uppercase tracking-wider">Routing</span>
          </div>
        </div>

        {/* Desktop: horizontal pipeline */}
        <div className="hidden md:flex items-stretch gap-0">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const isActive = i === activeIndex;
            const isPast = i < activeIndex;

            return (
              <div key={step.id} className="flex items-center flex-1 min-w-0">
                <motion.div
                  data-glow-card
                  animate={
                    isActive
                      ? { boxShadow: ["0 0 0px rgba(59,130,246,0)", "0 0 28px rgba(59,130,246,0.22)", "0 0 0px rgba(59,130,246,0)"] }
                      : {}
                  }
                  transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
                  className={cn(
                    "relative flex-1 flex flex-col items-center text-center p-4 rounded-xl border transition-all duration-500 routing-pipeline-node",
                    isActive && "routing-pipeline-node-active",
                    isPast && !isActive && "opacity-80",
                    !isActive && !isPast && "opacity-50"
                  )}
                >
                  <div
                    className={cn(
                      "w-11 h-11 rounded-xl flex items-center justify-center mb-3 transition-colors",
                      isActive
                        ? "bg-gradient-to-br from-amd-red to-red-800 text-white shadow-glow-red"
                        : "bg-slate-100/90 dark:bg-white/[0.06] text-theme-muted"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-theme leading-tight">{step.label}</p>
                  {isActive && (
                    <motion.div
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-amd-red"
                      layoutId="pipeline-indicator"
                    />
                  )}
                </motion.div>

                {i < STEPS.length - 1 && (
                  <PipelineConnector active={isPast || isActive} processing={isActive} horizontal />
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile: vertical pipeline */}
        <div className="flex md:hidden flex-col items-center">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const isActive = i === activeIndex;
            const isPast = i < activeIndex;

            return (
              <div key={step.id} className="flex flex-col items-center w-full">
                <motion.div
                  data-glow-card
                  className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-xl border routing-pipeline-node transition-all duration-500",
                    isActive && "routing-pipeline-node-active",
                    isPast && !isActive && "opacity-80",
                    !isActive && !isPast && "opacity-50"
                  )}
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                      isActive
                        ? "bg-gradient-to-br from-amd-red to-red-800 text-white"
                        : "bg-slate-100/90 dark:bg-white/[0.06] text-theme-muted"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <p className="text-sm font-medium text-theme">{step.label}</p>
                </motion.div>
                {i < STEPS.length - 1 && (
                  <PipelineConnector active={isPast || isActive} processing={isActive} horizontal={false} />
                )}
              </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}

function PipelineConnector({
  active,
  processing,
  horizontal,
}: {
  active: boolean;
  processing: boolean;
  horizontal: boolean;
}) {
  if (horizontal) {
    return (
      <div className="relative w-8 lg:w-12 shrink-0 flex items-center justify-center">
        <div className="h-px w-full bg-slate-200/80 dark:bg-white/[0.08] relative overflow-hidden">
          <motion.div
            className="absolute top-0 h-full w-4 rounded-full bg-amd-red shadow-[0_0_8px_rgba(59,130,246,0.5)]"
            animate={{
              left: processing ? ["-16px", "100%"] : active ? "50%" : "0%",
              opacity: processing ? [0.3, 1, 0.3] : active ? 0.5 : 0.15,
            }}
            transition={{
              left: { duration: 1.2, repeat: processing ? Infinity : 0, ease: "linear" },
              opacity: { duration: 1.2, repeat: processing ? Infinity : 0 },
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center py-1 h-10 justify-center relative">
      <div className="w-px h-full bg-slate-200/80 dark:bg-white/[0.06] relative overflow-hidden">
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-4 rounded-full bg-amd-red shadow-[0_0_8px_rgba(59,130,246,0.6)]"
          animate={{
            y: processing ? ["-8px", "48px"] : "-8px",
            opacity: processing ? [0.2, 1, 0.2] : active ? 0.35 : 0.1,
          }}
          transition={{
            y: { duration: 1.1, repeat: processing ? Infinity : 0, ease: "linear" },
            opacity: { duration: 1.1, repeat: processing ? Infinity : 0 },
          }}
        />
      </div>
      <ArrowDown className={cn("w-3 h-3 -mt-1", active ? "text-amd-red/70" : "text-slate-300 dark:text-white/15")} />
    </div>
  );
}
