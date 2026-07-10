"use client";

import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BarChart3, Sparkles } from "lucide-react";
import AnimatedCounter from "@/components/dashboard/AnimatedCounter";
import {
  ANALYTICS_STATS,
  COST_COMPARISON,
  MODEL_USAGE_DATA,
  ROUTING_ANALYTICS,
  TOKEN_SAVINGS_DATA,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const CHART_TOOLTIP_STYLE = {
  backgroundColor: "rgba(11, 17, 32, 0.9)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "12px",
  backdropFilter: "blur(12px)",
};

export default function AnalyticsView() {
  return (
    <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
      <div className="px-5 md:px-8 pt-6 pb-8">
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-5 h-5 text-amd-red" />
            <span className="text-[11px] font-mono text-theme-subtle uppercase tracking-[0.2em]">
              Data Universe
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            <span className="text-theme">Analytics </span>
            <span className="text-amd-red">Command Center</span>
          </h1>
          <p className="mt-2 text-sm text-theme-muted max-w-2xl">
            Holographic telemetry across token savings, model routing, and cost optimization.
          </p>
        </motion.header>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {ANALYTICS_STATS.map((stat, i) => (
            <motion.div
              key={stat.id}
              data-glow-card
              data-interactive
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -5, scale: 1.03 }}
              whileTap={{ scale: 0.99 }}
              className="glass-card rounded-2xl p-4 md:p-5 hover:border-emerald-500/15 transition-colors duration-200 cursor-default"
            >
              <p className="text-[10px] text-theme-subtle uppercase tracking-widest mb-3">{stat.label}</p>
              <p className={cn("text-2xl md:text-3xl font-semibold font-mono", stat.color)}>
                {stat.id === "cost" && "$"}
                {stat.id === "accuracy" ? (
                  <>
                    <AnimatedCounter value={stat.value} />
                    <span className="text-theme-subtle text-xl">/19</span>
                  </>
                ) : (
                  <AnimatedCounter value={stat.value} decimals={stat.decimals} suffix={stat.suffix} />
                )}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-5">
          <ChartCard title="Token Savings" subtitle="K tokens saved vs API calls">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={TOKEN_SAVINGS_DATA}>
                <defs>
                  <linearGradient id="savedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                <XAxis dataKey="day" stroke="rgba(255,255,255,0.3)" fontSize={11} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} />
                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                <Area type="monotone" dataKey="saved" stroke="#3B82F6" fill="url(#savedGrad)" strokeWidth={2} name="Saved" />
                <Area type="monotone" dataKey="api" stroke="#EF4444" fill="transparent" strokeWidth={2} name="API" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Model Usage" subtitle="Local vs cloud distribution">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={MODEL_USAGE_DATA} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" paddingAngle={4}>
                  {MODEL_USAGE_DATA.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} stroke="rgba(255,255,255,0.1)" />
                  ))}
                </Pie>
                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                <Legend wrapperStyle={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <ChartCard title="Routing Analytics" subtitle="Hits per pipeline layer">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={ROUTING_ANALYTICS}>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                <XAxis dataKey="layer" stroke="rgba(255,255,255,0.3)" fontSize={10} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} />
                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                <Bar dataKey="hits" fill="#3B82F6" radius={[6, 6, 0, 0]} name="Hits" />
                <Bar dataKey="bypassed" fill="#EF4444" radius={[6, 6, 0, 0]} name="Bypassed" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Cost Comparison" subtitle="Without vs with ZeroToken Router">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={COST_COMPARISON}>
                <defs>
                  <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34D399" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#34D399" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" fontSize={11} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} />
                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                <Area type="monotone" dataKey="without" stroke="#EF4444" fill="transparent" strokeWidth={2} name="Without Router" />
                <Area type="monotone" dataKey="with" stroke="#34D399" fill="url(#costGrad)" strokeWidth={2} name="With Router" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <motion.div
      data-glow-card
      data-interactive
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className="glass-card rounded-2xl p-5 border border-white/[0.08] overflow-hidden cursor-default"
    >
      <div className="flex items-center gap-2 mb-1">
        <Sparkles className="w-4 h-4 text-amd-red" />
        <h3 className="text-sm font-semibold text-theme">{title}</h3>
      </div>
      <p className="text-[11px] text-theme-subtle mb-4">{subtitle}</p>
      {children}
    </motion.div>
  );
}
