"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import type { RouteMeta, ChatMessageMeta } from "@/types/chat";
import { useUISettingsOptional } from "@/contexts/UISettingsContext";
import { cn } from "@/lib/utils";

type NodeId = "l1" | "l2" | "l3" | "qwen" | "fireworks";

const ROUTE_NODES: {
  id: NodeId;
  label: string;
  layer: RouteMeta["activeLayer"];
  route?: RouteMeta["activeRoute"];
  description: string;
  routeExplanation: string;
  status: string;
  latency: string;
}[] = [
  {
    id: "l1",
    label: "Regex",
    layer: "l1",
    description: "Pattern-based token pruning filters known-safe queries before embedding.",
    routeExplanation: "Strips filler tokens and matches fast-path regex rules to skip heavy inference.",
    status: "Ready",
    latency: "~4ms",
  },
  {
    id: "l2",
    label: "MiniLM",
    layer: "l2",
    description: "Semantic cache lookup using MiniLM embeddings for near-instant hits.",
    routeExplanation: "Compares query embeddings against cached responses for duplicate intent.",
    status: "Cache warm",
    latency: "~12ms",
  },
  {
    id: "l3",
    label: "XGBoost",
    layer: "l3",
    description: "Intent classifier scores complexity with 12 engineered features.",
    routeExplanation: "Predicts whether the query is simple enough for local inference or needs cloud.",
    status: "Model loaded",
    latency: "~18ms",
  },
  {
    id: "qwen",
    label: "Qwen",
    layer: "decision",
    route: "local",
    description: "Local Qwen 1.5B inference on ROCm — zero API cost path.",
    routeExplanation: "Routes to on-device Qwen when complexity score is below cloud threshold.",
    status: "ROCm online",
    latency: "~240ms",
  },
  {
    id: "fireworks",
    label: "Fireworks",
    layer: "decision",
    route: "cloud",
    description: "Premium Fireworks API for complex or high-context queries.",
    routeExplanation: "Escalates to Fireworks when XGBoost flags high complexity or cache miss.",
    status: "API healthy",
    latency: "~890ms",
  },
];

interface RoutingDetailsPanelProps {
  activeLayer: RouteMeta["activeLayer"];
  activeRoute: RouteMeta["activeRoute"];
  meta?: ChatMessageMeta;
  isProcessing?: boolean;
}

function resolveDefaultNode(layer: RouteMeta["activeLayer"], route: RouteMeta["activeRoute"]): NodeId {
  if (layer === "l1") return "l1";
  if (layer === "l2") return "l2";
  if (layer === "l3") return "l3";
  return route === "cloud" ? "fireworks" : "qwen";
}

