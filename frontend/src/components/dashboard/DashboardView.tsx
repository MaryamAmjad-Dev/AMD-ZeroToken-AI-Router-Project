"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PanelLeft, X } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import TopStats from "@/components/dashboard/TopStats";
import ChatConsole from "@/components/chat/ChatConsole";
import RouterPanel from "@/components/dashboard/RouterPanel";
import { useChat } from "@/hooks/useChat";
import type { RouteMeta } from "@/types/chat";

type ActiveLayer = RouteMeta["activeLayer"];
type ActiveRoute = RouteMeta["activeRoute"];

const LAYERS: ActiveLayer[] = ["prompt", "l1", "l2", "l3", "decision"];

export default function DashboardView() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [input, setInput] = useState("");
  const [showRouter, setShowRouter] = useState(false);
  const [activeLayer, setActiveLayer] = useState<ActiveLayer>("l2");
  const [activeRoute, setActiveRoute] = useState<ActiveRoute>("local");
  const [hasRouted, setHasRouted] = useState(false);

  const { messages, isLoading, thinkingLabel, sendMessage, clearNewFlag } = useChat({
    onRouteMeta: (meta) => {
      setActiveLayer(meta.activeLayer);
      setActiveRoute(meta.activeRoute);
      setHasRouted(true);
    },
  });

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  useEffect(() => {
    if (hasRouted || isLoading) return;

    let i = LAYERS.indexOf("l2");
    const interval = setInterval(() => {
      i = (i + 1) % LAYERS.length;
      const layer = LAYERS[i];
      setActiveLayer(layer);
      if (layer === "decision") {
        setActiveRoute((prev) => (prev === "local" ? "cloud" : "local"));
      }
    }, 2800);
    return () => clearInterval(interval);
  }, [hasRouted, isLoading]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px";
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const text = input;
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    await sendMessage(text);
  };

  const lastMeta = useMemo(() => {
    const last = [...messages].reverse().find((m) => m.role === "assistant" && m.meta);
    return last?.meta;
  }, [messages]);

  return (
    <>
      <div className="dashboard-page flex-1 min-h-0 overflow-y-auto custom-scrollbar">
        <div className="flex flex-col min-h-full">
          <DashboardHeader />
          <TopStats />

          <div className="flex-1 px-5 md:px-8 pb-5 md:pb-8 min-h-0">
            <div className="flex items-center justify-between gap-3 mb-4 lg:hidden">
              <button
                type="button"
                data-interactive
                onClick={() => setShowRouter(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl dashboard-surface-card text-xs text-theme-muted hover:text-theme transition-colors cursor-pointer"
              >
                <PanelLeft className="w-4 h-4" />
                Router Pipeline
              </button>
              <span className="text-[10px] font-mono text-theme-subtle uppercase tracking-widest">
                {activeLayer.toUpperCase()} active
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-5 min-h-[500px] lg:min-h-[calc(100vh-340px)]">
              <ChatConsole
                messages={messages}
                input={input}
                isLoading={isLoading}
                thinkingLabel={thinkingLabel}
                onInputChange={handleInput}
                onSend={handleSend}
                onClearNewFlag={clearNewFlag}
                textareaRef={textareaRef}
                activeLayer={activeLayer}
                activeRoute={activeRoute}
                lastMeta={lastMeta}
              />
              <div className="hidden lg:block min-h-0">
                <RouterPanel activeRoute={activeRoute} activeLayer={activeLayer} isProcessing={isLoading} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showRouter && (
          <motion.button
            key="router-overlay"
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden cursor-pointer"
            onClick={() => setShowRouter(false)}
            aria-label="Close router panel"
          />
        )}
        {showRouter && (
          <motion.div
            key="router-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed inset-y-0 right-0 z-50 w-[min(400px,92vw)] p-4 lg:hidden"
          >
            <div className="relative h-full">
              <button
                type="button"
                data-interactive
                onClick={() => setShowRouter(false)}
                className="absolute top-3 right-3 z-10 p-2 rounded-lg bg-white/10 text-white/60 hover:text-white cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
              <RouterPanel activeRoute={activeRoute} activeLayer={activeLayer} isProcessing={isLoading} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
