"use client";

import { motion } from "framer-motion";

interface OrbitRingsProps {
  color?: string;
  planetColor?: string;
  light?: boolean;
}

export default function OrbitRings({
  color = "rgba(59,130,246,0.2)",
  planetColor = "rgba(59,130,246,0.35)",
  light = false,
}: OrbitRingsProps) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {light && (
        <motion.div
          className="absolute rounded-full border"
          style={{
            width: 480,
            height: 480,
            top: "22%",
            left: "50%",
            marginLeft: -240,
            borderColor: "rgba(80,120,255,0.2)",
            boxShadow: "0 0 80px rgba(80,120,255,0.1)",
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
        />
      )}

      <motion.div
        className="absolute rounded-full border"
        style={{
          width: light ? 380 : 340,
          height: light ? 380 : 340,
          top: "12%",
          right: "8%",
          borderColor: color,
          boxShadow: light ? `0 0 40px rgba(80,120,255,0.12)` : undefined,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
      >
        <div
          className="absolute w-3 h-3 rounded-full -top-1.5 left-1/2 -translate-x-1/2"
          style={{
            background: planetColor,
            boxShadow: light ? `0 0 18px ${planetColor}` : `0 0 12px ${planetColor}`,
          }}
        />
      </motion.div>

      <motion.div
        className="absolute rounded-full border"
        style={{
          width: light ? 260 : 220,
          height: light ? 260 : 220,
          bottom: "18%",
          left: "6%",
          borderColor: color,
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
      >
        <div
          className="absolute w-2 h-2 rounded-full top-1/2 -right-1"
          style={{
            background: light ? "rgba(239,68,68,0.65)" : "rgba(239,68,68,0.5)",
            boxShadow: light ? "0 0 14px rgba(239,68,68,0.45)" : "0 0 10px rgba(239,68,68,0.4)",
          }}
        />
      </motion.div>

      <motion.div
        className="absolute rounded-full"
        style={{
          width: light ? 80 : 64,
          height: light ? 80 : 64,
          top: "55%",
          right: "28%",
          background: light
            ? "radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)",
          boxShadow: light ? "0 0 50px rgba(139,92,246,0.25)" : "0 0 40px rgba(139,92,246,0.15)",
        }}
        animate={{ y: [0, -12, 0], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
