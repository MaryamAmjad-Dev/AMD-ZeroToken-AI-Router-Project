"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { cn } from "@/lib/utils";

interface GlassPopoverProps {
  open: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement | null>;
  triggerRefs?: React.RefObject<HTMLElement | null>[];
  children: ReactNode;
  className?: string;
  align?: "start" | "end";
}

function getMaxPanelHeight() {
  return Math.min(window.innerHeight * 0.75, 650);
}

export default function GlassPopover({
  open,
  onClose,
  anchorRef,
  triggerRefs = [],
  children,
  className,
  align = "end",
}: GlassPopoverProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 340, maxHeight: 650 });
  const [mounted, setMounted] = useState(false);

  const updatePosition = useCallback(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;
    const rect = anchor.getBoundingClientRect();
    const width = Math.min(340, window.innerWidth - 24);
    const left =
      align === "end"
        ? Math.max(12, Math.min(rect.right - width, window.innerWidth - width - 12))
        : Math.max(12, rect.left);
    const maxHeight = getMaxPanelHeight();
    let top = rect.bottom + 8;
    if (top + maxHeight > window.innerHeight - 12) {
      top = Math.max(12, window.innerHeight - maxHeight - 12);
    }
    setPosition({ top, left, width, maxHeight });
  }, [anchorRef, align]);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;
    const prevBody = document.body.style.overflow;
    const prevHtml = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevBody;
      document.documentElement.style.overflow = prevHtml;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return;

    const onWheel = (e: WheelEvent) => {
      if (!panel.contains(e.target as Node)) return;

      const { scrollTop, scrollHeight, clientHeight } = panel;
      if (scrollHeight <= clientHeight) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      const atTop = scrollTop <= 0;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 1;

      if ((e.deltaY < 0 && atTop) || (e.deltaY > 0 && atBottom)) {
        e.preventDefault();
      }
      e.stopPropagation();
    };

    panel.addEventListener("wheel", onWheel, { passive: false });
    return () => panel.removeEventListener("wheel", onWheel);
  }, [open]);

  const outsideRefs = [anchorRef, panelRef, backdropRef, ...triggerRefs];
  useClickOutside(outsideRefs, onClose, open);
  useEscapeKey(onClose, open);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            ref={backdropRef}
            key="popover-backdrop"
            type="button"
            aria-label="Close panel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 z-[9998] cursor-default bg-black/10 dark:bg-black/25 border-0 p-0"
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.99 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            style={{
              top: position.top,
              left: position.left,
              width: position.width,
              maxHeight: position.maxHeight,
            }}
            className={cn(
              "fixed z-[9999] pointer-events-auto overflow-y-auto overscroll-contain scroll-hidden rounded-2xl glass-popover",
              className
            )}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
