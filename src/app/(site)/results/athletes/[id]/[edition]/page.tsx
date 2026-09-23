import Link from "next/link";
import { notFound } from "next/navigation";

import { Avatar } from "@/components/results/athlete-header";
import { BarChart } from "@/components/results/bar-chart";
import { Chip } from "@/components/results/data";
import { FieldStrip } from "@/components/results/field-strip";
import { LineChart } from "@/components/results/line-chart";
import { Section } from "@/components/results/page-head";
import { finishLabel, participationSide, ParticipationRows } from "@/components/results/participation";
import { RadarChart } from "@/components/results/radar-chart";
import { ArrowRight } from "@/components/ui/icons";
import { formatRange } from "@/lib/dates";
import {
  beatPercent,
  formatMark,
  getAthlete,
  getSchool,
  gymRanking,
  leagueRank,
  opponentName,
  participationOf,
  participationsOf,
  profiledAthletes,
  rankEvent,
  topPercent,
  type Participation,
} from "@/lib/results";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return profiledAthletes.flatMap((a) => participationsOf(a.id).map((p) => ({ id: a.id, edition: p.edition.slug })));
}

export async function generateMetadata(props: PageProps<"/results/athletes/[id]/[edition]">) {
  const { id, edition } = await props.params;
  const a = getAthlete(id);
  const p = participationOf(id, edition);
  return { title: a && p ? `${a.name} · ${p.edition.name} ${p.edition.season}` : "Result", robots: { index: false } };
}

/** Running totals: [1, 0, 2] -> [1, 1, 3]. */
const cumulative = (xs: number[]) => xs.map((_, i) => xs.slice(0, i + 1).reduce((a, b) => a + b, 0));

const median = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

function TrackAnalysis({ p, id }: { p: Extract<Participation, { kind: "track" }>; id: string }) {
  return (
    <>
      <Section title="Performance profile" description="Share of the field each result beat. 100% means first place.">
        <BarChart
          title="Field beaten, by event"
          unit="of the field beaten"
          suffix="%"
          max={100}
          data={p.entries.map((x) => ({ label: x.event.name, value: beatPercent(x.place, x.event.results.length), detail: `${x.event.name} · ${formatMark(x.mark, x.event.measure)} · ${x.place} of ${x.event.results.length}` }))}
        />
      </Section>
      <Section title="Against the field" description="Every competitor in the event, better to the right. Hover a dot for the athlete and their mark.">
        <div className="grid gap-4 xl:grid-cols-2 [&>*]:min-w-0">
          {p.entries.map((x) => (
            <FieldStrip
              key={x.event.id}
              title={`${x.event.name} · ${x.event.category}`}
              better={x.event.measure === "time" ? "lower" : "higher"}
              points={rankEvent(x.event).map((r) => ({ id: r.athleteId, name: getAthlete(r.athleteId)!.name, value: r.mark, display: formatMark(r.mark, x.event.measure), place: r.place, me: r.athleteId === id }))}
            />
          ))}
        </div>
      </Section>
    </>
  );
}

function GymAnalysis({ p, id }: { p: Extract<Participation, { kind: "gymnastics" }>; id: string }) {
  const ranking = gymRanking(p.edition, p.category);
  const apparatus = p.edition.apparatus[p.category];
  const med = apparatus.map((ap) => median(ranking.map((r) => r.byApparatus[ap])));
  const apRank = apparatus.map((ap) => {
    const sorted = [...ranking].sort((a, b) => b.byApparatus[ap] - a.byApparatus[ap]);
    return sorted.findIndex((r) => r.athleteId === id) + 1;
  });
  const all = ranking.flatMap((r) => apparatus.map((ap) => r.byApparatus[ap]));
  const domain: [number, number] = [Math.floor(Math.min(...all)) - 1, Math.ceil(Math.max(...all))];
  return (
    <>
      <div className="mt-12 grid gap-4 lg:grid-cols-2 [&>*]:min-w-0">
        <RadarChart title="Apparatus scores" axes={apparatus} me={apparatus.map((ap) => p.byApparatus[ap])} reference={med} labels={["This gymnast", "Category median"]} domain={domain} />
        <BarChart
          title="Field beaten, by apparatus"
          note={`Share of the ${ranking.length} gymnasts in ${p.category} this score beat.`}
          unit="of the field beaten"
          suffix="%"
          max={100}
          data={apparatus.map((ap, i) => ({ label: ap, value: beatPercent(apRank[i], ranking.length), detail: `${ap} · ${p.byApparatus[ap].toFixed(3)} · ${apRank[i]} of ${ranking.length}` }))}
        />
      </div>
      <Section title="All-around against the field" description="Every gymnast in the category, higher totals to the right.">
        <FieldStrip
          title={`All-around total · ${p.category}`}
          better="higher"
          points={ranking.map((r) => ({ id: r.athleteId, name: getAthlete(r.athleteId)!.name, value: r.total, display: r.total.toFixed(3), place: r.place, me: r.athleteId === id }))}
        />
      </Section>
    </>
  );
}

