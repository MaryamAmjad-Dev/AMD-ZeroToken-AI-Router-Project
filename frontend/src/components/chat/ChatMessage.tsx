"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { Copy, Cpu, RefreshCcw, Sparkles, ThumbsUp } from "lucide-react";
import TypingEffect from "./TypingEffect";
import type { ChatMessage } from "@/types/chat";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: ChatMessage;
  index: number;
  onTypingComplete?: () => void;
}

function Avatar({ glowing = false }: { glowing?: boolean }) {
  return (
    <div className="relative w-9 h-9 shrink-0">
      {glowing && (
        <motion.div
          className="absolute -inset-1 rounded-xl bg-amd-red/30 blur-md"
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      <div className="relative w-9 h-9 rounded-xl bg-amd-red/15 border border-amd-red/20 flex items-center justify-center">
        <Sparkles className="w-4 h-4 text-amd-red" />
      </div>
    </div>
  );
}

function ChatMessageBubble({ message, index, onTypingComplete }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: Math.min(index * 0.04, 0.15), duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={cn("flex gap-3", isUser ? "flex-row-reverse" : "flex-row")}
    >
      {!isUser && <Avatar glowing={message.isNew} />}

      <div className={cn("flex flex-col gap-2 min-w-0", isUser ? "items-end max-w-[85%]" : "flex-1")}>
        {!isUser && message.meta && (
          <div className="flex flex-wrap items-center gap-2">
            <Badge icon={<Cpu className="w-3 h-3" />} label={message.meta.model} variant="blue" />
            {message.meta.tokensSaved !== "0" && (
              <Badge label={`${message.meta.tokenReduction} saved`} variant="green" />
            )}
          </div>
        )}

        <div
          className={cn(
            "px-4 py-3.5 rounded-2xl text-sm leading-relaxed max-w-full break-words",
            isUser ? "glass-chat-user rounded-tr-md" : "glass-chat-ai rounded-tl-md"
          )}
        >
          {isUser ? (
            message.content
          ) : message.isNew ? (
            <TypingEffect text={message.content} speed={5} onComplete={onTypingComplete} />
          ) : (
            message.content
          )}
        </div>

        {!isUser && message.meta && (
          <div className="w-full pt-1">
            <div className="h-px bg-gradient-to-r from-transparent via-slate-900/10 dark:via-white/15 to-transparent mb-3" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <MetaChip label="Model" value={message.meta.model} />
              <MetaChip label="Route" value={message.meta.route} />
              <MetaChip label="Tokens Saved" value={message.meta.tokensSaved} accent />
              <MetaChip label="Latency" value={message.meta.latency} accent />
            </div>
          </div>
        )}

        <div className={cn("flex items-center gap-3", isUser && "flex-row-reverse")}>
          <span className="text-[10px] chat-message-secondary font-mono">{message.timestamp}</span>
          {!isUser && (
            <div className="flex gap-2">
              <ActionBtn icon={<Copy className="w-3.5 h-3.5" />} onClick={() => navigator.clipboard?.writeText(message.content)} />
              <ActionBtn icon={<ThumbsUp className="w-3.5 h-3.5" />} />
              <ActionBtn icon={<RefreshCcw className="w-3.5 h-3.5" />} />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function Badge({ icon, label, variant }: { icon?: React.ReactNode; label: string; variant: "blue" | "green" }) {
  const styles =
    variant === "blue"
      ? "bg-amd-red/10 border-amd-red/25 text-amd-red"
      : "bg-amd-red/10 border-amd-red/25 text-amd-red";
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[9px] font-mono uppercase tracking-wider", styles)}>
      {icon}
      {label}
    </span>
  );
}

function MetaChip({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="chat-meta-chip p-2.5 rounded-xl min-w-0">
      <p className="chat-meta-chip-label text-[8px] uppercase tracking-widest mb-1">{label}</p>
      <p className={cn("chat-meta-chip-value text-[11px] font-mono font-medium truncate", accent && "chat-meta-chip-value-accent")}>
        {value}
      </p>
    </div>
  );
}

function ActionBtn({ icon, onClick }: { icon: React.ReactNode; onClick?: () => void }) {
  return (
    <button type="button" data-interactive onClick={onClick} className="chat-message-secondary hover:text-[#0f172a] dark:hover:text-[#f8fafc] transition-colors p-0.5 cursor-pointer">
      {icon}
    </button>
  );
}

export default memo(ChatMessageBubble);
