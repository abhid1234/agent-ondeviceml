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
        <em>TODO: introduce <code>@mediapipe/tasks-genai</code>, the
        FilesetResolver, and the LlmInference handle. Show the npm install +
        bare-import shape.</em>
      </p>

      <h2 id="webgpu-vs-wasm">WebGPU vs WASM</h2>
      <p>
        <em>TODO: explain when each fires, the 4 GB WASM ceiling, why
        Chromebook iGPUs sometimes refuse WebGPU, and how the fallback is
        invisible to user code.</em>
      </p>

      <h2 id="the-blob-url-trick">The blob-URL trick</h2>
      <p>
        <em>TODO: per <code>feedback_odml_mediapipe_constraints.md</code>: why
        passing the model as a Blob (not a URL) works in dev/prod, and why the
        <code>self.import</code> path breaks streaming under Vite.</em>
      </p>

      <h2 id="the-loadmodel-call">The loadModel call</h2>
      <p>
        <em>TODO: show the actual <code>initModel(blob, modelInfo)</code>
        function from <code>src/lib/mediapipe.ts</code> with explanation. Note
        the dispose pattern.</em>
      </p>
    </LessonLayout>
  );
}
