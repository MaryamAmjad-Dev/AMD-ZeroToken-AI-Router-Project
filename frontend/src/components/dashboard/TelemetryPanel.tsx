"use client";

import { motion } from "framer-motion";
import { Activity, Clock, Coins, Cpu } from "lucide-react";
import AnimatedCounter from "./AnimatedCounter";
import RoutingPipeline from "./RoutingPipeline";
import { cn } from "@/lib/utils";

interface TelemetryPanelProps {
  activeRoute?: "local" | "cloud";
  activeLayer?: "l1" | "l2" | "l3" | "decision";
}

const METRICS = [
  {
    id: "tokens",
    label: "Tokens Saved",
    value: 1.25,
    suffix: "M",
    decimals: 2,
    sub: "+14% vs prev. hour",
    progress: 78,
    icon: Coins,
    accent: "from-amd-red/20 to-transparent",
    bar: "bg-amd-red",
  },
  {
    id: "model",
    label: "Active Model",
    value: null,
    display: "Qwen 1.5B",
    sub: "ROCm · Local",
    icon: Cpu,
    accent: "from-amd-blue/20 to-transparent",
  },
  {
    id: "latency",
    label: "Latency",
    value: 18,
    suffix: "ms",
    decimals: 0,
    sub: "p50 inference",
    progress: 42,
    icon: Clock,
    accent: "from-violet-500/20 to-transparent",
    bar: "bg-violet-400",
  },
  {
    id: "cost",
    label: "API Cost Saved",
    value: 847,
    prefix: "$",
    suffix: "",
    decimals: 0,
    sub: "This session",
    progress: 65,
    icon: Activity,
    accent: "from-emerald-500/20 to-transparent",
    bar: "bg-emerald-400",
  },
] as const;

export default function TelemetryPanel({ activeRoute = "local", activeLayer = "l2" }: TelemetryPanelProps) {
  return (
    <aside className="w-full lg:w-80 glass-panel border-r border-white/[0.06] flex flex-col overflow-hidden shrink-0">
      <div className="p-5 md:p-6 overflow-y-auto custom-scrollbar flex-1">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs font-medium text-white/80 mb-6 uppercase tracking-widest flex items-center gap-2"
        >
          <Activity className="w-4 h-4 text-amd-red" />
          Telemetry
        </motion.h2>

        <div className="space-y-3 mb-8">
          {METRICS.map((metric, i) => (
            <MetricCard key={metric.id} metric={metric} index={i} />
          ))}
        </div>

        <div>
          <p className="text-[10px] text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amd-red animate-pulse" />
            Routing Topology
          </p>
          <RoutingPipeline activeRoute={activeRoute} activeLayer={activeLayer} />
        </div>
      </div>
    </aside>
  );
}

function MetricCard({
  metric,
  index,
}: {
  metric: (typeof METRICS)[number];
  index: number;
}) {
  const Icon = metric.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2 }}
      className="glass-card rounded-2xl p-4 group hover:border-white/15 transition-colors duration-300 relative overflow-hidden"
    >
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-50", metric.accent)} />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] text-white/40 uppercase tracking-widest">{metric.label}</p>
          <div className="p-1.5 rounded-lg bg-white/5 text-white/60">
            <Icon className="w-3.5 h-3.5" />
          </div>
        </div>

        {metric.id === "model" ? (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
              <Cpu className="w-4 h-4 text-amd-blue" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">{metric.display}</p>
              <p className="text-[10px] text-white/50">{metric.sub}</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-2xl font-light text-white font-mono tracking-tight">
                {"prefix" in metric && metric.prefix}
                <AnimatedCounter
                  value={metric.value as number}
                  decimals={"decimals" in metric ? metric.decimals : 0}
                  suffix={metric.suffix ?? ""}
                />
              </span>
              <span className="text-[10px] text-white/40">{metric.sub}</span>
            </div>
            {"progress" in metric && metric.progress !== undefined && (
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${metric.progress}%` }}
                  transition={{ duration: 1.2, delay: 0.3 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className={cn("h-full rounded-full", metric.bar)}
                />
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
