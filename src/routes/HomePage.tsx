import { Link } from "react-router";
import { CURRICULUM } from "../data/curriculum";

export function Component() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <section className="mb-16">
        <p className="text-xs font-semibold tracking-[0.15em] uppercase text-[color:var(--color-primary)] mb-4">
          ondeviceml / research
        </p>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 max-w-3xl leading-[1.05]">
          Understanding agentic browsing by building it from scratch.
        </h1>
        <p className="text-xl text-[color:var(--color-on-surface-variant)] max-w-2xl mb-8 leading-relaxed">
          A six-lesson walkthrough of a research agent that runs entirely in
          your browser. Plan, retrieve, synthesize — on a 1.5B-parameter model,
          fully offline after the first download.
        </p>
        <div className="flex items-center gap-3">
          <Link
            to={`/lessons/${CURRICULUM[0].slug}`}
            className="px-5 py-2.5 rounded-full bg-[color:var(--color-primary)] text-[color:var(--color-on-primary)] text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Start with Lesson 0 →
          </Link>
          <Link
            to="/demo"
            className="px-5 py-2.5 rounded-full border border-[color:var(--color-outline-variant)] text-sm font-medium hover:border-[color:var(--color-outline)] transition-colors"
          >
            Skip to the demo
          </Link>
        </div>
      </section>

      <section className="border-t border-[color:var(--color-outline-variant)] pt-12">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[color:var(--color-on-surface-variant)] mb-6">
          Curriculum
        </p>
        <ol className="space-y-1">
          {CURRICULUM.map((lesson) => (
            <li key={lesson.slug}>
              <Link
                to={`/lessons/${lesson.slug}`}
                className="group block py-5 border-b border-[color:var(--color-outline-variant)] hover:bg-[color:var(--color-surface-container-low)] transition-colors -mx-3 px-3 rounded-md"
              >
                <div className="flex items-baseline gap-6">
                  <span className="text-3xl font-bold tabular-nums text-[color:var(--color-outline)] group-hover:text-[color:var(--color-primary)] transition-colors w-8 shrink-0">
                    {lesson.number}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-4 mb-1">
                      <h2 className="text-xl font-semibold tracking-tight">
                        {lesson.title}
                      </h2>
                      <span className="text-xs text-[color:var(--color-on-surface-variant)] tabular-nums shrink-0">
                        {lesson.readingMinutes} min
                      </span>
                    </div>
                    <p className="text-[color:var(--color-on-surface-variant)] text-base leading-relaxed">
                      {lesson.blurb}
                    </p>
                  </div>
                </div>
              </Link>
            </li>
          ))}

          <li>
            <Link
              to="/demo"
              className="group block py-5 hover:bg-[color:var(--color-tertiary-container)] transition-colors -mx-3 px-3 rounded-md"
            >
              <div className="flex items-baseline gap-6">
                <span className="text-3xl font-bold text-[color:var(--color-tertiary)] w-8 shrink-0">
                  →
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-4 mb-1">
                    <h2 className="text-xl font-semibold tracking-tight">
                      Live demo
                    </h2>
                    <span className="text-xs text-[color:var(--color-on-surface-variant)] tabular-nums shrink-0">
                      hands-on
                    </span>
                  </div>
                  <p className="text-[color:var(--color-on-surface-variant)] text-base leading-relaxed">
                    Pick a model, ask a question, watch all six pieces fire in
                    sequence on a real prompt.
                  </p>
                </div>
              </div>
            </Link>
          </li>
        </ol>
      </section>
    </div>
  );
}
