// Generates demo results data for the /results dashboard.
//
//   node scripts/generate-sample-results.mjs
//
// Output: src/data/results/sample.json (shape: ResultsData in src/types/results.ts).
// Seeded, so every run produces the same file. All schools and athletes are
// fictional. Replace the JSON with real results when they're available.
//
// Leagues run over several seasons and athletes carry over between them (moving
// up an age group as they get older), so profiles have a real history. Ten
// athletes are marked as having a public profile, standing in for the athletes
// whose parents have opted in.

import { writeFileSync, mkdirSync } from "node:fs";

// ---- Seeded randomness --------------------------------------------------------
let seed = 20260923;
const rand = () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const int = (min, max) => Math.floor(rand() * (max - min + 1)) + min;
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
// Rough Poisson for goal counts.
const poisson = (lambda) => {
  let k = 0;
  let p = 1;
  const l = Math.exp(-lambda);
  do {
    k++;
    p *= rand();
  } while (p > l);
  return k - 1;
};
const round = (n, dp) => Math.round(n * 10 ** dp) / 10 ** dp;
const clamp01 = (n) => Math.min(1, Math.max(0, n));

// ---- Schools ------------------------------------------------------------------
const SCHOOLS = {
  Jalpaiguri: ["Teesta Valley School", "Northfield Academy", "Kanchan Public School", "Riverbend International", "Dooars Model School", "Silverline Academy", "Greenridge School", "Sunrise Vidyalaya"],
  Gwalior: ["Fortview Public School", "Scindia Heights Academy", "Chambal Valley School", "Lakeside International", "Morar Model School", "Tansen Public School", "Kingsway Academy", "Pinewood School"],
  Dehradun: ["Doon Ridge School", "Mussoorie Road Academy", "Rajpur Valley School", "Himalayan Heights School", "Cedarwood International", "Saharanpur Road School", "Forest Hill Academy", "Maldevta Public School"],
};
const schools = [];
for (const [city, names] of Object.entries(SCHOOLS)) {
  for (const name of names) schools.push({ id: `s${schools.length + 1}`, name, city });
}
const schoolsIn = (city) => schools.filter((s) => s.city === city);

// ---- Athletes -----------------------------------------------------------------
// Internal fields (not written out): `born` (a school-year cohort; age group in a
// season is season - born) and `talent` (0 = best .. 1), which improves each year.
const BOYS = ["Aarav", "Vivaan", "Aditya", "Arjun", "Reyansh", "Kabir", "Ishaan", "Ayaan", "Krishna", "Rohan", "Dev", "Arnav", "Yash", "Rudra", "Atharv", "Veer", "Samar", "Tenzin", "Pemba", "Rahul", "Nikhil", "Siddharth", "Om", "Laksh", "Parth", "Aryan", "Dhruv", "Karan", "Manav", "Neel", "Harsh", "Anirudh", "Kunal", "Sahil", "Vihaan", "Rishi"];
const GIRLS = ["Aanya", "Diya", "Saanvi", "Ananya", "Aadhya", "Myra", "Ira", "Kiara", "Anika", "Riya", "Pari", "Tara", "Meera", "Navya", "Sara", "Avni", "Ishita", "Nisha", "Kavya", "Pooja", "Tashi", "Dolma", "Sneha", "Zoya", "Aisha", "Nandini", "Shreya", "Mahi", "Jiya", "Anvi"];
const INITIALS = "ABCDGJKMNPRSTVY";
const athletes = [];
const newAthlete = (sex, schoolId, born) => {
  const a = {
    id: `a${String(athletes.length + 1).padStart(4, "0")}`,
    name: `${pick(sex === "M" ? BOYS : GIRLS)} ${pick([...INITIALS])}.`,
    sex,
    schoolId,
    born,
    talent: rand(),
  };
  athletes.push(a);
  return a;
};
/** Years into the age band: 0–1 = U-12, 2–3 = U-14 (for the Dehradun leagues). */
const yearIn = (a, season) => season - a.born;
const ageGroup = (a, season) => {
  const y = yearIn(a, season);
  return y < 0 || y > 3 ? undefined : y <= 1 ? "U-12" : "U-14";
};
/** Talent in a season: athletes improve a little each year. */
const form = (a, season) => clamp01(a.talent - 0.07 * yearIn(a, season) + (rand() - 0.5) * 0.12);

