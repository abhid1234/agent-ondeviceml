# agent.ondeviceml.space — status

## Last updated

2026-05-06 — v0.1.0 shipped. End-to-end manual test still pending.

## Phase status

- ✅ **Phase 1: Scaffold** — Vite + React 19 + Router 7 + Tailwind 4 set up (mirrors web-ai-bench), build passes.
- ✅ **Phase 2: Primitives** — copied 7 files from ODML (`ModelContext`, `DownloadContext`, `mediapipe.ts`, `chatTemplate.ts`, `storage.ts`, `repetitionDetector.ts`, `types/index.ts`); providers wired in `main.tsx`.
- ✅ **Phase 3: Mini-gallery** — `HomePage` + `ModelCard` + `Layout` with cross-link to ondeviceml.space. 4-model catalog (Qwen 1.5B recommended; Gemma 3n E2B/4 E2B/3n E4B).
- ✅ **Phase 4: Research feature** — moved 14 files from ODML `src/features/research/`, `/research` route wired, build passes.
- ✅ **Phase 5: HF deeplink intake** — `HfIntakeBanner` extracted from ODML GalleryPage pattern; `?hf_model=&task=` parsing on HomePage.
- ✅ **Phase 6: ODML redirect** — `vercel.json` 307 redirect from `ondeviceml.space/research` → `agent.ondeviceml.space/research` (query params preserved).
- ✅ **Phase 7: ODML cleanup** — `/research` route + sidebar entry + FEATURE_CARD removed, `src/features/research/` deleted, STATUS/CLAUDE updated.
- ✅ **Vercel + DNS** — project linked, `agent.ondeviceml.space` aliased, returns 200.

## Resume here next session

**End-to-end test on the deployed site.**

1. Visit https://agent.ondeviceml.space — confirm HomePage renders the mini-gallery.
2. Click "Load & Open →" on Qwen 2.5 1.5B (recommended) — confirm download progresses, then loads, then routes to `/research`.
3. Run a research prompt: *"What's the difference between WebGPU and WebNN?"* — confirm plan parses, Wikipedia retrieval fires, answer streams with [N] citation badges.
4. Visit `https://agent.ondeviceml.space/?hf_model=google/gemma-3n-E2B-it&task=research` — confirm intake banner appears, click "Load & Open" works.
5. Visit `https://ondeviceml.space/research` — confirm it 307-redirects to `agent.ondeviceml.space/research`.
6. Visit `https://ondeviceml.space/research?hf_model=foo&task=research` — confirm query params preserved through redirect.

## Known limitations

- Catalog has 4 models, all >1.5GB. The Qwen 1.5B is the smallest viable for the planner step. Smaller is better for first-load UX — future work: add Gemma 270M IT when a `.task` build becomes available.
- HF deeplinks only match the 4 catalog models. Unknown HF models silently fall through (no banner shown). That's intentional for v1.
- Plan JSON parsing has fallback path if Gemma 270M-class output doesn't parse as JSON. Tested with Gemma 1B IT in ODML; should hold with the 4 catalog models.

## Out of scope (v1 — see plan file)

- Lifting `ModelContext`/`DownloadContext` to a shared package
- Cross-link from ondeviceml.space gallery announcing the new subdomain
- Updating huggingface.js#2141 PR to point research task at agent subdomain directly
- Multiple parallel topic workers
- LinkedIn / Substack drafts (outside git per `feedback_social_posts_never_in_git.md`)
