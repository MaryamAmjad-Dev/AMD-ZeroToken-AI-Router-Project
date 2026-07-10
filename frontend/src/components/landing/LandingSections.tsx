"use client";

import { motion } from "framer-motion";
import {
  Activity,
  BarChart3,
  Brain,
  Cloud,
  Coins,
  Cpu,
  Layers,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import AnimatedCounter from "@/components/dashboard/AnimatedCounter";
import { cn } from "@/lib/utils";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const PERFORMANCE = [
  { label: "Token Savings", value: 1.25, suffix: "M", decimals: 2, icon: Coins },
  { label: "API Calls Avoided", value: 3421, suffix: "", decimals: 0, icon: ShieldCheck },
  { label: "Routing Accuracy", value: 19, suffix: "/19", decimals: 0, icon: Target },
] as const;

const ARCHITECTURE = [
  {
    layer: "L1",
    title: "Regex Pruning",
    description: "Instant pattern-based filtering removes trivial queries before any model invocation.",
    icon: Zap,
  },
  {
    layer: "L2",
    title: "Semantic Cache",
    description: "MiniLM embeddings match semantically similar queries against a high-speed local cache.",
    icon: Sparkles,
  },
  {
    layer: "L3",
    title: "Router Decision",
    description: "XGBoost classifier routes complex queries to local Qwen or Fireworks cloud fallback.",
    icon: Brain,
  },
] as const;

const FEATURES = [
  {
    title: "Zero Token Routing",
    description: "Intercept repetitive queries locally and eliminate unnecessary cloud API token spend.",
    icon: Coins,
  },
  {
    title: "Local Inference",
    description: "Qwen 1.5B runs on AMD ROCm hardware for sub-20ms responses at zero marginal cost.",
    icon: Cpu,
  },
  {
    title: "Smart Fallback",
    description: "Complex queries escalate to Fireworks API only when local models cannot satisfy them.",
    icon: Cloud,
  },
  {
    title: "Analytics Dashboard",
    description: "Real-time routing metrics, cache hit rates, and cost savings in a unified console.",
    icon: BarChart3,
  },
] as const;

function SectionHeader({ badge, title, subtitle }: { badge: string; title: string; subtitle: string }) {
  return (
    <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
      <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-theme-subtle mb-3">{badge}</p>
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-theme mb-4">{title}</h2>
      <p className="text-theme-muted text-sm sm:text-base leading-relaxed">{subtitle}</p>
    </div>
  );
}

export default function LandingSections() {
  return (
    <>
      {/* Performance */}
      <section id="performance" className="px-4 sm:px-6 max-w-7xl mx-auto py-16 sm:py-24">
        <SectionHeader
          badge="Performance"
          title="Measurable Cost Reduction"
          subtitle="Real routing metrics from the ZeroToken hybrid pipeline — local-first execution with intelligent cloud escalation."
        />
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
          className="grid sm:grid-cols-3 gap-4 sm:gap-6"
        >
          {PERFORMANCE.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                data-glow-card
                whileHover={{ y: -6, scale: 1.03 }}
                className="dashboard-surface-card rounded-2xl p-6 sm:p-8 text-center border border-slate-200/80 dark:border-white/[0.08]"
              >
                <div className="inline-flex p-3 rounded-xl bg-slate-100/80 dark:bg-white/[0.06] mb-4">
                  <Icon className="w-5 h-5 text-amd-red" />
                </div>
                <p className="text-3xl sm:text-4xl font-semibold text-theme mb-2">
                  <AnimatedCounter value={stat.value} decimals={stat.decimals} suffix={stat.suffix} />
                </p>
                <p className="text-sm text-theme-muted">{stat.label}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Architecture */}
      <section id="architecture" className="px-4 sm:px-6 max-w-7xl mx-auto py-16 sm:py-24">
        <SectionHeader
          badge="Architecture"
          title="3-Layer Routing Stack"
          subtitle="Each layer progressively filters and classifies queries — maximizing local execution while preserving answer quality."
        />
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
          className="grid md:grid-cols-3 gap-4 sm:gap-6"
        >
          {ARCHITECTURE.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.layer}
                variants={fadeUp}
                data-glow-card
                whileHover={{ y: -8, scale: 1.025 }}
                className={cn(
                  "relative dashboard-surface-card rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-white/[0.08]",
                  "hover:border-amd-red/25 transition-colors duration-300"
                )}
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-amd-red/10 text-amd-red border border-amd-red/20">
                    {item.layer}
                  </span>
                  <div className="p-2 rounded-lg bg-slate-100/80 dark:bg-white/[0.06]">
                    <Icon className="w-4 h-4 text-amd-red" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-theme mb-3">{item.title}</h3>
                <p className="text-sm text-theme-muted leading-relaxed">{item.description}</p>
                {i < ARCHITECTURE.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-px bg-gradient-to-r from-amd-red/40 to-transparent" />
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="px-4 sm:px-6 max-w-7xl mx-auto py-16 sm:py-24 pb-28 sm:pb-36">
        <SectionHeader
          badge="Features"
          title="Built for Production AI Routing"
          subtitle="Everything you need to run a cost-efficient hybrid inference pipeline on AMD hardware."
        />
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
          className="grid sm:grid-cols-2 gap-4 sm:gap-6"
        >
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={fadeUp}
                data-glow-card
                data-interactive
                whileHover={{ y: -5, scale: 1.02 }}
                className="group dashboard-surface-card rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-white/[0.08] hover:border-amd-red/25 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-white/[0.06] group-hover:bg-amd-red/10 transition-colors">
                    <Icon className="w-5 h-5 text-amd-red" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-theme mb-2">{feature.title}</h3>
                    <p className="text-sm text-theme-muted leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-14 sm:mt-20 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <div className="flex items-center gap-2 text-theme-subtle text-sm">
            <Activity className="w-4 h-4 text-amd-red" />
            <span>Ready to route on AMD Instinct</span>
          </div>
          <a
            href="/dashboard"
            data-interactive
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amd-red text-white font-semibold shadow-glow-red hover:bg-red-600 transition-colors hover-glow-btn"
          >
            <Layers className="w-4 h-4" />
            Open Dashboard
          </a>
        </motion.div>
      </section>
    </>
  );
}
