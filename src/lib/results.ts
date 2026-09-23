import raw from "@/data/results/sample.json";
import type {
  Athlete,
  CricketEdition,
  CricketMatch,
  Edition,
  FootballEdition,
  FootballMatch,
  GymnasticsEdition,
  ResultsData,
  School,
  TrackEdition,
  TrackEvent,
} from "@/types/results";

// Everything on the /results pages is derived here from the raw data file.
export const results = raw as unknown as ResultsData;

const athletesById = new Map(results.athletes.map((a) => [a.id, a]));
const schoolsById = new Map(results.schools.map((s) => [s.id, s]));

export const editions = [...results.editions].sort((a, b) => b.season.localeCompare(a.season));
export const getEdition = (slug: string) => editions.find((e) => e.slug === slug);
export const getAthlete = (id: string) => athletesById.get(id);
export const getSchool = (id: string) => schoolsById.get(id) as School;
export const schoolOf = (a: Athlete) => getSchool(a.schoolId);
export const editionForLeague = (leagueSlug: string) => editions.find((e) => e.leagueSlug === leagueSlug);

export const KIND_LABEL: Record<Edition["kind"], string> = {
  football: "League & knockouts",
  cricket: "Round robin & final",
  track: "Individual events",
  gymnastics: "Individual all-around",
};

// ---- Formatting ---------------------------------------------------------------

export function formatMark(mark: number, measure: TrackEvent["measure"]) {
  if (measure === "distance") return `${mark.toFixed(2)} m`;
  if (mark < 60) return `${mark.toFixed(2)}s`;
  const m = Math.floor(mark / 60);
  return `${m}:${(mark - m * 60).toFixed(2).padStart(5, "0")}`;
}

export const ordinal = (n: number) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

export type Medal = "gold" | "silver" | "bronze";
export const medalFor = (place: number): Medal | undefined =>
  place === 1 ? "gold" : place === 2 ? "silver" : place === 3 ? "bronze" : undefined;

// ---- Teams (football & cricket) -----------------------------------------------

type TeamEdition = FootballEdition | CricketEdition;
export const teamById = (e: TeamEdition, id: string) => e.teams.find((t) => t.id === id)!;
export const teamOfAthlete = (e: TeamEdition, athleteId: string) => e.teams.find((t) => t.squad.includes(athleteId));

export function footballWinner(m: FootballMatch) {
  if (m.homeGoals !== m.awayGoals) return m.homeGoals > m.awayGoals ? m.home : m.away;
  if (m.penalties) return m.penalties.home > m.penalties.away ? m.home : m.away;
  return undefined;
}

export function cricketWinner(m: CricketMatch) {
  const [a, b] = m.innings;
  return a.runs > b.runs ? a.teamId : b.teamId;
}

export type StandingRow = { teamId: string; p: number; w: number; d: number; l: number; gf: number; ga: number; pts: number };

export function footballStandings(e: FootballEdition, group: string): StandingRow[] {
  const rows = new Map<string, StandingRow>();
  for (const id of e.groups.find((g) => g.name === group)!.teamIds) rows.set(id, { teamId: id, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 });
  for (const m of e.matches.filter((x) => x.stage === "Group" && x.group === group)) {
    for (const [id, f, a] of [[m.home, m.homeGoals, m.awayGoals], [m.away, m.awayGoals, m.homeGoals]] as const) {
      const r = rows.get(id)!;
      r.p++; r.gf += f; r.ga += a;
      if (f > a) { r.w++; r.pts += 3; } else if (f === a) { r.d++; r.pts += 1; } else r.l++;
    }
  }
  return [...rows.values()].sort((x, y) => y.pts - x.pts || y.gf - y.ga - (x.gf - x.ga) || y.gf - x.gf);
}

