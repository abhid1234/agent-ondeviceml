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
        <em>TODO: walk through the StreamCallback pattern in
        <code>src/lib/mediapipe.ts</code>. Why we render token-by-token, the
        cancel handle, and graceful interruption.</em>
      </p>

      <h2 id="citation-markers">Citation markers</h2>
      <p>
        <em>TODO: <code>[N]</code> is a deliberate, low-token-cost convention.
        N indexes into the retrieved snippets array. We don't ask the model for
        URLs — we ask for indices and resolve URLs ourselves.</em>
      </p>

      <h2 id="parsing-as-it-streams">Parsing as it streams</h2>
      <p>
        <em>TODO: show the regex + position-tracking that turns mid-stream
        text into clickable citation badges as soon as <code>[N]</code> is
        emitted.</em>
      </p>

      <h2 id="the-repetition-detector">The repetition detector</h2>
      <p>
        <em>TODO: from <code>src/lib/repetitionDetector.ts</code> — why small
        models loop, the n-gram heuristic, and the cancel-on-detect pattern
        that keeps the UX from hanging.</em>
      </p>
    </LessonLayout>
  );
}