// ---- Football -----------------------------------------------------------------
function football({ slug, leagueSlug, name, season, startsOn, endsOn, venue, category, squads }) {
  const teams = squads.map(({ school, players }, i) => ({
    id: `${slug}-t${i + 1}`,
    name: school.name,
    schoolId: school.id,
    squad: players.map((p) => p.id),
  }));
  const strength = Object.fromEntries(
    teams.map((t, i) => {
      const players = squads[i].players;
      const avg = players.reduce((n, p) => n + p.talent, 0) / players.length;
      return [t.id, 0.7 + (1 - avg) * 0.9 + rand() * 0.3];
    }),
  );
  const shuffled = shuffle(teams.map((t) => t.id));
  const groups = [
    { name: "A", teamIds: shuffled.slice(0, 4) },
    { name: "B", teamIds: shuffled.slice(4, 8) },
  ];
  const matches = [];
  const play = (home, away, stage, day, group) => {
    const homeGoals = poisson((1.4 * strength[home]) / strength[away] ** 0.5);
    const awayGoals = poisson((1.4 * strength[away]) / strength[home] ** 0.5);
    const scorer = (teamId) => {
      const squad = teams.find((t) => t.id === teamId).squad;
      // Forwards (first few in the squad) score more often.
      return rand() < 0.6 ? squad[int(0, 3)] : pick(squad);
    };
    const goals = [
      ...Array.from({ length: homeGoals }, () => ({ athleteId: scorer(home), teamId: home, minute: int(1, 40) })),
      ...Array.from({ length: awayGoals }, () => ({ athleteId: scorer(away), teamId: away, minute: int(1, 40) })),
    ].sort((a, b) => a.minute - b.minute);
    const m = { id: `${slug}-m${matches.length + 1}`, day, stage, ...(group ? { group } : {}), home, away, homeGoals, awayGoals, goals };
    if (stage !== "Group" && homeGoals === awayGoals) {
      const h = int(3, 5);
      m.penalties = rand() < 0.5 ? { home: h, away: h - int(1, 2) } : { home: h - int(1, 2), away: h };
    }
    const winnerTeam = homeGoals > awayGoals ? home : awayGoals > homeGoals ? away : pick([home, away]);
    const winnerScorers = goals.filter((g) => g.teamId === winnerTeam).map((g) => g.athleteId);
    m.playerOfMatch = winnerScorers.length ? pick(winnerScorers) : teams.find((t) => t.id === winnerTeam).squad[int(0, 5)];
    matches.push(m);
    return m;
  };
  for (const g of groups) {
    const [a, b, c, d] = g.teamIds;
    for (const [h, aw] of [[a, b], [c, d], [a, c], [b, d], [a, d], [b, c]]) play(h, aw, "Group", 1, g.name);
  }
  // Group standings for the knockouts.
  const table = (g) =>
    g.teamIds
      .map((id) => {
        let pts = 0, gd = 0, gf = 0;
        for (const m of matches.filter((x) => x.group === g.name)) {
          if (m.home !== id && m.away !== id) continue;
          const f = m.home === id ? m.homeGoals : m.awayGoals;
          const a = m.home === id ? m.awayGoals : m.homeGoals;
          gf += f; gd += f - a; pts += f > a ? 3 : f === a ? 1 : 0;
        }
        return { id, pts, gd, gf };
      })
      .sort((x, y) => y.pts - x.pts || y.gd - x.gd || y.gf - x.gf);
  const [A, B] = groups.map(table);
  const winner = (m) => (m.homeGoals + (m.penalties?.home ?? 0) / 10 > m.awayGoals + (m.penalties?.away ?? 0) / 10 ? m.home : m.away);
  const loser = (m) => (winner(m) === m.home ? m.away : m.home);
  const sf1 = play(A[0].id, B[1].id, "Semi-final", 2);
  const sf2 = play(B[0].id, A[1].id, "Semi-final", 2);
  play(loser(sf1), loser(sf2), "3rd place", 2);
  play(winner(sf1), winner(sf2), "Final", 2);
  return { kind: "football", slug, leagueSlug, name, sport: "Football", season, startsOn, endsOn, venue, categories: [category], teams, groups, matches };
}

