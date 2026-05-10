import { useEffect, useState } from "react";

export interface TocHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

interface TableOfContentsProps {
  headings: TocHeading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (headings.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <aside className="hidden xl:block w-56 shrink-0">
      <div className="sticky top-6 px-5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[color:var(--color-on-surface-variant)] mb-3">
          On this page
        </p>
        <ul className="space-y-0.5 border-l border-[color:var(--color-outline-variant)]">
          {headings.map((h) => (
            <li key={h.id} className={h.level === 3 ? "pl-3" : ""}>
              <a
                href={`#${h.id}`}
                className={`block text-sm pl-3 py-1 -ml-px border-l-2 transition-all ${
                  activeId === h.id
                    ? "text-[color:var(--color-primary)] font-medium border-[color:var(--color-primary)]"
                    : "text-[color:var(--color-on-surface-variant)] hover:text-[color:var(--color-on-surface)] border-transparent hover:border-[color:var(--color-outline)]"
                }`}
              >
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
