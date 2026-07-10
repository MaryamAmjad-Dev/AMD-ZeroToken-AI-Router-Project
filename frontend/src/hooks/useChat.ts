"use client";

import { useCallback, useRef, useState } from "react";
import { sendRouterPrompt } from "@/lib/router-api";
import { buildMessageMeta, formatTimestamp, routeMetaFromResponse } from "@/lib/route-utils";
import type { ChatMessage, RouteMeta } from "@/types/chat";
import { DEFAULT_PHASES } from "@/components/chat/ThinkingLoader";

const PHASE_LAYERS: RouteMeta["activeLayer"][] = ["prompt", "l1", "l2", "l3", "decision"];

let messageId = 0;
function nextId() {
  return `msg-${++messageId}-${Date.now()}`;
}

interface UseChatOptions {
  onRouteMeta?: (meta: RouteMeta) => void;
}

export function useChat({ onRouteMeta }: UseChatOptions = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [thinkingPhase, setThinkingPhase] = useState(0);
  const sendingRef = useRef(false);

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || sendingRef.current) return false;

      sendingRef.current = true;
      setIsLoading(true);
      setThinkingPhase(0);
      onRouteMeta?.({ activeLayer: "prompt", activeRoute: "local" });

      const userMessage: ChatMessage = {
        id: nextId(),
        role: "user",
        content: trimmed,
        timestamp: formatTimestamp(),
      };

      setMessages((prev) => [...prev, userMessage]);

      let phase = 0;
      const phaseInterval = window.setInterval(() => {
        phase = (phase + 1) % DEFAULT_PHASES.length;
        setThinkingPhase(phase);
        const layer = PHASE_LAYERS[Math.min(phase, PHASE_LAYERS.length - 1)];
        onRouteMeta?.({
          activeLayer: layer,
          activeRoute: phase >= 3 ? "cloud" : "local",
        });
      }, 850);

      const result = await sendRouterPrompt(trimmed);
      window.clearInterval(phaseInterval);

      const meta = buildMessageMeta(result, result.latencyMs);
      onRouteMeta?.(routeMetaFromResponse(result));

      const assistantMessage: ChatMessage = {
        id: nextId(),
        role: "assistant",
        content: result.response,
        timestamp: formatTimestamp(),
        meta,
        isNew: true,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
      sendingRef.current = false;
      return true;
    },
    [onRouteMeta]
  );

  const clearNewFlag = useCallback((id: string) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, isNew: false } : m)));
  }, []);

  return {
    messages,
    isLoading,
    thinkingPhase,
    thinkingLabel: DEFAULT_PHASES[thinkingPhase],
    sendMessage,
    clearNewFlag,
  };
}