export function cricketStandings(e: CricketEdition) {
  const rows = new Map(e.teams.map((t) => [t.id, { teamId: t.id, p: 0, w: 0, l: 0, pts: 0, runsFor: 0, runsAgainst: 0 }]));
  for (const m of e.matches.filter((x) => x.stage === "Group")) {
    const win = cricketWinner(m);
    for (const [i, inn] of m.innings.entries()) {
      const r = rows.get(inn.teamId)!;
      r.p++; r.runsFor += inn.runs; r.runsAgainst += m.innings[1 - i].runs;
      if (inn.teamId === win) { r.w++; r.pts += 2; } else r.l++;
    }
  }
  return [...rows.values()].sort((x, y) => y.pts - x.pts || y.runsFor - y.runsAgainst - (x.runsFor - x.runsAgainst));
}

/** Final placings: 1 = champion. Teams knocked out earlier get no placing. */
export function teamPlacings(e: TeamEdition): Map<string, number> {
  const places = new Map<string, number>();
  const winner = (m: FootballMatch | CricketMatch) => (e.kind === "football" ? footballWinner(m as FootballMatch) : cricketWinner(m as CricketMatch));
  const teamsIn = (m: FootballMatch | CricketMatch) => ("home" in m ? [m.home, m.away] : m.innings.map((i) => i.teamId));
  const final = e.matches.find((m) => m.stage === "Final");
  if (final) {
    const w = winner(final)!;
    places.set(w, 1);
    places.set(teamsIn(final).find((t) => t !== w)!, 2);
  }
  const third = e.matches.find((m) => m.stage === "3rd place");
  if (third) {
    const w = winner(third)!;
    places.set(w, 3);
    places.set(teamsIn(third).find((t) => t !== w)!, 4);
  }
  return places;
}

export function champion(e: Edition): string | undefined {
  if (e.kind === "football" || e.kind === "cricket") {
    const id = [...teamPlacings(e)].find(([, p]) => p === 1)?.[0];
    return id ? teamById(e, id).name : undefined;
  }
  return undefined;
}

export function topScorers(e: FootballEdition) {
  const goals = new Map<string, number>();
  for (const m of e.matches) for (const g of m.goals) goals.set(g.athleteId, (goals.get(g.athleteId) ?? 0) + 1);
  return [...goals]
    .map(([athleteId, n]) => ({ athleteId, teamId: teamOfAthlete(e, athleteId)!.id, goals: n }))
    .sort((a, b) => b.goals - a.goals || a.athleteId.localeCompare(b.athleteId));
}

/** Competition ranking: tied values share a rank (1, 2, 2, 4). */
export function rankOf<T>(rows: T[], value: (row: T) => number, i: number) {
  return rows.findIndex((r) => value(r) === value(rows[i])) + 1;
}

/** Top value and how many share it, e.g. { value: 3, count: 6 }. */
export function leaderTie<T>(rows: T[], value: (row: T) => number) {
  const top = rows.length ? value(rows[0]) : 0;
  return { value: top, count: rows.filter((r) => value(r) === top).length };
}

export function goalsByTeam(e: FootballEdition) {
  return e.teams
    .map((t) => ({ teamId: t.id, name: t.name, goals: e.matches.reduce((n, m) => n + m.goals.filter((g) => g.teamId === t.id).length, 0) }))
    .sort((a, b) => b.goals - a.goals);
}

export function battingLeaders(e: CricketEdition) {
  const map = new Map<string, { athleteId: string; teamId: string; runs: number; balls: number; innings: number; best: number }>();
  for (const m of e.matches) for (const p of m.performances) {
    if (p.runs === undefined) continue;
    const r = map.get(p.athleteId) ?? { athleteId: p.athleteId, teamId: p.teamId, runs: 0, balls: 0, innings: 0, best: 0 };
    r.runs += p.runs; r.balls += p.balls ?? 0; r.innings++; r.best = Math.max(r.best, p.runs);
    map.set(p.athleteId, r);
  }
  return [...map.values()].sort((a, b) => b.runs - a.runs);
}

export function bowlingLeaders(e: CricketEdition) {
  const map = new Map<string, { athleteId: string; teamId: string; wickets: number; runsConceded: number; matches: number }>();
  for (const m of e.matches) for (const p of m.performances) {
    if (p.wickets === undefined) continue;
    const r = map.get(p.athleteId) ?? { athleteId: p.athleteId, teamId: p.teamId, wickets: 0, runsConceded: 0, matches: 0 };
    r.wickets += p.wickets; r.runsConceded += p.runsConceded ?? 0; r.matches++;
    map.set(p.athleteId, r);
  }
  return [...map.values()].sort((a, b) => b.wickets - a.wickets || a.runsConceded - b.runsConceded);
}