function FootballAnalysis({ p }: { p: Extract<Participation, { kind: "football" }> }) {
  const totals = cumulative(p.goalsByMatch.map((g) => g.goals));
  return (
    <div className="mt-12 grid gap-4 lg:grid-cols-2 [&>*]:min-w-0">
      <BarChart
        title="Goals per match"
        unit="goals"
        data={p.goalsByMatch.map(({ match: m, goals }) => ({ label: `${m.stage === "Group" ? "Group" : m.stage} v ${opponentName(p.edition, m, p.teamId)}`, value: goals }))}
      />
      <LineChart
        title="Goals over the league"
        note="Running total after each match."
        unit="goals"
        points={p.goalsByMatch.map(({ match: m }, i) => ({ label: m.id, value: totals[i], detail: `after ${m.stage === "Group" ? "group match" : m.stage} v ${opponentName(p.edition, m, p.teamId)}` }))}
      />
    </div>
  );
}

function CricketAnalysis({ p }: { p: Extract<Participation, { kind: "cricket" }> }) {
  const totals = cumulative(p.runsByMatch.map((r) => r.runs));
  return (
    <div className="mt-12 grid gap-4 lg:grid-cols-2 [&>*]:min-w-0">
      <LineChart
        title="Runs over the league"
        note="Running total after each match."
        unit="runs"
        points={p.runsByMatch.map(({ match: m }, i) => ({ label: m.id, value: totals[i], detail: `after ${m.stage === "Group" ? "league match" : m.stage} v ${opponentName(p.edition, m, p.teamId)}` }))}
      />
      <BarChart
        title="Runs per match"
        unit="runs"
        data={p.runsByMatch.map(({ match: m, runs }) => ({ label: `v ${opponentName(p.edition, m, p.teamId)}`, value: runs, detail: `${m.stage === "Group" ? "League" : m.stage} v ${opponentName(p.edition, m, p.teamId)}` }))}
      />
    </div>
  );
}

