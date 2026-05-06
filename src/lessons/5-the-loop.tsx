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
        <em>TODO: walk through the phases in <code>ResearchPage.tsx</code>:
        idle → planning → plan-approval → retrieving → synthesizing → done.
        Show the transition diagram.</em>
      </p>

      <h2 id="approving-the-plan">Approving the plan</h2>
      <p>
        <em>TODO: why the human sees the plan before retrieval starts. Editing
        affordances. The cost of getting this wrong (wasted compute) vs. the
        cost of friction (one extra click).</em>
      </p>

      <h2 id="error-recovery">Error recovery</h2>
      <p>
        <em>TODO: each phase has its own retry path. Plan parse fails →
        synthesized fallback. Wikipedia errors → per-query retry. Synthesis
        cancels on repetition → stops streaming with what we have.</em>
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
        now and see all six pieces working together on a real prompt.
      </p>
      <p>
        <em>TODO: tease v2 ideas — parallel topic workers, a richer retrieval
        backend, a model picker that picks based on task. Frame as homework.</em>
      </p>
    </LessonLayout>
  );
}
