import { Link } from "react-router";
import { LessonLayout } from "../components/curriculum/LessonLayout";
import { getLesson } from "../data/curriculum";

const HEADINGS = [
  { id: "phase-state-machine", text: "The phase state machine", level: 2 as const },
  { id: "approving-the-plan", text: "Approving the plan", level: 2 as const },
  { id: "error-recovery", text: "Error recovery", level: 2 as const },
  { id: "what-comes-next", text: "What comes next", level: 2 as const },
];

export function Component() {
  const lesson = getLesson("the-loop")!;
  return (
    <LessonLayout lesson={lesson} headings={HEADINGS}>
      <p className="lead">
        We've built three pieces: a planner, a retriever, a synthesizer. The
        last lesson is wiring them into a single loop with the right
        affordances — when does the user step in, when does the model run
        unattended, and what happens when something goes wrong.
      </p>

      <h2 id="phase-state-machine">The phase state machine</h2>
      <p>
        <code>ResearchPage.tsx</code> orchestrates five phases:
      </p>
      <pre><code>{`type Phase =
  | "idle"            // user hasn't asked anything
  | "planning"        // model is generating a plan
  | "plan-approval"   // plan rendered, user can edit
  | "retrieving"      // running Wikipedia subqueries
  | "synthesizing"    // streaming the cited answer
  | "done";`}</code></pre>
      <p>
        Transitions are linear forward (each phase advances only to the
        next), but every phase can also reset to <code>idle</code> via the
        cancel button or the "new question" affordance. There's no diamond
        branching, no parallel paths — the same prompt always traces the same
        path through the same five states. That's deliberate. The agentic
        ideal is a graph; the agentic <em>shipping</em> reality, on a small
        model, is a clean line.
      </p>
      <p>
        Each transition is owned by one hook: <code>usePlan</code> drives{" "}
        <code>idle → planning → plan-approval</code>,{" "}
        <code>useRetrieve</code> drives <code>plan-approval → retrieving</code>,{" "}
        <code>useSynthesize</code> drives <code>retrieving → synthesizing → done</code>.
        The page component itself just renders whichever component matches the
        current phase. Adding a new phase later (re-rank, refine, fact-check)
        is one new state and one new hook.
      </p>

      <h2 id="approving-the-plan">Approving the plan</h2>
      <p>
        The plan-approval phase is the only place the loop pauses for the
        human. The user sees the 2–4 subqueries plus the synthesis approach,
        and can edit any field before retrieval starts. Why bother?
      </p>
      <p>
        <strong>Cost asymmetry.</strong> Wikipedia retrieval is cheap (~3
        seconds for 9 snippets), but synthesis on a 1.5B model is expensive
        (~15–30 seconds for a 200-token answer with citations). If the plan
        is wrong — wrong subquery, wrong synthesis approach — you waste
        retrieval, then waste synthesis, then have to re-prompt. One human
        click of approval prevents both wastes.
      </p>
      <p>
        <strong>Trust calibration.</strong> Showing the plan also tells the
        user what the agent is about to do. That's important for an
        on-device agent — the value prop is that nothing leaves your
        machine, and seeing the queries before they fire makes that legible.
        The plan card is a contract.
      </p>

      <h2 id="error-recovery">Error recovery</h2>
      <p>
        Every phase fails differently, so each has its own recovery path:
      </p>
      <ul>
        <li>
          <strong>Plan parse fails.</strong> Fallback to a 2-query plan
          synthesized from the question itself (lesson 2). User never sees an
          error.
        </li>
        <li>
          <strong>Subquery times out or returns empty.</strong> Drop that
          one, keep the rest (lesson 3). The retrieval drawer marks the
          missing entry; the user can retry that subquery alone if they
          want.
        </li>
        <li>
          <strong>Synthesis loops.</strong> The repetition detector cancels
          the stream and emits "done" with the partial answer (lesson 4).
          Every <code>[N]</code> marker emitted before the cancel still
          resolves to a valid citation.
        </li>
        <li>
          <strong>Model crash or OOM.</strong> The generation throws, the
          phase resets to <code>plan-approval</code>, the user can retry.
          The model handle stays alive; only the run dies.
        </li>
      </ul>
      <p>
        The throughline: never hard-fail. Every error degrades to a usable
        partial result.
      </p>

      <h2 id="what-comes-next">What comes next</h2>
      <p>
        That's the loop. You can{" "}
        <Link
          to="/demo"
          className="text-[color:var(--color-primary)] underline hover:opacity-80"
        >
          run the demo
        </Link>{" "}
        now and see the planner, the retriever, and the synthesizer working
        together on a real prompt.
      </p>
      <p>
        Three directions worth thinking about as homework:
      </p>
      <ul>
        <li>
          <strong>Parallel subqueries.</strong> The data shape supports it
          (lesson 3). The hook is sequential. <code>Promise.all()</code> +
          a concurrency cap of 3 would cut retrieval latency by ~60% for
          most plans.
        </li>
        <li>
          <strong>Richer retrieval.</strong> Wikipedia is one source. A
          second hook against, say, GitHub READMEs (CORS-permissive, often
          authoritative for code questions) would make the agent useful for
          a different class of question without changing anything else.
        </li>
        <li>
          <strong>Task-based model picker.</strong> A 270M model can plan and
          can summarize, but struggles with comparison-style synthesis. A
          1B is the sweet spot for synthesis. There's a version of this where
          planning runs on 270M (fast) and synthesis runs on 1B (capable),
          loaded sequentially. The model context already supports
          unload-then-load.
        </li>
      </ul>
      <p>
        Or take it apart and put it back together with something the loop
        doesn't have today. Every piece of this site is{" "}
        <a
          href="https://github.com/abhid1234/agent-ondeviceml"
          target="_blank"
          rel="noopener"
          className="text-[color:var(--color-primary)] underline hover:opacity-80"
        >
          on GitHub
        </a>
        , Apache 2.0.
      </p>
    </LessonLayout>
  );
}
