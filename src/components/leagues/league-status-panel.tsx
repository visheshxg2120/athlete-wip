"use client";

import { ButtonLink } from "@/components/ui/button-link";
import { ArrowRight } from "@/components/ui/icons";
import { LeagueStatusBadge } from "@/components/ui/league-status-badge";
import { getLeagueStatus } from "@/lib/league-status";
import { useToday } from "@/lib/use-today";
import type { League } from "@/types/content";

// Status line and call to action for a league page. Both change with the date:
// register while registration is open, enquire before it starts, and look back
// (photos, next season) once it's done.
export function LeagueStatusPanel({ league }: { league: League }) {
  const status = getLeagueStatus(league, useToday());
  const hasPhotos = league.photos.length > 0;

  const actions = {
    registration: { primary: "Register your school", secondary: undefined },
    upcoming: { primary: "Enquire about this league", secondary: undefined },
    live: { primary: "Contact the organisers", secondary: undefined },
    completed: { primary: "Register for next season", secondary: hasPhotos ? "See the photos" : undefined },
  }[status.kind];

  return (
    <div className="mt-10">
      <div className="flex flex-wrap items-center gap-3">
        <LeagueStatusBadge league={league} />
        {status.note ? <span className="text-sm text-white/80">{status.note}</span> : null}
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <ButtonLink href="/contact" variant={status.kind === "completed" ? "outline" : "volt"}>
          {actions.primary}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </ButtonLink>
        {actions.secondary ? (
          <ButtonLink href="#photos" variant="volt" className="-order-1">
            {actions.secondary}
          </ButtonLink>
        ) : null}
      </div>
    </div>
  );
}
