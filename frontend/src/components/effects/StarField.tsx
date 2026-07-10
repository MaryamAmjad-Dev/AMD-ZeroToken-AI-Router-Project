"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

interface StarFieldProps {
  density?: number;
  light?: boolean;
  className?: string;
}

export default function StarField({ density = 1, light = false, className = "" }: StarFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let running = true;
    let animId = 0;
    let stars: Star[] = [];
    let startTime = Date.now();

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const count = Math.floor((canvas.width * canvas.height) / (light ? 6500 : 8000) / density);
      stars = Array.from({ length: Math.min(count, light ? 450 : 400) }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * (light ? 2.2 : 1.8) + 0.3,
        opacity: Math.random() * 0.7 + 0.2,
        twinkleSpeed: Math.random() * 2 + 1,
        twinkleOffset: Math.random() * Math.PI * 2,
      }));
    };

    const draw = () => {
      if (!running) return;
      const t = (Date.now() - startTime) / 1000;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const star of stars) {
        if (light) {
          star.x += 0.015;
          star.y += 0.006;
          if (star.x > canvas.width) star.x = 0;
          if (star.y > canvas.height) star.y = 0;
        }

        const twinkle = 0.5 + 0.5 * Math.sin(t * star.twinkleSpeed + star.twinkleOffset);
        const alpha = star.opacity * twinkle;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        if (light) {
          const hue = star.x % 3;
          const color =
            hue < 1
              ? `rgba(59, 130, 246, ${alpha * 0.85})`
              : hue < 2
                ? `rgba(139, 92, 246, ${alpha * 0.75})`
                : `rgba(34, 211, 238, ${alpha * 0.7})`;
          ctx.fillStyle = color;
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        }
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    resize();
    animId = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);

    return () => {
      running = false;
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, [density, light]);

  return <canvas ref={canvasRef} className={`absolute inset-0 w-full h-full pointer-events-none ${className}`} />;
}
