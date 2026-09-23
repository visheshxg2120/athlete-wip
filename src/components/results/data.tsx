import Link from "next/link";

import { getAthlete, getSchool, type Medal } from "@/lib/results";
import { cn } from "@/lib/utils";

// Small building blocks shared by the results pages.

/** Summary chip: big value over a small label, like "57 / RACES". */
export function Chip({ value, label, tone = "neutral" }: { value: React.ReactNode; label: string; tone?: "neutral" | "volt" | "ink" }) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col rounded-xl border px-3.5 py-2.5",
        tone === "neutral" && "bg-surface",
        tone === "volt" && "border-volt bg-volt",
        tone === "ink" && "border-ink bg-ink text-white",
      )}
    >
      <span className="truncate text-lg font-semibold leading-tight tabular-nums">{value}</span>
      <span className={cn("eyebrow mt-0.5 text-[0.65rem]", tone === "ink" ? "text-white/60" : "text-muted")}>{label}</span>
    </div>
  );
}

export function StatTile({ label, value, sub }: { label: string; value: React.ReactNode; sub?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border bg-surface p-5">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">{value}</p>
      {sub ? <p className="mt-1 text-sm text-muted">{sub}</p> : null}
    </div>
  );
}

/** `compact` drops the minimum width so short tables fit a phone without scrolling. */
export function TableCard({ children, className, compact }: { children: React.ReactNode; className?: string; compact?: boolean }) {
  return (
    <div className={cn("overflow-x-auto rounded-2xl border bg-surface", className)}>
      <table className={cn("w-full border-collapse text-left text-sm [&_tbody_tr:last-child_td]:border-0", !compact && "min-w-[32rem]")}>{children}</table>
    </div>
  );
}

export function Th({ children, className, numeric }: { children?: React.ReactNode; className?: string; numeric?: boolean }) {
  return (
    <th scope="col" className={cn("eyebrow border-b px-3 py-3 font-normal text-muted sm:px-4", numeric && "text-right", className)}>
      {children}
    </th>
  );
}

export function Td({ children, className, numeric }: { children?: React.ReactNode; className?: string; numeric?: boolean }) {
  return <td className={cn("border-b px-3 py-3 sm:px-4", numeric && "text-right tabular-nums", className)}>{children}</td>;
}

export function AthleteLink({ id, showSchool = true }: { id: string; showSchool?: boolean }) {
  const a = getAthlete(id);
  if (!a) return <span>Unknown</span>;
  return (
    <span className="flex flex-col">
      {a.profile ? (
        <Link href={`/results/athletes/${a.id}`} className="font-medium text-indigo hover:underline">
          {a.name}
        </Link>
      ) : (
        <span className="font-medium">{a.name}</span>
      )}
      {showSchool ? <span className="text-xs text-muted">{getSchool(a.schoolId).name}</span> : null}
    </span>
  );
}

const MEDAL_STYLE: Record<Medal, string> = {
  gold: "bg-[#E6B422]",
  silver: "bg-[#A9AEB9]",
  bronze: "bg-[#B8743A]",
};

/** Medal marker: coloured dot plus the word, so it never relies on colour alone. */
export function MedalBadge({ medal }: { medal?: Medal }) {
  if (!medal) return null;
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium capitalize text-ink">
      <span className={cn("size-2.5 rounded-full", MEDAL_STYLE[medal])} aria-hidden />
      {medal}
    </span>
  );
}

export function Place({ place }: { place: number }) {
  return (
    <span className={cn("inline-grid size-7 place-items-center rounded-full text-xs font-semibold tabular-nums", place <= 3 ? "bg-ink text-white" : "bg-ink/5 text-ink")}>
      {place}
    </span>
  );
}

export function Pill({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "volt" | "indigo" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        tone === "neutral" && "bg-ink/5 text-ink",
        tone === "volt" && "bg-volt text-ink",
        tone === "indigo" && "bg-indigo/10 text-indigo",
      )}
    >
      {children}
    </span>
  );
}
