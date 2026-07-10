"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ClickRipple from "@/components/ui/ClickRipple";
import { cn } from "@/lib/utils";

const INITIAL = [
  { id: "n1", emoji: "🚀", text: "Router optimized successfully", unread: true },
  { id: "n2", emoji: "🧠", text: "Semantic cache hit detected", unread: true },
  { id: "n3", emoji: "⚡", text: "XGBoost routed query locally", unread: true },
  { id: "n4", emoji: "💰", text: "Tokens saved updated", unread: true },
];

interface NotificationsPanelProps {
  isOpen?: boolean;
  onUnreadChange?: (count: number) => void;
}

export default function NotificationsPanel({ isOpen = false, onUnreadChange }: NotificationsPanelProps) {
  const [items, setItems] = useState(INITIAL);

  const unreadCount = items.filter((i) => i.unread).length;

  useEffect(() => {
    onUnreadChange?.(unreadCount);
  }, [unreadCount, onUnreadChange]);

  const markAllRead = () => {
    setItems((prev) => prev.map((i) => ({ ...i, unread: false })));
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-900/10 dark:border-white/[0.08]">
        <div>
          <h3 className="text-sm font-semibold text-theme">Notifications</h3>
          <p className="text-[10px] text-theme-subtle mt-0.5">{unreadCount} unread</p>
        </div>
        {unreadCount > 0 && (
          <ClickRipple
            onClick={markAllRead}
            className="text-[10px] font-mono uppercase tracking-wider text-amd-red hover:text-slate-900 dark:hover:text-white px-2 py-1 rounded-lg hover:bg-slate-900/5 dark:hover:bg-white/5 cursor-pointer"
          >
            Mark read
          </ClickRipple>
        )}
      </div>

      <ul className="p-2">
        {items.map((item, i) => (
          <motion.li
            key={item.id}
            layout
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
              className={cn(
              "flex items-start gap-3 px-3 py-3 rounded-xl mb-1 transition-colors cursor-pointer hover:bg-slate-900/5 dark:hover:bg-white/[0.04]",
              item.unread ? "bg-amd-red/[0.08] dark:bg-amd-red/[0.06]" : "opacity-75"
            )}
            onClick={() => setItems((prev) => prev.map((n) => (n.id === item.id ? { ...n, unread: false } : n)))}
          >
            <span className="text-lg shrink-0">{item.emoji}</span>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-theme leading-relaxed">{item.text}</p>
              <p className="text-[10px] text-theme-subtle mt-1 font-mono">Just now</p>
            </div>
            {item.unread && (
              <motion.span
                layout
                className="w-2 h-2 rounded-full bg-amd-red shrink-0 mt-1"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
            )}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

export function useNotificationCount() {
  return INITIAL.filter((i) => i.unread).length;
}
