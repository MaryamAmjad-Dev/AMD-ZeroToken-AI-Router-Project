"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Clock, Cpu, Database, Search, Sparkles } from "lucide-react";
import { HISTORY_DATA, type HistoryFilter } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const FILTERS: { id: HistoryFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "local", label: "Local" },
  { id: "fireworks", label: "Fireworks" },
  { id: "cached", label: "Cached" },
];

export default function HistoryView() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<HistoryFilter>("all");

  const filtered = useMemo(() => {
    return HISTORY_DATA.filter((item) => {
      const matchesFilter = filter === "all" || item.type === filter;
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        item.prompt.toLowerCase().includes(q) ||
        item.response.toLowerCase().includes(q) ||
        item.model.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [search, filter]);

  return (
    <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
      <div className="px-5 md:px-8 pt-6 pb-8">
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-amd-red" />
            <span className="text-[11px] font-mono text-theme-subtle uppercase tracking-[0.2em]">
              AI Memory Timeline
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            <span className="text-theme">Request </span>
            <span className="text-amd-red">History</span>
          </h1>
          <p className="mt-2 text-sm text-theme-muted max-w-2xl">
            Searchable log of routed queries, models used, and tokens saved.
          </p>
        </motion.header>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-subtle" />
            <input
              data-interactive
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search prompts, responses, models..."
              className="w-full pl-10 pr-4 py-3 rounded-xl glass-card border border-slate-900/10 dark:border-white/[0.08] bg-[rgba(247,244,238,0.6)] dark:bg-transparent text-sm text-theme placeholder:text-theme-subtle outline-none focus:border-amd-blue/40 transition-colors"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <motion.button
                key={f.id}
                data-interactive
                onClick={() => setFilter(f.id)}
                whileHover={{ scale: 1.06, y: -2 }}
                whileTap={{ scale: 0.96 }}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-medium uppercase tracking-wider transition-all cursor-pointer",
                  filter === f.id
                    ? "bg-amd-red/15 border border-amd-red/30 text-amd-red"
                    : "glass-card border border-slate-900/10 dark:border-white/[0.08] text-theme-muted hover:text-theme"
                )}
              >
                {f.label}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute left-4 md:left-6 top-0 bottom-0 w-px bg-gradient-to-b from-amd-red/40 via-slate-300/40 dark:via-white/10 to-transparent" />

          <div className="space-y-4">
            {filtered.map((item, i) => (
              <motion.article
                key={item.id}
                data-glow-card
                data-interactive
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ x: 6, scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="relative ml-8 md:ml-12 glass-page-card glass-card rounded-2xl p-5 border border-slate-900/10 dark:border-white/[0.08] hover:border-slate-900/20 dark:hover:border-white/15 transition-colors cursor-pointer"
              >
                <div
                  className={cn(
                    "absolute -left-[22px] md:-left-[30px] top-6 w-3 h-3 rounded-full border-2 border-[#E8E4DA] dark:border-[#060612]",
                    item.type === "local" && "bg-amd-red",
                    item.type === "fireworks" && "bg-amd-red",
                    item.type === "cached" && "bg-amd-red/70"
                  )}
                />

                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <TypeBadge type={item.type} />
                  <span className="text-[10px] font-mono text-theme-subtle">{item.timestamp}</span>
                </div>

                <p className="text-sm font-medium text-theme mb-2 leading-relaxed">{item.prompt}</p>
                <p className="text-xs text-theme-muted mb-4 line-clamp-2 leading-relaxed">{item.response}</p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <Meta label="Model" value={item.model} icon={<Cpu className="w-3 h-3" />} />
                  <Meta label="Route" value={item.route} icon={<Sparkles className="w-3 h-3" />} />
                  <Meta label="Saved" value={item.tokensSaved} icon={<Database className="w-3 h-3" />} accent="text-amd-red" />
                  <Meta label="Latency" value={item.latency} icon={<Clock className="w-3 h-3" />} accent="text-amd-red" />
                </div>
              </motion.article>
            ))}

            {filtered.length === 0 && (
              <p className="text-center text-slate-500 dark:text-white/40 py-12 text-sm">No matching requests found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TypeBadge({ type }: { type: string }) {
  const styles = {
    local: "bg-red-100 text-red-800 border-red-300/60 dark:bg-amd-red/10 dark:text-amd-red dark:border-amd-red/20",
    fireworks: "bg-red-100 text-red-800 border-red-300/60 dark:bg-amd-red/10 dark:text-amd-red dark:border-amd-red/20",
    cached: "bg-red-50 text-red-700 border-red-200/60 dark:bg-amd-red/10 dark:text-amd-red dark:border-amd-red/20",
  }[type] ?? "bg-slate-100 text-slate-600 border-slate-200 dark:bg-white/5 dark:text-white/50 dark:border-white/10";

  return (
    <span className={cn("text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md border", styles)}>
      {type}
    </span>
  );
}

function Meta({
  label,
  value,
  icon,
  accent = "text-[#0F172A] dark:text-white",
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  accent?: string;
}) {
  return (
    <div className="p-2.5 rounded-xl bg-slate-900/4 dark:bg-white/[0.03] border border-slate-900/8 dark:border-white/[0.06] min-w-0">
      <div className="flex items-center gap-1 mb-1">
        <span className="text-slate-400 dark:text-white/30">{icon}</span>
        <p className="text-[8px] text-slate-500 dark:text-white/30 uppercase tracking-widest">{label}</p>
      </div>
      <p className={cn("text-[11px] font-mono font-medium truncate", accent)}>{value}</p>
    </div>
  );
}
