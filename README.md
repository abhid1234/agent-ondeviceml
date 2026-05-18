# ondeviceml/research

Agentic research, fully on-device. A small model plans, browses Wikipedia, and writes a cited answer — in your browser, fully offline.

**Live:** [agent.ondeviceml.space](https://agent.ondeviceml.space)

## What it does

Pick a model. Ask a research question. The agent:

1. **Plans** — produces a JSON plan with 2–4 subqueries and a synthesis approach.
2. **Retrieves** — hits Wikipedia's Action API per subquery (CORS-safe, no proxy).
3. **Synthesizes** — streams an answer with `[N]` citation markers parsed on the fly.
4. **Stays honest** — an n-gram repetition detector cuts the stream when the model starts to loop.

No backend. No serverless functions. No third-party API. The first model download is ~1.5 GB. After that, the network can be off.

## Stack

| Layer | Tech |
|---|---|
| App | React 19 · React Router 7 · TypeScript 5.7 |
| Build | Vite 6 · Tailwind 4 |
| Inference | MediaPipe Tasks GenAI |
| Acceleration | WebGPU primary · WASM fallback |
| Models | Qwen 2.5 1.5B Instruct (default) · Gemma 3n E2B / E4B · Gemma 4 E2B |
| Retrieval | Wikipedia Action API |
| Hosting | Vercel (static SPA) |

## Local dev

```bash
git clone https://github.com/abhid1234/agent-ondeviceml.git
cd agent-ondeviceml
npm install
npm run dev          # local dev server
npm test             # vitest
npm run build        # production build
```

First load downloads the chosen model (~1.5 GB for Qwen). The browser caches it; subsequent loads are offline.

## Requirements

- Modern Chromium-based browser (Chrome 113+, Edge 113+). Safari 16.4+ with WebGPU on macOS/iOS 18.
- ~2 GB free RAM during inference.
- ~4 GB free disk space for the model cache.

## License

Apache 2.0.
