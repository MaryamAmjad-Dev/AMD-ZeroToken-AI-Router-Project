"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, GitBranch, Plus, Send, SlidersHorizontal, Sparkles } from "lucide-react";
import ChatMessage from "./ChatMessage";
import ThinkingLoader from "./ThinkingLoader";
import NotificationsPanel from "./NotificationsPanel";
import RoutingDetailsPanel from "./RoutingDetailsPanel";
import AISettingsPanel from "./AISettingsPanel";
import HeaderActionButton from "@/components/ui/HeaderActionButton";
import GlassPopover from "@/components/ui/GlassPopover";
import ClickRipple from "@/components/ui/ClickRipple";
import ThemeToggle from "@/components/theme/ThemeToggle";
import type { ChatMessage as ChatMessageType, ChatMessageMeta, RouteMeta } from "@/types/chat";
import { cn } from "@/lib/utils";

type PanelId = "notifications" | "routing" | "settings" | null;

interface ChatConsoleProps {
  messages: ChatMessageType[];
  input: string;
  isLoading: boolean;
  thinkingLabel: string;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSend: () => void;
  onClearNewFlag: (id: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  activeLayer?: RouteMeta["activeLayer"];
  activeRoute?: RouteMeta["activeRoute"];
  lastMeta?: ChatMessageMeta;
}

export default function ChatConsole({
  messages,
  input,
  isLoading,
  thinkingLabel,
  onInputChange,
  onSend,
  onClearNewFlag,
  textareaRef,
  activeLayer = "l2",
  activeRoute = "local",
  lastMeta,
}: ChatConsoleProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLButtonElement>(null);
  const routingRef = useRef<HTMLButtonElement>(null);
  const settingsRef = useRef<HTMLButtonElement>(null);
  const [focused, setFocused] = useState(false);
  const [openPanel, setOpenPanel] = useState<PanelId>(null);
  const [unreadCount, setUnreadCount] = useState(4);

  const anchorRef =
    openPanel === "notifications" ? bellRef : openPanel === "routing" ? routingRef : settingsRef;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, thinkingLabel]);

  const togglePanel = (id: PanelId) => {
    setOpenPanel((prev) => (prev === id ? null : id));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && input.trim()) onSend();
    }
  };

  return (
    <div className="relative z-10 flex flex-col h-full min-h-0 glass-console rounded-2xl">
      <header className="relative z-20 shrink-0 flex justify-between items-center px-5 py-4 border-b border-slate-900/8 dark:border-white/[0.06] gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-amd-red/15 border border-amd-red/20 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-amd-red" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-theme truncate">AI Console</h2>
            <p className="text-[11px] text-theme-subtle truncate">Spaceship command interface</p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <HeaderActionButton
            ref={bellRef}
            icon={<Bell className="w-4 h-4" />}
            tooltip="Notifications"
            active={openPanel === "notifications"}
            badge={unreadCount}
            onClick={() => togglePanel("notifications")}
          />
          <HeaderActionButton
            ref={routingRef}
            icon={<GitBranch className="w-4 h-4" />}
            tooltip="Routing Status"
            active={openPanel === "routing"}
            onClick={() => togglePanel("routing")}
          />
          <HeaderActionButton
            ref={settingsRef}
            icon={<SlidersHorizontal className="w-4 h-4" />}
            tooltip="AI Controls"
            active={openPanel === "settings"}
            onClick={() => togglePanel("settings")}
          />
          <ThemeToggle />
        </div>
      </header>

      <GlassPopover
        open={openPanel !== null}
        onClose={() => setOpenPanel(null)}
        anchorRef={anchorRef}
        triggerRefs={[bellRef, routingRef, settingsRef]}
      >
        {openPanel === "notifications" && (
          <NotificationsPanel isOpen onUnreadChange={setUnreadCount} />
        )}
        {openPanel === "routing" && (
          <RoutingDetailsPanel
            activeLayer={activeLayer}
            activeRoute={activeRoute}
            meta={lastMeta}
            isProcessing={isLoading}
          />
        )}
        {openPanel === "settings" && <AISettingsPanel />}
      </GlassPopover>

      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar px-5 py-6">
        <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full">
          {messages.length === 0 && !isLoading && (
            <div className="flex flex-col items-center py-16 text-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-900/5 dark:bg-white/5 border border-slate-900/10 dark:border-white/10 flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5 text-amd-red" />
              </div>
              <p className="text-sm text-theme-muted max-w-xs">
                Route queries through Regex → MiniLM → XGBoost → Local or Fireworks
              </p>
            </div>
          )}

          {messages.map((msg, i) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              index={i}
              onTypingComplete={() => msg.isNew && onClearNewFlag(msg.id)}
            />
          ))}

          <AnimatePresence mode="wait">
            {isLoading && (
              <motion.div
                key="chat-loading"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex gap-3"
              >
                <div className="w-9 h-9 shrink-0 rounded-xl bg-gradient-to-br from-amd-red/20 to-amd-blue/10 border border-white/10 flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-amd-red animate-pulse" />
                </div>
                <div className="glass-chat-ai rounded-2xl rounded-tl-md px-5 py-4">
                  <ThinkingLoader label={thinkingLabel} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="shrink-0 p-5 border-t border-slate-900/8 dark:border-white/[0.06]">
        <div
          className={cn(
            "relative rounded-2xl border transition-colors duration-300 overflow-hidden",
            focused
              ? "glass-chat-input-focused"
              : "glass-chat-input"
          )}
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-amd-red/30" />
          <div className="relative flex items-end gap-2 p-3">
            <ClickRipple className="p-2.5 text-theme-subtle hover:text-theme rounded-xl hover:bg-slate-900/5 dark:hover:bg-white/5 shrink-0 cursor-pointer">
              <Plus className="w-5 h-5" />
            </ClickRipple>
            <textarea
              data-interactive
              ref={textareaRef}
              value={input}
              onChange={onInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Ask the ZeroToken Router anything..."
              disabled={isLoading}
              className="flex-1 bg-transparent border-none outline-none text-[#0f172a] dark:text-white placeholder:text-[#64748B] dark:placeholder:text-[#94a3b8] py-2.5 resize-none text-sm leading-relaxed max-h-[160px] min-h-[44px] disabled:opacity-50 cursor-text"
              rows={1}
            />
            <ClickRipple
              disabled={isLoading || !input.trim()}
              onClick={onSend}
              className={cn(
                "shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200",
                input.trim() && !isLoading
                  ? "glass-send-active dark:bg-gradient-to-br dark:from-white dark:to-white/90 dark:text-black dark:shadow-md cursor-pointer"
                  : "bg-slate-900/5 dark:bg-white/[0.06] text-theme-subtle cursor-not-allowed"
              )}
            >
              <Send className="w-4 h-4" />
            </ClickRipple>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 mt-3 px-1">
          <div className="flex flex-wrap gap-4">
            <FooterTag label="Auto-Route" />
            <FooterTag label="Local Context" />
          </div>
          <span className="text-[10px] text-theme-subtle font-mono uppercase tracking-widest">Enter · send</span>
        </div>
      </div>
    </div>
  );
}

function FooterTag({ label }: { label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-[10px] text-theme-subtle uppercase tracking-widest font-medium">
      <Sparkles className="w-3 h-3 text-amd-red" />
      {label}
    </span>
  );
}
