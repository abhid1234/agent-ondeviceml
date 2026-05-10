import { LessonLayout } from "../components/curriculum/LessonLayout";
import { getLesson } from "../data/curriculum";

const HEADINGS = [
  { id: "the-cors-problem", text: "The CORS problem", level: 2 as const },
  { id: "wikipedia-action-api", text: "Wikipedia's Action API", level: 2 as const },
  { id: "snippet-shape", text: "The snippet shape", level: 2 as const },
  { id: "timeouts-and-errors", text: "Timeouts and errors", level: 2 as const },
];

export function Component() {
  const lesson = getLesson("retrieval")!;
  return (
    <LessonLayout lesson={lesson} headings={HEADINGS}>
      <p className="lead">
        On-device retrieval has two constraints: it has to run from a static
        page (no server) and it has to come back fast enough that a 6-second
        cap is comfortable. Wikipedia's Action API satisfies both — and gives
        you cleaner snippets than scraping.
      </p>

      <h2 id="the-cors-problem">The CORS problem</h2>
      <p>
        Browsers refuse cross-origin requests unless the target server says
        yes. That single rule rules out most of the search-engine APIs you'd
        reach for first: Google, Bing, Brave, Kagi — none of them serve a{" "}
        <code>Access-Control-Allow-Origin</code> header for arbitrary
        callers. Their answer to "I want to call you from a static page" is
        "use a server."
      </p>
      <p>
        The other natural reflex — "I'll just fetch the page and parse the
        HTML" — fails for the same reason, plus a worse one: most sites send
        an HTML shell with no content and hydrate with JavaScript. By the
        time you'd get rendered text, you're running a headless browser, and
        we're back to "use a server."
      </p>
      <p>
        That leaves APIs that explicitly serve browsers. Wikipedia is the
        rare excellent one: open data, generous CORS, structured responses,
        decent recall on common topics. For an educational research agent,
        it's exactly the right floor.
      </p>

      <h2 id="wikipedia-action-api">Wikipedia's Action API</h2>
      <p>
        The endpoint is <code>https://en.wikipedia.org/w/api.php</code>. We
        use one operation: <code>action=query</code> with a search generator,
        which returns the top N article titles plus extracted intro
        paragraphs in a single round-trip:
      </p>
      <pre><code>{`const params = new URLSearchParams({
  action: "query",
  format: "json",
  generator: "search",
  gsrsearch: subquery,
  gsrlimit: "3",
  prop: "extracts|info",
  exintro: "1",
  explaintext: "1",
  inprop: "url",
  origin: "*",
});
const res = await fetch(\`https://en.wikipedia.org/w/api.php?\${params}\`);`}</code></pre>
      <p>
        Two flags matter. <code>origin=*</code> tells Wikipedia to send a
        permissive CORS header — without it, Chromium blocks the response.{" "}
        <code>exintro=1</code> + <code>explaintext=1</code> asks for plain-text
        intro paragraphs only, not full article HTML — about 500–1500 chars
        per result, which is the right size to slot into a synthesizer
        context.
      </p>

      <h2 id="snippet-shape">The snippet shape</h2>
      <p>
        Each search result becomes a snippet with four fields:
      </p>
      <pre><code>{`type Snippet = {
  id: string;        // stable: "wiki:" + pageid
  title: string;     // article title, used as link text
  url: string;       // canonical Wikipedia URL
  body: string;      // first 800 chars of the intro extract
};`}</code></pre>
      <p>
        We keep <code>body</code> short on purpose. The synthesizer prompt
        glues every snippet into the context window in the form{" "}
        <code>[1] {`{title}`}: {`{body}`}</code>. With three subqueries
        × three results × ~800 chars, we land around 7 KB of evidence — well
        inside a 1.5B model's effective window, with room left for the
        question and the system prompt.
      </p>
      <p>
        The <code>id</code> field is what the citation badges resolve
        against. When the synthesizer emits <code>[2]</code>, the UI looks up
        snippet index 2 and renders a clickable badge that scrolls the
        retrieval drawer to the matching card. URLs are not in the prompt at
        all — we ask the model for indices, not links, because indices are
        cheap tokens and links are expensive ones the model gets wrong.
      </p>

      <h2 id="timeouts-and-errors">Timeouts and errors</h2>
      <p>
        Each subquery gets its own 6-second timeout via{" "}
        <code>AbortController</code>. If Wikipedia is slow, or a subquery
        returns nothing, we fail soft: drop that one, keep the others. The
        synthesizer doesn't need every snippet — it needs enough.
      </p>
      <p>
        The retrieval drawer surfaces what we got and what we missed in the
        same panel. A user who sees "2 of 3 subqueries returned" can decide:
        retry the missing one, edit the plan, or just accept the answer. The
        philosophy throughout the loop is the same: never let a partial
        failure block the whole pipeline. Show what works.
      </p>
    </LessonLayout>
  );
}
