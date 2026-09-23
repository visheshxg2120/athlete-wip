import { BarChart } from "@/components/results/bar-chart";
import { AthleteLink, MedalBadge, Place, StatTile, TableCard, Td, Th } from "@/components/results/data";
import { Section } from "@/components/results/results-shell";
import { Tabs } from "@/components/results/tabs";
import {
  battingLeaders,
  bowlingLeaders,
  cricketStandings,
  cricketWinner,
  footballStandings,
  footballWinner,
  formatMark,
  getAthlete,
  goalsByTeam,
  gymRanking,
  medalFor,
  medalTable,
  getSchool,
  leaderTie,
  rankEvent,
  rankOf,
  teamById,
  teamPlacings,
  topScorers,
} from "@/lib/results";
import { cn } from "@/lib/utils";
import type { CricketEdition, CricketMatch, FootballEdition, FootballMatch, GymnasticsEdition, TrackEdition } from "@/types/results";

// ---------------------------------------------------------------------------
// Football
// ---------------------------------------------------------------------------

function FootballMatchRow({ e, m }: { e: FootballEdition; m: FootballMatch }) {
  const win = footballWinner(m);
  const side = (id: string, goals: number, alignEnd?: boolean) => (
    <span className={cn("flex-1 truncate", alignEnd && "text-right", win === id ? "font-semibold" : "text-muted")}>{teamById(e, id).name}</span>
  );
  return (
    <li className="flex items-center gap-3 px-4 py-3 text-sm">
      {side(m.home, m.homeGoals, true)}
      <span className="shrink-0 rounded-lg bg-ink px-2.5 py-1 text-center font-semibold tabular-nums text-white">
        {m.homeGoals} – {m.awayGoals}
      </span>
      {side(m.away, m.awayGoals)}
      {m.penalties ? <span className="hidden shrink-0 text-xs text-muted sm:inline">pens {m.penalties.home}–{m.penalties.away}</span> : null}
    </li>
  );
}