/** Headline chips for the result: mark or finish, place in the field, percentile. */
function ResultChips({ p, id }: { p: Participation; id: string }) {
  if (p.kind === "track") {
    const best = p.entries.reduce((a, b) => (b.place / b.event.results.length < a.place / a.event.results.length ? b : a));
    return (
      <>
        <Chip value={formatMark(best.mark, best.event.measure)} label={`Best · ${best.event.name}`} tone="ink" />
        <Chip value={`#${best.place} of ${best.event.results.length}`} label={best.event.name} />
        <Chip value={`Top ${topPercent(best.place, best.event.results.length)}%`} label="Best event" tone={best.place <= 3 ? "volt" : "neutral"} />
        <Chip value={p.entries.length} label="Events" />
        <Chip value={p.entries.filter((x) => x.place <= 3).length} label="Medals" />
      </>
    );
  }
  if (p.kind === "gymnastics") {
    return (
      <>
        <Chip value={p.total.toFixed(3)} label="All-around" tone="ink" />
        <Chip value={`#${p.place} of ${p.fieldSize}`} label={p.category} />
        <Chip value={`Top ${topPercent(p.place, p.fieldSize)}%`} label="Of the field" tone={p.place <= 3 ? "volt" : "neutral"} />
      </>
    );
  }
  const r = leagueRank(p.edition, id);
  if (p.kind === "football") {
    return (
      <>
        <Chip value={finishLabel(p.teamPlace)} label="Team finish" tone={p.teamPlace === 1 ? "volt" : "ink"} />
        <Chip value={p.goals} label="Goals" />
        {"goals" in r && r.goals && p.goals ? <Chip value={`#${r.goals.place} of ${r.goals.field}`} label="Scoring rank" /> : null}
        <Chip value={p.matches.length} label="Matches" />
        {p.playerOfMatch ? <Chip value={p.playerOfMatch} label="Player of match" /> : null}
      </>
    );
  }
  return (
    <>
      <Chip value={finishLabel(p.teamPlace)} label="Team finish" tone={p.teamPlace === 1 ? "volt" : "ink"} />
      <Chip value={p.runs} label="Runs" />
      {"runs" in r && r.runs ? <Chip value={`#${r.runs.place} of ${r.runs.field}`} label="Batting rank" /> : null}
      {"wickets" in r && r.wickets ? <Chip value={p.wickets} label="Wickets" /> : null}
      {"wickets" in r && r.wickets && p.wickets ? <Chip value={`#${r.wickets.place} of ${r.wickets.field}`} label="Bowling rank" /> : null}
    </>
  );
}

export default async function ResultAnalysisPage(props: PageProps<"/results/athletes/[id]/[edition]">) {
  const { id, edition } = await props.params;
  const athlete = getAthlete(id);
  const p = participationOf(id, edition);
  if (!athlete?.profile || !p) notFound();
  const e = p.edition;
  const others = participationsOf(id);

  return (
    <>
      <nav aria-label="Breadcrumb" className="eyebrow flex flex-wrap gap-x-2 gap-y-1 text-[0.7rem] text-muted">
        <Link href="/results" className="hover:text-ink">Results</Link>/
        <Link href={`/results/${e.slug}`} className="hover:text-ink">{e.sport} {e.season}</Link>/
        <span>{participationSide(p)}</span>/
        <span className="text-ink">{athlete.name}</span>
      </nav>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <Avatar name={athlete.name} className="size-14 text-lg" />
          <div className="min-w-0">
            <h1 className="display text-3xl md:text-4xl">
              <Link href={`/results/athletes/${id}`} className="hover:text-indigo">{athlete.name}</Link>
            </h1>
            <p className="mt-1 text-sm text-muted">
              {e.name} {e.season} · {formatRange(e.startsOn, e.endsOn)} · {getSchool(athlete.schoolId).name}
            </p>
          </div>
        </div>
        <Link href={`/results/athletes/${id}`} className="group inline-flex items-center gap-2 text-sm font-semibold">
          Full profile
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <ResultChips p={p} id={id} />
      </div>

      {others.length > 1 ? (
        <nav aria-label="Other leagues" className="mt-6 flex gap-1 overflow-x-auto rounded-xl border bg-surface p-1">
          {others.map((o) => (
            <Link
              key={o.edition.slug}
              href={`/results/athletes/${id}/${o.edition.slug}`}
              aria-current={o.edition.slug === e.slug ? "page" : undefined}
              className={cn("shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium", o.edition.slug === e.slug ? "bg-ink text-white" : "text-muted hover:text-ink")}
            >
              {o.edition.sport} {o.edition.season}
            </Link>
          ))}
        </nav>
      ) : null}

      {p.kind === "track" ? <TrackAnalysis p={p} id={id} /> : null}
      {p.kind === "gymnastics" ? <GymAnalysis p={p} id={id} /> : null}
      {p.kind === "football" ? <FootballAnalysis p={p} /> : null}
      {p.kind === "cricket" ? <CricketAnalysis p={p} /> : null}

      <Section title={p.kind === "football" || p.kind === "cricket" ? "Match by match" : "Results"}>
        <div className="overflow-hidden rounded-2xl border bg-surface">
          <ParticipationRows p={p} athleteId={id} />
        </div>
      </Section>
    </>
  );
}
