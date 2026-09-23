import type { Metadata } from "next";
import Link from "next/link";

import { AthleteLink, TableCard, Td, Th } from "@/components/results/data";
import { PageHead, Section } from "@/components/results/page-head";
import { Tabs } from "@/components/results/tabs";
import { battingLeaders, bowlingLeaders, editions, formatMark, gymRanking, rankEvent, topScorers } from "@/lib/results";
import type { Edition, TrackEvent } from "@/types/results";

export const metadata: Metadata = {
  title: "Records",
  description: "Best marks, scores and single-league performances across every Athleta league.",
};

const EditionLink = ({ e }: { e: Edition }) => (
  <Link href={`/results/${e.slug}`} className="text-muted hover:text-ink hover:underline">
    {e.season}
  </Link>
);

export default function RecordsPage() {
  // Athletics: best mark per event and category.
  const best = new Map<string, { ev: TrackEvent; e: Edition; athleteId: string; mark: number }>();
  for (const e of editions) {
    if (e.kind !== "track") continue;
    for (const ev of e.events) {
      const top = rankEvent(ev)[0];
      const key = `${ev.category}|${ev.name}`;
      const cur = best.get(key);
      if (!cur || (ev.measure === "time" ? top.mark < cur.mark : top.mark > cur.mark)) best.set(key, { ev, e, athleteId: top.athleteId, mark: top.mark });
    }
  }
  const trackCats = [...new Set([...best.values()].map((b) => b.ev.category))];

  const gym = editions.flatMap((e) => (e.kind === "gymnastics" ? e.categories.map((c) => ({ e, c, top: gymRanking(e, c)[0] })) : []));
  const gymCats = [...new Set(gym.map((g) => g.c))];

  const goals = editions.flatMap((e) => (e.kind === "football" ? topScorers(e).map((s) => ({ ...s, e })) : [])).sort((a, b) => b.goals - a.goals).slice(0, 8);
  const runs = editions.flatMap((e) => (e.kind === "cricket" ? battingLeaders(e).map((s) => ({ ...s, e })) : [])).sort((a, b) => b.runs - a.runs).slice(0, 8);
  const wickets = editions.flatMap((e) => (e.kind === "cricket" ? bowlingLeaders(e).map((s) => ({ ...s, e })) : [])).sort((a, b) => b.wickets - a.wickets || a.runsConceded - b.runsConceded).slice(0, 8);

  return (
    <>
      <PageHead
        crumbs={[{ label: "Results", href: "/results" }, { label: "Analysis" }, { label: "Records" }]}
        title="Records"
        description="The best marks and scores ever set in an Athleta league, and the biggest single-league performances."
      />

      <Section title="Athletics" description="League record for each event, by category.">
        <Tabs
          tabs={trackCats.map((cat) => ({
            label: cat,
            content: (
              <TableCard compact>
                <thead><tr><Th>Event</Th><Th numeric>Record</Th><Th>Athlete</Th><Th>Season</Th></tr></thead>
                <tbody>
                  {[...best.values()].filter((b) => b.ev.category === cat).map((b) => (
                    <tr key={b.ev.name}>
                      <Td className="font-medium">{b.ev.name}</Td>
                      <Td numeric className="font-semibold">{formatMark(b.mark, b.ev.measure)}</Td>
                      <Td><AthleteLink id={b.athleteId} /></Td>
                      <Td><EditionLink e={b.e} /></Td>
                    </tr>
                  ))}
                </tbody>
              </TableCard>
            ),
          }))}
        />
      </Section>

      <Section title="Gymnastics" description="Highest all-around total, by category and season.">
        <TableCard>
          <thead><tr><Th>Category</Th><Th>Season</Th><Th>Champion</Th><Th numeric>Total</Th></tr></thead>
          <tbody>
            {gymCats.flatMap((c) =>
              gym.filter((g) => g.c === c).map((g) => (
                <tr key={`${g.e.slug}-${c}`}>
                  <Td className="font-medium">{c}</Td>
                  <Td><EditionLink e={g.e} /></Td>
                  <Td><AthleteLink id={g.top.athleteId} /></Td>
                  <Td numeric className="font-semibold">{g.top.total.toFixed(3)}</Td>
                </tr>
              )),
            )}
          </tbody>
        </TableCard>
      </Section>

      <Section title="Team sports" description="Most in a single league.">
        <div className="grid gap-4 xl:grid-cols-3 [&>*]:min-w-0">
          {[
            { title: "Goals", rows: goals.map((g) => ({ id: g.athleteId, e: g.e, v: g.goals })) },
            { title: "Runs", rows: runs.map((r) => ({ id: r.athleteId, e: r.e, v: r.runs })) },
            { title: "Wickets", rows: wickets.map((w) => ({ id: w.athleteId, e: w.e, v: w.wickets })) },
          ].map((t) => (
            <TableCard key={t.title} compact>
              <caption className="px-4 pt-4 text-left font-medium">{t.title}</caption>
              <thead><tr><Th>Player</Th><Th>League</Th><Th numeric>{t.title}</Th></tr></thead>
              <tbody>
                {t.rows.map((r) => (
                  <tr key={`${r.id}-${r.e.slug}`}>
                    <Td><AthleteLink id={r.id} /></Td>
                    <Td className="text-xs"><Link href={`/results/${r.e.slug}`} className="text-muted hover:text-ink hover:underline">{r.e.sport} {r.e.season}</Link></Td>
                    <Td numeric className="font-semibold">{r.v}</Td>
                  </tr>
                ))}
              </tbody>
            </TableCard>
          ))}
        </div>
      </Section>
    </>
  );
}
