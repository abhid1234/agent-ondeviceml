import { useState } from "react";

interface ResearchComposerProps {
  onSubmit: (question: string) => void;
  disabled?: boolean;
  isRunning?: boolean;
  hasModel?: boolean;
  autoApprove?: boolean;
  onAutoApproveChange?: (next: boolean) => void;
}

const EXAMPLE_QUESTIONS = [
  "What's the difference between WebGPU and WebNN?",
  "How does on-device AI compare to cloud AI for privacy?",
  "Compare LiteRT.js vs ONNX Runtime Web for browser deployments.",
];

export function ResearchComposer({
  onSubmit,
  disabled,
  isRunning = false,
  hasModel = true,
  autoApprove = false,
  onAutoApproveChange,
}: ResearchComposerProps) {
  const [question, setQuestion] = useState("");

  const handleSubmit = () => {
    const q = question.trim();
    if (!q || disabled) return;
    onSubmit(q);
  };

  return (
    <div
      className="rounded-2xl overflow-hidden shadow-sm"
      style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-outline-variant)" }}
    >
      <div className="px-4 pt-4 pb-3">
        <textarea
          rows={2}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder="Ask a research question..."
          disabled={disabled}
          className="w-full resize-none text-sm px-4 py-3 rounded-xl outline-none transition-shadow focus:ring-2 focus:ring-[color:var(--color-primary)]/30 focus:border-[color:var(--color-primary)] disabled:opacity-50"
          style={{
            backgroundColor: "var(--color-surface-container)",
            color: "var(--color-on-surface)",
            border: "1px solid var(--color-outline-variant)",
          }}
        />
        <div className="flex items-center justify-between mt-2">
          <span className="text-[11px]" style={{ color: "var(--color-on-surface-variant)" }}>
            Enter to start · Shift+Enter for newline
          </span>
          <button
            onClick={handleSubmit}
            disabled={!question.trim() || disabled}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            style={{ backgroundColor: "var(--color-primary)", color: "#fff" }}
          >
            {isRunning ? "Running…" : !hasModel ? "Load a model first" : "Start research"}
          </button>
        </div>
      </div>

      <div
        className="flex items-end gap-3 justify-between px-4 pb-4"
        style={{ borderTop: "1px solid var(--color-outline-variant)", paddingTop: "14px" }}
      >
        <div className="flex flex-wrap gap-2 flex-1 min-w-0">
          {EXAMPLE_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => setQuestion(q)}
              disabled={disabled}
              className="text-xs px-3 py-1.5 rounded-full border transition-all hover:bg-[color:var(--color-primary-container)] hover:border-[color:var(--color-primary)] disabled:opacity-40 disabled:hover:bg-[color:var(--color-surface)] truncate max-w-[260px]"
              style={{
                borderColor: "var(--color-primary-container)",
                color: "var(--color-primary)",
                backgroundColor: "var(--color-surface)",
              }}
            >
              {q}
            </button>
          ))}
        </div>
        {onAutoApproveChange && (
          <label
            className="flex items-center gap-1.5 text-xs cursor-pointer select-none whitespace-nowrap"
            style={{ color: "var(--color-on-surface-variant)" }}
          >
            <input
              type="checkbox"
              checked={autoApprove}
              onChange={(e) => onAutoApproveChange(e.target.checked)}
              className="rounded"
            />
            Auto-approve plan
          </label>
        )}
      </div>
    </div>
  );
}
