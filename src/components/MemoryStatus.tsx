import { useCallback, useEffect, useState } from "react";
import { useModel } from "../contexts/ModelContext";
import { formatSize } from "../data/models";

interface PerformanceMemory {
  jsHeapSizeLimit: number;
  totalJSHeapSize: number;
  usedJSHeapSize: number;
}

function readHeap(): PerformanceMemory | null {
  const mem = (performance as Performance & { memory?: PerformanceMemory }).memory;
  return mem ?? null;
}

function formatMB(bytes: number): string {
  return `${Math.round(bytes / (1024 * 1024))} MB`;
}

export function MemoryStatus() {
  const { currentModel, unloadModel, isLoading, isGenerating } = useModel();
  const [heap, setHeap] = useState<PerformanceMemory | null>(() => readHeap());
  const [justFreed, setJustFreed] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setHeap(readHeap()), 2000);
    return () => clearInterval(id);
  }, []);

  const handleFree = useCallback(async () => {
    await unloadModel();
    setJustFreed(true);
    setTimeout(() => setJustFreed(false), 4000);
  }, [unloadModel]);

  const heapAvailable = heap !== null;
  const modelBytes = currentModel?.sizeBytes ?? 0;
  const heapUsed = heap?.usedJSHeapSize ?? 0;
  const heapLimit = heap?.jsHeapSizeLimit ?? 0;
  const heapPct = heapLimit > 0 ? Math.min(100, Math.round((heapUsed / heapLimit) * 100)) : 0;
  const approxFootprint = modelBytes + heapUsed;

  return (
    <section className="mt-8 rounded-2xl border border-[color:var(--color-outline-variant)] bg-[color:var(--color-surface)] p-5">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[color:var(--color-on-surface-variant)] mb-1">
            Browser memory
          </p>
          <p className="text-sm text-[color:var(--color-on-surface-variant)]">
            Everything runs in this tab. Here's what it's costing you.
          </p>
        </div>
        <button
          onClick={handleFree}
          disabled={!currentModel || isLoading || isGenerating}
          className="px-4 py-1.5 text-sm font-medium rounded-full bg-[color:var(--color-primary)] text-[color:var(--color-on-primary)] hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          title={!currentModel ? "No model loaded" : "Unload the model and release its memory"}
        >
          {justFreed ? "Freed" : "Free memory"}
        </button>
      </div>

      <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
        <div>
          <dt className="text-xs text-[color:var(--color-on-surface-variant)] mb-1">
            Loaded model
          </dt>
          <dd className="font-medium">
            {currentModel ? (
              <>
                {currentModel.name}
                <span className="text-[color:var(--color-on-surface-variant)] font-normal">
                  {" · "}
                  {formatSize(currentModel.sizeBytes)}
                </span>
              </>
            ) : (
              <span className="text-[color:var(--color-on-surface-variant)] font-normal">
                None
              </span>
            )}
          </dd>
        </div>

        <div>
          <dt className="text-xs text-[color:var(--color-on-surface-variant)] mb-1">
            JS heap
          </dt>
          <dd className="font-medium">
            {heapAvailable ? (
              <>
                {formatMB(heapUsed)}
                <span className="text-[color:var(--color-on-surface-variant)] font-normal">
                  {" / "}
                  {formatMB(heapLimit)}
                </span>
              </>
            ) : (
              <span className="text-[color:var(--color-on-surface-variant)] font-normal">
                Not exposed by this browser
              </span>
            )}
          </dd>
          {heapAvailable && (
            <div className="mt-2 h-1 bg-[color:var(--color-outline-variant)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[color:var(--color-primary)] transition-all"
                style={{ width: `${heapPct}%` }}
              />
            </div>
          )}
        </div>

        <div>
          <dt className="text-xs text-[color:var(--color-on-surface-variant)] mb-1">
            Approximate footprint
          </dt>
          <dd className="font-medium">
            {currentModel || heapAvailable
              ? formatSize(approxFootprint)
              : "—"}
          </dd>
          <p className="mt-1 text-[11px] text-[color:var(--color-on-surface-variant)]">
            Model weights live outside the JS heap (WebGPU / WASM).
          </p>
        </div>
      </dl>

      {justFreed && (
        <p className="mt-4 text-xs text-[color:var(--color-on-surface-variant)]">
          Model unloaded. Reload the page if you also want the browser to
          return WASM memory to the OS.
        </p>
      )}
    </section>
  );
}
