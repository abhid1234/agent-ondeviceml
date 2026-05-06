import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { ModelInfo } from "../types";
import { useDownload } from "../contexts/DownloadContext";
import { useModel } from "../contexts/ModelContext";
import { formatSize } from "../data/models";

interface ModelCardProps {
  model: ModelInfo;
  recommended?: boolean;
}

export function ModelCard({ model, recommended }: ModelCardProps) {
  const navigate = useNavigate();
  const { getModelStatus, startDownload, getModelBlob, downloadProgress } = useDownload();
  const { loadModel, currentModel, isLoading } = useModel();
  const [pendingNav, setPendingNav] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const status = getModelStatus(model.id);
  const progress = downloadProgress[model.id];
  const isActive = currentModel?.id === model.id;
  const isDownloading = status === "downloading";
  const downloadPct =
    progress && progress.totalBytes > 0
      ? Math.round((progress.bytesDownloaded / progress.totalBytes) * 100)
      : 0;

  useEffect(() => {
    if (pendingNav && status === "ready" && !isActive && !isLoading) {
      (async () => {
        try {
          const blob = await getModelBlob(model);
          await loadModel(model, blob);
          navigate("/research");
        } catch (e) {
          setLoadError(e instanceof Error ? e.message : "Failed to load model");
        } finally {
          setPendingNav(false);
        }
      })();
    } else if (pendingNav && isActive) {
      navigate("/research");
      setPendingNav(false);
    }
  }, [pendingNav, status, isActive, isLoading, model, getModelBlob, loadModel, navigate]);

  const handleClick = async () => {
    setLoadError(null);
    if (status === "not_downloaded") {
      setPendingNav(true);
      await startDownload(model);
    } else if (status === "ready") {
      setPendingNav(true);
    }
  };

  let buttonLabel = "Load model";
  if (isDownloading) buttonLabel = `Downloading… ${downloadPct}%`;
  else if (isLoading && pendingNav) buttonLabel = "Loading model…";
  else if (isActive) buttonLabel = "Open Research →";
  else if (status === "ready") buttonLabel = "Load & Open →";

  return (
    <div
      className={`rounded-2xl border p-5 transition-all bg-[color:var(--color-surface)] ${
        isActive
          ? "border-[color:var(--color-primary)] shadow-md"
          : "border-[color:var(--color-outline-variant)] hover:border-[color:var(--color-outline)]"
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-semibold text-base">{model.name}</h3>
          <p className="text-xs text-[color:var(--color-on-surface-variant)] mt-0.5">
            {model.parameterCount} · {formatSize(model.sizeBytes)} · {model.author}
          </p>
        </div>
        {recommended && (
          <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-[color:var(--color-tertiary-container)] text-[color:var(--color-tertiary)]">
            Recommended
          </span>
        )}
      </div>

      <p className="text-sm text-[color:var(--color-on-surface-variant)] mb-4">
        {model.description}
      </p>

      {loadError && (
        <p className="text-xs text-[color:var(--color-error)] mb-3">{loadError}</p>
      )}

      <button
        onClick={handleClick}
        disabled={isDownloading || (isLoading && pendingNav)}
        className={`w-full px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          isActive
            ? "bg-[color:var(--color-primary)] text-[color:var(--color-on-primary)] hover:opacity-90"
            : isDownloading || (isLoading && pendingNav)
            ? "bg-[color:var(--color-surface-container)] text-[color:var(--color-on-surface-variant)] cursor-wait"
            : "bg-[color:var(--color-primary-container)] text-[color:var(--color-on-primary-container)] hover:bg-[color:var(--color-primary)] hover:text-[color:var(--color-on-primary)]"
        }`}
      >
        {buttonLabel}
      </button>

      {isDownloading && (
        <div className="mt-2 h-1 bg-[color:var(--color-surface-container)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[color:var(--color-primary)] transition-all"
            style={{ width: `${downloadPct}%` }}
          />
        </div>
      )}
    </div>
  );
}
