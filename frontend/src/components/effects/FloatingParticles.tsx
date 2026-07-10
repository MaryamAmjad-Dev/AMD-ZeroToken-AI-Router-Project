"use client";

import { useEffect, useRef } from "react";

interface Floater {
  x: number;
  y: number;
  z: number;
  size: number;
  speed: number;
  opacity: number;
}

export default function FloatingParticles({ count = 40, light = false }: { count?: number; light?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lowPower = (navigator.hardwareConcurrency ?? 8) <= 4;
    const particleCount = reduced ? 0 : lowPower ? Math.min(25, count) : count;

    let running = true;
    let animId = 0;
    let floaters: Floater[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      floaters = Array.from({ length: particleCount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random(),
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.3 + 0.1,
        opacity: Math.random() * 0.4 + 0.1,
      }));
    };

    const draw = () => {
      if (!running) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const f of floaters) {
        f.y -= f.speed * (0.5 + f.z);
        f.x += Math.sin(f.y * 0.01) * 0.15;
        if (f.y < -10) {
          f.y = canvas.height + 10;
          f.x = Math.random() * canvas.width;
        }

        const scale = 0.5 + f.z * 0.8;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.size * scale, 0, Math.PI * 2);
        ctx.fillStyle = light
          ? `rgba(80, 120, 255, ${f.opacity * scale * 0.75})`
          : `rgba(186, 230, 253, ${f.opacity * scale})`;
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
  }, [count, light]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${light ? "opacity-90" : "opacity-50"}`}
    />
  );
}
