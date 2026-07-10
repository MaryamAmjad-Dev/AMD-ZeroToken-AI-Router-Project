"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { useSpring, useMotionValueEvent } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  style?: CSSProperties;
}

function formatValue(v: number, decimals: number, prefix: string, suffix: string) {
  const formatted = decimals > 0 ? v.toFixed(decimals) : Math.round(v).toLocaleString();
  return `${prefix}${formatted}${suffix}`;
}

export default function AnimatedCounter({
  value,
  decimals = 0,
  suffix = "",
  prefix = "",
  className = "",
  style,
}: AnimatedCounterProps) {
  const spring = useSpring(0, { stiffness: 80, damping: 20 });
  const [displayText, setDisplayText] = useState(() => formatValue(0, decimals, prefix, suffix));

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  useMotionValueEvent(spring, "change", (v) => {
    setDisplayText(formatValue(v, decimals, prefix, suffix));
  });

  return (
    <span className={className} style={style}>
      {displayText}
    </span>
  );
}