// ---- Cricket ------------------------------------------------------------------
function cricket({ slug, leagueSlug, name, season, startsOn, endsOn, venue, overs, squads }) {
  const teams = squads.map(({ school, players }, i) => ({
    id: `${slug}-t${i + 1}`,
    name: school.name,
    schoolId: school.id,
    squad: players.map((p) => p.id),
  }));
  const strength = Object.fromEntries(teams.map((t) => [t.id, 0.8 + rand() * 0.5]));
  const talentOf = Object.fromEntries(squads.flatMap(({ players }) => players.map((p) => [p.id, form(p, Number(season))])));
  const matches = [];
  const innings = (teamId, oppId) => {
    const wickets = int(3, 9);
    const runs = Math.round(((70 + rand() * 70) * strength[teamId]) / strength[oppId] ** 0.4);
    return { teamId, runs, wickets, overs };
  };
  const play = (t1, t2, stage, day) => {
    const inn = [innings(t1, t2), innings(t2, t1)];
    if (inn[0].runs === inn[1].runs) inn[1].runs += 1;
    const performances = [];
    for (const [i, x] of inn.entries()) {
      const bat = teams.find((t) => t.id === x.teamId).squad;
      const bowl = teams.find((t) => t.id === inn[1 - i].teamId).squad;
      // Split runs across the top six batters; better batters take a bigger share.
      const weights = [0.26, 0.22, 0.17, 0.13, 0.1, 0.07].map((w, j) => w * (0.5 + rand() * 0.8) * (1.4 - talentOf[bat[j]] * 0.8));
      const total = weights.reduce((a, b) => a + b, 0);
      let left = x.runs - int(4, 12); // extras
      weights.forEach((w, j) => {
        const r = j === 5 ? Math.max(0, left) : Math.max(0, Math.round((w / total) * (x.runs - 8)));
        left -= r;
        performances.push({ athleteId: bat[j], teamId: x.teamId, runs: r, balls: Math.max(r, Math.round(r * (0.9 + rand() * 0.6)) + int(1, 6)) });
      });
      // Share wickets and runs across five bowlers (the last five in the squad).
      let w = x.wickets;
      bowl.slice(6, 11).forEach((b, j) => {
        const taken = j === 4 ? w : Math.min(w, int(0, 3));
        w -= taken;
        performances.push({ athleteId: b, teamId: inn[1 - i].teamId, wickets: taken, runsConceded: Math.max(4, Math.round(x.runs / 5 + int(-6, 6))) });
      });
    }
    const winTeam = inn[0].runs > inn[1].runs ? inn[0].teamId : inn[1].teamId;
    const top = performances
      .filter((p) => p.teamId === winTeam)
      .sort((a, b) => (b.runs ?? 0) + (b.wickets ?? 0) * 20 - ((a.runs ?? 0) + (a.wickets ?? 0) * 20))[0];
    matches.push({ id: `${slug}-m${matches.length + 1}`, day, stage, innings: inn, performances, playerOfMatch: top.athleteId });
  };
  const ids = teams.map((t) => t.id);
  let day = 1;
  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      play(ids[i], ids[j], "Group", day);
      if (matches.length % 3 === 0) day++;
    }
  }
  // Final between the top two by wins.
  const wins = Object.fromEntries(ids.map((id) => [id, 0]));
  for (const m of matches) wins[m.innings[0].runs > m.innings[1].runs ? m.innings[0].teamId : m.innings[1].teamId]++;
  const [f1, f2] = [...ids].sort((a, b) => wins[b] - wins[a]);
  play(f1, f2, "Final", day + 1);
  return { kind: "cricket", slug, leagueSlug, name, sport: "Cricket", season, startsOn, endsOn, venue, categories: ["U-12"], oversPerSide: overs, teams, matches };
}

