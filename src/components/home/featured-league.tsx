"use client";

import Link from "next/link";

import { ArrowUpRight, Calendar, Pin } from "@/components/ui/icons";
import { getLeagueStatus, leagueDates, pickFeatured } from "@/lib/league-status";
import { useToday } from "@/lib/use-today";
import type { League } from "@/types/content";

const labels = {
  live: "Happening now",
  registration: "Registration open",
  upcoming: "Up next",
  completed: "Latest league",
} as const;

// Hero card for the most relevant league: live, else next up, else most recent.
export function FeaturedLeague({ leagues }: { leagues: League[] }) {
  const today = useToday();
  const league = pickFeatured(leagues, today);
  const status = getLeagueStatus(league, today);
  const dates = leagueDates(league);

  return (
    <Link
      href={`/leagues/${league.slug}`}
      className="group relative -mt-16 ml-auto block w-[88%] rounded-2xl border border-line-inverse bg-ink-2/90 p-5 backdrop-blur-md transition-colors hover:border-volt/60"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="eyebrow rounded-full bg-volt px-2.5 py-1 text-ink">{labels[status.kind]}</span>
        <ArrowUpRight className="size-5 text-white/60 transition-colors group-hover:text-volt" />
      </div>
      <p className="display mt-4 text-3xl">{league.shortName}</p>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-inverse">
        {dates ? (
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="size-4" />
            {dates}
          </span>
        ) : null}
        <span className="inline-flex items-center gap-1.5">
          <Pin className="size-4" />
          {league.location}
        </span>
      </div>
      {status.kind !== "completed" ? <p className="mt-3 text-sm font-medium text-volt">{status.note}</p> : null}
    </Link>
  );
}
