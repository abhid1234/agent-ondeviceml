export interface Lesson {
  number: number;
  slug: string;
  title: string;
  blurb: string;
  readingMinutes: number;
}

export const CURRICULUM: Lesson[] = [
  {
    number: 0,
    slug: "introduction",
    title: "Introduction",
    blurb:
      "What on-device agentic browsing is, why a 1.5B-parameter model running in your browser is enough, and what we'll build.",
    readingMinutes: 4,
  },
  {
    number: 1,
    slug: "loading-the-model",
    title: "Loading a model in the browser",
    blurb:
      "MediaPipe Tasks GenAI, the WebGPU primary path, the WASM fallback, and the blob-URL trick that keeps streaming alive under Vite.",
    readingMinutes: 7,
  },
  {
    number: 2,
    slug: "planning",
    title: "Planning the search",
    blurb:
      "Turning a research question into a structured JSON plan with 2–4 subqueries and a synthesis approach. Why JSON, and how to make a small model produce it reliably.",
    readingMinutes: 8,
  },
  {
    number: 3,
    slug: "retrieval",
    title: "Retrieving from Wikipedia",
    blurb:
      "Wikipedia's Action API, CORS-safe browsing without a server, per-subquery timeouts, and the snippet shape that pairs cleanly with citations.",
    readingMinutes: 6,
  },
  {
    number: 4,
    slug: "synthesis",
    title: "Synthesizing with citations",
    blurb:
      "Streaming generation, parsing `[N]` markers as the tokens come in, scroll-to-source affordances, and the repetition-detector that keeps a small model honest.",
    readingMinutes: 7,
  },
  {
    number: 5,
    slug: "the-loop",
    title: "Putting it together",
    blurb:
      "The phase state machine that wires plan → retrieve → synthesize, error recovery, and the demo you can run.",
    readingMinutes: 5,
  },
];

export function getLesson(slug: string): Lesson | undefined {
  return CURRICULUM.find((l) => l.slug === slug);
}

export function getNextLesson(currentSlug: string): Lesson | undefined {
  const idx = CURRICULUM.findIndex((l) => l.slug === currentSlug);
  return idx >= 0 && idx < CURRICULUM.length - 1 ? CURRICULUM[idx + 1] : undefined;
}

export function getPrevLesson(currentSlug: string): Lesson | undefined {
  const idx = CURRICULUM.findIndex((l) => l.slug === currentSlug);
  return idx > 0 ? CURRICULUM[idx - 1] : undefined;
}
