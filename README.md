# ondeviceml/research

Agentic research, fully on-device. A small Gemma plans, browses Wikipedia, and writes a cited answer — in your browser, fully offline.

**Live:** [agent.ondeviceml.space](https://agent.ondeviceml.space)

**Sister site:** [ondeviceml.space](https://ondeviceml.space) (24+ on-device AI demos)

## What it does

Pick a model. Ask a research question. The model:

1. **Plans** the research (subqueries, synthesis approach) → JSON plan
2. **Retrieves** snippets from Wikipedia per subquery (CORS-safe Action API)
3. **Synthesizes** a streamed answer with `[N]` citation markers

All inference runs in the browser via MediaPipe + WebGPU. No servers, no install, no account.

## Local dev

```bash
npm install
npm run dev
```

## Built with

- React 19 + Router 7
- Vite 6 + Tailwind 4
- MediaPipe Tasks GenAI for in-browser inference

## License

Apache 2.0