// ---- Track & field ------------------------------------------------------------
// Typical U-12 marks; U-14 athletes are ~7% better.
const TRACK = [
  { name: "100m", measure: "time", base: { M: 13.6, F: 14.2 }, spread: 1.6 },
  { name: "200m", measure: "time", base: { M: 28.4, F: 29.8 }, spread: 3.4 },
  { name: "600m", measure: "time", base: { M: 112, F: 121 }, spread: 22 },
  { name: "Long jump", measure: "distance", base: { M: 4.3, F: 3.9 }, spread: 1.0 },
  { name: "Shot put", measure: "distance", base: { M: 8.6, F: 7.4 }, spread: 2.2 },
];
function track({ slug, leagueSlug, name, season, startsOn, endsOn, venue, pool }) {
  const cats = [["U-12", "M"], ["U-12", "F"], ["U-14", "M"], ["U-14", "F"]];
  const entries = new Map(TRACK.map((ev) => [ev.name, []]));
  const events = [];
  for (const [age, sex] of cats) {
    const category = `${age} ${sex === "M" ? "Boys" : "Girls"}`;
    const byEvent = new Map(TRACK.map((ev) => [ev.name, []]));
    // Each athlete enters two or three events: sprinters sprint, throwers throw.
    for (const a of pool.filter((x) => x.sex === sex && ageGroup(x, Number(season)) === age)) {
      const pref = a.id.charCodeAt(4) % 2 === 0 ? ["100m", "200m", "Long jump", "600m", "Shot put"] : ["Shot put", "600m", "Long jump", "100m", "200m"];
      for (const ev of pref.slice(0, int(2, 3))) byEvent.get(ev).push(a);
    }
    for (const ev of TRACK) {
      const factor = age === "U-14" ? (ev.measure === "time" ? 0.93 : 1.08) : 1;
      const results = byEvent.get(ev.name).map((a) => {
        const t = form(a, Number(season));
        const base = ev.base[sex] * factor;
        const mark = ev.measure === "time"
          ? base - ev.spread * 0.4 + t * ev.spread + (rand() - 0.5) * ev.spread * 0.3
          : base + ev.spread * 0.4 - t * ev.spread + (rand() - 0.5) * ev.spread * 0.3;
        return { athleteId: a.id, mark: round(mark, 2) };
      });
      if (results.length) events.push({ id: `${slug}-${age}-${sex}-${ev.name}`.toLowerCase().replace(/[^a-z0-9]+/g, "-"), name: ev.name, category, measure: ev.measure, results });
      entries.get(ev.name).push(...results);
    }
  }
  return { kind: "track", slug, leagueSlug, name, sport: "Athletics", season, startsOn, endsOn, venue, categories: cats.map(([a, s]) => `${a} ${s === "M" ? "Boys" : "Girls"}`), events };
}

// ---- Gymnastics ---------------------------------------------------------------
const APPARATUS = {
  "U-12 Girls": ["Vault", "Bars", "Beam", "Floor"],
  "U-14 Girls": ["Vault", "Bars", "Beam", "Floor"],
  "U-12 Boys": ["Floor", "Pommel horse", "Vault", "High bar"],
};
function gymnastics({ slug, leagueSlug, name, season, startsOn, endsOn, venue, pool }) {
  const scores = [];
  for (const [category, list] of Object.entries(APPARATUS)) {
    const [age, who] = category.split(" ");
    const sex = who === "Girls" ? "F" : "M";
    for (const a of pool.filter((x) => x.sex === sex && ageGroup(x, Number(season)) === age)) {
      const t = form(a, Number(season));
      // Each gymnast has a stronger and a weaker apparatus.
      const bias = Object.fromEntries(list.map((ap) => [ap, (rand() - 0.5) * 1.1]));
      const byApparatus = Object.fromEntries(list.map((ap) => [ap, round(12.6 - t * 3 + bias[ap] + (rand() - 0.5) * 0.8, 3)]));
      scores.push({ athleteId: a.id, category, byApparatus });
    }
  }
  const apparatus = Object.fromEntries(Object.entries(APPARATUS).filter(([c]) => scores.some((s) => s.category === c)));
  return { kind: "gymnastics", slug, leagueSlug, name, sport: "Gymnastics", season, startsOn, endsOn, venue, categories: Object.keys(apparatus), apparatus, scores };
}

// ---- Rosters ------------------------------------------------------------------
// Gwalior U-13 football: squads of 12 per school. Each year the oldest players
// move on and new ones join, so about two thirds of a squad carry over.
const gwalior = schoolsIn("Gwalior");
const gwaliorSquads = new Map(gwalior.map((s) => [s.id, []]));
function gwaliorSquadsFor(season) {
  return gwalior.map((school) => {
    const current = gwaliorSquads.get(school.id).filter((p) => season - p.born <= 1);
    while (current.length < 12) current.push(newAthlete("M", school.id, season - int(0, 1)));
    // Forwards first: the most talented players lead the line.
    current.sort((a, b) => a.talent - b.talent);
    gwaliorSquads.set(school.id, current);
    return { school, players: [...current] };
  });
}

