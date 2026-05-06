import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import type { ModelInfo } from "../types";
import { HF_TO_CATALOG, MODELS, formatSize } from "../data/models";
import { useDownload } from "../contexts/DownloadContext";
import { useModel } from "../contexts/ModelContext";

// Task aliases that map to local routes. Default destination is /research since
// this is the agentic-research subdomain.
const TASK_TO_PATH: Record<string, string> = {
  research: "research",
  chat: "research",
  "text-generation": "research",
  "image-text-to-text": "research",
};

interface IntakeState {
  model: ModelInfo;
  task: string;
}

export function HfIntakeBanner() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { getModelStatus, startDownload, getModelBlob, downloadProgress } = useDownload();
  const { loadModel, currentModel } = useModel();
  const [intake, setIntake] = useState<IntakeState | null>(null);
  const [loading, setLoading] = useState(false);

  // Parse ?hf_model=&task= once on mount
  useEffect(() => {
    const hfModel = searchParams.get("hf_model");
    const task = searchParams.get("task") ?? "research";
    if (!hfModel || intake) return;
    const catalogId = HF_TO_CATALOG[hfModel.toLowerCase()];
    const matched = MODELS.find((m) => m.id === catalogId);
    if (!matched) return;
    setIntake({ model: matched, task: TASK_TO_PATH[task] ?? "research" });
    setSearchParams({}, { replace: true });
  }, [searchParams, setSearchParams, intake]);

  // Auto-load and navigate when download finishes
  const status = intake ? getModelStatus(intake.model.id) : "not_downloaded";
  useEffect(() => {
    if (!intake || !loading || status !== "ready") return;
    (async () => {
      try {
        const blob = await getModelBlob(intake.model);
        await loadModel(intake.model, blob);
        navigate(`/${intake.task}`);
        setIntake(null);
      } catch {
        setLoading(false);
      }
    })();
  }, [status, intake, loading, getModelBlob, loadModel, navigate]);

  const handleOpen = useCallback(async () => {
    if (!intake) return;
    const { model, task } = intake;
    if (currentModel?.id === model.id) {
      navigate(`/${task}`);
      setIntake(null);
      return;
    }
    setLoading(true);
    const s = getModelStatus(model.id);
    if (s === "not_downloaded") {
      startDownload(model);
      return;
    }
    try {
      const blob = await getModelBlob(model);
      await loadModel(model, blob);
      navigate(`/${task}`);
      setIntake(null);
    } catch {
      setLoading(false);
    }
  }, [intake, currentModel, getModelStatus, startDownload, getModelBlob, loadModel, navigate]);

  if (!intake) return null;

  const progress = downloadProgress[intake.model.id];
  const pct =
    progress && progress.totalBytes > 0
      ? Math.round((progress.bytesDownloaded / progress.totalBytes) * 100)
      : 0;
  const isDownloading = status === "downloading";

  return (
    <div className="mb-6 rounded-2xl border border-[color:var(--color-primary)] bg-[color:var(--color-primary-container)] p-4 flex items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-[color:var(--color-on-primary-container)] mb-1">
          Coming from Hugging Face
        </p>
        <p className="text-sm text-[color:var(--color-on-primary-container)]">
          Open <span className="font-semibold">{intake.model.name}</span> ·{" "}
          {formatSize(intake.model.sizeBytes)} → Research
        </p>
        {isDownloading && (
          <div className="mt-2 h-1 bg-[color:var(--color-primary)]/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-[color:var(--color-primary)] transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => setIntake(null)}
          className="px-3 py-1.5 text-sm rounded-full text-[color:var(--color-on-primary-container)] hover:bg-[color:var(--color-primary)]/10"
        >
          Dismiss
        </button>
        <button
          onClick={handleOpen}
          disabled={loading || isDownloading}
          className="px-4 py-1.5 text-sm font-medium rounded-full bg-[color:var(--color-primary)] text-[color:var(--color-on-primary)] hover:opacity-90 disabled:opacity-60 disabled:cursor-wait"
        >
          {isDownloading ? `Downloading… ${pct}%` : loading ? "Loading…" : "Load & Open"}
        </button>
      </div>
    </div>
  );
}
