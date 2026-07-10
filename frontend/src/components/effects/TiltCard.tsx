"use client";

import { memo, useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useUISettingsOptional } from "@/contexts/UISettingsContext";
import { cn } from "@/lib/utils";

type TiltVariant = "stable" | "subtle" | "interactive";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  float?: boolean;
  variant?: TiltVariant;
  style?: React.CSSProperties;
}

function TiltCardInner({
  children,
  className,
  float = false,
  variant = "subtle",
  style,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const settings = useUISettingsOptional();
  const motionOn = settings?.animationsEnabled !== false;
  const isStable = variant === "stable";
  const isSubtle = variant === "subtle" || isStable;

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 260, damping: 28 });
  const sy = useSpring(my, { stiffness: 260, damping: 28 });
  const maxTilt = isStable ? 0 : isSubtle ? 4 : 7;
  const rotateX = useTransform(sy, [-0.5, 0.5], [maxTilt, -maxTilt]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-maxTilt, maxTilt]);
  const glareOpacity = useTransform([sx, sy], ([x, y]) => {
    if (isStable) return 0;
    const ax = Math.abs(x as number);
    const ay = Math.abs(y as number);
    return Math.min(0.22, (ax + ay) * 0.35 + 0.04);
  });

  const onMove = (e: React.MouseEvent) => {
    if (!motionOn || isStable) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const enableTilt = motionOn && !isStable;
  const enableFloat = motionOn && float && !isStable;

  return (
    <motion.div
      ref={ref}
      data-glow-card
      onMouseMove={enableTilt ? onMove : undefined}
      onMouseLeave={enableTilt ? onLeave : undefined}
      style={enableTilt ? { rotateX, rotateY, ...style } : style}
      animate={enableFloat ? { y: [0, -3, 0] } : undefined}
      transition={
        enableFloat
          ? { y: { duration: 6, repeat: Infinity, ease: "easeInOut" } }
          : { duration: 0.25, ease: [0.22, 1, 0.36, 1] }
      }
      whileHover={
        motionOn
          ? {
              y: isStable ? -4 : -6,
              scale: 1.025,
              transition: { type: "spring", stiffness: 320, damping: 22 },
            }
          : undefined
      }
      className={cn(
        isStable ? "glass-card-stable" : "glass-card-3d",
        "relative group",
        className
      )}
    >
      {!isStable && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-0 rounded-[inherit]"
          style={{
            opacity: glareOpacity,
            background:
              "radial-gradient(circle at 35% 25%, rgba(255,255,255,0.18) 0%, rgba(147,197,253,0.08) 35%, transparent 60%)",
          }}
        />
      )}
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
}

const TiltCard = memo(TiltCardInner);
export default TiltCard;
