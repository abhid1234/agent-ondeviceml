import { LessonLayout } from "../components/curriculum/LessonLayout";
import { getLesson } from "../data/curriculum";

const HEADINGS = [
  { id: "the-cors-problem", text: "The CORS problem", level: 2 as const },
  { id: "wikipedia-action-api", text: "Wikipedia's Action API", level: 2 as const },
  { id: "snippet-shape", text: "The snippet shape", level: 2 as const },
  { id: "timeouts-and-errors", text: "Timeouts and errors", level: 2 as const },
];

export function Component() {
  const lesson = getLesson("retrieval")!;
  return (
    <LessonLayout lesson={lesson} headings={HEADINGS}>
      <p className="lead">
        On-device retrieval has two constraints: it has to run from a static
        page (no server) and it has to come back fast enough that a 6-second
        cap is comfortable. Wikipedia's Action API satisfies both — and gives
        you cleaner snippets than scraping.
      </p>

      <h2 id="the-cors-problem">The CORS problem</h2>
      <p>
        <em>TODO: explain why most search APIs are unreachable from the browser
        without a proxy, and why "fetch a URL and parse the HTML" doesn't work
        for arbitrary sites.</em>
      </p>

      <h2 id="wikipedia-action-api">Wikipedia's Action API</h2>
      <p>
        <em>TODO: walk through the actual fetch in
        <code>src/features/research/hooks/useRetrieve.ts</code>. URL params,
        the JSON shape, what fields we keep.</em>
      </p>

      <h2 id="snippet-shape">The snippet shape</h2>
      <p>
        <em>TODO: each snippet ends up with a stable id, title, url, and short
        body. This shape is what the synthesizer cites against — keeping it
        small keeps the context window honest.</em>
      </p>

      <h2 id="timeouts-and-errors">Timeouts and errors</h2>
      <p>
        <em>TODO: per-subquery 6-second cap, retry-on-error UX, partial-results
        philosophy (show what we got; don't block on one slow query).</em>
      </p>
    </LessonLayout>
  );
}
