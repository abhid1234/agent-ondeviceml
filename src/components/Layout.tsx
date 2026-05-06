import { Link, Outlet } from "react-router";

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-[color:var(--color-outline-variant)] bg-[color:var(--color-surface)]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-base font-bold tracking-tight">ondeviceml</span>
            <span className="text-base font-light text-[color:var(--color-on-surface-variant)]">/</span>
            <span className="text-base font-semibold text-[color:var(--color-primary)]">research</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link
              to="/research"
              className="text-[color:var(--color-on-surface-variant)] hover:text-[color:var(--color-primary)] transition-colors"
            >
              Research
            </Link>
            <a
              href="https://ondeviceml.space"
              className="text-[color:var(--color-on-surface-variant)] hover:text-[color:var(--color-primary)] transition-colors"
            >
              ondeviceml.space ↗
            </a>
            <a
              href="https://github.com/abhid1234/agent-ondeviceml"
              target="_blank"
              rel="noopener"
              className="text-[color:var(--color-on-surface-variant)] hover:text-[color:var(--color-primary)] transition-colors"
            >
              GitHub ↗
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-[color:var(--color-outline-variant)] bg-[color:var(--color-surface)] py-6">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between text-sm text-[color:var(--color-on-surface-variant)]">
          <p>
            Agentic research, fully on-device. Part of the{" "}
            <a href="https://ondeviceml.space" className="underline hover:text-[color:var(--color-primary)]">
              ondeviceml
            </a>{" "}
            family.
          </p>
          <p>Apache 2.0</p>
        </div>
      </footer>
    </div>
  );
}
