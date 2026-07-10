export interface RouteResponse {
  model_selected: string;
  tokens_saved: number;
  response: string;
  routing_layer: string;
  latency_ms?: number;
}

type PromptCategory = "greeting" | "coding" | "ai" | "complex" | "general";

const GREETING_RESPONSES = [
  "Hello! ZeroToken Router is ready. Your prompt cleared Regex pruning and semantic checks — ask about coding, AMD AI routing, or general tasks anytime.",
  "Hi there! I routed your message through the hybrid pipeline locally. Light greetings stay on Qwen at zero API cost with sub-20ms routing overhead.",
  "Hey! Welcome to the AMD ZeroToken console. The router classified this as a low-complexity intent and answered without touching the cloud.",
];

const CODING_RESPONSES = [
  "For this coding task, I'd start by defining inputs, outputs, and edge cases, then implement incrementally with tests. The router kept this on {model} after XGBoost scored complexity at {score}/100.",
  "Break the problem into a pure function core plus I/O boundaries. Use typed interfaces and handle errors at module edges. Routed via Regex → MiniLM → XGBoost in {latency}ms on {model}.",
  "Consider readability first: name functions by intent, keep side effects isolated, and add a minimal repro before optimizing. {model} handled this path with {tokens} tokens saved vs a 70B cloud call.",
];

const AI_RESPONSES = [
  "AMD ZeroToken routing uses three layers: Regex pruning, MiniLM semantic cache, and XGBoost intent scoring before choosing Qwen local or Fireworks API. Your query mapped to {model} with {latency}ms end-to-end latency.",
  "The hybrid pipeline optimizes cost by running easy intents on-device via ROCm while escalating only high-complexity prompts. MiniLM embeddings short-circuit repeat questions; XGBoost uses 12 engineered features.",
  "Local-first inference cuts token spend dramatically — this response used {model} after the router estimated low cloud benefit. Semantic cache hits can answer in under 15ms without regenerating text.",
];

const GENERAL_RESPONSES = [
  "Here's a concise take: {snippet} — the router treated this as a general query, pruned filler tokens, and generated on {model} with about {tokens} tokens saved versus a default cloud model.",
  "I processed your question through Regex → MiniLM → XGBoost. Complexity stayed moderate, so {model} produced this answer in {latency}ms without API charges.",
  "ZeroToken classified this as a standard assistant request. The pipeline skipped cloud escalation and returned a local answer with strong latency and cost efficiency.",
];

const COMPLEX_RESPONSES = [
  "This prompt scored high complexity, so the router escalated to Fireworks API after Regex and MiniLM stages. For multi-step reasoning, decompose the problem, validate assumptions, then synthesize — cloud path latency was {latency}ms.",
  "XGBoost flagged elevated difficulty (complexity {score}/100). Fireworks handles deep reasoning here; local Qwen would risk incomplete coverage for this scope.",
  "Long-form or architectural questions route to Fireworks when the confidence threshold for local execution is exceeded. Consider iterative refinement and explicit success criteria for problems like this.",
];

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function classifyPrompt(prompt: string): PromptCategory {
  const text = prompt.toLowerCase().trim();

  if (
    /^(hi|hello|hey|yo|sup|good\s+(morning|afternoon|evening)|greetings)\b/.test(text) ||
    (text.length < 16 && /\b(hi|hello|hey)\b/.test(text))
  ) {
    return "greeting";
  }

  if (
    /code|function|debug|python|javascript|typescript|react|api|implement|algorithm|bug|refactor|syntax|compile|error/.test(
      text
    )
  ) {
    return "coding";
  }

  if (
    /amd|routing|router|llm|model|inference|token|xgboost|minilm|qwen|fireworks|gpu|rocm|\bai\b|hybrid|semantic/.test(
      text
    )
  ) {
    return "ai";
  }

  if (
    prompt.length > 120 ||
    /prove|theorem|distributed|architecture|multi-?step|design\s+a\s+system|microservices/.test(text)
  ) {
    return "complex";
  }

  return "general";
}

function fillTemplate(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? ""));
}

function buildResponse(
  prompt: string,
  category: PromptCategory,
  modelLabel: string,
  latencyMs: number,
  tokensSaved: number,
  complexityScore: number
): string {
  const snippet = prompt.length > 72 ? `${prompt.slice(0, 72)}...` : prompt;
  const vars = {
    model: modelLabel,
    latency: latencyMs,
    tokens: tokensSaved,
    score: complexityScore,
    snippet,
  };

  switch (category) {
    case "greeting":
      return pick(GREETING_RESPONSES);
    case "coding":
      return fillTemplate(pick(CODING_RESPONSES), vars);
    case "ai":
      return fillTemplate(pick(AI_RESPONSES), vars);
    case "complex":
      return fillTemplate(pick(COMPLEX_RESPONSES), vars);
    default:
      return fillTemplate(pick(GENERAL_RESPONSES), vars);
  }
}

function routeDemoPrompt(prompt: string, latencyMs: number): RouteResponse {
  const category = classifyPrompt(prompt);
  const complexityScore = Math.min(
    98,
    Math.max(
      12,
      Math.round(
        prompt.length / 4 +
          (category === "complex" ? 55 : category === "coding" ? 35 : category === "ai" ? 28 : 18) +
          Math.random() * 20
      )
    )
  );

  const cacheHit = category === "greeting" && Math.random() > 0.55;
  const escalate =
    category === "complex" ||
    (category === "coding" && (prompt.length > 90 || complexityScore > 72)) ||
    complexityScore > 78;

  let model_selected: string;
  let routing_layer: string;
  let tokens_saved: number;

  if (cacheHit) {
    model_selected = "local";
    routing_layer = "c2-semantic-cache";
    tokens_saved = 300 + Math.floor(Math.random() * 120);
  } else if (escalate) {
    model_selected = "accounts/fireworks/models/llama-v3p1-70b-instruct";
    routing_layer = "c3t-fallback";
    tokens_saved = 0;
  } else {
    model_selected = "local";
    routing_layer = category === "ai" ? "c3t-sentiment-local" : "c3t-text-local";
    tokens_saved = 220 + Math.floor(Math.random() * 180);
  }

  const modelLabel = model_selected === "local" ? "Qwen 1.5B Local" : "Fireworks API";
  const response = buildResponse(prompt, category, modelLabel, latencyMs, tokens_saved, complexityScore);

  return {
    model_selected,
    tokens_saved,
    routing_layer,
    response,
    latency_ms: latencyMs,
  };
}

/** Simulated routing delay so pipeline animations can play during the demo. */
export async function simulateDemoRoute(prompt: string): Promise<RouteResponse> {
  const routingDelay = 1600 + Math.floor(Math.random() * 1400);
  const startedAt = performance.now();
  await delay(routingDelay);
  const latencyMs = Math.max(Math.round(performance.now() - startedAt), 14);
  return routeDemoPrompt(prompt, latencyMs);
}

/** @deprecated Use simulateDemoRoute — kept for compatibility */
export function getDemoFallback(prompt: string, latencyMs: number): RouteResponse {
  return routeDemoPrompt(prompt, latencyMs);
}
