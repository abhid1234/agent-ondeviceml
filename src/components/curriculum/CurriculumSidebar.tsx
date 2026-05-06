import { NavLink } from "react-router";
import { CURRICULUM } from "../../data/curriculum";

export function CurriculumSidebar() {
  return (
    <aside className="hidden lg:block w-60 shrink-0 border-r border-[color:var(--color-outline-variant)] bg-[color:var(--color-surface)]">
      <div className="sticky top-0 px-5 py-6">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[color:var(--color-on-surface-variant)] mb-3">
          Curriculum
        </p>
        <ol className="space-y-1">
          {CURRICULUM.map((lesson) => (
            <li key={lesson.slug}>
              <NavLink
                to={`/lessons/${lesson.slug}`}
                className={({ isActive }) =>
                  `flex gap-2 px-2 py-1.5 rounded-md text-sm transition-colors ${
                    isActive
                      ? "bg-[color:var(--color-primary-container)] text-[color:var(--color-on-primary-container)] font-medium"
                      : "text-[color:var(--color-on-surface-variant)] hover:bg-[color:var(--color-surface-container)] hover:text-[color:var(--color-on-surface)]"
                  }`
                }
              >
                <span className="tabular-nums text-[color:var(--color-outline)] shrink-0 w-4">
                  {lesson.number}
                </span>
                <span className="truncate">{lesson.title}</span>
              </NavLink>
            </li>
          ))}
        </ol>

        <div className="mt-6 pt-4 border-t border-[color:var(--color-outline-variant)]">
          <NavLink
            to="/demo"
            className={({ isActive }) =>
              `flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors ${
                isActive
                  ? "bg-[color:var(--color-tertiary-container)] text-[color:var(--color-tertiary)] font-medium"
                  : "text-[color:var(--color-on-surface-variant)] hover:bg-[color:var(--color-surface-container)] hover:text-[color:var(--color-on-surface)]"
              }`
            }
          >
            <span aria-hidden className="shrink-0 w-4">→</span>
            <span>Live demo</span>
          </NavLink>
        </div>
      </div>
    </aside>
  );
}
