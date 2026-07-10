"use client";

import { Route } from "lucide-react";
import RoutingPipeline from "./RoutingPipeline";

type ActiveRoute = "local" | "cloud";
type ActiveLayer = "prompt" | "l1" | "l2" | "l3" | "decision";

interface RouterPanelProps {
  activeRoute?: ActiveRoute;
  activeLayer?: ActiveLayer;
  isProcessing?: boolean;
}

export default function RouterPanel({
  activeRoute = "local",
  activeLayer = "l2",
  isProcessing = false,
}: RouterPanelProps) {
  return (
    <div className="relative z-10 flex flex-col h-full min-h-0 dashboard-surface-card rounded-2xl">
      <div className="shrink-0 px-5 py-4 border-b border-slate-200/80 dark:border-white/[0.06] flex items-center gap-3">
        <div className="p-2 rounded-lg bg-amd-red/10 border border-amd-red/20">
          <Route className="w-4 h-4 text-amd-red" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-[#111827] dark:text-white">Router Visualization</h2>
          <p className="text-[11px] text-[#64748B] dark:text-white/40 mt-0.5">Live pipeline</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amd-red/10 border border-amd-red/20">
          <span className={`w-1.5 h-1.5 rounded-full ${isProcessing ? "bg-amd-red animate-pulse" : "bg-amd-red/70"}`} />
          <span className="text-[10px] font-mono text-amd-red">{isProcessing ? "Routing" : "Live"}</span>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-5">
        <RoutingPipeline activeRoute={activeRoute} activeLayer={activeLayer} isProcessing={isProcessing} />
      </div>
    </div>
  );
}
