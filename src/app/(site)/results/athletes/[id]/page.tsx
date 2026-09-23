import Link from "next/link";
import { notFound } from "next/navigation";

import { AthleteHeader } from "@/components/results/athlete-header";
import { AthleteLink, Chip } from "@/components/results/data";
import { FilterList } from "@/components/results/filter-list";
import { ParticipationCard } from "@/components/results/participation";
import { Tabs } from "@/components/results/tabs";
import {
  athleteRankings,
  getAthlete,
  participationsOf,
  personalBests,
  podiumsOf,
  profiledAthletes,
  teammatesOf,
  venuesOf,
} from "@/lib/results";

export function generateStaticParams() {
  return profiledAthletes.map((a) => ({ id: a.id }));
}

export async function generateMetadata(props: PageProps<"/results/athletes/[id]">) {
  const { id } = await props.params;
  const a = getAthlete(id);
  return { title: a ? `${a.name} · Athlete` : "Athlete", robots: { index: false } };
}

export default async function AthletePage(props: PageProps<"/results/athletes/[id]">) {
  const { id } = await props.params;
  const athlete = getAthlete(id);
  if (!athlete?.profile) notFound();

  const ps = participationsOf(id);
  const sports = [...new Set(ps.map((p) => p.edition.sport))];
  const seasons = new Set(ps.map((p) => p.edition.season));
  const rank = athleteRankings().find((r) => r.id === id)!.rank;
  const sum = (f: (p: (typeof ps)[number]) => number) => ps.reduce((n, p) => n + f(p), 0);
  const goals = sum((p) => (p.kind === "football" ? p.goals : 0));
  const runs = sum((p) => (p.kind === "cricket" ? p.runs : 0));
  const wickets = sum((p) => (p.kind === "cricket" ? p.wickets : 0));
  const events = sum((p) => (p.kind === "track" ? p.entries.length : 0));
  const titles = ps.filter((p) => ((p.kind === "football" || p.kind === "cricket") && p.teamPlace === 1) || (p.kind === "gymnastics" && p.place === 1)).length;
  const teammates = teammatesOf(id);
  const bests = personalBests(id);
  const venues = venuesOf(id);

  return (
    <>
      <nav aria-label="Breadcrumb" className="eyebrow flex gap-2 text-[0.7rem] text-muted">
        <Link href="/results" className="hover:text-ink">Results</Link>/
        <Link href="/results/athletes" className="hover:text-ink">Athletes</Link>/
        <span className="text-ink">{athlete.name}</span>
      </nav>
      <div className="mt-5">
        <AthleteHeader athlete={athlete} sports={sports} />
      </div>

      <div className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-4 xl:grid-cols-7">
        <Chip value={`#${rank}`} label="Ranking" tone="ink" />
        {titles ? <Chip value={titles} label={titles === 1 ? "Title" : "Titles"} tone="volt" /> : null}
        <Chip value={podiumsOf(ps)} label="Podiums" />
        <Chip value={ps.length} label="Leagues" />
        <Chip value={seasons.size} label="Seasons" />
        {events ? <Chip value={events} label="Events" /> : null}
        {goals ? <Chip value={goals} label="Goals" /> : null}
        {runs ? <Chip value={runs} label="Runs" /> : null}
        {wickets ? <Chip value={wickets} label="Wickets" /> : null}
        <Chip value={teammates.length} label="Teammates" />
      </div>

      <div className="mt-10">
        <Tabs
          tabs={[
            {
              label: `Results · ${ps.length}`,
              content: (
                <FilterList
                  items={ps.map((p) => ({ key: p.edition.slug, sport: p.edition.sport, season: p.edition.season, node: <ParticipationCard p={p} athleteId={id} /> }))}
                />
              ),
            },
            {
              label: "Personal bests",
              content: (
                <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {bests.map((b) => (
                    <li key={b.label} className="rounded-2xl border bg-surface p-4">
                      <p className="eyebrow text-[0.65rem] text-muted">{b.label}</p>
                      <p className="mt-1 text-2xl font-semibold tabular-nums">{b.value}</p>
                      <p className="mt-1 text-sm text-muted">{b.detail}</p>
                      <Link href={`/results/athletes/${id}/${b.edition.slug}`} className="mt-3 inline-block text-xs font-medium text-indigo hover:underline">
                        {b.edition.name} {b.edition.season}
                      </Link>
                    </li>
                  ))}
                </ul>
              ),
            },
            {
              label: `Teammates · ${teammates.length}`,
              content: (
                <div>
                  <p className="text-sm text-muted">Squad-mates, and schoolmates who competed in the same league.</p>
                  <ul className="mt-4 divide-y rounded-2xl border bg-surface">
                    {teammates.map((t) => (
                      <li key={t.athleteId} className="flex items-center justify-between gap-4 px-4 py-3">
                        <AthleteLink id={t.athleteId} showSchool={false} />
                        <span className="text-right text-xs text-muted">
                          {t.editions.length} league{t.editions.length === 1 ? "" : "s"} together
                          <span className="hidden sm:inline"> · {t.editions.map((e) => `${e.sport} ${e.season}`).join(", ")}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ),
            },
            {
              label: "Venues",
              content: (
                <ul className="divide-y rounded-2xl border bg-surface">
                  {venues.map((v) => (
                    <li key={v.venue} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                      <span className="font-medium">{v.venue}</span>
                      <span className="flex flex-wrap gap-2">
                        {v.editions.map((e) => (
                          <Link key={e.slug} href={`/results/athletes/${id}/${e.slug}`} className="rounded-full bg-ink/5 px-2.5 py-0.5 text-xs hover:bg-ink/10">
                            {e.sport} {e.season}
                          </Link>
                        ))}
                      </span>
                    </li>
                  ))}
                </ul>
              ),
            },
          ]}
        />
      </div>

      <p className="mt-10 text-sm text-muted">
        This profile is public because the athlete&apos;s parents opted in. It shows a first name and surname initial only. Parents
        can ask for it to be hidden at any time by contacting Athleta.
      </p>
    </>
  );
}