export default function RoutingDetailsPanel({
  activeLayer,
  activeRoute,
  meta,
  isProcessing = false,
}: RoutingDetailsPanelProps) {
  const settings = useUISettingsOptional();
  const motionOn = settings?.animationsEnabled !== false;
  const [selectedId, setSelectedId] = useState<NodeId>(() => resolveDefaultNode(activeLayer, activeRoute));

  const selected = ROUTE_NODES.find((n) => n.id === selectedId) ?? ROUTE_NODES[0];
  const model = meta?.model ?? (activeRoute === "local" ? "Qwen 1.5B" : "Fireworks Llama");
  const costSaved = meta?.tokensSaved ?? (activeRoute === "local" ? "$0.00" : "Premium");
  const routePath = meta?.route ?? "Regex → MiniLM → XGBoost → Local";

  const isNodeActive = (node: (typeof ROUTE_NODES)[number]) => {
    if (node.layer !== activeLayer) return false;
    if (node.layer === "decision" && node.route) return node.route === activeRoute;
    return true;
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-theme">Routing Status</h3>
        <p className="text-[10px] text-theme-subtle mt-0.5">Click a node to inspect pipeline details</p>
      </div>

      <div className="rounded-xl p-4 border border-slate-900/10 dark:border-white/[0.08] bg-slate-900/3 dark:bg-white/[0.02] mb-4">
        <p className="text-[10px] text-theme-subtle uppercase tracking-widest mb-3">Pipeline</p>
        <div className="flex flex-col items-center gap-0">
          {ROUTE_NODES.map((node, i) => {
            const isActive = isNodeActive(node);
            const isSelected = selectedId === node.id;
            const isLive = isActive && isProcessing;

            return (
              <div key={node.id} className="flex flex-col items-center w-full">
                <motion.button
                  type="button"
                  data-interactive
                  onClick={() => setSelectedId(node.id)}
                  animate={
                    motionOn && isLive
                      ? { boxShadow: ["0 0 0px rgba(59,130,246,0)", "0 0 16px rgba(59,130,246,0.4)", "0 0 0px rgba(59,130,246,0)"] }
                      : {}
                  }
                  transition={{ duration: 1.2, repeat: isLive ? Infinity : 0 }}
                  className={cn(
                    "w-full px-3 py-2 rounded-lg text-center text-xs font-medium border transition-colors cursor-pointer",
                    isSelected
                      ? "bg-amd-red/15 border-amd-red/35 text-amd-red"
                      : isActive
                        ? "bg-slate-900/6 dark:bg-white/[0.06] border-amd-red/25 text-[#334155] dark:text-theme-muted"
                        : "bg-slate-900/3 dark:bg-white/[0.02] border-slate-900/8 dark:border-white/[0.06] text-theme-subtle hover:border-slate-900/15 dark:hover:border-white/12"
                  )}
                >
                  <span className="flex items-center justify-center gap-2">
                    {node.label}
                    {isSelected && (
                      <span className="text-[8px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-amd-red/20 text-amd-red">
                        Selected
                      </span>
                    )}
                  </span>
                  {isActive && (
                    <span className="block text-[9px] font-mono text-amd-red/70 mt-0.5">
                      {isProcessing ? "ACTIVE" : "LAST"}
                    </span>
                  )}
                </motion.button>
                {i < ROUTE_NODES.length - 1 && (
                  <ArrowDown
                    className={cn(
                      "w-3.5 h-3.5 my-0.5",
                      isActive || isNodeActive(ROUTE_NODES[i + 1])
                        ? "text-amd-red/50"
                        : "text-slate-300 dark:text-white/15"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl p-4 mb-4 bg-slate-900/4 dark:bg-white/[0.03] border border-slate-900/8 dark:border-white/[0.06]">
        <p className="text-[10px] text-theme-subtle uppercase tracking-widest mb-2">{selected.label}</p>
        <p className="text-xs text-theme-muted leading-relaxed mb-2">{selected.description}</p>
        <p className="text-[11px] text-[#475569] dark:text-theme-subtle leading-relaxed mb-3">{selected.routeExplanation}</p>
        <div className="grid grid-cols-2 gap-2">
          <DetailRow label="Status" value={isNodeActive(selected) && isProcessing ? "Processing" : selected.status} accent="text-amd-red" />
          <DetailRow label="Latency" value={selected.latency} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2">
        <DetailRow label="Active Layer" value={activeLayer.toUpperCase()} accent="text-amd-red" />
        <DetailRow label="Model Selected" value={model} />
        <DetailRow label="Route Path" value={routePath} small />
        <DetailRow label="Cost Saved" value={costSaved} accent="text-amd-red" />
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
  accent = "text-[#111827] dark:text-white",
  small,
}: {
  label: string;
  value: string;
  accent?: string;
  small?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl bg-slate-900/4 dark:bg-white/[0.03] border border-slate-900/8 dark:border-white/[0.06]">
      <span className="text-[10px] text-[#64748B] dark:text-theme-subtle uppercase tracking-wider shrink-0">{label}</span>
      <span className={cn("font-mono text-right truncate max-w-[180px]", small ? "text-[10px]" : "text-xs", accent)}>
        {value}
      </span>
    </div>
  );
}