// Dehradun: one pool of athletes who do track, and some also gymnastics or
// cricket. Cohorts cover 2023–2026 entry years so both seasons have a full field.
const dehradun = schoolsIn("Dehradun");
const pool = [];
for (let born = 2021; born <= 2025; born++) {
  for (const sex of ["M", "F"]) {
    for (let i = 0; i < 7; i++) pool.push(newAthlete(sex, pick(dehradun).id, born));
  }
}
// Gymnasts: some from the track pool, plus gymnastics-only athletes.
const gymPool = shuffle(pool).slice(0, 18);
for (let born = 2021; born <= 2025; born++) {
  for (const sex of ["F", "F", "M"]) gymPool.push(newAthlete(sex, pick(dehradun).id, born));
}

// Cricket: six schools, U-12 squads of 11. A few track athletes open the batting
// for their school; the rest are cricket-only players who stay while they're U-12.
const cricketSchools = dehradun.slice(0, 6);
const cricketOnly = new Map(cricketSchools.map((s) => [s.id, []]));
function cricketSquadsFor(season) {
  return cricketSchools.map((school) => {
    const trackers = pool.filter((a) => a.sex === "M" && a.schoolId === school.id && ageGroup(a, season) === "U-12").slice(0, 3);
    const regulars = cricketOnly.get(school.id).filter((p) => ageGroup(p, season) === "U-12");
    while (trackers.length + regulars.length < 11) regulars.push(newAthlete(rand() < 0.2 ? "F" : "M", school.id, season - int(0, 1)));
    cricketOnly.set(school.id, regulars);
    const players = [...trackers, ...regulars].slice(0, 11);
    // Batters first (best first), bowlers last.
    const batters = players.slice(0, 6).sort((a, b) => a.talent - b.talent);
    return { school, players: [...batters, ...players.slice(6)] };
  });
}

// ---- Build --------------------------------------------------------------------
const editions = [];

editions.push(gymnastics({
  slug: "gymnastics-premier-league-2024", leagueSlug: "gymnastics-premier-league",
  name: "Gymnastics Premier League", season: "2024", startsOn: "2024-08-24", endsOn: "2024-08-25", venue: "Dehradun", pool: gymPool,
}));
editions.push(football({
  slug: "burgeoning-football-league-2024", leagueSlug: "burgeoning-football-league",
  name: "1st Burgeoning Football League", season: "2024", startsOn: "2024-11-16", endsOn: "2024-11-17",
  venue: "LNIPE, Gwalior", category: "U-13", squads: gwaliorSquadsFor(2024),
}));
editions.push(cricket({
  slug: "u12-cricket-league-2024", leagueSlug: "u12-cricket-league",
  name: "U12 Cricket League", season: "2024", startsOn: "2024-12-07", endsOn: "2024-12-14", venue: "Dehradun", overs: 15, squads: cricketSquadsFor(2024),
}));
editions.push(gymnastics({
  slug: "gymnastics-premier-league-2025", leagueSlug: "gymnastics-premier-league",
  name: "Gymnastics Premier League", season: "2025", startsOn: "2025-08-23", endsOn: "2025-08-24", venue: "Dehradun", pool: gymPool,
}));
editions.push(track({
  slug: "track-and-field-championship-2025", leagueSlug: "track-and-field-championship",
  name: "1st Burgeoning Track and Field Championship", season: "2025", startsOn: "2025-10-18", endsOn: "2025-10-19", venue: "Dehradun", pool,
}));
editions.push(football({
  slug: "burgeoning-football-league-2025", leagueSlug: "burgeoning-football-league",
  name: "2nd Burgeoning Football League", season: "2025", startsOn: "2025-11-15", endsOn: "2025-11-16",
  venue: "LNIPE, Gwalior", category: "U-13", squads: gwaliorSquadsFor(2025),
}));
editions.push(cricket({
  slug: "u12-cricket-league-2025", leagueSlug: "u12-cricket-league",
  name: "U12 Cricket League", season: "2025", startsOn: "2025-12-06", endsOn: "2025-12-13", venue: "Dehradun", overs: 15, squads: cricketSquadsFor(2025),
}));
editions.push(football({
  slug: "u10-inter-school-football-2026", leagueSlug: "u10-inter-school-football-2026",
  name: "1st Burgeoning U-10 Inter-School Football League", season: "2026", startsOn: "2026-09-19", endsOn: "2026-09-20",
  venue: "SAP 12th Battalion Ground, Jalpaiguri", category: "U-10",
  squads: schoolsIn("Jalpaiguri").map((school) => ({ school, players: Array.from({ length: 10 }, () => newAthlete("M", school.id, 2026)).sort((a, b) => a.talent - b.talent) })),
}));

