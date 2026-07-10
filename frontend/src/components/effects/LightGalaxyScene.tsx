"use client";

import { motion } from "framer-motion";

const NEBULA_BLOBS = [
  { color: "rgba(34,211,238,0.4)", w: 920, top: "-18%", left: "58%", dx: [0, 40, -20, 0], dy: [0, 30, -15, 0], dur: 30 },
  { color: "rgba(139,92,246,0.4)", w: 780, top: "38%", left: "-12%", dx: [0, -35, 25, 0], dy: [0, -25, 20, 0], dur: 34 },
  { color: "rgba(59,130,246,0.4)", w: 680, top: "52%", right: "-8%", dx: [0, 30, -40, 0], dy: [0, 20, -30, 0], dur: 26 },
  { color: "rgba(236,72,153,0.35)", w: 540, top: "8%", left: "22%", dx: [0, 25, -15, 0], dy: [0, -20, 15, 0], dur: 28 },
] as const;

const STAR_CLUSTERS = [
  { top: "12%", left: "72%", size: 140, hue: "59,130,246" },
  { top: "68%", left: "18%", size: 120, hue: "139,92,246" },
  { top: "42%", left: "48%", size: 100, hue: "34,211,238" },
  { top: "78%", left: "65%", size: 90, hue: "167,139,250" },
] as const;

const CONSTELLATIONS = [
  { points: "12,18 28,12 45,22 38,38 18,35", lines: "12,18 28,12 45,22 38,38 18,35 12,18" },
  { points: "72,55 82,48 90,58 85,68 74,65", lines: "72,55 82,48 90,58 85,68 74,65" },
  { points: "55,78 62,72 70,76 68,85 58,82", lines: "55,78 62,72 70,76 68,85 58,82 55,78" },
] as const;

const DISTANT_PLANETS = [
  { top: "18%", left: "82%", size: 28, color: "rgba(59,130,246,0.55)", glow: "rgba(59,130,246,0.35)" },
  { top: "72%", left: "8%", size: 22, color: "rgba(139,92,246,0.5)", glow: "rgba(139,92,246,0.3)" },
  { top: "48%", left: "88%", size: 18, color: "rgba(34,211,238,0.45)", glow: "rgba(34,211,238,0.25)" },
] as const;

export default function LightGalaxyScene() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      {/* Layer 2 — animated nebula clouds */}
      {NEBULA_BLOBS.map((blob, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: blob.w,
            height: blob.w,
            top: blob.top,
            left: "left" in blob ? blob.left : undefined,
            right: "right" in blob ? blob.right : undefined,
            background: `radial-gradient(circle, ${blob.color} 0%, transparent 68%)`,
            filter: "blur(120px)",
            opacity: 0.4,
          }}
          animate={{ x: [...blob.dx], y: [...blob.dy] }}
          transition={{ duration: blob.dur, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* Holographic — diagonal rays, prism sheen, aurora */}
      <div className="absolute inset-0 light-holo-rays opacity-[0.22]" />
      <div className="absolute inset-0 light-prism-sheen opacity-[0.18]" />
      <div className="absolute left-[-10%] right-[-10%] top-[20%] h-[45%] light-aurora-wave opacity-[0.35]" />
      <div className="absolute left-[-5%] right-[-5%] bottom-[10%] h-[30%] light-aurora-wave-alt opacity-[0.25]" />

      {/* Layer 3 — star clusters */}
      {STAR_CLUSTERS.map((cluster, i) => (
        <div
          key={i}
          className="absolute rounded-full light-star-cluster"
          style={{
            top: cluster.top,
            left: cluster.left,
            width: cluster.size,
            height: cluster.size,
            background: `radial-gradient(circle, rgba(${cluster.hue},0.22) 0%, rgba(${cluster.hue},0.06) 40%, transparent 70%)`,
          }}
        />
      ))}

      {/* Constellation lines */}
      <svg
        className="absolute inset-0 w-full h-full light-constellation-drift pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        {CONSTELLATIONS.map((c, i) => (
          <g key={i} opacity={0.28}>
            <polyline
              points={c.lines}
              fill="none"
              stroke="rgba(80,120,255,0.45)"
              strokeWidth="0.12"
              strokeLinecap="round"
            />
            {c.points.split(" ").map((pt, j) => {
              const [cx, cy] = pt.split(",").map(Number);
              return (
                <circle
                  key={j}
                  cx={cx}
                  cy={cy}
                  r="0.35"
                  fill="rgba(139,92,246,0.65)"
                  className="light-constellation-node"
                />
              );
            })}
          </g>
        ))}
      </svg>

      {/* Distant planets */}
      {DISTANT_PLANETS.map((planet, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            top: planet.top,
            left: planet.left,
            width: planet.size,
            height: planet.size,
            background: `radial-gradient(circle at 35% 35%, ${planet.color} 0%, transparent 72%)`,
            boxShadow: `0 0 ${planet.size}px ${planet.glow}`,
          }}
          animate={{ y: [0, -8, 0], opacity: [0.55, 0.85, 0.55] }}
          transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* Large orbit rings */}
      <motion.div
        className="absolute rounded-full border"
        style={{
          width: 560,
          height: 560,
          top: "6%",
          left: "50%",
          marginLeft: -280,
          borderColor: "rgba(80,120,255,0.16)",
          boxShadow: "0 0 80px rgba(80,120,255,0.1), inset 0 0 40px rgba(139,92,246,0.04)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 140, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute rounded-full border"
        style={{
          width: 780,
          height: 780,
          bottom: "-18%",
          right: "-14%",
          borderColor: "rgba(139,92,246,0.12)",
          boxShadow: "0 0 60px rgba(167,139,250,0.08)",
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute rounded-full border border-dashed"
        style={{
          width: 340,
          height: 340,
          top: "58%",
          left: "12%",
          borderColor: "rgba(34,211,238,0.14)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 95, repeat: Infinity, ease: "linear" }}
      />

      {/* Ambient depth glow — cards float above galaxy */}
      <div
        className="absolute top-[22%] left-[28%] w-[55%] h-[50%] rounded-full light-depth-glow-blue pointer-events-none"
        style={{ filter: "blur(100px)" }}
      />
      <div
        className="absolute top-[30%] right-[18%] w-[42%] h-[45%] rounded-full light-depth-glow-purple pointer-events-none"
        style={{ filter: "blur(110px)" }}
      />
    </div>
  );
}
