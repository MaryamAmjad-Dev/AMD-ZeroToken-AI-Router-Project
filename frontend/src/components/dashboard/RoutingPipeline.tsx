"use client";

import { motion } from "framer-motion";
import { ArrowDown, Cloud, Cpu, GitBranch, Sparkles, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

type ActiveRoute = "local" | "cloud";
type ActiveLayer = "prompt" | "l1" | "l2" | "l3" | "decision";

interface RoutingPipelineProps {
  activeRoute?: ActiveRoute;
  activeLayer?: ActiveLayer;
  isProcessing?: boolean;
  animationsEnabled?: boolean;
}

const STEPS: { id: ActiveLayer; label: string; sub: string }[] = [
  { id: "prompt", label: "User Prompt", sub: "Incoming query" },
  { id: "l1", label: "Regex Pruning", sub: "Pattern filter · 4ms" },
  { id: "l2", label: "Semantic Cache MiniLM", sub: "Embedding match · 12ms" },
  { id: "l3", label: "XGBoost Router", sub: "ML classifier · 8ms" },
  { id: "decision", label: "Decision Node", sub: "Route selection" },
];

function layerIndex(id: ActiveLayer) {
  return STEPS.findIndex((s) => s.id === id);
}

export default function RoutingPipeline({
  activeRoute = "local",
  activeLayer = "l2",
  isProcessing = true,
  animationsEnabled = true,
}: RoutingPipelineProps) {
  const activeIdx = layerIndex(activeLayer);
  const motionOn = animationsEnabled && isProcessing;

  return (
    <div className="flex flex-col gap-0">
      {STEPS.map((step, i) => {
        const isActive = step.id === activeLayer;
        const isPast = activeIdx > i;
        const isFuture = activeIdx < i;

        return (
          <div key={step.id} className="flex flex-col items-center">
            <PipelineNode
              step={step}
              isActive={isActive}
              isPast={isPast}
              isFuture={isFuture}
              index={i}
              motionOn={motionOn}
            />

            {i < STEPS.length - 1 && (
              <FlowConnector active={isActive || isPast} processing={motionOn && isActive} />
            )}
          </div>
        );
      })}

      <div className="mt-5 pt-5 border-t border-slate-200/80 dark:border-white/[0.06]">
        <div className="flex items-center gap-2 mb-4">
          <GitBranch className="w-3.5 h-3.5 text-[#64748B] dark:text-white/40" />
          <span className="text-[10px] text-[#64748B] dark:text-white/40 uppercase tracking-[0.15em] font-medium">Route Split</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <BranchNode
            side="left"
            title="Qwen 1.5B Local"
            badge="$0"
            badgeColor="bg-red-100 text-red-800 border-red-300/60 dark:bg-amd-red/15 dark:text-amd-red dark:border-amd-red/25"
            icon={<Cpu className="w-4 h-4 text-amd-red" />}
            active={activeRoute === "local"}
            glowClass="shadow-glow-red border-amd-red/35 bg-amd-red/[0.08] dark:bg-amd-red/[0.06]"
            inactiveClass="border-slate-200/80 bg-slate-50/60 dark:border-white/[0.06] dark:bg-white/[0.02]"
            motionOn={motionOn}
          />
          <BranchNode
            side="right"
            title="Fireworks API"
            badge="Premium"
            badgeColor="bg-red-100 text-red-800 border-red-300/60 dark:bg-amd-red/15 dark:text-amd-red dark:border-amd-red/25"
            icon={<Cloud className="w-4 h-4 text-red-600 dark:text-amd-red" />}
            active={activeRoute === "cloud"}
            glowClass="shadow-glow-red border-amd-red/35 bg-red-500/[0.08] dark:bg-amd-red/[0.06]"
            inactiveClass="border-slate-200/80 bg-slate-50/60 dark:border-white/[0.06] dark:bg-white/[0.02]"
            sub="Complex queries"
            motionOn={motionOn}
          />
        </div>
      </div>
    </div>
  );
}

function PipelineNode({
  step,
  isActive,
  isPast,
  isFuture,
  index,
  motionOn,
}: {
  step: (typeof STEPS)[number];
  isActive: boolean;
  isPast: boolean;
  isFuture: boolean;
  index: number;
  motionOn: boolean;
}) {
  return (
    <motion.div
      key={step.id}
      data-glow-card
      data-interactive
      whileHover={motionOn ? { scale: 1.01 } : undefined}
      whileTap={motionOn ? { scale: 0.99 } : undefined}
      initial={motionOn ? { opacity: 0, scale: 0.95 } : false}
      animate={{ opacity: isFuture ? 0.45 : isPast ? 0.85 : 1, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className={cn(
        "relative w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-500 cursor-pointer",
        isActive
          ? "routing-pipeline-node-active routing-pipeline-node"
          : isPast
            ? "routing-pipeline-node border-slate-200/90 dark:border-white/[0.08] dark:bg-white/[0.03]"
            : "routing-pipeline-node opacity-60 dark:bg-transparent dark:border-white/[0.04]"
      )}
    >
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        initial={false}
        animate={{
          boxShadow: motionOn && isActive
            ? ["0 0 0px rgba(59,130,246,0)", "0 0 24px rgba(59,130,246,0.2)", "0 0 0px rgba(59,130,246,0)"]
            : "0 0 0px rgba(59,130,246,0)",
        }}
        transition={{ duration: 2, repeat: motionOn && isActive ? Infinity : 0 }}
      />

      <div
        className={cn(
          "relative z-10 w-9 h-9 rounded-lg flex items-center justify-center shrink-0 font-mono text-[10px] font-bold",
          isActive
            ? "bg-gradient-to-br from-amd-red to-red-800 text-white"
            : isPast
              ? "bg-slate-200/80 text-[#475569] dark:bg-white/10 dark:text-white/60"
              : "bg-slate-100/80 text-[#64748B] dark:bg-white/5 dark:text-white/30"
        )}
      >
        {step.id === "prompt" ? (
          <Zap className="w-4 h-4" />
        ) : step.id === "decision" ? (
          <GitBranch className="w-4 h-4" />
        ) : step.id === "l2" ? (
          <Sparkles className="w-4 h-4" />
        ) : (
          step.id.toUpperCase()
        )}
      </div>

      <div className="relative z-10 flex-1 min-w-0">
        <p className="text-[13px] font-medium text-[#111827] dark:text-white leading-tight">{step.label}</p>
        <p className="text-[11px] text-[#475569] dark:text-white/40 mt-0.5 leading-tight">{step.sub}</p>
      </div>

      <motion.div
        className="relative z-10 flex gap-0.5"
        initial={false}
        animate={{ opacity: motionOn && isActive ? [0.4, 1, 0.4] : 0 }}
        transition={{ duration: 1.2, repeat: motionOn && isActive ? Infinity : 0 }}
      >
        {[0, 1, 2].map((d) => (
          <motion.div
            key={`pulse-${step.id}-${d}`}
            className="w-1 h-3 rounded-full bg-amd-red"
            animate={{ scaleY: motionOn && isActive ? [0.4, 1, 0.4] : 0.4 }}
            transition={{ duration: 0.8, repeat: motionOn && isActive ? Infinity : 0, delay: d * 0.15 }}
          />
        ))}
      </motion.div>

      <div
        className={cn(
          "w-2 h-2 rounded-full bg-amd-red dark:bg-amd-red/60 shrink-0 transition-opacity duration-300",
          isPast && !isActive ? "opacity-100" : "opacity-0"
        )}
      />
    </motion.div>
  );
}

function FlowConnector({ active, processing }: { active: boolean; processing: boolean }) {
  return (
    <div className="flex flex-col items-center py-1 h-10 justify-center relative">
      <div className="w-px h-full bg-slate-200/80 dark:bg-white/[0.06] relative overflow-hidden">
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-4 rounded-full bg-amd-red shadow-[0_0_8px_rgba(59,130,246,0.6)]"
          initial={false}
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

function BranchNode({
  side,
  title,
  sub,
  badge,
  badgeColor,
  icon,
  active,
  glowClass,
  inactiveClass,
  motionOn,
}: {
  side: "left" | "right";
  title: string;
  sub?: string;
  badge: string;
  badgeColor: string;
  icon: React.ReactNode;
  active: boolean;
  glowClass: string;
  inactiveClass: string;
  motionOn: boolean;
}) {
  return (
    <motion.div
      key={`branch-${side}`}
      data-glow-card
      animate={motionOn && active ? { scale: [1, 1.02, 1] } : { scale: 1 }}
      transition={{ duration: 2.5, repeat: motionOn && active ? Infinity : 0, ease: "easeInOut" }}
      className={cn(
        "relative p-4 rounded-xl border transition-all duration-500 routing-pipeline-node",
        active ? glowClass : `${inactiveClass} opacity-55`
      )}
    >
      <motion.div
        className="absolute top-0 left-4 right-4 h-px pointer-events-none"
        style={{
          background:
            side === "left"
              ? "linear-gradient(90deg, transparent, rgba(52,211,153,0.6), transparent)"
              : "linear-gradient(90deg, transparent, rgba(239,68,68,0.6), transparent)",
        }}
        initial={false}
        animate={{ opacity: motionOn && active ? [0.4, 1, 0.4] : 0 }}
        transition={{ duration: 2, repeat: motionOn && active ? Infinity : 0 }}
      />

      <div className="flex items-center justify-between mb-2">
        <span className="text-[9px] font-mono text-[#64748B] dark:text-white/30 uppercase tracking-widest">{side}</span>
        <span className={cn("text-[9px] font-mono font-semibold px-2 py-0.5 rounded-md border", badgeColor)}>
          {badge}
        </span>
      </div>

      <div className="flex items-center gap-2.5">
        <div className={cn("p-2 rounded-lg", active ? "bg-slate-200/60 dark:bg-white/10" : "bg-slate-100/80 dark:bg-white/5")}>{icon}</div>
        <div className="min-w-0">
          <p className="text-[12px] font-medium text-[#111827] dark:text-white leading-tight">{title}</p>
          {sub && <p className="text-[10px] text-[#475569] dark:text-white/40 mt-0.5">{sub}</p>}
        </div>
      </div>

      <motion.div
        className={cn(
          "absolute bottom-3 right-3 w-2 h-2 rounded-full",
          side === "left" ? "bg-amd-red dark:bg-amd-red" : "bg-amd-red"
        )}
        initial={false}
        animate={{
          opacity: motionOn && active ? [0.4, 1, 0.4] : 0,
          scale: motionOn && active ? [0.8, 1.2, 0.8] : 0.8,
        }}
        transition={{ duration: 1.5, repeat: motionOn && active ? Infinity : 0 }}
      />
    </motion.div>
  );
}
