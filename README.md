# ondeviceml/research

> A research agent that runs entirely in your browser. Plan → retrieve → synthesize, on a 1.5B model, fully offline after the first download.

**Live:** [agent.ondeviceml.space](https://agent.ondeviceml.space) · **Write-up:** [abhid.substack.com](https://abhid.substack.com/p/i-built-a-research-agent-that-runs) · **Family:** [ondeviceml.space](https://ondeviceml.space) (24+ demos) · [bench.ondeviceml.space](https://bench.ondeviceml.space) (Web AI runtime benchmark)

Most AI assumes the model lives on someone else's GPU. But a 1.5B-parameter model fits inside the browser tab you already have open — it's just smaller than the conversation suggests it should be. This is the proof.

## What it does

Ask a research question. The agent:

1. **Plans** — produces a JSON plan with 2–4 subqueries and a synthesis approach (compare-and-contrast, summarize, timeline).
2. **Retrieves** — hits Wikipedia's Action API per subquery (CORS-safe, no proxy, per-subquery timeouts).
3. **Synthesizes** — streams a final answer that interleaves `[1]` `[2]` citation markers parsed on the fly. Click a marker, jump to the source.
4. **Stays honest** — an n-gram repetition detector cuts the stream when the model starts to loop. Small models loop more than benchmarks suggest.

No backend. No serverless functions. No third-party API. No account. The first model download is ~1.5 GB. After that, the network can be off.

## Why this matters

Three shifts in the last 18 months made on-device agentic workflows real:

- **Small models got good.** Qwen 2.5 1.5B and Gemma 3n produce structured JSON, summarize coherently, and follow multi-step instructions at "good enough for a focused workflow" level.
- **WebGPU shipped.** Chrome, Edge, and Safari expose the GPU to JavaScript. Sub-second token generation on integrated graphics.
- **MediaPipe Tasks GenAI shipped.** A clean library that loads a `.task` bundle and exposes a streaming inference API directly in the browser.

Pull any one of those three and the project doesn't work. Together, they make the browser a real ML runtime.

## The 6-lesson curriculum

The whole build is broken into self-contained lessons. Each one is a working build log with code, prompts, and the failure modes I hit:

| #   | Lesson                            | Read time | What you'll learn                                                                     |
| --- | --------------------------------- | --------- | ------------------------------------------------------------------------------------- |
| 0   | [Introduction](https://agent.ondeviceml.space/lessons/introduction) | 4 min     | Why on-device, three shifts, what we'll build                                          |
| 1   | [Loading a model in the browser](https://agent.ondeviceml.space/lessons/loading-the-model) | 7 min     | MediaPipe GenAI, WebGPU primary path, WASM fallback, the blob-URL trick under Vite     |
| 2   | [Planning the search](https://agent.ondeviceml.space/lessons/planning) | 8 min     | Reliable JSON output from a 1.5B model, anchored prompts, example-driven decomposition |
| 3   | [Retrieving from Wikipedia](https://agent.ondeviceml.space/lessons/retrieval) | 6 min     | Wikipedia Action API, CORS-safe browsing, per-subquery timeouts, snippet shaping       |
| 4   | [Synthesizing with citations](https://agent.ondeviceml.space/lessons/synthesis) | 7 min     | Streaming `[N]` markers, click-to-source jumps, repetition-detector that keeps it honest |
| 5   | [Putting it together](https://agent.ondeviceml.space/lessons/the-loop) | 5 min     | The phase state machine, error recovery, the demo you can run                          |

Full teardown: [abhid.substack.com](https://abhid.substack.com/p/i-built-a-research-agent-that-runs) (or the [rich HTML version with diagrams](https://agent.ondeviceml.space/blog))

## Five things I learned

1. **A 1.5B model can plan reliably if you anchor the prompt hard.** Three concrete `{question, plan}` example pairs in the system prompt took JSON validity from ~70% to ~95%. The phrase "Output ONLY valid JSON, no prose, starting with `{`" is non-negotiable.
2. **The repetition detector matters more than the benchmarks suggest.** Small models loop. An n-gram counter on the streaming output is the difference between a usable product and a toy.
3. **WebGPU vs WASM is not "fast vs slow." It's "usable vs not."** On a Chromebook, Qwen 2.5 1.5B streams ~25 tokens/sec on WebGPU and ~3 tokens/sec on WASM. Plan in 2 seconds vs 30. Same code, same model.
4. **The blob-URL trick that's nowhere in MediaPipe's docs:**
   ```ts
   const blob = await (await fetch(modelUrl)).blob();
   const blobUrl = URL.createObjectURL(blob);
   await LlmInference.createFromModelPath(resolver, blobUrl);
   ```
   Without it, Vite's worker pipeline silently breaks streaming generation. Three lines that took me a weekend to find.
5. **Small-model UX is downstream of small-model honesty controls.** The benchmark doesn't capture how the model fails; the product does.

## Stack

| Layer | Tech |
|---|---|
| App | React 19 · React Router 7 · TypeScript 5.7 |
| Build | Vite 6 · Tailwind 4 |
| Inference | MediaPipe Tasks GenAI |
| Acceleration | WebGPU primary · WASM fallback |
| Models | Qwen 2.5 1.5B Instruct (default) · Gemma 3n E2B / E4B · Gemma 4 E2B |
| Retrieval | Wikipedia Action API (no proxy, no server) |
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

- A modern Chromium-based browser (Chrome 113+, Edge 113+) for WebGPU. Safari 16.4+ works with WebGPU on macOS/iOS 18.
- ~2 GB of free RAM during inference.
- ~4 GB of free disk space for the model cache.

## What's next

- **Tool use beyond Wikipedia** — search APIs, arXiv, GitHub. The browser is already a tool-use environment.
- **Vision retrieval** — Gemma 3n is multimodal. The browser renders images natively.
- **Memory across sessions** — a small embedded vector store would give the agent persistence without leaving the device.
- **Better evals** — [vla-bench](https://github.com/abhid1234/vla-bench) is the parallel eval-harness project. The two will eventually merge.

## Acknowledgments

This project sits inside an on-device-ML track I run as a 20% project at Google Cloud, alongside the LiteRT team. The broader bet: the web is the next ML deployment surface, and the path from "model trained on a TPU" to "model running on a user's laptop" gets shorter every quarter.

Thanks to:
- The MediaPipe team for Tasks GenAI
- The Qwen and Gemma teams for the models
- Wikipedia for an API that's still free and CORS-safe in 2026

## License

Apache 2.0. Fork it, break it, file bugs.

## Contact

Built by [Abhi Das](https://github.com/abhid1234) — Strategic Partnerships at Google Cloud. Long-form writing at [abhid.substack.com](https://abhid.substack.com).
