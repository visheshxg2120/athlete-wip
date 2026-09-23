import type { Metadata } from "next";
import Link from "next/link";

import { CtaBand } from "@/components/layout/cta-band";
import { AthleteSearch } from "@/components/results/athlete-search";
import { AthleteLink, StatTile, TableCard, Td, Th } from "@/components/results/data";
import { ResultsShell, Section } from "@/components/results/results-shell";
import { ArrowRight } from "@/components/ui/icons";
import {
  athleteIndex,
  battingLeaders,
  champion,
  editions,
  formatMark,
  getSchool,
  gymRanking,
  KIND_LABEL,
  leaderTie,
  medalTable,
  participantCount,
  rankEvent,
  teamById,
  topScorers,
  totals,
} from "@/lib/results";
import type { Edition } from "@/types/results";

export const metadata: Metadata = {
  title: "Results",
  description: "Results, leaderboards and athlete profiles from every Athleta league.",
};

export default function ResultsPage() {
  const t = totals();
  const medals = medalTable().slice(0, 8);

  // One headline performance per edition.
  type Highlight = { edition: Edition; label: string; athleteId: string; value: string; sub: string };
  const highlights = editions.map((e): Highlight => {
    if (e.kind === "football") {
      const scorers = topScorers(e);
      const s = scorers[0];
      const tie = leaderTie(scorers, (x) => x.goals);
      return { edition: e, label: tie.count > 1 ? `Joint top scorer (${tie.count} players)` : "Top scorer", athleteId: s.athleteId, value: `${s.goals} goals`, sub: teamById(e, s.teamId).name };
    }
    if (e.kind === "cricket") {
      const b = battingLeaders(e)[0];
      return { edition: e, label: "Most runs", athleteId: b.athleteId, value: `${b.runs} runs`, sub: teamById(e, b.teamId).name };
    }
    if (e.kind === "track") {
      const ev = e.events.find((x) => x.name === "100m" && x.category === "U-14 Boys") ?? e.events[0];
      const r = rankEvent(ev)[0];
      return { edition: e, label: `Fastest ${ev.name} · ${ev.category}`, athleteId: r.athleteId, value: formatMark(r.mark, ev.measure), sub: "" };
    }
    const cat = e.categories[0];
    const r = gymRanking(e, cat)[0];
    return { edition: e, label: `All-around · ${cat}`, athleteId: r.athleteId, value: `${r.total.toFixed(3)} pts`, sub: "" };
  });

  return (
    <>
      <ResultsShell
        eyebrow="Results"
        title="Every league. Every athlete."
        intro="Standings, leaderboards and match-by-match results from every Athleta league, and a profile for every athlete that follows them from one league to the next."
        active="Overview"
      >
        <div className="shell grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatTile label="Athletes" value={t.athletes} sub={`from ${t.schools} schools`} />
          <StatTile label="League editions" value={t.editions} sub="Football, cricket, athletics, gymnastics" />
          <StatTile label="Matches played" value={t.matches} />
          <StatTile label="Individual results" value={t.marks} sub="Times, distances and scores" />
        </div>

        <Section title="Find an athlete" description="Search by first name or school to see every league an athlete has played.">
          <AthleteSearch athletes={athleteIndex()} compact />
          <Link href="/results/athletes" className="group mt-4 inline-flex items-center gap-2 text-sm font-semibold">
            Browse all athletes
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Section>

        <Section title="Leagues" description="Newest first. Open a league for full standings and leaderboards.">
          <TableCard>
            <thead>
              <tr><Th>League</Th><Th>Sport</Th><Th>Season</Th><Th>Format</Th><Th numeric>Athletes</Th><Th>Champion</Th><Th /></tr>
            </thead>
            <tbody>
              {editions.map((e) => (
                <tr key={e.slug} className="group">
                  <Td>
                    <Link href={`/results/${e.slug}`} className="font-medium group-hover:text-indigo group-hover:underline">
                      {e.name}
                    </Link>
                    <span className="block text-xs text-muted">{e.venue}</span>
                  </Td>
                  <Td>{e.sport}</Td>
                  <Td>{e.season}</Td>
                  <Td className="text-muted">{KIND_LABEL[e.kind]}</Td>
                  <Td numeric>{participantCount(e)}</Td>
                  <Td>{champion(e) ?? <span className="text-muted">{e.categories.length} categories</span>}</Td>
                  <Td>
                    <Link href={`/results/${e.slug}`} aria-label={`Results for ${e.name}`} className="grid size-8 place-items-center rounded-full bg-ink/5 group-hover:bg-volt">
                      <ArrowRight className="size-4" />
                    </Link>
                  </Td>
                </tr>
              ))}
            </tbody>
          </TableCard>
        </Section>

        <div className="shell mt-14 grid gap-10 lg:grid-cols-2 [&>*]:min-w-0">
          <div>
            <h2 className="display text-3xl md:text-4xl">Standout performances</h2>
            <p className="mt-2 text-muted">The headline result from each league.</p>
            <ul className="mt-6 divide-y rounded-2xl border bg-surface">
              {highlights.map((h) => (
                <li key={h.edition.slug} className="flex items-center justify-between gap-4 px-4 py-4">
                  <div>
                    <p className="eyebrow text-muted">{h.label}</p>
                    <div className="mt-1"><AthleteLink id={h.athleteId} /></div>
                    <Link href={`/results/${h.edition.slug}`} className="mt-1 block text-xs text-indigo hover:underline">{h.edition.name}</Link>
                  </div>
                  <p className="shrink-0 text-right text-xl font-semibold tabular-nums">{h.value}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="display text-3xl md:text-4xl">Medal table</h2>
            <p className="mt-2 text-muted">Schools ranked by medals in athletics and gymnastics.</p>
            <TableCard className="mt-6">
              <thead><tr><Th>School</Th><Th numeric>Gold</Th><Th numeric>Silver</Th><Th numeric>Bronze</Th></tr></thead>
              <tbody>
                {medals.map((r) => (
                  <tr key={r.schoolId}>
                    <Td>{getSchool(r.schoolId).name}<span className="block text-xs text-muted">{getSchool(r.schoolId).city}</span></Td>
                    <Td numeric className="font-semibold">{r.gold}</Td><Td numeric>{r.silver}</Td><Td numeric>{r.bronze}</Td>
                  </tr>
                ))}
              </tbody>
            </TableCard>
          </div>
        </div>
      </ResultsShell>
      <CtaBand />
    </>
  );
}
