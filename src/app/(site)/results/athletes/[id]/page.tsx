import Link from "next/link";
import { notFound } from "next/navigation";

import { BarChart } from "@/components/results/bar-chart";
import { MedalBadge, Pill, Place, StatTile, TableCard, Td, Th } from "@/components/results/data";
import { ResultsShell } from "@/components/results/results-shell";
import {
  cricketWinner,
  footballWinner,
  formatMark,
  getAthlete,
  getSchool,
  medalFor,
  ordinal,
  participationHeadline,
  participationsOf,
  podiumsOf,
  results,
  teamById,
  type Participation,
} from "@/lib/results";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return results.athletes.map((a) => ({ id: a.id }));
}

export async function generateMetadata(props: PageProps<"/results/athletes/[id]">) {
  const { id } = await props.params;
  const a = getAthlete(id);
  return { title: a ? `${a.name} · Athlete` : "Athlete", robots: { index: false } };
}

const finishLabel = (place?: number) =>
  place === 1 ? "Champions" : place === 2 ? "Runners-up" : place ? `${ordinal(place)} place` : "Group stage";

function ParticipationDetail({ p, athleteId }: { p: Participation; athleteId: string }) {
  if (p.kind === "football") {
    return (
      <div className="grid gap-4 lg:grid-cols-[3fr_2fr]">
        <TableCard compact>
          <thead><tr><Th>Stage</Th><Th>Opponent</Th><Th>Result</Th><Th numeric>Goals</Th></tr></thead>
          <tbody>
            {p.goalsByMatch.map(({ match: m, goals }) => {
              const home = m.home === p.teamId;
              const opp = home ? m.away : m.home;
              const [f, a] = home ? [m.homeGoals, m.awayGoals] : [m.awayGoals, m.homeGoals];
              const win = footballWinner(m);
              const res = win === p.teamId ? "W" : win ? "L" : "D";
              return (
                <tr key={m.id}>
                  <Td className="text-muted">{m.stage === "Group" ? `Group ${m.group}` : m.stage}</Td>
                  <Td>{teamById(p.edition, opp).name}</Td>
                  <Td>
                    <span className={cn("mr-2 inline-grid size-6 place-items-center rounded-md text-xs font-semibold", res === "W" ? "bg-volt" : res === "L" ? "bg-ink/10" : "bg-ink/5")}>{res}</span>
                    <span className="tabular-nums">{f}–{a}</span>
                    {m.penalties ? <span className="ml-1 text-xs text-muted">(pens)</span> : null}
                  </Td>
                  <Td numeric className="font-semibold">
                    {goals || <span className="font-normal text-muted">0</span>}
                    {m.playerOfMatch === athleteId ? <span className="ml-2 text-xs font-normal text-indigo">Player of the match</span> : null}
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </TableCard>
        {p.goals ? (
          <BarChart
            title="Goals per match"
            unit="goals"
            data={p.goalsByMatch.map(({ match: m, goals }) => {
              const opp = m.home === p.teamId ? m.away : m.home;
              const stage = m.stage === "Group" ? "Group" : m.stage;
              return { label: `v ${teamById(p.edition, opp).name}`, value: goals, detail: `${stage} v ${teamById(p.edition, opp).name}` };
            })}
          />
        ) : null}
      </div>
    );
  }
  if (p.kind === "cricket") {
    return (
      <TableCard compact>
        <thead><tr><Th>Stage</Th><Th>Opponent</Th><Th>Result</Th><Th numeric>Runs</Th><Th numeric>Wkts</Th></tr></thead>
        <tbody>
          {p.runsByMatch.map(({ match: m, runs, wickets }) => {
            const opp = m.innings.find((i) => i.teamId !== p.teamId)!.teamId;
            const won = cricketWinner(m) === p.teamId;
            const batted = m.performances.some((x) => x.athleteId === athleteId && x.runs !== undefined);
            const bowled = m.performances.some((x) => x.athleteId === athleteId && x.wickets !== undefined);
            return (
              <tr key={m.id}>
                <Td className="text-muted">{m.stage === "Group" ? "League" : m.stage}</Td>
                <Td>{teamById(p.edition, opp).name}</Td>
                <Td><span className={cn("inline-grid size-6 place-items-center rounded-md text-xs font-semibold", won ? "bg-volt" : "bg-ink/10")}>{won ? "W" : "L"}</span></Td>
                <Td numeric className="font-semibold">{batted ? runs : <span className="font-normal text-muted">–</span>}</Td>
                <Td numeric className="font-semibold">{bowled ? wickets : <span className="font-normal text-muted">–</span>}</Td>
              </tr>
            );
          })}
        </tbody>
      </TableCard>
    );
  }
  if (p.kind === "track") {
    return (
      <TableCard compact>
        <thead><tr><Th>Event</Th><Th numeric>Mark</Th><Th>Place</Th><Th>Medal</Th></tr></thead>
        <tbody>
          {p.entries.map((x) => (
            <tr key={x.event.id}>
              <Td>{x.event.name}</Td>
              <Td numeric className="font-semibold">{formatMark(x.mark, x.event.measure)}</Td>
              <Td><Place place={x.place} /> <span className="ml-1 hidden text-xs text-muted sm:inline">of {x.event.results.length}</span></Td>
              <Td><MedalBadge medal={medalFor(x.place)} /></Td>
            </tr>
          ))}
        </tbody>
      </TableCard>
    );
  }
  return (
    <TableCard>
      <thead>
        <tr>
          {Object.keys(p.byApparatus).map((ap) => <Th key={ap} numeric>{ap}</Th>)}
          <Th numeric>Total</Th><Th>Place</Th>
        </tr>
      </thead>
      <tbody>
        <tr>
          {Object.entries(p.byApparatus).map(([ap, v]) => <Td key={ap} numeric>{v.toFixed(3)}</Td>)}
          <Td numeric className="font-semibold">{p.total.toFixed(3)}</Td>
          <Td><Place place={p.place} /> <MedalBadge medal={medalFor(p.place)} /></Td>
        </tr>
      </tbody>
    </TableCard>
  );
}

export default async function AthletePage(props: PageProps<"/results/athletes/[id]">) {
  const { id } = await props.params;
  const athlete = getAthlete(id);
  if (!athlete) notFound();

  const school = getSchool(athlete.schoolId);
  const ps = participationsOf(id);
  const sports = [...new Set(ps.map((p) => p.edition.sport))];
  const goals = ps.reduce((n, p) => n + (p.kind === "football" ? p.goals : 0), 0);
  const runs = ps.reduce((n, p) => n + (p.kind === "cricket" ? p.runs : 0), 0);
  const wickets = ps.reduce((n, p) => n + (p.kind === "cricket" ? p.wickets : 0), 0);
  const events = ps.reduce((n, p) => n + (p.kind === "track" ? p.entries.length : 0), 0);
  const trackMedals = ps.reduce((n, p) => n + (p.kind === "track" ? p.entries.filter((x) => x.place <= 3).length : 0), 0);

  const tiles = [
    { label: "Leagues", value: ps.length, sub: sports.join(", ") },
    { label: "Podium finishes", value: podiumsOf(ps), sub: "Team and individual" },
    goals ? { label: "Goals", value: goals, sub: "Football" } : null,
    runs || wickets ? { label: "Runs · wickets", value: `${runs} · ${wickets}`, sub: "Cricket" } : null,
    events ? { label: "Athletics events", value: events, sub: `${trackMedals} medal${trackMedals === 1 ? "" : "s"}` } : null,
    ps.find((p) => p.kind === "gymnastics") ? { label: "All-around", value: ordinal((ps.find((p) => p.kind === "gymnastics") as Extract<Participation, { kind: "gymnastics" }>).place), sub: "Gymnastics" } : null,
  ].filter(Boolean) as { label: string; value: React.ReactNode; sub: string }[];

  return (
    <ResultsShell
      eyebrow={`${school.name} · ${school.city}`}
      title={athlete.name}
      heroExtra={
        <div className="mt-6 flex flex-wrap gap-2">
          {sports.map((s) => (
            <span key={s} className="rounded-full border border-white/20 px-3 py-1 text-sm text-white/85">{s}</span>
          ))}
        </div>
      }
    >
      <div className="shell grid grid-cols-2 gap-3 md:grid-cols-4">
        {tiles.slice(0, 4).map((t) => <StatTile key={t.label} {...t} />)}
      </div>

      <section className="shell mt-14">
        <h2 className="display text-3xl md:text-4xl">League history</h2>
        <ol className="mt-6 space-y-6">
          {ps.map((p) => (
            <li key={p.edition.slug} className="rounded-2xl border bg-paper p-5 md:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="eyebrow text-muted">{p.edition.sport} · {p.edition.season}</p>
                  <Link href={`/results/${p.edition.slug}`} className="display mt-2 block text-2xl hover:text-indigo md:text-3xl">{p.edition.name}</Link>
                  <p className="mt-2 text-muted">{participationHeadline(p)}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {p.kind === "football" || p.kind === "cricket" ? (
                    <>
                      <Pill>{teamById(p.edition, p.teamId).name}</Pill>
                      <Pill tone={p.teamPlace === 1 ? "volt" : "neutral"}>{finishLabel(p.teamPlace)}</Pill>
                    </>
                  ) : (
                    <Pill>{p.category}</Pill>
                  )}
                  {p.kind === "football" && p.playerOfMatch ? <Pill tone="indigo">Player of the match ×{p.playerOfMatch}</Pill> : null}
                </div>
              </div>
              <div className="mt-5">
                <ParticipationDetail p={p} athleteId={id} />
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-8 text-sm text-muted">
          To protect young athletes, profiles show a first name and surname initial only. Parents can ask for a profile to be
          hidden by contacting Athleta.
        </p>
      </section>
    </ResultsShell>
  );
}
