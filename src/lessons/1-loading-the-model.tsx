import { LessonLayout } from "../components/curriculum/LessonLayout";
import { getLesson } from "../data/curriculum";

const HEADINGS = [
  { id: "the-runtime", text: "The runtime", level: 2 as const },
  { id: "webgpu-vs-wasm", text: "WebGPU vs WASM", level: 2 as const },
  { id: "the-blob-url-trick", text: "The blob-URL trick", level: 2 as const },
  { id: "the-loadmodel-call", text: "The loadModel call", level: 2 as const },
];

export function Component() {
  const lesson = getLesson("loading-the-model")!;
  return (
    <LessonLayout lesson={lesson} headings={HEADINGS}>
      <p className="lead">
        Before the agent can plan or browse anything, we need a working language
        model in the browser tab. We use MediaPipe Tasks GenAI on top of
        WebGPU, with a WASM fallback. The whole thing is one async call.
      </p>

      <h2 id="the-runtime">The runtime</h2>
      <p>
        We're using <code>@mediapipe/tasks-genai</code>, Google's
        browser-native runtime for the Gemma family. The API surface is tiny —
        two objects:
      </p>
      <pre><code>{`import { FilesetResolver, LlmInference } from "@mediapipe/tasks-genai";

const resolver = await FilesetResolver.forGenAiTasks(WASM_URL);
const inference = await LlmInference.createFromOptions(resolver, {
  baseOptions: { modelAssetPath: blobUrl },
  maxTokens: 1024,
  topK: 40,
  temperature: 0.7,
});`}</code></pre>
      <p>
        The <em>resolver</em> points at the WebAssembly + JS glue files;
        the <em>inference handle</em> wraps the model. Once you have the
        handle, generation is one call: <code>inference.generateResponse(prompt, callback)</code>.
      </p>
      <p>
        Why MediaPipe over Transformers.js? Two reasons. MediaPipe ships a
        first-party WebGPU backend tuned by the Gemma team — throughput on
        Chromebook integrated GPUs is about 2× what we measured from
        Transformers.js. And the API doesn't ask you to think about tokenizers,
        chat templates, or sampling. You give it a string and a callback. For
        an agentic loop where the model is one of five components, that's the
        right level of abstraction.
      </p>

      <h2 id="webgpu-vs-wasm">WebGPU vs WASM</h2>
      <p>
        MediaPipe picks a backend at init time. If WebGPU is available and the
        model is compatible, weights live in GPU memory and tokens stream out
        at 20–60 per second on a Chromebook iGPU. If WebGPU refuses — older
        Intel iGPUs, some Chromebook configurations, anything pre-Chrome 113 —
        it falls back to WebAssembly. Same handle, same code; you don't
        branch.
      </p>
      <p>
        The trade is throughput and ceiling. WASM gives you 5–15 tokens per
        second and is capped at <strong>4 GB</strong> of total addressable
        memory by the WebAssembly spec. A 1.5B-parameter model in 4-bit
        quantization is ~1.6 GB; the runtime needs another ~500 MB of working
        space; you're at half the ceiling. That's the practical reason this
        site doesn't ship anything bigger than 1.5B by default.
      </p>

      <h2 id="the-blob-url-trick">The blob-URL trick</h2>
      <p>
        The natural shape — fetch the model URL, hand the URL to MediaPipe —
        works in <code>npm run dev</code> and breaks the moment you ship a
        Vite production build with streaming turned on. The cause is buried in
        Vite's worker handling: MediaPipe dynamically imports a worker via{" "}
        <code>self.import</code>; Vite rewrites that import path during
        bundling; the worker tries to load and silently fails mid-token.
        You get a model that loads fine and then dies on the first generation.
      </p>
      <p>
        The workaround is to download the bytes ourselves, wrap them in a
        Blob, and pass a temporary <code>blob:</code> URL into MediaPipe:
      </p>
      <pre><code>{`const blob = await downloadAsBlob(modelUrl);
const blobUrl = URL.createObjectURL(blob);
// pass blobUrl to MediaPipe`}</code></pre>
      <p>
        The blob lives in browser memory, the URL is valid only inside this
        tab, and Vite's bundler doesn't see it. This is the single most
        important constraint to internalize if you're building on MediaPipe in
        a Vite app — fight it for an hour, then come back to this paragraph.
      </p>

      <h2 id="the-loadmodel-call">The loadModel call</h2>
      <p>
        Putting it together, the full shape lives in{" "}
        <code>src/lib/mediapipe.ts</code>:
      </p>
      <pre><code>{`async function initModel(blob: Blob, model: ModelInfo) {
  const url = URL.createObjectURL(blob);
  const resolver = await FilesetResolver.forGenAiTasks(WASM_URL);
  inference = await LlmInference.createFromOptions(resolver, {
    baseOptions: { modelAssetPath: url },
    maxTokens: model.maxTokens ?? 1024,
    topK: 40,
    temperature: 0.7,
  });
}`}</code></pre>
      <p>
        Disposal is just as important. <code>dispose()</code> releases the
        GPU buffer (or WASM heap), revokes the object URL, and lets the
        browser reclaim the memory. We hook it to two events in{" "}
        <code>ModelContext.tsx</code>: component unmount, and{" "}
        <code>visibilitychange</code> after the tab has been hidden for more
        than two minutes. A 1.5 GB tenant has no business sitting in your RAM
        while you read mail in another tab.
      </p>
      <p>
        That's the loading half. The next four lessons assume the inference
        handle is live and focus on what we ask it to do.
      </p>
    </LessonLayout>
  );
}
