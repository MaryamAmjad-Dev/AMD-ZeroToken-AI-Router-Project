"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GitBranch, Network, Zap } from "lucide-react";
import RoutingPipeline from "@/components/dashboard/RoutingPipeline";
import { useUISettingsOptional } from "@/contexts/UISettingsContext";
import { cn } from "@/lib/utils";

type ActiveLayer = "prompt" | "l1" | "l2" | "l3" | "decision";
type ActiveRoute = "local" | "cloud";

const LAYERS: ActiveLayer[] = ["prompt", "l1", "l2", "l3", "decision"];

const LAYER_DETAILS: Record<ActiveLayer, string> = {
  prompt: "Incoming user query enters the ZeroToken routing pipeline for classification.",
  l1: "Regex patterns prune redundant tokens and filter known-safe queries in ~4ms.",
  l2: "MiniLM embeddings match against semantic cache for near-instant responses.",
  l3: "XGBoost classifier predicts intent complexity using 12 engineered features.",
  decision: "Decision engine selects local Qwen 1.5B or Fireworks API based on score.",
};

export default function RoutingView() {
  const settings = useUISettingsOptional();
  const animationsEnabled = settings?.animationsEnabled !== false;
  const [activeLayer, setActiveLayer] = useState<ActiveLayer>("l2");
  const [activeRoute, setActiveRoute] = useState<ActiveRoute>("local");

  useEffect(() => {
    if (!animationsEnabled) return;
    let i = LAYERS.indexOf("l2");
    const interval = setInterval(() => {
      i = (i + 1) % LAYERS.length;
      const layer = LAYERS[i];
      setActiveLayer(layer);
      if (layer === "decision") {
        setActiveRoute((prev) => (prev === "local" ? "cloud" : "local"));
      }
    }, 3200);
    return () => clearInterval(interval);
  }, [animationsEnabled]);

  const displayLayer = activeLayer;

  return (
    <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
      <div className="px-5 md:px-8 pt-6 pb-8">
        <motion.header
          initial={animationsEnabled ? { opacity: 0, y: -12 } : false}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-2">
            <Network className="w-5 h-5 text-amd-red" />
            <span className="text-[11px] font-mono text-[#64748B] dark:text-white/40 uppercase tracking-[0.2em]">
              Neural Routing Galaxy
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#111827] dark:text-white">
            <span>ZeroToken </span>
            <span className="text-amd-red">Router Architecture</span>
          </h1>
          <p className="mt-2 text-sm text-[#334155] dark:text-white/45 max-w-2xl">
            3-layer hybrid pipeline — regex pruning, semantic cache, and XGBoost classification.
          </p>
        </motion.header>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6">
          <motion.div
            data-glow-card
            initial={animationsEnabled ? { opacity: 0, scale: 0.98 } : false}
            animate={{ opacity: 1, scale: 1 }}
            className="routing-surface-card rounded-2xl p-6 md:p-8 relative overflow-hidden"
          >
            <div className="absolute inset-0 pointer-events-none">
              {animationsEnabled && (
                <motion.div
                  className="absolute w-2 h-2 rounded-full bg-amd-red"
                  animate={{ top: ["10%", "30%", "50%", "70%", "85%"], left: ["50%", "50%", "50%", "50%", "50%"], opacity: [0, 1, 1, 1, 0] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }}
                />
              )}
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-amd-red/10 border border-amd-red/20">
                <GitBranch className="w-4 h-4 text-amd-red" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-[#111827] dark:text-white">Live Pipeline</h2>
                <p className="text-[11px] text-[#64748B] dark:text-white/40">Animated routing flow</p>
              </div>
              <motion.div
                className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amd-red/10 border border-amd-red/20"
                animate={animationsEnabled ? { opacity: [0.6, 1, 0.6] } : { opacity: 1 }}
                transition={{ duration: 2, repeat: animationsEnabled ? Infinity : 0 }}
              >
                <Zap className="w-3 h-3 text-amd-red" />
                <span className="text-[10px] font-mono text-amd-red">{activeLayer.toUpperCase()}</span>
              </motion.div>
            </div>

            <RoutingPipeline
              activeRoute={activeRoute}
              activeLayer={activeLayer}
              isProcessing={animationsEnabled}
              animationsEnabled={animationsEnabled}
            />
          </motion.div>

          <div className="space-y-4">
            <motion.div
              data-glow-card
              initial={animationsEnabled ? { opacity: 0, x: 20 } : false}
              animate={{ opacity: 1, x: 0 }}
              className="routing-surface-card rounded-2xl p-5"
            >
              <h3 className="text-xs font-semibold text-[#64748B] dark:text-white/60 uppercase tracking-widest mb-3">Node Details</h3>
              <p className="text-sm text-[#334155] dark:text-white/70 leading-relaxed">{LAYER_DETAILS[displayLayer]}</p>
            </motion.div>

            {(["local", "cloud"] as const).map((route) => (
              <motion.div
                key={route}
                data-glow-card
                data-interactive
                whileHover={animationsEnabled ? { scale: 1.02 } : undefined}
                className={cn(
                  "routing-surface-card rounded-2xl p-5 transition-all duration-500",
                  activeRoute === route
                    ? route === "local"
                      ? "border-amd-red/35 shadow-glow-red"
                      : "border-amd-red/35 shadow-glow-red"
                    : "opacity-70 dark:opacity-50"
                )}
              >
                <p className="text-[10px] font-mono uppercase tracking-widest text-[#64748B] dark:text-white/40 mb-1">
                  {route === "local" ? "Left Branch" : "Right Branch"}
                </p>
                <p className="text-sm font-semibold text-[#111827] dark:text-white">
                  {route === "local" ? "Qwen 1.5B Local" : "Fireworks Premium API"}
                </p>
                <p className="text-xs text-[#475569] dark:text-white/45 mt-1">
                  {route === "local" ? "ZERO COST · ROCm optimized" : "Complex tasks · Premium tier"}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
