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
        Three reasons to spend a model call on planning before retrieval, even
        though it makes the loop slower:
      </p>
      <ul>
        <li>
          <strong>Coverage.</strong> "Compare WebGPU and WebNN" is two topics.
          A single search misses one half. A 2-query plan ("WebGPU
          architecture" + "WebNN architecture") covers both.
        </li>
        <li>
          <strong>Intent.</strong> The plan also commits to a synthesis
          approach — "compare-and-contrast" vs. "summarize" vs. "timeline."
          That choice changes the synthesizer prompt downstream.
        </li>
        <li>
          <strong>Citation grounding.</strong> If you retrieve once and
          synthesize once, the model can drift. If you retrieve per
          subquery, each citation is anchored to a specific intent — which
          makes <code>[N]</code> markers meaningful.
        </li>
      </ul>
      <p>
        There's a fourth payoff that's easy to overlook: planning makes the
        retrieval step <em>parallelizable</em>. Today we run subqueries
        sequentially. Tomorrow you can fan them out — and the data shape
        doesn't change.
      </p>

      <h2 id="the-prompt">The planner prompt</h2>
      <p>
        The prompt lives in <code>src/features/research/lib/plannerPrompt.ts</code>.
        Three pieces, in order:
      </p>
      <ol>
        <li>
          A <strong>system message</strong> that tells the model it is a
          research planner and must emit JSON only — no preamble, no
          reasoning out loud.
        </li>
        <li>
          One <strong>few-shot example</strong>: a question, then the
          well-formed JSON plan you want back. Small models lock onto format
          much harder from one concrete example than from a schema
          description.
        </li>
        <li>
          The <strong>user message</strong>: just the research question,
          wrapped exactly like the example.
        </li>
      </ol>
      <p>
        Wrapping the whole thing for the right chat template is{" "}
        <code>formatWithSystem()</code> in <code>src/lib/chatTemplate.ts</code>.
        Each model in the catalog declares its template family (Gemma, Qwen,
        Llama-style). The function emits the right turn tokens —{" "}
        <code>&lt;start_of_turn&gt;</code> for Gemma,{" "}
        <code>&lt;|im_start|&gt;</code> for Qwen — so we don't have a
        per-model branch in the planner code.
      </p>

      <h2 id="parsing-the-output">Parsing the output</h2>
      <p>
        Small models cooperate, mostly. They also do three things that break
        a naive <code>JSON.parse()</code>:
      </p>
      <ul>
        <li>Wrap the JSON in <code>```json</code> fences.</li>
        <li>Add a sentence of preamble: "Here is the plan: {`{`}…{`}`}".</li>
        <li>Sometimes drop a closing brace if generation cuts off near the limit.</li>
      </ul>
      <p>
        <code>parsePlanJson()</code> in{" "}
        <code>src/features/research/lib/parsePlanJson.ts</code> handles all
        three. It strips Markdown fences, walks the string to find the first{" "}
        <code>{`{`}</code> and the matching <code>{`}`}</code> via brace
        counting, then runs the substring through <code>JSON.parse</code>. If
        the schema check fails (missing <code>queries</code>, wrong types) the
        whole call returns <code>null</code> and the caller falls back.
      </p>

      <h2 id="the-fallback">The fallback path</h2>
      <p>
        Even with the lenient parser, a 1.5B-class model misses ~5% of the
        time. The fallback is intentionally dumb: take the original question
        and produce two queries from it — the question as-is, and the
        question prefixed with "background". Set the synthesis approach to{" "}
        <code>"summarize"</code>. Move on.
      </p>
      <p>
        The user sees a slightly less ambitious plan, gets to edit it before
        retrieval, and the loop continues. No error toast, no retry spinner.
        The cost of perfect planning isn't worth the cost of a stalled UX —
        especially when the user can edit the plan anyway.
      </p>
    </LessonLayout>
  );
}
