export type { RouteResponse } from "./api";
export { simulateDemoRoute, getDemoFallback } from "./api";

import { simulateDemoRoute, type RouteResponse } from "./api";

export interface RouterApiResult extends RouteResponse {
  demoMode: boolean;
  latencyMs: number;
}

/**
 * Frontend-only demo router — simulates Regex → MiniLM → XGBoost → Qwen/Fireworks.
 */
export async function sendRouterPrompt(prompt: string): Promise<RouterApiResult> {
  const data = await simulateDemoRoute(prompt);
  const latencyMs = data.latency_ms ?? 18;

  return {
    ...data,
    demoMode: true,
    latencyMs,
  };
}
