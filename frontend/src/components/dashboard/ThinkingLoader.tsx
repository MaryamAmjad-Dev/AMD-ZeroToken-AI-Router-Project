"use client";

import { motion } from "framer-motion";

interface ThinkingLoaderProps {
  label?: string;
}

export default function ThinkingLoader({ label = "Routing query" }: ThinkingLoaderProps) {
  return (
    <div className="flex flex-col gap-3 py-1 min-w-[200px]">
      <div className="flex items-center gap-3">
        <div className="flex gap-1 items-end h-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={`bar-${i}`}
              className="w-1 rounded-full bg-gradient-to-t from-amd-red to-amd-blue"
              animate={{ height: ["6px", "14px", "6px"] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.12, ease: "easeInOut" }}
            />
          ))}
        </div>
        <motion.span
          key={label}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[10px] font-mono text-white/50 uppercase tracking-[0.12em]"
        >
          {label}
        </motion.span>
      </div>
      <div className="h-0.5 w-full rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className="h-full w-1/3 bg-gradient-to-r from-amd-red via-amd-blue to-transparent"
          animate={{ x: ["-100%", "400%"] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </div>
  );
}
