// Dimmed preview of the three phases the agent runs through. Rendered below
// the composer at idle to show new users what comes next without copy.

const PHASES = [
  { number: 1, title: "Plan", subtitle: "2 subqueries · compare-and-contrast" },
  { number: 2, title: "Retrieve", subtitle: "Wikipedia · 6 snippets" },
  { number: 3, title: "Synthesize", subtitle: "Streamed answer · cited" },
] as const;

export function IdlePreview() {
  return (
    <div className="w-full max-w-3xl pt-2">
      <p
        className="text-[11px] font-semibold uppercase tracking-wider mb-3"
        style={{ color: "var(--color-on-surface-variant)" }}
      >
        What happens after you ask
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {PHASES.map((phase) => (
          <div
            key={phase.number}
            className="rounded-xl px-4 py-3.5"
            style={{
              border: "1px dashed var(--color-outline-variant)",
              backgroundColor: "var(--color-surface)",
              opacity: 0.6,
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span
                className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold"
                style={{
                  backgroundColor: "var(--color-primary-container)",
                  color: "var(--color-on-primary-container)",
                }}
              >
                {phase.number}
              </span>
              <span
                className="text-[11px] font-semibold uppercase tracking-wider"
                style={{ color: "var(--color-tertiary)" }}
              >
                {phase.title}
              </span>
            </div>

            {phase.title === "Plan" && <PlanStub />}
            {phase.title === "Retrieve" && <RetrieveStub />}
            {phase.title === "Synthesize" && <SynthesizeStub />}

            <p
              className="text-[11px] mt-3"
              style={{ color: "var(--color-on-surface-variant)" }}
            >
              {phase.subtitle}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PlanStub() {
  return (
    <div className="space-y-1 text-xs" style={{ color: "var(--color-on-surface)" }}>
      <p className="font-mono">"WebGPU architecture"</p>
      <p className="font-mono">"WebNN architecture"</p>
    </div>
  );
}

function RetrieveStub() {
  return (
    <div className="flex flex-wrap gap-1">
      {["WebGPU API", "WebNN spec", "+4 more"].map((s) => (
        <span
          key={s}
          className="px-2 py-0.5 rounded-full text-[10px]"
          style={{
            backgroundColor: "var(--color-surface-container)",
            color: "var(--color-on-surface-variant)",
          }}
        >
          {s}
        </span>
      ))}
    </div>
  );
}

function SynthesizeStub() {
  return (
    <p className="text-xs leading-relaxed" style={{ color: "var(--color-on-surface)" }}>
      WebGPU exposes the GPU directly{" "}
      <CitationBadge n={1} />, while WebNN abstracts it{" "}
      <CitationBadge n={3} />…
    </p>
  );
}

function CitationBadge({ n }: { n: number }) {
  return (
    <span
      className="inline-block px-1.5 rounded text-[10px] font-semibold align-middle"
      style={{
        backgroundColor: "var(--color-primary-container)",
        color: "var(--color-on-primary-container)",
      }}
    >
      {n}
    </span>
  );
}
