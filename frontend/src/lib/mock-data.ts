export type SpaceTheme = "command" | "analytics" | "routing" | "history";

export const ANALYTICS_STATS = [
  { id: "tokens", label: "Total Tokens Saved", value: 1.25, suffix: "M", decimals: 2, color: "text-amd-red" },
  { id: "cost", label: "API Cost Reduction", value: 847, suffix: "", decimals: 0, color: "text-emerald-400" },
  { id: "local", label: "Local Model Usage", value: 87.3, suffix: "%", decimals: 1, color: "text-amd-blue" },
  { id: "fireworks", label: "Fireworks Usage", value: 12.7, suffix: "%", decimals: 1, color: "text-orange-400" },
  { id: "latency", label: "Average Latency", value: 18, suffix: "ms", decimals: 0, color: "text-violet-400" },
  { id: "accuracy", label: "Accuracy Score", value: 19, suffix: "/19", decimals: 0, color: "text-amber-400" },
] as const;

export const TOKEN_SAVINGS_DATA = [
  { day: "Mon", saved: 120, api: 45 },
  { day: "Tue", saved: 180, api: 38 },
  { day: "Wed", saved: 240, api: 32 },
  { day: "Thu", saved: 310, api: 28 },
  { day: "Fri", saved: 420, api: 22 },
  { day: "Sat", saved: 380, api: 25 },
  { day: "Sun", saved: 440, api: 20 },
];

export const MODEL_USAGE_DATA = [
  { name: "Qwen Local", value: 87.3, color: "#3B82F6" },
  { name: "Fireworks", value: 12.7, color: "#EF4444" },
];

export const ROUTING_ANALYTICS = [
  { layer: "L1 Regex", hits: 1240, bypassed: 320 },
  { layer: "L2 Cache", hits: 890, bypassed: 180 },
  { layer: "L3 XGBoost", hits: 650, bypassed: 95 },
  { layer: "Local Exec", hits: 580, bypassed: 0 },
];

export const COST_COMPARISON = [
  { month: "Jan", without: 2400, with: 890 },
  { month: "Feb", without: 2800, with: 720 },
  { month: "Mar", without: 3100, with: 650 },
  { month: "Apr", without: 2900, with: 580 },
];

export type HistoryFilter = "all" | "local" | "fireworks" | "cached";

export interface HistoryItem {
  id: string;
  prompt: string;
  response: string;
  model: string;
  route: string;
  tokensSaved: string;
  latency: string;
  timestamp: string;
  type: "local" | "fireworks" | "cached";
}

export const HISTORY_DATA: HistoryItem[] = [
  {
    id: "h1",
    prompt: "Analyze semantic routing efficiency for NA cluster",
    response: "Optimization complete. Cache layer at 92.4% efficiency...",
    model: "Qwen 1.5B",
    route: "L2 Cache → Local",
    tokensSaved: "440K",
    latency: "18ms",
    timestamp: "2026-03-10 10:24 AM",
    type: "cached",
  },
  {
    id: "h2",
    prompt: "Explain XGBoost intent classification thresholds",
    response: "The L3 router uses gradient-boosted trees with 12 features...",
    model: "Qwen 1.5B",
    route: "L3 XGBoost → Local",
    tokensSaved: "128K",
    latency: "22ms",
    timestamp: "2026-03-10 09:58 AM",
    type: "local",
  },
  {
    id: "h3",
    prompt: "Generate complex multi-step reasoning for distributed systems",
    response: "For distributed consensus across regions, consider the following...",
    model: "Fireworks Llama",
    route: "L3 → Fireworks API",
    tokensSaved: "0",
    latency: "340ms",
    timestamp: "2026-03-10 09:41 AM",
    type: "fireworks",
  },
  {
    id: "h4",
    prompt: "What is the current token reduction rate?",
    response: "Current session shows 73.2% token reduction with 1.25M saved...",
    model: "Qwen 1.5B",
    route: "L1 Regex → Local",
    tokensSaved: "89K",
    latency: "12ms",
    timestamp: "2026-03-10 09:15 AM",
    type: "local",
  },
  {
    id: "h5",
    prompt: "Cache hit analysis for MiniLM embeddings",
    response: "MiniLM semantic cache showing 78% hit rate on repeated queries...",
    model: "Qwen 1.5B",
    route: "L2 Cache → Local",
    tokensSaved: "312K",
    latency: "14ms",
    timestamp: "2026-03-09 16:30 PM",
    type: "cached",
  },
  {
    id: "h6",
    prompt: "Design a fault-tolerant routing failover strategy",
    response: "Implementing cascading fallback: L1 prune → L2 cache → L3 classify...",
    model: "Fireworks Llama",
    route: "L3 → Fireworks API",
    tokensSaved: "0",
    latency: "290ms",
    timestamp: "2026-03-09 14:22 PM",
    type: "fireworks",
  },
];
