# AMD ZeroToken AI Router

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-0055FF?style=for-the-badge&logo=framer&logoColor=white)

A futuristic AI routing dashboard built with Next.js that visualizes hybrid AI model routing, token optimization, and intelligent model selection through a premium interactive interface.

---

## 🌌 Overview

**AMD ZeroToken AI Router** demonstrates a **local-first hybrid routing** concept: simple queries stay on-device, complex ones escalate to premium models — maximizing accuracy while minimizing token cost.

The dashboard turns that pipeline into a **premium AI experience**:

- **Zero-token routing concept** — Regex pruning, semantic cache, and intent classification before any expensive generation
- **Local-first visualization** — Watch prompts flow through Regex → MiniLM → XGBoost → Qwen Local or Fireworks API
- **Premium AI dashboard** — Glassmorphism UI, space-themed backgrounds, smooth motion, and an interactive console

---

## ✨ Features

### 🖥️ AI Dashboard
- Real-time style command interface
- Interactive metric cards (tokens saved, API avoided, accuracy, latency)
- Live routing pipeline status

### 🤖 AI Console
- Immersive chat experience
- Hybrid routing simulation with thinking phases
- Model, route, tokens saved, and latency metadata per response

### ⚡ Hybrid Router Visualization
| Layer | Role |
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

| Layer | Technologies |
|--------|----------------|
| **Framework** | Next.js · React · TypeScript |
| **Styling** | Tailwind CSS |
| **Motion** | Framer Motion |
| **Charts** | Recharts |

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

> Add screenshots under `docs/` or `public/screenshots/` and update the paths below.

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

AMD ZeroToken AI Router · Hybrid AI Routing Dashboard

</div>
