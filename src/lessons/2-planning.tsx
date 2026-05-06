import { LessonLayout } from "../components/curriculum/LessonLayout";
import { getLesson } from "../data/curriculum";

const HEADINGS = [
  { id: "why-a-plan", text: "Why a plan", level: 2 as const },
  { id: "the-prompt", text: "The planner prompt", level: 2 as const },
  { id: "parsing-the-output", text: "Parsing the output", level: 2 as const },
  { id: "the-fallback", text: "The fallback path", level: 2 as const },
];

export function Component() {
  const lesson = getLesson("planning")!;
  return (
    <LessonLayout lesson={lesson} headings={HEADINGS}>
      <p className="lead">
        A research question like "compare WebGPU and WebNN" doesn't map to a
        single search. We ask the model to break it into 2–4 subqueries and
        commit to a synthesis approach — emitted as JSON so the rest of the
        loop has a stable contract to consume.
      </p>

      <h2 id="why-a-plan">Why a plan</h2>
      <p>
        <em>TODO: argue against single-shot search; coverage, intent
        decomposition, citation grounding. Note that planning makes the
        retrieval step parallelizable later.</em>
      </p>

      <h2 id="the-prompt">The planner prompt</h2>
      <p>
        <em>TODO: walk through the system message + user template in
        <code>src/features/research/lib/plannerPrompt.ts</code>. Highlight the
        few-shot example, the strict JSON schema, and the choice of
        <code>formatWithSystem()</code> for chat-template handling.</em>
      </p>

      <h2 id="parsing-the-output">Parsing the output</h2>
      <p>
        <em>TODO: show <code>parsePlanJson()</code> — fence stripping, brace
        matching, schema validation. Why a small model often wraps JSON in
        prose, and how the parser tolerates it.</em>
      </p>

      <h2 id="the-fallback">The fallback path</h2>
      <p>
        <em>TODO: when JSON parsing fails (1.5B-class models miss sometimes),
        we synthesize a 2-query plan from the question itself. Better than
        showing a parse error to the user.</em>
      </p>
    </LessonLayout>
  );
}
