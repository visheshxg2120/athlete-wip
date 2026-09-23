import Link from "next/link";

import { cn } from "@/lib/utils";

type Crumb = { label: string; href?: string };

/** Breadcrumb, title and optional chips/actions at the top of a results page. */
export function PageHead({
  crumbs,
  title,
  description,
  aside,
  children,
}: {
  crumbs: Crumb[];
  title: React.ReactNode;
  description?: React.ReactNode;
  aside?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <header>
      <nav aria-label="Breadcrumb">
        <ol className="eyebrow flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.7rem] text-muted">
          {crumbs.map((c, i) => (
            <li key={c.label} className="flex items-center gap-2">
              {i ? <span aria-hidden>/</span> : null}
              {c.href ? (
                <Link href={c.href} className="hover:text-ink">
                  {c.label}
                </Link>
              ) : (
                <span aria-current="page" className="text-ink">
                  {c.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="display text-4xl md:text-5xl">{title}</h1>
          {description ? <p className="mt-3 max-w-2xl text-muted">{description}</p> : null}
        </div>
        {aside}
      </div>
      {children ? <div className="mt-6">{children}</div> : null}
    </header>
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
    <section className={cn("mt-12", className)}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="display text-2xl md:text-3xl">{title}</h2>
          {description ? <p className="mt-2 max-w-2xl text-sm text-muted">{description}</p> : null}
        </div>
        {action}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}
