import Link from "next/link";

import { PageHero } from "@/components/ui/page-hero";
import { results } from "@/lib/results";
import { cn } from "@/lib/utils";

const TABS = [
  { label: "Overview", href: "/results" },
  { label: "Athletes", href: "/results/athletes" },
] as const;

// Shared frame for every /results page: dark hero, sub-navigation and the
// sample-data notice.
export function ResultsShell({
  eyebrow,
  title,
  intro,
  active,
  heroExtra,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  active?: (typeof TABS)[number]["label"];
  heroExtra?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} intro={intro}>
        {heroExtra}
      </PageHero>
      <div className="sticky top-0 z-30 border-b bg-paper/90 backdrop-blur">
        <nav aria-label="Results" className="shell flex h-14 items-center gap-1 overflow-x-auto">
          {TABS.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              aria-current={active === t.label ? "page" : undefined}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                active === t.label ? "bg-ink text-white" : "text-muted hover:bg-ink/5 hover:text-ink",
              )}
            >
              {t.label}
            </Link>
          ))}
          {results.sample ? (
            <span className="eyebrow ml-auto shrink-0 rounded-full bg-indigo/10 px-3 py-1 text-indigo">Sample data</span>
          ) : null}
        </nav>
      </div>
      {results.sample ? (
        <div className="shell pt-8">
          <p className="rounded-xl border border-indigo/20 bg-indigo/5 px-4 py-3 text-sm text-ink">
            <strong className="font-semibold">Demo data.</strong> Athletes, schools and results on these pages are
            generated examples that show how the dashboard works. Real results replace them once they&apos;re published.
          </p>
        </div>
      ) : null}
      <div className="py-12 md:py-16">{children}</div>
    </>
  );
}

export function Section({
  title,
  description,
  action,
  children,
  className,
}: {
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("shell mt-14 first:mt-0", className)}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="display text-3xl md:text-4xl">{title}</h2>
          {description ? <p className="mt-2 max-w-2xl text-muted">{description}</p> : null}
        </div>
        {action}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}
