"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, Coins, Clock, Cpu } from "lucide-react";
import AnimatedCounter from "@/components/dashboard/AnimatedCounter";
import MagneticButton from "@/components/ui/MagneticButton";
import { cn } from "@/lib/utils";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const HERO_CARDS = [
  {
    id: "tokens",
    label: "Tokens Saved",
    value: 1.25,
    decimals: 2,
    suffix: "M",
    icon: Coins,
    floatDelay: 0,
    floatY: [-6, 6, -6] as number[],
  },
  {
    id: "latency",
    label: "Latency",
    value: 18,
    decimals: 0,
    suffix: "ms",
    icon: Clock,
    floatDelay: 0.4,
    floatY: [-8, 5, -8] as number[],
  },
  {
    id: "local",
    label: "Local Execution",
    value: 92,
    decimals: 0,
    suffix: "%",
    icon: Cpu,
    floatDelay: 0.8,
    floatY: [-5, 8, -5] as number[],
  },
];

function FloatingStatCard({
  card,
  index,
}: {
  card: (typeof HERO_CARDS)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 180, damping: 18 });
  const springY = useSpring(rotateY, { stiffness: 180, damping: 18 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateX.set(py * -10);
    rotateY.set(px * 10);
  };

  const resetTilt = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  const Icon = card.icon;

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      onMouseMove={handleMove}
      onMouseLeave={resetTilt}
      animate={{ y: card.floatY }}
      transition={{
        y: { duration: 5 + index, repeat: Infinity, ease: "easeInOut", delay: card.floatDelay },
      }}
      style={{
        rotateX: springX,
        rotateY: springY,
        transformPerspective: 900,
      }}
      whileHover={{ scale: 1.04, y: -5 }}
      className={cn(
        "relative dashboard-surface-card rounded-2xl p-5 sm:p-6 cursor-default",
        "border border-slate-200/80 dark:border-white/[0.08]",
        "hover:border-amd-red/30 dark:hover:border-amd-red/25",
        "hover:shadow-[0_12px_40px_rgba(80,120,220,0.12)] dark:hover:shadow-glow-red",
        "transition-shadow duration-300"
      )}
      data-glow-card
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amd-red/[0.04] via-transparent to-blue-500/[0.04] pointer-events-none" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-theme-subtle">
            {card.label}
          </span>
          <div className="p-2 rounded-lg bg-slate-100/80 dark:bg-white/[0.06]">
            <Icon className="w-4 h-4 text-amd-red" />
          </div>
        </div>
        <p className="text-3xl sm:text-4xl font-semibold tracking-tight text-theme">
          <AnimatedCounter
            value={card.value}
            decimals={card.decimals}
            suffix={card.suffix}
          />
        </p>
      </div>
    </motion.div>
  );
}

export default function LandingHero() {
  return (
    <section className="pt-28 sm:pt-32 md:pt-36 pb-16 sm:pb-20 px-4 sm:px-6 max-w-7xl mx-auto">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center"
      >
        <div className="text-center lg:text-left">
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full dashboard-surface-card border border-slate-200/80 dark:border-white/10 text-[11px] font-mono uppercase tracking-[0.14em] text-theme-muted mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amd-red animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
            Powered by AMD Instinct
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.05] mb-6"
          >
            <span className="block landing-hero-gradient bg-clip-text text-transparent">
              ZeroToken Hybrid AI Router
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-base sm:text-lg md:text-xl text-theme-muted max-w-xl mx-auto lg:mx-0 leading-relaxed mb-10"
          >
            3-layer intelligent routing system reducing AI inference cost with local-first execution.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
          >
            <MagneticButton>
              <Link
                href="/dashboard"
                data-interactive
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-amd-red text-white font-semibold shadow-glow-red hover:bg-red-600 transition-colors hover-glow-btn"
              >
                Start Routing
                <ArrowRight className="w-4 h-4" />
              </Link>
            </MagneticButton>
            <MagneticButton>
              <Link
                href="#architecture"
                data-interactive
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl dashboard-surface-card border border-slate-200/80 dark:border-white/10 font-semibold text-theme hover:border-amd-red/30 transition-colors hover-glass-btn"
              >
                View Architecture
              </Link>
            </MagneticButton>
          </motion.div>
        </div>

        <motion.div variants={stagger} className="grid sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-5">
          {HERO_CARDS.map((card, i) => (
            <FloatingStatCard key={card.id} card={card} index={i} />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
