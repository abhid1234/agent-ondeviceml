import { useEffect } from "react";
import { ModelCard } from "../components/ModelCard";
import { HfIntakeBanner } from "../components/HfIntakeBanner";
import { useDownload } from "../contexts/DownloadContext";
import { MODELS } from "../data/models";

export function Component() {
  const { checkStoredModels } = useDownload();

  useEffect(() => {
    checkStoredModels(MODELS);
  }, [checkStoredModels]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <HfIntakeBanner />
      <section className="mb-12 text-center">
        <p className="text-xs font-semibold tracking-wider uppercase text-[color:var(--color-primary)] mb-3">
          Agentic research · fully on-device
        </p>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
          A small model that plans, browses, and writes.
        </h1>
        <p className="text-lg text-[color:var(--color-on-surface-variant)] max-w-2xl mx-auto">
          Pick a model. Ask a research question. Watch it plan subqueries,
          browse Wikipedia, and synthesize a cited answer — all in your
          browser, fully offline after the first download.
        </p>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Choose a model</h2>
          <p className="text-xs text-[color:var(--color-on-surface-variant)]">
            Models cache to your browser. First load is the only download.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MODELS.map((model, i) => (
            <ModelCard key={model.id} model={model} recommended={i === 0} />
          ))}
        </div>
      </section>

      <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
        <div>
          <h3 className="font-semibold mb-1.5">1. Plan</h3>
          <p className="text-[color:var(--color-on-surface-variant)]">
            The model breaks your question into 2–4 subqueries with a synthesis approach.
          </p>
        </div>
        <div>
          <h3 className="font-semibold mb-1.5">2. Retrieve</h3>
          <p className="text-[color:var(--color-on-surface-variant)]">
            Wikipedia snippets fetched per subquery via the public Action API. CORS-safe, no key.
          </p>
        </div>
        <div>
          <h3 className="font-semibold mb-1.5">3. Synthesize</h3>
          <p className="text-[color:var(--color-on-surface-variant)]">
            A streamed answer with inline [N] citations linking back to the retrieved sources.
          </p>
        </div>
      </section>
    </div>
  );
}
