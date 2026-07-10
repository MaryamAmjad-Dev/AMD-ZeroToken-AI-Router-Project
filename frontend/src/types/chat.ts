export interface ChatMessageMeta {
  model: string;
  route: string;
  latency: string;
  tokensSaved: string;
  tokenReduction: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  meta?: ChatMessageMeta;
  isNew?: boolean;
}

export interface RouteMeta {
  activeLayer: "prompt" | "l1" | "l2" | "l3" | "decision";
  activeRoute: "local" | "cloud";
}
