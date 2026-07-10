"use client";



import { forwardRef } from "react";

import { AnimatePresence, motion } from "framer-motion";

import { Moon, Sun } from "lucide-react";

import GlassTooltip from "@/components/ui/GlassTooltip";

import { useMountedTheme } from "@/hooks/useMountedTheme";

import { cn } from "@/lib/utils";



interface ThemeToggleProps {

  className?: string;

}



const ThemeToggle = forwardRef<HTMLButtonElement, ThemeToggleProps>(function ThemeToggle(

  { className },

  ref

) {

  const { mounted, isDark, setTheme } = useMountedTheme();



  const toggle = () => {

    setTheme(isDark ? "light" : "dark");

  };



  const tooltipLabel = mounted ? (isDark ? "Light mode" : "Dark mode") : "Toggle theme";

  const ariaLabel = mounted

    ? isDark

      ? "Switch to light mode"

      : "Switch to dark mode"

    : "Toggle theme";



  return (

    <GlassTooltip label={tooltipLabel} side="bottom">

      <motion.button

        ref={ref}

        type="button"

        data-interactive

        aria-label={ariaLabel}

        suppressHydrationWarning

        onClick={(e) => {

          e.stopPropagation();

          toggle();

        }}

        whileHover={{ scale: 1.08, y: -2 }}
        whileTap={{ scale: 0.92 }}
        className={cn(
          "relative z-20 inline-flex items-center justify-center p-2 rounded-lg cursor-pointer transition-colors duration-200",
          "text-slate-500 hover:text-slate-800 dark:text-white/50 dark:hover:text-white/90",
          "hover:bg-slate-900/5 dark:hover:bg-white/[0.06] border border-transparent hover:border-slate-900/10 dark:hover:border-white/10",
          "hover:shadow-[0_0_18px_rgba(59,130,246,0.14)] dark:hover:shadow-[0_0_22px_rgba(239,68,68,0.14)]",
          className
        )}

      >

        <AnimatePresence mode="wait" initial={false}>

          {mounted && (

            <motion.span

              key={isDark ? "moon" : "sun"}

              initial={{ opacity: 0, rotate: -90, scale: 0.6 }}

              animate={{ opacity: 1, rotate: 0, scale: 1 }}

              exit={{ opacity: 0, rotate: 90, scale: 0.6 }}

              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}

              className="flex items-center justify-center"

            >

              {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-500" />}

            </motion.span>

          )}

        </AnimatePresence>

      </motion.button>

    </GlassTooltip>

  );

});



export default ThemeToggle;

