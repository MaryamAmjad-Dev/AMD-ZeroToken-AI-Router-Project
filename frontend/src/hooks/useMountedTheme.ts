"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

/**
 * Returns a stable theme during SSR and the first client paint (default: dark),
 * then the resolved theme after mount. Prevents hydration mismatches from
 * next-themes reading localStorage before React hydrates.
 */
export function useMountedTheme() {
  const { resolvedTheme, setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme !== "light" : true;
  const isLight = !isDark;

  return {
    mounted,
    isDark,
    isLight,
    resolvedTheme: mounted ? resolvedTheme : "dark",
    setTheme,
    theme,
  };
}
