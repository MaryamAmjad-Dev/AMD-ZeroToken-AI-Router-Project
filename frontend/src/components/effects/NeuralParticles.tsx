"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

interface NeuralParticlesProps {
  connectionDistance?: number;
  particleCount?: number;
  lineColor?: string;
  dotColor?: string;
  light?: boolean;
  className?: string;
}

export default function NeuralParticles({
  connectionDistance = 120,
  particleCount,
  lineColor = "59, 130, 246",
  dotColor = "147, 197, 253",
  light = false,
  className = "",
}: NeuralParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let running = true;
    let animId = 0;
    let particles: Particle[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const lowPower = typeof navigator !== "undefined" && (navigator.hardwareConcurrency ?? 8) <= 4;
      const base = particleCount ?? Math.floor((canvas.width * canvas.height) / 22000);
      const count = reduced ? 0 : Math.min(lowPower ? 35 : 70, base);
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.45 + 0.1,
      }));
    };

    const draw = () => {
      if (!running) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectionDistance) {
            const lineAlpha = (light ? 0.22 : 0.07) * (1 - dist / connectionDistance);
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${lineColor}, ${lineAlpha})`;
            ctx.lineWidth = light ? 0.6 : 0.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();

            if (light && (i + j) % 5 === 0) {
              const pulseT = ((Date.now() / 1200 + i * 0.13 + j * 0.07) % 1);
              const px = p.x + (p2.x - p.x) * pulseT;
              const py = p.y + (p2.y - p.y) * pulseT;
              ctx.beginPath();
              ctx.arc(px, py, 1.8, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(${dotColor}, ${0.55 + 0.35 * Math.sin(pulseT * Math.PI)})`;
              ctx.fill();
            }
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${dotColor}, ${light ? Math.min(p.opacity * 1.4, 0.75) : p.opacity})`;
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
  }, [connectionDistance, particleCount, lineColor, dotColor, light]);

  return <canvas ref={canvasRef} className={`absolute inset-0 w-full h-full pointer-events-none ${className}`} />;
}
