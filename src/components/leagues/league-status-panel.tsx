"use client";

import { ButtonLink } from "@/components/ui/button-link";
import { ArrowRight } from "@/components/ui/icons";
import { LeagueStatusBadge } from "@/components/ui/league-status-badge";
import { getLeagueStatus } from "@/lib/league-status";
import { useToday } from "@/lib/use-today";
import type { League } from "@/types/content";

// Status line and call to action for a league page. Both change with the date:
// register while registration is open, enquire before it starts, and look back
// (results, photos, next season) once it's done.
export function LeagueStatusPanel({ league, resultsHref }: { league: League; resultsHref?: string }) {
  const status = getLeagueStatus(league, useToday());

  // First action is the primary (volt) button; the rest are outlines.
  const actions: { label: string; href: string }[] = {
    registration: [{ label: "Register your school", href: "/contact" }],
    upcoming: [{ label: "Enquire about this league", href: "/contact" }],
    live: [
      { label: "Contact the organisers", href: "/contact" },
      ...(resultsHref ? [{ label: "Results so far", href: resultsHref }] : []),
    ],
    completed: [
      ...(resultsHref ? [{ label: "See results", href: resultsHref }] : []),
      ...(league.photos.length ? [{ label: "See the photos", href: "#photos" }] : []),
      { label: "Register for next season", href: "/contact" },
    ],
  }[status.kind];

  return (
    <div className="mt-10">
      <div className="flex flex-wrap items-center gap-3">
        <LeagueStatusBadge league={league} />
        {status.note ? <span className="text-sm text-white/80">{status.note}</span> : null}
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        {actions.map((a, i) => (
          <ButtonLink key={a.label} href={a.href} variant={i === 0 ? "volt" : "outline"}>
            {a.label}
            {i === 0 ? <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" /> : null}
          </ButtonLink>
        ))}
      </div>
    </div>
  );
}
