# AMD ZeroToken AI Router

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![Accuracy](https://img.shields.io/badge/Accuracy-19%2F19-EF4444?style=for-the-badge)
![Architecture](https://img.shields.io/badge/Architecture-Hybrid_Local_%2B_Cloud-111827?style=for-the-badge)

A futuristic AI routing dashboard built with Next.js that visualizes hybrid AI model routing, token optimization, and intelligent model selection through a premium interactive interface.

**Goal:** Maximum accuracy · Minimum token cost · Local-first intelligence

---

## 🌌 Overview

**AMD ZeroToken AI Router** is a full-stack concept project that combines:

1. A **5-layer hybrid AI routing architecture** that answers easy tasks locally (zero API tokens) and escalates only when needed
2. A **premium Next.js dashboard** that visualizes that pipeline in real time — glassmorphism UI, space-themed backgrounds, and an interactive AI console

Simple queries stay on-device. Complex ones go to premium cloud models. Every layer before generation aims for **zero token cost**.

---

## 🔥 The Problem: Skyrocketing AI Costs

General-purpose AI agents often send **every request** to expensive cloud LLMs — even for greetings, sentiment checks, or basic facts.

| Pain Point | Impact |
|------------|--------|
| **Blind cloud routing** | Simple queries burn premium tokens |
| **Token waste** | Conversational filler inflates prompt size |
| **Network latency** | Every round-trip adds cost and delay |
| **No local-first path** | Easy work never stays on-device |

**Project goal:** Deliver **maximum accuracy** with **minimum token usage** through intelligent hybrid routing.

---

## 🧠 ZeroToken Router Solution

A **5-layer hybrid AI routing architecture** that aggressively prefers local / zero-token paths before any paid API call.

```text
User Prompt
    ↓
① Regex Pruning          → 0 tokens
    ↓
② Semantic Cache (MiniLM) → 0 tokens (cache hit = done)
    ↓
③ XGBoost Intent Router   → 0 tokens (CPU, <5ms)
    ↓
④ Local Qwen 1.5B         → 0 API tokens (easy tasks)
    ↓
⑤ Fireworks Premium API   → minimal tokens (complex only)
```

### Layer 1 — Regex Pruning

- Strips conversational filler (“Can you tell me…”, “Please output…”)
- Reduces prompt size **before** any model runs
- Executes fully locally
- **Cost: 0 tokens**

### Layer 2 — Semantic Caching (MiniLM)

- Embeds prompts with `all-MiniLM-L6-v2`
- Compares against previously solved queries via **cosine similarity**
- Cache hit returns the answer instantly — **no generation**
- **Cost: 0 tokens**

### Layer 3 — XGBoost Intent Router

- Local ML classifier running on CPU in **under milliseconds**
- Detects query category:
  - Math · Logic · Sentiment · Code · Factual
- Decides whether the task is “easy” (local) or “hard” (cloud)
- **Cost: 0 tokens**

### Layer 4 — Local Qwen Engine

- **Qwen2.5-1.5B-Instruct** for easy / high-confidence tasks
- Runs without an external API
- Ideal for sentiment, greetings, and basic factual answers
- **Cost: 0 API tokens**

### Layer 5 — Premium API Routing

- Complex tasks (code, deep reasoning, architecture) escalate to **Fireworks AI**
- Uses **Chain-of-Draft** prompting to keep outputs lean
- Minimizes paid output tokens while preserving quality

---

## 📈 Performance Highlights

| Metric | Result |
|--------|--------|
| **Accuracy** | **100%** evaluation accuracy (**19/19** tests) |
| **Efficiency** | **~60%** of queries handled via local / cache paths |
| **Deployment** | Docker-ready packaging |
| **Architecture** | Hybrid **Local + Cloud** AI |

---

## ✨ Dashboard & Product Features

### 🖥️ AI Dashboard
- Real-time style command interface
- Interactive metric cards (tokens saved, API avoided, accuracy, latency)
- Live routing pipeline status

### 🤖 AI Console
- Immersive chat experience
- Hybrid routing simulation with thinking phases
- Model, route, tokens saved, and latency metadata per response

### ⚡ Hybrid Router Visualization
| Stage | Role |
|--------|------|
| **Regex** | Prompt pruning & fast-path filters |
| **Semantic Cache (MiniLM)** | Near-instant cache hits |
| **XGBoost Router** | Intent / complexity scoring |
| **Decision** | Qwen Local vs Fireworks API |

### 📊 Analytics
- Token savings & cost comparison views
- Latency and accuracy insights
- Usage-style visualizations

### 🎨 UI Experience
- Dark / light theme toggle
- Space AI background & particle atmosphere
- Glassmorphism surfaces
- Smooth Framer Motion animations
- Interactive AI cursor & hover feedback

---

## 🛠️ Tech Stack

### Frontend Dashboard
| Layer | Technologies |
|--------|----------------|
| **Framework** | Next.js · React · TypeScript |
| **Styling** | Tailwind CSS |
| **Motion** | Framer Motion |
| **Charts** | Recharts |

### Routing Architecture
| Layer | Technologies |
|--------|----------------|
| **Embeddings** | MiniLM (`all-MiniLM-L6-v2`) |
| **Classifier** | XGBoost |
| **Local LLM** | Qwen2.5-1.5B |
| **Cloud LLM** | Fireworks AI |
| **Packaging** | Docker |

---

## 📁 Project Structure

```text
frontend/
 ├── app/           # Next.js App Router pages & layout
 ├── components/    # Dashboard, chat, landing, effects, UI
 ├── hooks/         # Chat, theme, interaction hooks
 ├── lib/           # Demo router, utils, route helpers
 └── types/         # Shared TypeScript types
```

---

## 🚀 Installation

```bash
git clone https://github.com/MaryamAmjad-Dev/AMD-ZeroToken-AI-Router-Project.git
cd AMD-ZeroToken-AI-Router-Project/frontend
npm install
npm run dev
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000) in your browser.

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |

---

## 📸 Screenshots

> Add screenshots under `docs/screenshots/` and update the paths below.

| View | Preview |
|------|---------|
| **Dashboard** | ![Dashboard](docs/screenshots/dashboard.png) |
| **Analytics** | ![Analytics](docs/screenshots/analytics.png) |
| **Routing** | ![Routing](docs/screenshots/routing.png) |
| **AI Console** | ![AI Console](docs/screenshots/ai-console.png) |

---

## 🔮 Future Improvements

- [ ] Live AI API integration
- [ ] Expanded analytics & historical trends
- [ ] Advanced routing metrics and confidence scores
- [ ] Persistent conversation history

---

## 📄 License

This project is available for portfolio and demonstration use.

---

<div align="center">

**Developed by Maryam Amjad**

AMD ZeroToken AI Router · Hybrid Local + Cloud AI · Maximum Accuracy · Minimum Tokens

</div>
