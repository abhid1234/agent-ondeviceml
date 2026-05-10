import { LessonLayout } from "../components/curriculum/LessonLayout";
import { getLesson } from "../data/curriculum";

const HEADINGS = [
  { id: "streaming", text: "Streaming generation", level: 2 as const },
  { id: "citation-markers", text: "Citation markers", level: 2 as const },
  { id: "parsing-as-it-streams", text: "Parsing as it streams", level: 2 as const },
  { id: "the-repetition-detector", text: "The repetition detector", level: 2 as const },
];

export function Component() {
  const lesson = getLesson("synthesis")!;
  return (
    <LessonLayout lesson={lesson} headings={HEADINGS}>
      <p className="lead">
        The synthesizer takes the retrieved snippets and writes a cited answer.
        We stream tokens to the page as they arrive, parse <code>[N]</code>
        markers in-flight, and watch for the failure mode every small model
        has: looping.
      </p>

      <h2 id="streaming">Streaming generation</h2>
      <p>
        MediaPipe's <code>generateResponse</code> takes a callback that fires
        on every token. We pass it through to React state every ~16 ms (one
        frame), which is what makes the answer appear word-by-word instead of
        all at once when generation completes:
      </p>
      <pre><code>{`type StreamCallback = (partialText: string, done: boolean) => void;

await inference.generateResponse(prompt, (partial, done) => {
  setAnswerText(partial);
  if (done) setStatus("complete");
});`}</code></pre>
      <p>
        Two reasons to render token-by-token. First, perceived latency: the
        first useful tokens arrive in 200–400 ms, so the user sees an answer
        forming long before the full response is ready. Second, it gives us a
        place to interrupt. The cancel button calls{" "}
        <code>cancelGeneration()</code> which closes MediaPipe's stream
        without disposing the model — critical for the repetition detector
        below.
      </p>
      <p>
        The whole streaming surface lives in <code>src/lib/mediapipe.ts</code>
        as a thin wrapper around MediaPipe's native callback. Higher-level
        hooks (<code>useSynthesize</code>) consume it as an async generator,
        which keeps the React side clean.
      </p>

      <h2 id="citation-markers">Citation markers</h2>
      <p>
        We need the synthesizer to point at evidence without making things up.
        The convention: tell the model the snippets are numbered{" "}
        <code>[1]</code>, <code>[2]</code>, <code>[3]</code>, and ask it to
        cite by index whenever it makes a claim.
      </p>
      <pre><code>{`const evidence = snippets
  .map((s, i) => \`[\${i + 1}] \${s.title}: \${s.body}\`)
  .join("\\n\\n");

const prompt = \`Answer the question using only the snippets below.
Cite each claim with the snippet number in brackets, like [1].

\${evidence}

Question: \${question}\`;`}</code></pre>
      <p>
        Indices are deliberate. They're 2–3 tokens; URLs are 10+ and
        the model hallucinates them more often. We resolve indices to URLs
        client-side after the stream finishes — the model never sees a URL,
        so it never invents one.
      </p>

      <h2 id="parsing-as-it-streams">Parsing as it streams</h2>
      <p>
        The synthesizer hook runs a regex over the partial text on every
        callback to find new <code>[N]</code> markers:
      </p>
      <pre><code>{`const CITATION_RE = /\\[(\\d+)\\]/g;

function parseCitations(text: string): Array<{ index: number; pos: number }> {
  return Array.from(text.matchAll(CITATION_RE)).map((m) => ({
    index: parseInt(m[1], 10) - 1,
    pos: m.index!,
  }));
}`}</code></pre>
      <p>
        The render layer turns each match into a clickable badge inline with
        the prose. There's an edge case: when the model has emitted{" "}
        <code>[3</code> but not yet <code>]</code>, the regex doesn't match —
        which is what we want. We don't render a partial citation; we wait
        for the closing bracket. One frame later the bracket arrives, the
        match fires, and the badge appears.
      </p>
      <p>
        Click handling resolves the index against the retrieved snippets list
        and scrolls the retrieval drawer to that card. The whole
        click-to-source loop happens entirely in the browser — there's no
        server in the path between "I want to verify this claim" and the
        Wikipedia article it came from.
      </p>

      <h2 id="the-repetition-detector">The repetition detector</h2>
      <p>
        Small models loop. After 200–400 generated tokens, especially on
        ambiguous prompts, a 1.5B model will sometimes lock into a phrase and
        keep emitting it: <em>"…and the same is true and the same is true
        and the same is true…"</em>. Without intervention you wait out the
        full 1024-token budget watching garbage stream onto the page.
      </p>
      <p>
        <code>src/lib/repetitionDetector.ts</code> runs an n-gram heuristic
        on every callback: take the last ~200 chars, slice into 6-word
        windows, count duplicates. When the same window appears 3+ times
        inside the recent text, we flip a flag, the synthesize hook calls{" "}
        <code>cancelGeneration()</code>, and the stream stops with whatever
        we have. The user sees a complete-looking answer instead of a
        spinning prompt.
      </p>
      <p>
        That's the pattern: the model is one component, and the surrounding
        code is allowed to overrule it. Trust, but verify, but cancel.
      </p>
    </LessonLayout>
  );
}
