import { LessonLayout } from "../components/curriculum/LessonLayout";
import { getLesson } from "../data/curriculum";

const HEADINGS = [
  { id: "premise", text: "The premise", level: 2 as const },
  { id: "what-well-build", text: "What we'll build", level: 2 as const },
  { id: "what-youll-need", text: "What you'll need", level: 2 as const },
  { id: "the-shape-of-the-thing", text: "The shape of the thing", level: 2 as const },
];

export function Component() {
  const lesson = getLesson("introduction")!;
  return (
    <LessonLayout lesson={lesson} headings={HEADINGS}>
      <p className="lead">
        We're going to build a research agent that runs entirely in your
        browser. No server. No API key. The model lives in your browser tab,
        the search runs against Wikipedia's public API, and the answer streams
        back with citations — all on a 1.5B-parameter model that fits in 1.6 GB
        of RAM.
      </p>

      <h2 id="premise">The premise</h2>
      <p>
        <em>TODO: motivate why on-device matters now — small models are good
        enough for structured tasks; latency, privacy, cost; the GemmaDesktop
        moment.</em>
      </p>

      <h2 id="what-well-build">What we'll build</h2>
      <p>
        <em>TODO: describe the plan-retrieve-synthesize loop in one paragraph.
        Show a screenshot or diagram of the live demo.</em>
      </p>

      <h2 id="what-youll-need">What you'll need</h2>
      <ul>
        <li>A modern Chromium-based browser (Chrome 113+, Edge)</li>
        <li>Roughly 2 GB of free RAM for the model</li>
        <li>A first-time download of ~1.6 GB (cached after that)</li>
      </ul>

      <h2 id="the-shape-of-the-thing">The shape of the thing</h2>
      <p>
        <em>TODO: list the 5 lessons that follow with a one-line teaser each.
        Frame the demo as the payoff after lesson 5.</em>
      </p>
    </LessonLayout>
  );
}
