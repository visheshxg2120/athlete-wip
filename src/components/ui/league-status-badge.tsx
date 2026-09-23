"use client";

import { getLeagueStatus, type LeagueStatus } from "@/lib/league-status";
import { cn } from "@/lib/utils";
import { useToday } from "@/lib/use-today";
import type { League } from "@/types/content";

const styles: Record<LeagueStatus["kind"], string> = {
  live: "bg-volt text-ink",
  registration: "bg-volt text-ink",
  upcoming: "bg-white text-ink",
  completed: "bg-ink/60 text-white/80 ring-1 ring-inset ring-white/15 backdrop-blur",
};

// Status pill, worked out from today's date in the visitor's browser.
export function LeagueStatusBadge({ league, className }: { league: League; className?: string }) {
  const status = getLeagueStatus(league, useToday());

  return (
    <span
      className={cn(
        "eyebrow inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[0.7rem]",
        styles[status.kind],
        className,
      )}
    >
      {status.kind === "live" ? (
        <span className="relative flex size-2">
          <span className="absolute inset-0 animate-ping rounded-full bg-ink/60" />
          <span className="relative size-2 rounded-full bg-ink" />
        </span>
      ) : null}
      {status.label}
    </span>
  );
}