export function FootballView({ e }: { e: FootballEdition }) {
  const places = teamPlacings(e);
  const byPlace = (p: number) => [...places].find(([, x]) => x === p)?.[0];
  const scorers = topScorers(e);
  const topTie = leaderTie(scorers, (s) => s.goals);
  const final = e.matches.find((m) => m.stage === "Final")!;
  const totalGoals = e.matches.reduce((n, m) => n + m.homeGoals + m.awayGoals, 0);
  const stages = ["Final", "3rd place", "Semi-final", "Group"] as const;

  return (
    <>
      <div className="shell grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatTile label="Champions" value={<span className="text-2xl md:text-3xl">{teamById(e, byPlace(1)!).name}</span>} sub={`Beat ${teamById(e, byPlace(2)!).name} ${final.homeGoals}–${final.awayGoals}${final.penalties ? " on penalties" : ""}`} />
        {topTie.count > 1 ? (
          <StatTile label="Top scorers" value={`${topTie.value} goals`} sub={`Shared by ${topTie.count} players`} />
        ) : (
          <StatTile label="Top scorer" value={<span className="text-2xl md:text-3xl">{getAthlete(scorers[0].athleteId)?.name}</span>} sub={`${scorers[0].goals} goals · ${teamById(e, scorers[0].teamId).name}`} />
        )}
        <StatTile label="Matches" value={e.matches.length} sub={`${e.teams.length} teams · ${e.categories.join(", ")}`} />
        <StatTile label="Goals" value={totalGoals} sub={`${(totalGoals / e.matches.length).toFixed(1)} per match`} />
      </div>

      <Section title="Group tables" description="Top two in each group reach the semi-finals. Win 3 pts, draw 1.">
        <div className="grid gap-4 lg:grid-cols-2">
          {e.groups.map((g) => (
            <TableCard key={g.name} className="[&_table]:min-w-[26rem]">
              <caption className="px-4 pt-4 text-left font-medium">Group {g.name}</caption>
              <thead>
                <tr>
                  <Th>Team</Th><Th numeric>P</Th><Th numeric>W</Th><Th numeric>D</Th><Th numeric>L</Th><Th numeric>GD</Th><Th numeric>Pts</Th>
                </tr>
              </thead>
              <tbody>
                {footballStandings(e, g.name).map((r, i) => (
                  <tr key={r.teamId} className={i < 2 ? "bg-volt/10" : undefined}>
                    <Td><span className="mr-2 text-muted tabular-nums">{i + 1}</span>{teamById(e, r.teamId).name}</Td>
                    <Td numeric>{r.p}</Td><Td numeric>{r.w}</Td><Td numeric>{r.d}</Td><Td numeric>{r.l}</Td>
                    <Td numeric>{r.gf - r.ga > 0 ? "+" : ""}{r.gf - r.ga}</Td>
                    <Td numeric className="font-semibold">{r.pts}</Td>
                  </tr>
                ))}
              </tbody>
            </TableCard>
          ))}
        </div>
      </Section>

      <Section title="Top scorers" description="Every goal is credited to its scorer; open a player to see their match-by-match record.">
        <div className="grid gap-4 lg:grid-cols-2">
          <TableCard>
            <thead>
              <tr><Th>#</Th><Th>Player</Th><Th>Team</Th><Th numeric>Goals</Th></tr>
            </thead>
            <tbody>
              {scorers.slice(0, 10).map((s, i) => (
                <tr key={s.athleteId}>
                  <Td><Place place={rankOf(scorers, (x) => x.goals, i)} /></Td>
                  <Td><AthleteLink id={s.athleteId} showSchool={false} /></Td>
                  <Td className="text-muted">{teamById(e, s.teamId).name}</Td>
                  <Td numeric className="font-semibold">{s.goals}</Td>
                </tr>
              ))}
            </tbody>
          </TableCard>
          <BarChart
            title="Goals scored by team"
            unit="goals"
            data={goalsByTeam(e).map((t) => {
              const place = places.get(t.teamId);
              return { label: t.name, value: t.goals, detail: `${t.name}${place ? ` · finished ${place === 1 ? "1st" : place === 2 ? "2nd" : place === 3 ? "3rd" : "4th"}` : " · group stage"}` };
            })}
          />
        </div>
      </Section>

      <Section title="All results">
        <div className="space-y-6">
          {stages.map((stage) => {
            const ms = e.matches.filter((m) => m.stage === stage);
            if (!ms.length) return null;
            return (
              <div key={stage}>
                <h3 className="eyebrow text-muted">{stage === "Group" ? "Group stage" : stage}</h3>
                <ul className="mt-3 divide-y rounded-2xl border bg-surface">
                  {ms.map((m) => (
                    <FootballMatchRow key={m.id} e={e} m={m} />
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </Section>
    </>
  );
}

// ---------------------------------------------------------------------------
// Cricket
// ---------------------------------------------------------------------------

function CricketMatchRow({ e, m }: { e: CricketEdition; m: CricketMatch }) {
  const win = cricketWinner(m);
  const [a, b] = m.innings;
  const margin = a.teamId === win ? `won by ${a.runs - b.runs} runs` : `won by ${10 - b.wickets} wickets`;
  return (
    <li className="grid gap-1 px-4 py-3 text-sm sm:grid-cols-[1fr_1fr_auto] sm:items-center sm:gap-4">
      {m.innings.map((inn) => (
        <span key={inn.teamId} className={cn("flex justify-between gap-3", inn.teamId === win ? "font-semibold" : "text-muted")}>
          <span className="truncate">{teamById(e, inn.teamId).name}</span>
          <span className="tabular-nums">{inn.runs}/{inn.wickets} <span className="text-xs text-muted">({inn.overs} ov)</span></span>
        </span>
      ))}
      <span className="text-xs text-muted">{teamById(e, win).name} {margin}</span>
    </li>
  );
}

export function CricketView({ e }: { e: CricketEdition }) {
  const places = teamPlacings(e);
  const champ = [...places].find(([, p]) => p === 1)![0];
  const bat = battingLeaders(e);
  const bowl = bowlingLeaders(e);
  const final = e.matches.find((m) => m.stage === "Final")!;
  return (
    <>
      <div className="shell grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatTile label="Champions" value={<span className="text-2xl md:text-3xl">{teamById(e, champ).name}</span>} sub="Won the final" />
        <StatTile label="Most runs" value={<span className="text-2xl md:text-3xl">{getAthlete(bat[0].athleteId)?.name}</span>} sub={`${bat[0].runs} runs · best ${bat[0].best}`} />
        <StatTile label="Most wickets" value={<span className="text-2xl md:text-3xl">{getAthlete(bowl[0].athleteId)?.name}</span>} sub={`${bowl[0].wickets} wickets`} />
        <StatTile label="Matches" value={e.matches.length} sub={`${e.oversPerSide} overs a side`} />
      </div>

      <Section title="Final">
        <ul className="rounded-2xl border bg-surface"><CricketMatchRow e={e} m={final} /></ul>
      </Section>

      <Section title="Points table" description="Round robin: win 2 pts. Top two meet in the final.">
        <TableCard>
          <thead>
            <tr><Th>Team</Th><Th numeric>P</Th><Th numeric>W</Th><Th numeric>L</Th><Th numeric>Runs for</Th><Th numeric>Runs against</Th><Th numeric>Pts</Th></tr>
          </thead>
          <tbody>
            {cricketStandings(e).map((r, i) => (
              <tr key={r.teamId} className={i < 2 ? "bg-volt/10" : undefined}>
                <Td><span className="mr-2 text-muted tabular-nums">{i + 1}</span>{teamById(e, r.teamId).name}</Td>
                <Td numeric>{r.p}</Td><Td numeric>{r.w}</Td><Td numeric>{r.l}</Td><Td numeric>{r.runsFor}</Td><Td numeric>{r.runsAgainst}</Td>
                <Td numeric className="font-semibold">{r.pts}</Td>
              </tr>
            ))}
          </tbody>
        </TableCard>
      </Section>

      <Section title="Leaders">
        <div className="grid gap-4 lg:grid-cols-2">
          <TableCard>
            <caption className="px-4 pt-4 text-left font-medium">Batting</caption>
            <thead><tr><Th>#</Th><Th>Batter</Th><Th numeric>Inns</Th><Th numeric>Runs</Th><Th numeric>Best</Th><Th numeric>SR</Th></tr></thead>
            <tbody>
              {bat.slice(0, 10).map((r, i) => (
                <tr key={r.athleteId}>
                  <Td><Place place={i + 1} /></Td><Td><AthleteLink id={r.athleteId} /></Td>
                  <Td numeric>{r.innings}</Td><Td numeric className="font-semibold">{r.runs}</Td><Td numeric>{r.best}</Td>
                  <Td numeric>{r.balls ? ((r.runs / r.balls) * 100).toFixed(0) : "–"}</Td>
                </tr>
              ))}
            </tbody>
          </TableCard>
          <TableCard>
            <caption className="px-4 pt-4 text-left font-medium">Bowling</caption>
            <thead><tr><Th>#</Th><Th>Bowler</Th><Th numeric>Mat</Th><Th numeric>Wkts</Th><Th numeric>Runs</Th></tr></thead>
            <tbody>
              {bowl.slice(0, 10).map((r, i) => (
                <tr key={r.athleteId}>
                  <Td><Place place={i + 1} /></Td><Td><AthleteLink id={r.athleteId} /></Td>
                  <Td numeric>{r.matches}</Td><Td numeric className="font-semibold">{r.wickets}</Td><Td numeric>{r.runsConceded}</Td>
                </tr>
              ))}
            </tbody>
          </TableCard>
        </div>
      </Section>

      <Section title="All results">
        <ul className="divide-y rounded-2xl border bg-surface">
          {e.matches.filter((m) => m.stage === "Group").map((m) => (
            <CricketMatchRow key={m.id} e={e} m={m} />
          ))}
        </ul>
      </Section>
    </>
  );
}

// ---------------------------------------------------------------------------
// Individual sports
// ---------------------------------------------------------------------------

function MedalTableView({ e }: { e: TrackEdition | GymnasticsEdition }) {
  const rows = medalTable([e]);
  return (
    <TableCard>
      <thead><tr><Th>School</Th><Th numeric>Gold</Th><Th numeric>Silver</Th><Th numeric>Bronze</Th><Th numeric>Total</Th></tr></thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.schoolId}>
            <Td>{getSchool(r.schoolId).name}</Td>
            <Td numeric>{r.gold}</Td><Td numeric>{r.silver}</Td><Td numeric>{r.bronze}</Td>
            <Td numeric className="font-semibold">{r.gold + r.silver + r.bronze}</Td>
          </tr>
        ))}
      </tbody>
    </TableCard>
  );
}

export function TrackView({ e }: { e: TrackEdition }) {
  const entrants = new Set(e.events.flatMap((ev) => ev.results.map((r) => r.athleteId))).size;
  return (
    <>
      <div className="shell grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatTile label="Athletes" value={entrants} sub={`${e.categories.length} categories`} />
        <StatTile label="Events" value={e.events.length} sub={[...new Set(e.events.map((ev) => ev.name))].join(", ")} />
        <StatTile label="Top school" value={<span className="text-2xl md:text-3xl">{getSchool(medalTable([e])[0].schoolId).name}</span>} sub={`${medalTable([e])[0].gold} golds`} />
        <StatTile label="Results" value={e.events.reduce((n, ev) => n + ev.results.length, 0)} sub="Times and distances" />
      </div>

      <Section title="Event results" description="Choose a category. Times are hand-timed seconds; distances in metres.">
        <Tabs
          tabs={e.categories.map((cat) => ({
            label: cat,
            content: (
              <div className="grid gap-4 lg:grid-cols-2">
                {e.events.filter((ev) => ev.category === cat).map((ev) => (
                  <TableCard key={ev.id} className="[&_table]:min-w-[22rem]">
                    <caption className="px-4 pt-4 text-left font-medium">{ev.name}</caption>
                    <thead><tr><Th>Pl</Th><Th>Athlete</Th><Th numeric>Mark</Th><Th>Medal</Th></tr></thead>
                    <tbody>
                      {rankEvent(ev).map((r) => (
                        <tr key={r.athleteId}>
                          <Td><Place place={r.place} /></Td>
                          <Td><AthleteLink id={r.athleteId} /></Td>
                          <Td numeric className="font-semibold">{formatMark(r.mark, ev.measure)}</Td>
                          <Td><MedalBadge medal={medalFor(r.place)} /></Td>
                        </tr>
                      ))}
                    </tbody>
                  </TableCard>
                ))}
              </div>
            ),
          }))}
        />
      </Section>

      <Section title="Medal table" description="By school, across every event and category.">
        <MedalTableView e={e} />
      </Section>
    </>
  );
}

export function GymnasticsView({ e }: { e: GymnasticsEdition }) {
  return (
    <>
      <div className="shell grid grid-cols-2 gap-3 md:grid-cols-4">
        {e.categories.map((cat) => {
          const top = gymRanking(e, cat)[0];
          return <StatTile key={cat} label={`${cat} champion`} value={<span className="text-2xl md:text-3xl">{getAthlete(top.athleteId)?.name}</span>} sub={`${top.total.toFixed(3)} pts all-around`} />;
        })}
        <StatTile label="Gymnasts" value={e.scores.length} sub={`${e.categories.length} categories`} />
        <StatTile label="Routines scored" value={e.scores.reduce((n, s) => n + Object.keys(s.byApparatus).length, 0)} />
      </div>

      <Section title="All-around rankings" description="Total of every apparatus score. Choose a category.">
        <Tabs
          tabs={e.categories.map((cat) => ({
            label: cat,
            content: (
              <TableCard>
                <thead>
                  <tr>
                    <Th>Pl</Th><Th>Gymnast</Th>
                    {e.apparatus[cat].map((ap) => <Th key={ap} numeric>{ap}</Th>)}
                    <Th numeric>Total</Th>
                  </tr>
                </thead>
                <tbody>
                  {gymRanking(e, cat).map((r) => (
                    <tr key={r.athleteId}>
                      <Td><Place place={r.place} /></Td>
                      <Td><AthleteLink id={r.athleteId} /></Td>
                      {e.apparatus[cat].map((ap) => <Td key={ap} numeric>{r.byApparatus[ap].toFixed(3)}</Td>)}
                      <Td numeric className="font-semibold">{r.total.toFixed(3)}</Td>
                    </tr>
                  ))}
                </tbody>
              </TableCard>
            ),
          }))}
        />
      </Section>

      <Section title="Medal table" description="By school, all-around podiums.">
        <MedalTableView e={e} />
      </Section>
    </>
  );
}
