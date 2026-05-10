import { LessonLayout } from "../components/curriculum/LessonLayout";
import { getLesson } from "../data/curriculum";

const HEADINGS = [
  { id: "premise", text: "The premise", level: 2 as const },
  { id: "what-well-build", text: "What we'll build", level: 2 as const },
  { id: "what-youll-need", text: "What you'll need", level: 2 as const },
  { id: "the-shape-of-the-thing", text: "The shape of the thing", level: 2 as const },
];

export function Component() {
  const lesson = getLesson("introduction")!;
  return (
    <LessonLayout lesson={lesson} headings={HEADINGS}>
      <p className="lead">
        We're going to build a research agent that runs entirely in your
        browser. No server. No API key. The model lives in your browser tab,
        the search runs against Wikipedia's public API, and the answer streams
        back with citations — all on a 1.5B-parameter model that fits in 1.6 GB
        of RAM.
      </p>

      <h2 id="premise">The premise</h2>
      <p>
        The bet here is that small models — sub-2B, quantized, running on
        hardware you already paid for — are now good enough for{" "}
        <em>structured</em> tasks. Not open-ended chat. But: turn a question
        into a plan, score retrieved snippets, write a paragraph that cites
        them. The kind of work where the model is one component in a loop, not
        the whole app.
      </p>
      <p>That bet hinges on three shifts that all landed inside the last 18 months:</p>
      <ul>
        <li>
          Gemma 3, Qwen 2.5, and friends pulled the small-model floor up to
          where 1.5B is genuinely usable for instruction-following.
        </li>
        <li>
          WebGPU shipped on every major Chromium browser, so a model can use
          the GPU without a native install or a driver flag.
        </li>
        <li>
          MediaPipe Tasks GenAI started shipping a streaming-token, browser-native
          runtime that fits inside a tab.
        </li>
      </ul>
      <p>
        Stack those three, and the math changes. No server. No API key. No
        per-token bill. The user's question never leaves their machine. The
        model lives in the page; the page browses Wikipedia from the page; the
        answer renders in the page.
      </p>
      <p>
        That's the desktop-AI moment, in a tab. This site is what falls out the
        other side.
      </p>

      <h2 id="what-well-build">What we'll build</h2>
      <p>A research agent with three phases:</p>
      <ol>
        <li>
          <strong>Plan.</strong> The user types a question. The model returns
          JSON: 2–4 subqueries plus a synthesis approach. We pause here so you
          can edit the plan before any compute runs.
        </li>
        <li>
          <strong>Retrieve.</strong> Each subquery hits the Wikipedia Action
          API. Snippets come back with article titles and URLs. No CORS dance,
          no proxy — Wikipedia serves browsers directly.
        </li>
        <li>
          <strong>Synthesize.</strong> The model gets the snippets and writes a
          cited answer. <code>[N]</code> markers stream in token-by-token; we
          parse them as they arrive and turn them into clickable citations.
        </li>
      </ol>
      <p>
        That's the whole loop. The interesting parts are the seams: how the
        JSON-shaped plan stays valid when a small model occasionally
        hallucinates a closing brace, how the streaming parser recovers when{" "}
        <code>[3</code> arrives without <code>]</code> yet, how we detect when
        the model has started looping and cancel the stream before the user
        sees garbage.
      </p>
      <p>Each lesson is one of those seams.</p>

      <h2 id="what-youll-need">What you'll need</h2>
      <ul>
        <li>A modern Chromium-based browser (Chrome 113+, Edge)</li>
        <li>Roughly 2 GB of free RAM for the model</li>
        <li>A first-time download of ~1.6 GB (cached after that)</li>
      </ul>
      <p>
        No cloud account, no install, no CLI. Everything runs in this tab.
      </p>

      <h2 id="the-shape-of-the-thing">The shape of the thing</h2>
      <p>Five lessons, ordered the way the system runs at runtime:</p>
      <ol>
        <li>
          <strong>Loading a model in the browser.</strong> Why MediaPipe over
          Transformers.js for this use case. The blob-URL trick. WebGPU
          primary, WASM fallback.
        </li>
        <li>
          <strong>Planning the search.</strong> JSON output from a small model.
          Few-shot prompting. The recovery path when parsing fails.
        </li>
        <li>
          <strong>Retrieving from Wikipedia.</strong> The Action API.
          Per-subquery timeouts. The snippet shape that makes citations cheap.
        </li>
        <li>
          <strong>Synthesizing with citations.</strong> Streaming generation.
          The <code>[N]</code> convention. The repetition detector.
        </li>
        <li>
          <strong>Putting it together.</strong> The phase state machine. Where
          the human steps in. Error recovery.
        </li>
      </ol>
      <p>
        Then the demo. Same code you've just read, running on a model you load
        yourself.
      </p>
    </LessonLayout>
  );
}