// ---- Individual sports ------------------------------------------------------------

export function rankEvent(ev: TrackEvent) {
  const sorted = [...ev.results].sort((a, b) => (ev.measure === "time" ? a.mark - b.mark : b.mark - a.mark));
  return sorted.map((r, i) => ({ ...r, place: i + 1 }));
}

export function gymRanking(e: GymnasticsEdition, category: string) {
  return e.scores
    .filter((s) => s.category === category)
    .map((s) => ({ ...s, total: Object.values(s.byApparatus).reduce((a, b) => a + b, 0) }))
    .sort((a, b) => b.total - a.total)
    .map((s, i) => ({ ...s, place: i + 1 }));
}

/** Medals by school for individual-sport editions (track events + gymnastics all-around). */
export function medalTable(eds: Edition[] = editions) {
  const table = new Map<string, { schoolId: string; gold: number; silver: number; bronze: number }>();
  const add = (athleteId: string, place: number) => {
    const medal = medalFor(place);
    if (!medal) return;
    const schoolId = getAthlete(athleteId)!.schoolId;
    const row = table.get(schoolId) ?? { schoolId, gold: 0, silver: 0, bronze: 0 };
    row[medal]++;
    table.set(schoolId, row);
  };
  for (const e of eds) {
    if (e.kind === "track") for (const ev of e.events) for (const r of rankEvent(ev)) add(r.athleteId, r.place);
    if (e.kind === "gymnastics") for (const c of e.categories) for (const r of gymRanking(e, c)) add(r.athleteId, r.place);
  }
  return [...table.values()].sort((a, b) => b.gold - a.gold || b.silver - a.silver || b.bronze - a.bronze);
}

// ---- Athletes -----------------------------------------------------------------

export type Participation =
  | { kind: "football"; edition: FootballEdition; teamId: string; matches: FootballMatch[]; goals: number; playerOfMatch: number; teamPlace?: number; goalsByMatch: { match: FootballMatch; goals: number }[] }
  | { kind: "cricket"; edition: CricketEdition; teamId: string; matches: CricketMatch[]; runs: number; wickets: number; best: number; teamPlace?: number; runsByMatch: { match: CricketMatch; runs: number; wickets: number }[] }
  | { kind: "track"; edition: TrackEdition; category: string; entries: { event: TrackEvent; mark: number; place: number }[] }
  | { kind: "gymnastics"; edition: GymnasticsEdition; category: string; place: number; total: number; byApparatus: Record<string, number>; fieldSize: number };

export function participationsOf(athleteId: string): Participation[] {
  const out: Participation[] = [];
  for (const e of editions) {
    if (e.kind === "football") {
      const team = teamOfAthlete(e, athleteId);
      if (!team) continue;
      const matches = e.matches.filter((m) => m.home === team.id || m.away === team.id);
      const goalsByMatch = matches.map((match) => ({ match, goals: match.goals.filter((g) => g.athleteId === athleteId).length }));
      out.push({
        kind: "football", edition: e, teamId: team.id, matches,
        goals: goalsByMatch.reduce((n, g) => n + g.goals, 0),
        playerOfMatch: matches.filter((m) => m.playerOfMatch === athleteId).length,
        teamPlace: teamPlacings(e).get(team.id), goalsByMatch,
      });
    } else if (e.kind === "cricket") {
      const team = teamOfAthlete(e, athleteId);
      if (!team) continue;
      const matches = e.matches.filter((m) => m.innings.some((i) => i.teamId === team.id));
      const runsByMatch = matches.map((match) => {
        const ps = match.performances.filter((p) => p.athleteId === athleteId);
        return { match, runs: ps.reduce((n, p) => n + (p.runs ?? 0), 0), wickets: ps.reduce((n, p) => n + (p.wickets ?? 0), 0) };
      });
      out.push({
        kind: "cricket", edition: e, teamId: team.id, matches,
        runs: runsByMatch.reduce((n, r) => n + r.runs, 0),
        wickets: runsByMatch.reduce((n, r) => n + r.wickets, 0),
        best: Math.max(0, ...runsByMatch.map((r) => r.runs)),
        teamPlace: teamPlacings(e).get(team.id), runsByMatch,
      });
    } else if (e.kind === "track") {
      const entries = e.events.flatMap((event) => {
        const r = rankEvent(event).find((x) => x.athleteId === athleteId);
        return r ? [{ event, mark: r.mark, place: r.place }] : [];
      });
      if (entries.length) out.push({ kind: "track", edition: e, category: entries[0].event.category, entries });
    } else {
      const score = e.scores.find((s) => s.athleteId === athleteId);
      if (!score) continue;
      const ranking = gymRanking(e, score.category);
      const me = ranking.find((r) => r.athleteId === athleteId)!;
      out.push({ kind: "gymnastics", edition: e, category: score.category, place: me.place, total: me.total, byApparatus: score.byApparatus, fieldSize: ranking.length });
    }
  }
  return out;
}

