"use client";

import { ButtonLink } from "@/components/ui/button-link";
import { ArrowRight } from "@/components/ui/icons";
import { LeagueCard } from "@/components/ui/league-card";
import { groupLeagues } from "@/lib/league-status";
import { useToday } from "@/lib/use-today";
import type { League } from "@/types/content";

// Leagues grouped by what's happening now, what's next and what's done.
export function LeaguesBoard({ leagues }: { leagues: League[] }) {
  const { live, upcoming, past } = groupLeagues(leagues, useToday());

  return (
    <div className="shell space-y-20">
      {live.length ? (
        <Group title="Happening now" count={live.length}>
          {live.map(({ league }) => (
            <LeagueCard key={league.slug} league={league} className="md:col-span-2 lg:col-span-3 lg:min-h-[28rem]" />
          ))}
        </Group>
      ) : null}

      <Group title="Coming up" count={upcoming.length}>
        {upcoming.length ? (
          upcoming.map(({ league }, i) => (
            <LeagueCard
              key={league.slug}
              league={league}
              className={i === 0 ? "md:col-span-2 lg:min-h-[28rem]" : undefined}
            />
          ))
        ) : (
          <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-dashed border-ink/20 p-8 md:col-span-2 md:flex-row md:items-center lg:col-span-3">
            <div>
              <p className="display text-3xl md:text-4xl">Next season is being scheduled</p>
              <p className="mt-2 max-w-xl text-muted">
                No leagues are open for registration right now. Tell us about your school and
                we&apos;ll let you know as soon as the next one opens.
              </p>
            </div>
            <ButtonLink href="/contact" variant="ink" className="shrink-0">
              Register interest
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </ButtonLink>
          </div>
        )}
      </Group>

      <Group title="Past leagues" count={past.length}>
        {past.map(({ league }) => (
          <LeagueCard key={league.slug} league={league} showStatus={false} />
        ))}
      </Group>
    </div>
  );
}

function Group({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <section>
      <div className="flex items-baseline gap-3 border-b pb-4">
        <h2 className="display text-4xl md:text-5xl">{title}</h2>
        <span className="eyebrow text-muted">{String(count).padStart(2, "0")}</span>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{children}</div>
    </section>
  );
}
