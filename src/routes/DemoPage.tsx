import { useEffect } from "react";
import { ModelCard } from "../components/ModelCard";
import { HfIntakeBanner } from "../components/HfIntakeBanner";
import { MemoryStatus } from "../components/MemoryStatus";
import { useDownload } from "../contexts/DownloadContext";
import { MODELS } from "../data/models";

export function Component() {
  const { checkStoredModels } = useDownload();

  useEffect(() => {
    checkStoredModels(MODELS);
  }, [checkStoredModels]);

  return (
    <div className="max-w-4xl mx-auto px-6 lg:px-12 py-10">
      <header className="mb-10 pb-6 border-b border-[color:var(--color-outline-variant)]">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[color:var(--color-tertiary)] mb-3 flex items-center gap-2">
          <span
            className="inline-block w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ backgroundColor: "var(--color-tertiary)" }}
          />
          Live demo
        </p>
        <h1 className="text-4xl font-bold tracking-tight mb-3">
          The full agent
        </h1>
        <p className="text-base text-[color:var(--color-on-surface-variant)] max-w-2xl">
          Pick a model below. Once it loads, you'll be dropped into the
          research playground — where the planner, retriever, and synthesizer
          you read about in lessons 2–5 run end-to-end on whatever prompt you
          give it.
        </p>
      </header>

      <HfIntakeBanner />

      <section>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[color:var(--color-on-surface-variant)] mb-4">
          Choose a model
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MODELS.map((model, i) => (
            <ModelCard key={model.id} model={model} recommended={i === 0} />
          ))}
        </div>
        <p className="mt-4 text-xs text-[color:var(--color-on-surface-variant)]">
          Models cache to your browser. First load is the only download.
        </p>
      </section>

      <MemoryStatus />
    </div>
  );
}