/** One-line headline for a participation, used in lists and timelines. */
export function participationHeadline(p: Participation) {
  switch (p.kind) {
    case "football": {
      const finish = p.teamPlace ? `team finished ${ordinal(p.teamPlace)}` : "team out in the group stage";
      return `${p.goals} goal${p.goals === 1 ? "" : "s"} in ${p.matches.length} matches · ${finish}`;
    }
    case "cricket": {
      const finish = p.teamPlace === 1 ? "champions" : p.teamPlace === 2 ? "runners-up" : "group stage";
      return `${p.runs} runs, ${p.wickets} wicket${p.wickets === 1 ? "" : "s"} · ${finish}`;
    }
    case "track": {
      const medals = p.entries.filter((x) => x.place <= 3).length;
      return `${p.entries.length} events · ${medals ? `${medals} medal${medals === 1 ? "" : "s"}` : `best ${ordinal(Math.min(...p.entries.map((x) => x.place)))}`}`;
    }
    case "gymnastics":
      return `${ordinal(p.place)} all-around of ${p.fieldSize} · ${p.total.toFixed(3)} pts`;
  }
}

export function podiumsOf(ps: Participation[]) {
  let n = 0;
  for (const p of ps) {
    if ((p.kind === "football" || p.kind === "cricket") && p.teamPlace && p.teamPlace <= 3) n++;
    if (p.kind === "track") n += p.entries.filter((x) => x.place <= 3).length;
    if (p.kind === "gymnastics" && p.place <= 3) n++;
  }
  return n;
}

export function athleteSports(id: string) {
  return [...new Set(participationsOf(id).map((p) => p.edition.sport))];
}

/** Compact index used by the client-side athlete search. */
export function athleteIndex() {
  return results.athletes.map((a) => {
    const ps = participationsOf(a.id);
    return {
      id: a.id,
      name: a.name,
      school: getSchool(a.schoolId).name,
      city: getSchool(a.schoolId).city,
      sports: [...new Set(ps.map((p) => p.edition.sport))],
      editions: ps.map((p) => p.edition.slug),
      podiums: podiumsOf(ps),
    };
  });
}
export type AthleteIndexEntry = ReturnType<typeof athleteIndex>[number];

export function totals() {
  const matches = results.editions.reduce((n, e) => n + (e.kind === "football" || e.kind === "cricket" ? e.matches.length : 0), 0);
  const marks = results.editions.reduce((n, e) => n + (e.kind === "track" ? e.events.reduce((m, ev) => m + ev.results.length, 0) : e.kind === "gymnastics" ? e.scores.length : 0), 0);
  return { athletes: results.athletes.length, schools: results.schools.length, editions: results.editions.length, matches, marks };
}

export function participantCount(e: Edition) {
  if (e.kind === "football" || e.kind === "cricket") return e.teams.reduce((n, t) => n + t.squad.length, 0);
  if (e.kind === "track") return new Set(e.events.flatMap((ev) => ev.results.map((r) => r.athleteId))).size;
  return e.scores.length;
}
