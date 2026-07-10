"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, Activity, Route, History, Settings } from "lucide-react";
import GlassTooltip from "@/components/ui/GlassTooltip";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Activity, label: "Analytics", href: "/analytics" },
  { icon: Route, label: "Routing", href: "/routing" },
  { icon: History, label: "History", href: "/history" },
] as const;

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="relative z-50 w-[90px] flex flex-col items-center py-6 glass-sidebar shrink-0 h-full">
      <Link href="/dashboard" className="mb-8 flex flex-col items-center gap-2.5 group cursor-pointer" data-interactive>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative"
        >
          <div className="w-11 h-11 bg-gradient-to-br from-amd-red via-red-600 to-red-800 rounded-xl flex items-center justify-center font-bold text-white text-[11px] tracking-tighter shadow-glow-red dark:sidebar-logo-glow group-hover:scale-105 transition-transform">
            AMD
          </div>
          <motion.div
            className="absolute -inset-1 rounded-xl border border-amd-red/30 dark:border-amd-red/20 pointer-events-none"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </motion.div>
        <div className="text-center leading-none">
          <p className="text-[10px] font-semibold text-slate-500 dark:text-white/60 tracking-widest">ZERO</p>
          <p className="text-[10px] font-bold text-amd-red tracking-widest mt-0.5">TOKEN</p>
        </div>
      </Link>

      <div className="flex flex-col gap-3 items-center flex-1 w-full px-3">
        {NAV_ITEMS.map((item, i) => (
          <NavItem
            key={item.href}
            href={item.href}
            icon={<item.icon className="w-[18px] h-[18px]" strokeWidth={1.75} />}
            label={item.label}
            active={pathname === item.href || (item.href === "/dashboard" && pathname === "/chat")}
            delay={i * 0.06}
          />
        ))}
      </div>

      <div className="mt-auto px-3 w-full">
        <NavItem
          href="/dashboard"
          icon={<Settings className="w-[18px] h-[18px]" strokeWidth={1.75} />}
          label="Settings"
          active={false}
          delay={0.24}
        />
      </div>
    </nav>
  );
}

function NavItem({
  href,
  icon,
  label,
  active = false,
  delay = 0,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full"
    >
      <GlassTooltip label={label} side="right" className="w-full">
        <Link
          href={href}
          data-interactive
          className={cn(
            "relative w-full flex items-center justify-center p-3 rounded-xl transition-all duration-300 cursor-pointer",
            active
              ? "text-slate-800 dark:text-theme"
              : "text-slate-500 hover:text-slate-800 dark:text-white/35 dark:hover:text-white/80 hover:bg-slate-900/[0.05] dark:hover:bg-white/[0.06]"
          )}
          aria-label={label}
        >
          {active && (
            <>
              <div className="absolute inset-0 rounded-xl bg-[rgba(247,244,238,0.92)] border border-slate-900/10 dark:sidebar-nav-active" />
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-amd-red rounded-r-full shadow-glow-red dark:sidebar-nav-indicator" />
            </>
          )}
          <motion.span
            className="relative z-10"
            whileHover={{ scale: 1.1, rotate: active ? 0 : 3 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            {icon}
          </motion.span>
        </Link>
      </GlassTooltip>
    </motion.div>
  );
}