// Scheduled leagues without results yet (shown on the calendar).
const fixtures = [
  { slug: "gymnastics-premier-league-2026", leagueSlug: "gymnastics-premier-league", name: "Gymnastics Premier League", sport: "Gymnastics", season: "2026", startsOn: "2026-09-22", endsOn: "2026-09-24", venue: "Dehradun" },
  { slug: "track-and-field-championship-2026", leagueSlug: "track-and-field-championship", name: "2nd Burgeoning Track and Field Championship", sport: "Athletics", season: "2026", startsOn: "2026-10-17", endsOn: "2026-10-18", registrationCloses: "2026-10-05", venue: "Dehradun" },
  { slug: "burgeoning-football-league-2026", leagueSlug: "burgeoning-football-league", name: "3rd Burgeoning Football League", sport: "Football", season: "2026", startsOn: "2026-11-14", endsOn: "2026-11-15", registrationCloses: "2026-10-31", venue: "LNIPE, Gwalior" },
  { slug: "u12-cricket-league-2026", leagueSlug: "u12-cricket-league", name: "U12 Cricket League", sport: "Cricket", season: "2026", startsOn: "2026-12-05", endsOn: "2026-12-12", venue: "Dehradun" },
];

// ---- Output -------------------------------------------------------------------
const editionsOf = new Map();
for (const e of editions) {
  const ids = new Set();
  if (e.kind === "football" || e.kind === "cricket") e.teams.forEach((t) => t.squad.forEach((id) => ids.add(id)));
  if (e.kind === "track") e.events.forEach((ev) => ev.results.forEach((r) => ids.add(r.athleteId)));
  if (e.kind === "gymnastics") e.scores.forEach((s) => ids.add(s.athleteId));
  for (const id of ids) editionsOf.set(id, [...(editionsOf.get(id) ?? []), e]);
}
const used = athletes.filter((a) => editionsOf.has(a.id));

// Ten public profiles: athletes with the longest histories, across sports and
// both boys and girls, plus the top scorer of the newest league.
const sportsOf = (a) => new Set(editionsOf.get(a.id).map((e) => e.sport));
const chosen = [];
const take = (filter, n) => {
  const candidates = shuffle(used.filter((a) => !chosen.includes(a) && filter(a)))
    .sort((a, b) => editionsOf.get(b.id).length - editionsOf.get(a.id).length);
  chosen.push(...candidates.slice(0, n));
};
take((a) => sportsOf(a).size >= 3, 2);
take((a) => sportsOf(a).has("Gymnastics") && sportsOf(a).has("Athletics") && a.sex === "F", 2);
take((a) => sportsOf(a).has("Cricket") && sportsOf(a).has("Athletics"), 1);
take((a) => sportsOf(a).has("Cricket") && editionsOf.get(a.id).length >= 2, 1);
take((a) => sportsOf(a).has("Football") && editionsOf.get(a.id).length >= 2, 2);
take((a) => sportsOf(a).has("Gymnastics") && editionsOf.get(a.id).length >= 2 && a.sex === "M", 1);
const u10 = editions.find((e) => e.slug === "u10-inter-school-football-2026");
const goals = new Map();
for (const m of u10.matches) for (const g of m.goals) goals.set(g.athleteId, (goals.get(g.athleteId) ?? 0) + 1);
const topU10 = [...goals].sort((a, b) => b[1] - a[1])[0][0];
chosen.push(used.find((a) => a.id === topU10));

const profiles = new Set(chosen.map((a) => a.id));
const data = {
  sample: true,
  schools,
  athletes: used.map(({ id, name, sex, schoolId }) => ({ id, name, sex, schoolId, ...(profiles.has(id) ? { profile: true } : {}) })),
  editions,
  fixtures,
};

mkdirSync("src/data/results", { recursive: true });
writeFileSync("src/data/results/sample.json", JSON.stringify(data));
console.log(`${data.athletes.length} athletes (${profiles.size} with profiles), ${schools.length} schools, ${editions.length} editions, ${fixtures.length} fixtures`);
for (const a of chosen) console.log(`  ${a.id} ${a.name.padEnd(12)} ${editionsOf.get(a.id).map((e) => e.slug).join(", ")}`);
