"use client";

import { useEffect } from "react";

/** Tracks pointer position on glow cards for radial hover highlights. */
export function useCardGlowTracking() {
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const card = (e.target as HTMLElement).closest("[data-glow-card]");
      if (!(card instanceof HTMLElement)) return;
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty("--glow-x", `${x}%`);
      card.style.setProperty("--glow-y", `${y}%`);
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    return () => document.removeEventListener("mousemove", onMove);
  }, []);
}
