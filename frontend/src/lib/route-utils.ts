import type { RouteMeta } from "@/types/chat";
import type { RouteResponse } from "@/lib/api";

export function formatModelName(model: string): string {
  if (model === "local") return "Qwen 1.5B Local";
  const lower = model.toLowerCase();
  if (lower.includes("70b")) return "Fireworks Llama 70B";
  if (lower.includes("8b")) return "Fireworks Llama 8B";
  if (lower.includes("qwen") && lower.includes("coder")) return "Fireworks Qwen Coder";
  if (lower.includes("fireworks") || lower.includes("accounts/")) return "Fireworks API";
  return model.split("/").pop()?.replace(/-/g, " ") ?? model;
}

export function mapRoutingLayer(layer: string): { route: string } & RouteMeta {
  const l = layer.toLowerCase();

  if (l.includes("cache")) {
    return { route: "Regex → MiniLM → Cache → Local", activeLayer: "l2", activeRoute: "local" };
  }
  if (l.includes("code-bypass") || l.includes("math-bypass")) {
    return { route: "Regex → XGBoost → Fireworks", activeLayer: "l1", activeRoute: "cloud" };
  }
  if (l.includes("text-local") || l.includes("sentiment-local")) {
    return { route: "Regex → MiniLM → XGBoost → Local", activeLayer: "l3", activeRoute: "local" };
  }
  if (l.includes("fallback")) {
    return { route: "Regex → MiniLM → XGBoost → Fireworks", activeLayer: "decision", activeRoute: "cloud" };
  }
  return { route: "Regex → MiniLM → XGBoost → Model", activeLayer: "decision", activeRoute: "local" };
}

export function buildMessageMeta(
  data: RouteResponse,
  latencyMs: number
): {
  model: string;
  route: string;
  latency: string;
  tokensSaved: string;
  tokenReduction: string;
} {
  const mapped = mapRoutingLayer(data.routing_layer);
  const tokensSaved = data.tokens_saved;

  return {
    model: formatModelName(data.model_selected),
    route: mapped.route,
    latency: `${latencyMs}ms`,
    tokensSaved: tokensSaved > 0 ? tokensSaved.toLocaleString() : "0",
    tokenReduction: tokensSaved > 0 ? `${Math.min(95, 60 + Math.floor(tokensSaved / 10))}%` : "0%",
  };
}

export function routeMetaFromResponse(data: RouteResponse): RouteMeta {
  return mapRoutingLayer(data.routing_layer);
}

export function formatTimestamp(date = new Date()): string {
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}
