import type { ModelInfo } from "../types";

export const MODELS: ModelInfo[] = [
  {
    id: "qwen-1.5b",
    name: "Qwen 2.5 1.5B",
    fileName: "Qwen2.5-1.5B-Instruct_multi-prefill-seq_q8_ekv1280.task",
    downloadUrl:
      "https://pub-c58f10d335194d4d817c4c47bb5b9d85.r2.dev/models/Qwen2.5-1.5B-Instruct_multi-prefill-seq_q8_ekv1280.task",
    sizeBytes: 1625493432,
    capabilities: ["text"],
    quantization: "q8",
    parameterCount: "1.5B",
    description:
      "Smallest text-only model in the lineup. Recommended starting point for research — fast plan generation, low memory footprint.",
    maxTokens: 1024,
    tags: ["recommended", "multilingual", "long-context"],
    category: "text-gen",
    author: "Alibaba",
    released: "2025-09-01",
    architecture: { family: "qwen", contextLength: 4096, embeddingSize: 1536 },
    chatTemplate: "chatml",
  },
  {
    id: "gemma-3n-e2b",
    name: "Gemma 3n E2B",
    fileName: "gemma-3n-E2B-it-int4-Web.litertlm",
    downloadUrl:
      "https://pub-c58f10d335194d4d817c4c47bb5b9d85.r2.dev/models/gemma-3n-E2B-it-int4-Web.litertlm",
    sizeBytes: 3038117888,
    capabilities: ["text", "image", "audio"],
    quantization: "int4",
    parameterCount: "E2B (~2B active)",
    description:
      "Google's multimodal Gemma. Larger but higher quality synthesis. Works on most desktop browsers.",
    maxTokens: 4096,
    tags: ["multimodal", "audio"],
    category: "multimodal",
    author: "Google",
    released: "2025-06-01",
    architecture: { family: "gemma", contextLength: 4096, embeddingSize: 2560 },
    chatTemplate: "gemma",
  },
  {
    id: "gemma-4-e2b",
    name: "Gemma 4 E2B",
    fileName: "gemma-4-E2B-it-web.task",
    downloadUrl:
      "https://pub-c58f10d335194d4d817c4c47bb5b9d85.r2.dev/models/gemma-4-E2B-it-web.task",
    sizeBytes: 2003697664,
    capabilities: ["text", "image"],
    quantization: "int4",
    parameterCount: "E2B (~2B active)",
    description:
      "Newest Gemma. Text + image. Best on desktop Chrome with a dedicated GPU.",
    maxTokens: 128,
    chatTemplate: "gemma",
    tags: ["multimodal", "gemma4", "high-memory"],
    category: "multimodal",
    author: "Google",
    released: "2026-04-02",
    architecture: { family: "gemma", contextLength: 1024, embeddingSize: 2560 },
  },
  {
    id: "gemma-3n-e4b",
    name: "Gemma 3n E4B",
    fileName: "gemma-3n-E4B-it-int4.task",
    downloadUrl:
      "https://pub-c58f10d335194d4d817c4c47bb5b9d85.r2.dev/models/gemma-3n-E4B-it-int4.task",
    sizeBytes: 4405655031,
    capabilities: ["text", "image", "audio"],
    quantization: "int4",
    parameterCount: "E4B (~4B active)",
    description:
      "Largest model. Highest answer quality. May exceed memory limits in some browsers — desktop Chrome with dedicated GPU recommended.",
    maxTokens: 4096,
    tags: ["multimodal", "audio", "high-quality", "high-memory"],
    category: "multimodal",
    author: "Google",
    released: "2025-06-01",
    architecture: { family: "gemma", contextLength: 4096, embeddingSize: 3072 },
    chatTemplate: "gemma",
  },
];

// Map HuggingFace model IDs to catalog model IDs for ?hf_model= deeplinks
export const HF_TO_CATALOG: Record<string, string> = {
  "qwen/qwen2.5-1.5b-instruct": "qwen-1.5b",
  "google/gemma-3n-e2b-it": "gemma-3n-e2b",
  "google/gemma-4-e2b-it": "gemma-4-e2b",
  "google/gemma-3n-e4b-it": "gemma-3n-e4b",
};

export function getModelById(id: string): ModelInfo | undefined {
  return MODELS.find((m) => m.id === id);
}

export function formatSize(bytes: number): string {
  if (bytes >= 1_073_741_824) {
    return `${(bytes / 1_073_741_824).toFixed(1)} GB`;
  }
  return `${(bytes / 1_048_576).toFixed(0)} MB`;
}
