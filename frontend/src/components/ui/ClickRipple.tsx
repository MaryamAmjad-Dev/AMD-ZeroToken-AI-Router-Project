"use client";

import { useState, type MouseEvent, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Ripple {
  id: number;
  x: number;
  y: number;
}

interface ClickRippleProps {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit";
  "aria-label"?: string;
  "aria-expanded"?: boolean;
  "data-interactive"?: boolean;
}

export default function ClickRipple({
  children,
  className,
  disabled,
  onClick,
  type = "button",
  ...rest
}: ClickRippleProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now();
    setRipples((prev) => [
      ...prev.slice(-2),
      { id, x: e.clientX - rect.left, y: e.clientY - rect.top },
    ]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 600);
    onClick?.(e);
  };

  return (
    <motion.button
      type={type}
      disabled={disabled}
      data-interactive
      onClick={handleClick}
      whileHover={disabled ? undefined : { scale: 1.03 }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      className={cn("relative overflow-hidden", className)}
      {...rest}
    >
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          className="absolute rounded-full bg-white/25 pointer-events-none"
          style={{ left: r.x, top: r.y, width: 8, height: 8, marginLeft: -4, marginTop: -4 }}
          initial={{ scale: 0, opacity: 0.6 }}
          animate={{ scale: 12, opacity: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        />
      ))}
      <span className="relative z-10 flex items-center justify-center">{children}</span>
    </motion.button>
  );
}
