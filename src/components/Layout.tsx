import { Link, Outlet, useLocation } from "react-router";
import { CurriculumSidebar } from "./curriculum/CurriculumSidebar";

export function Layout() {
  const location = useLocation();
  // Sidebar shows on lesson + demo pages, not on the home landing
  const showSidebar =
    location.pathname.startsWith("/lessons") || location.pathname.startsWith("/demo");

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-[color:var(--color-outline-variant)] bg-[color:var(--color-surface)] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-base font-bold tracking-tight">ondeviceml</span>
            <span className="text-base font-light text-[color:var(--color-on-surface-variant)]">/</span>
            <span className="text-base font-semibold text-[color:var(--color-primary)]">research</span>
          </Link>
          <nav className="flex items-center gap-5 text-sm">
            <Link
              to="/"
              className="text-[color:var(--color-on-surface-variant)] hover:text-[color:var(--color-on-surface)] transition-colors"
            >
              Curriculum
            </Link>
            <Link
              to="/demo"
              className="text-[color:var(--color-on-surface-variant)] hover:text-[color:var(--color-on-surface)] transition-colors"
            >
              Demo
            </Link>
            <a
              href="https://github.com/abhid1234/agent-ondeviceml"
              target="_blank"
              rel="noopener"
              className="text-[color:var(--color-on-surface-variant)] hover:text-[color:var(--color-on-surface)] transition-colors"
            >
              GitHub ↗
            </a>
            <a
              href="https://ondeviceml.space"
              className="text-[color:var(--color-on-surface-variant)] hover:text-[color:var(--color-on-surface)] transition-colors"
            >
              ondeviceml.space ↗
            </a>
          </nav>
        </div>
      </header>

      <div className="flex-1 flex">
        {showSidebar && <CurriculumSidebar />}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>

      <footer className="border-t border-[color:var(--color-outline-variant)] bg-[color:var(--color-surface)] py-6 mt-12">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-sm text-[color:var(--color-on-surface-variant)]">
          <p>
            Understanding agentic browsing by building it from scratch. Part of the{" "}
            <a href="https://ondeviceml.space" className="underline hover:text-[color:var(--color-on-surface)]">
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
