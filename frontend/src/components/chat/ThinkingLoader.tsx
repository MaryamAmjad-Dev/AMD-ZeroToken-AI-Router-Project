"use client";

import { motion } from "framer-motion";

const DEFAULT_PHASES = [
  "Analyzing prompt...",
  "Checking Semantic Cache...",
  "Running XGBoost Router...",
  "Selecting Model...",
  "Generating response...",
];

export const ROUTING_LOADING_LABEL = "Routing through AMD ZeroToken pipeline...";

interface ThinkingLoaderProps {
  label?: string;
}

export default function ThinkingLoader({ label }: ThinkingLoaderProps) {
  const text = label ?? DEFAULT_PHASES[0];

  return (
    <div className="flex flex-col gap-3 py-1 min-w-[220px]">
      <div className="flex items-center gap-3">
        <div className="flex gap-1 items-end h-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={`dot-${i}`}
              className="w-1.5 rounded-full bg-amd-red"
              animate={{ height: ["5px", "14px", "5px"] }}
              transition={{ duration: 0.75, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
            />
          ))}
        </div>
        <motion.span
          key={text}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[10px] font-mono text-theme-muted uppercase tracking-[0.1em]"
        >
          {text}
        </motion.span>
      </div>
      <div className="h-0.5 w-full rounded-full bg-slate-900/8 dark:bg-white/10 overflow-hidden">
        <motion.div
          className="h-full w-1/3 bg-amd-red/80"
          animate={{ x: ["-100%", "400%"] }}
          transition={{ duration: 1.3, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </div>
  );
}

export { DEFAULT_PHASES };
