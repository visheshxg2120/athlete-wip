import Link from "next/link";

import { MedalBadge, Pill } from "@/components/results/data";
import { ArrowRight } from "@/components/ui/icons";
import { formatRange } from "@/lib/dates";
import { cricketWinner, footballWinner, formatMark, medalFor, opponentName, ordinal, teamById, type Participation } from "@/lib/results";
import { cn } from "@/lib/utils";

export const finishLabel = (place?: number) =>
  place === 1 ? "Champions" : place === 2 ? "Runners-up" : place ? `${ordinal(place)} place` : "Group stage";

/** Category or team for a participation, e.g. "U-12 Girls" or "Doon Ridge School". */
export const participationSide = (p: Participation) => (p.kind === "football" || p.kind === "cricket" ? teamById(p.edition, p.teamId).name : p.category);

const Row = ({ cells, className }: { cells: React.ReactNode[]; className?: string }) => (
  <li className={cn("grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 px-4 py-2.5 text-sm sm:grid-cols-[minmax(0,1fr)_6rem_6rem_5rem]", className)}>
    {cells.map((c, i) => (
      <span key={i} className={cn(i === 0 ? "min-w-0 truncate" : "text-right tabular-nums", i === 3 && "hidden sm:block")}>{c}</span>
    ))}
  </li>
);

const WL = ({ r }: { r: "W" | "L" | "D" }) => (
  <span className={cn("inline-grid size-6 place-items-center rounded-md text-xs font-semibold", r === "W" ? "bg-volt" : r === "L" ? "bg-ink/10" : "bg-ink/5")}>{r}</span>
);

/** An athlete's rows for one league: events, apparatus or matches. */
export function ParticipationRows({ p, athleteId }: { p: Participation; athleteId: string }) {
  if (p.kind === "track") {
    return (
      <ul className="divide-y">
        {p.entries.map((x) => (
          <Row key={x.event.id} cells={[<span key="n" className="font-medium">{x.event.name}</span>, <strong key="m">{formatMark(x.mark, x.event.measure)}</strong>, <span key="p">#{x.place} <span className="text-muted">of {x.event.results.length}</span></span>, <MedalBadge key="md" medal={medalFor(x.place)} />]} />
        ))}
      </ul>
    );
  }
  if (p.kind === "gymnastics") {
    return (
      <ul className="divide-y">
        <Row cells={[<span key="n" className="font-medium">All-around</span>, <strong key="m">{p.total.toFixed(3)}</strong>, <span key="p">#{p.place} <span className="text-muted">of {p.fieldSize}</span></span>, <MedalBadge key="md" medal={medalFor(p.place)} />]} />
        {Object.entries(p.byApparatus).map(([ap, v]) => (
          <Row key={ap} className="text-muted" cells={[ap, v.toFixed(3), "", ""]} />
        ))}
      </ul>
    );
  }
  if (p.kind === "football") {
    return (
      <ul className="divide-y">
        {p.goalsByMatch.map(({ match: m, goals }) => {
          const home = m.home === p.teamId;
          const [f, a] = home ? [m.homeGoals, m.awayGoals] : [m.awayGoals, m.homeGoals];
          const win = footballWinner(m);
          return (
            <Row
              key={m.id}
              cells={[
                <span key="o"><span className="text-muted">{m.stage === "Group" ? `Group ${m.group}` : m.stage} · </span>v {opponentName(p.edition, m, p.teamId)}</span>,
                <span key="r" className="inline-flex items-center gap-2"><WL r={win === p.teamId ? "W" : win ? "L" : "D"} />{f}–{a}</span>,
                <span key="g" className={goals ? "font-semibold" : "text-muted"}>{goals} goal{goals === 1 ? "" : "s"}</span>,
                m.playerOfMatch === athleteId ? <Pill key="pm" tone="indigo">POTM</Pill> : "",
              ]}
            />
          );
        })}
      </ul>
    );
  }
  return (
    <ul className="divide-y">
      {p.runsByMatch.map(({ match: m, runs, wickets }) => {
        const batted = m.performances.some((x) => x.athleteId === athleteId && x.runs !== undefined);
        const bowled = m.performances.some((x) => x.athleteId === athleteId && x.wickets !== undefined);
        return (
          <Row
            key={m.id}
            cells={[
              <span key="o"><span className="text-muted">{m.stage === "Group" ? "League" : m.stage} · </span>v {opponentName(p.edition, m, p.teamId)}</span>,
              <WL key="r" r={cricketWinner(m) === p.teamId ? "W" : "L"} />,
              <span key="b" className={batted ? "font-semibold" : "text-muted"}>{batted ? `${runs} runs` : "–"}</span>,
              <span key="w" className={bowled ? "" : "text-muted"}>{bowled ? `${wickets} wkt${wickets === 1 ? "" : "s"}` : "–"}</span>,
            ]}
          />
        );
      })}
    </ul>
  );
}

/** League card on a profile: header with the league and finish, then the rows. */
export function ParticipationCard({ p, athleteId }: { p: Participation; athleteId: string }) {
  const e = p.edition;
  const team = p.kind === "football" || p.kind === "cricket";
  return (
    <article className="overflow-hidden rounded-2xl border bg-surface">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b bg-paper/60 px-4 py-3">
        <div className="min-w-0">
          <p className="text-xs text-muted">{formatRange(e.startsOn, e.endsOn)} · {e.venue}</p>
          <Link href={`/results/${e.slug}`} className="mt-0.5 block font-semibold hover:text-indigo hover:underline">
            {e.name} {e.season}
          </Link>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Pill>{participationSide(p)}</Pill>
          {team ? <Pill tone={p.teamPlace === 1 ? "volt" : "neutral"}>{finishLabel(p.teamPlace)}</Pill> : null}
          <Link href={`/results/athletes/${athleteId}/${e.slug}`} className="group inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white hover:bg-indigo">
            Analyse
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </header>
      <ParticipationRows p={p} athleteId={athleteId} />
    </article>
  );
}
