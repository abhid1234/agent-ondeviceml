import type { ReactNode } from "react";
import { Link } from "react-router";
import type { Lesson } from "../../data/curriculum";
import { getNextLesson, getPrevLesson } from "../../data/curriculum";
import { TableOfContents, type TocHeading } from "./TableOfContents";

interface LessonLayoutProps {
  lesson: Lesson;
  headings: TocHeading[];
  children: ReactNode;
}

export function LessonLayout({ lesson, headings, children }: LessonLayoutProps) {
  const next = getNextLesson(lesson.slug);
  const prev = getPrevLesson(lesson.slug);

  return (
    <div className="flex max-w-7xl mx-auto">
      <article className="flex-1 min-w-0 px-6 lg:px-12 py-10 max-w-3xl">
        <header className="mb-10 pb-6 border-b border-[color:var(--color-outline-variant)]">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[color:var(--color-primary)] mb-3 flex items-center gap-2">
            <span>Lesson {lesson.number}</span>
            <span className="text-[color:var(--color-outline-variant)]">·</span>
            <span className="text-[color:var(--color-on-surface-variant)] font-normal tracking-normal normal-case">{lesson.readingMinutes} min read</span>
          </p>
          <h1 className="text-4xl font-bold tracking-tight mb-3">{lesson.title}</h1>
          <p className="text-base text-[color:var(--color-on-surface-variant)]">
            {lesson.blurb}
          </p>
        </header>

        <div className="prose-content">
          {children}
        </div>

        <nav className="mt-16 pt-8 border-t border-[color:var(--color-outline-variant)] grid grid-cols-2 gap-4">
          <div>
            {prev ? (
              <Link
                to={`/lessons/${prev.slug}`}
                className="group block p-4 rounded-xl border border-[color:var(--color-outline-variant)] transition-all hover:-translate-y-0.5 hover:border-[color:var(--color-outline)] hover:shadow-sm"
              >
                <p className="text-xs text-[color:var(--color-on-surface-variant)] mb-1 inline-flex items-center gap-1">
                  <span className="inline-block transition-transform group-hover:-translate-x-1">←</span>
                  Lesson {prev.number}
                </p>
                <p className="text-sm font-semibold">{prev.title}</p>
              </Link>
            ) : (
              <Link
                to="/"
                className="group block p-4 rounded-xl border border-[color:var(--color-outline-variant)] transition-all hover:-translate-y-0.5 hover:border-[color:var(--color-outline)] hover:shadow-sm"
              >
                <p className="text-xs text-[color:var(--color-on-surface-variant)] mb-1 inline-flex items-center gap-1">
                  <span className="inline-block transition-transform group-hover:-translate-x-1">←</span>
                  Back to
                </p>
                <p className="text-sm font-semibold">Curriculum</p>
              </Link>
            )}
          </div>
          <div>
            {next ? (
              <Link
                to={`/lessons/${next.slug}`}
                className="group block p-4 rounded-xl border border-[color:var(--color-outline-variant)] transition-all hover:-translate-y-0.5 hover:border-[color:var(--color-outline)] hover:shadow-sm text-right"
              >
                <p className="text-xs text-[color:var(--color-on-surface-variant)] mb-1 inline-flex items-center gap-1 justify-end">
                  Lesson {next.number}
                  <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                </p>
                <p className="text-sm font-semibold">{next.title}</p>
              </Link>
            ) : (
              <Link
                to="/demo"
                className="group block p-4 rounded-xl border border-[color:var(--color-primary)] bg-[color:var(--color-primary-container)] text-[color:var(--color-on-primary-container)] transition-all hover:-translate-y-0.5 hover:shadow-md text-right"
              >
                <p className="text-xs mb-1 inline-flex items-center gap-1 justify-end">
                  Try it
                  <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                </p>
                <p className="text-sm font-semibold">Live demo</p>
              </Link>
            )}
          </div>
        </nav>
      </article>

      <TableOfContents headings={headings} />
    </div>
  );
}
