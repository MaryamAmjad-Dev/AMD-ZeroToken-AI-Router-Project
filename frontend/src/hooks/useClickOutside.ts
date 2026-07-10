"use client";

import { useEffect, type RefObject } from "react";

export function useClickOutside<T extends HTMLElement>(
  refs: RefObject<T | null>[],
  handler: () => void,
  enabled = true
) {
  useEffect(() => {
    if (!enabled) return;

    const listener = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      const inside = refs.some((ref) => ref.current?.contains(target));
      if (!inside) handler();
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener, { passive: true });
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [refs, handler, enabled]);
}
