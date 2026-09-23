// Generates demo results data for the /results dashboard.
//
//   node scripts/generate-sample-results.mjs
//
// Output: src/data/results/sample.json (shape: ResultsData in src/types/results.ts).
// Seeded, so every run produces the same file. All schools and athletes are
// fictional. Replace the JSON with real results when they're available.

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

// ---- Schools ------------------------------------------------------------------
const SCHOOLS = {
  Jalpaiguri: ["Teesta Valley School", "Northfield Academy", "Kanchan Public School", "Riverbend International", "Dooars Model School", "Silverline Academy", "Greenridge School", "Sunrise Vidyalaya"],
  Gwalior: ["Fortview Public School", "Scindia Heights Academy", "Chambal Valley School", "Lakeside International", "Morar Model School", "Tansen Public School", "Kingsway Academy", "Pinewood School"],
  Dehradun: ["Doon Ridge School", "Mussoorie Road Academy", "Rajpur Valley School", "Himalayan Heights School", "Cedarwood International", "Saharanpur Road School", "Forest Hill Academy", "Maldevta Public School"],
};
const schools = [];
for (const [city, names] of Object.entries(SCHOOLS)) {
  for (const name of names) {
    schools.push({ id: `s${schools.length + 1}`, name, city });
  }
}
const schoolsIn = (city) => schools.filter((s) => s.city === city);

// ---- Athletes -----------------------------------------------------------------
const BOYS = ["Aarav", "Vivaan", "Aditya", "Arjun", "Reyansh", "Kabir", "Ishaan", "Ayaan", "Krishna", "Rohan", "Dev", "Arnav", "Yash", "Rudra", "Atharv", "Veer", "Samar", "Tenzin", "Pemba", "Rahul", "Nikhil", "Siddharth", "Om", "Laksh", "Parth", "Aryan", "Dhruv", "Karan", "Manav", "Neel", "Harsh", "Anirudh", "Kunal", "Sahil", "Vihaan", "Rishi"];
const GIRLS = ["Aanya", "Diya", "Saanvi", "Ananya", "Aadhya", "Myra", "Ira", "Kiara", "Anika", "Riya", "Pari", "Tara", "Meera", "Navya", "Sara", "Avni", "Ishita", "Nisha", "Kavya", "Pooja", "Tashi", "Dolma", "Sneha", "Zoya", "Aisha", "Nandini", "Shreya", "Mahi", "Jiya", "Anvi"];
const INITIALS = "ABCDGJKMNPRSTVY";
const athletes = [];
const newAthlete = (sex, schoolId) => {
  const a = {
    id: `a${String(athletes.length + 1).padStart(4, "0")}`,
    name: `${pick(sex === "M" ? BOYS : GIRLS)} ${pick([...INITIALS])}.`,
    sex,
    schoolId,
  };
  athletes.push(a);
  return a;
};

// ---- Football -----------------------------------------------------------------
function football({ slug, leagueSlug, name, season, venue, city, category, squadSize, days }) {
  const teams = schoolsIn(city).map((s, i) => ({
    id: `${slug}-t${i + 1}`,
    name: s.name,
    schoolId: s.id,
    squad: Array.from({ length: squadSize }, () => newAthlete("M", s.id).id),
  }));
  const strength = Object.fromEntries(teams.map((t) => [t.id, 0.7 + rand() * 0.9]));
  const shuffled = shuffle(teams.map((t) => t.id));
  const groups = [
    { name: "A", teamIds: shuffled.slice(0, 4) },
    { name: "B", teamIds: shuffled.slice(4, 8) },
  ];
  const matches = [];
  const play = (home, away, stage, day, group) => {
    const homeGoals = poisson(1.4 * strength[home] / strength[away] ** 0.5);
    const awayGoals = poisson(1.4 * strength[away] / strength[home] ** 0.5);
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
  const sf1 = play(A[0].id, B[1].id, "Semi-final", days, undefined);
  const sf2 = play(B[0].id, A[1].id, "Semi-final", days, undefined);
  play(loser(sf1), loser(sf2), "3rd place", days, undefined);
  play(winner(sf1), winner(sf2), "Final", days, undefined);
  return { kind: "football", slug, leagueSlug, name, sport: "Football", season, venue, categories: [category], teams, groups, matches };
}

// ---- Cricket ------------------------------------------------------------------
function cricket({ slug, leagueSlug, name, season, venue, city, overs }) {
  const teams = schoolsIn(city).slice(0, 6).map((s, i) => ({
    id: `${slug}-t${i + 1}`,
    name: s.name,
    schoolId: s.id,
    squad: Array.from({ length: 11 }, () => newAthlete(rand() < 0.2 ? "F" : "M", s.id).id),
  }));
  const strength = Object.fromEntries(teams.map((t) => [t.id, 0.8 + rand() * 0.5]));
  const matches = [];
  const innings = (teamId, oppId) => {
    const wickets = Math.min(10, int(3, 9));
    const runs = Math.round((70 + rand() * 70) * strength[teamId] / strength[oppId] ** 0.4);
    return { teamId, runs, wickets, overs };
  };
  const play = (t1, t2, stage, day) => {
    const inn = [innings(t1, t2), innings(t2, t1)];
    if (inn[0].runs === inn[1].runs) inn[1].runs += 1;
    const performances = [];
    for (const [i, x] of inn.entries()) {
      const bat = teams.find((t) => t.id === x.teamId).squad;
      const bowl = teams.find((t) => t.id === inn[1 - i].teamId).squad;
      // Split runs across the top six batters.
      const weights = [0.26, 0.22, 0.17, 0.13, 0.1, 0.07].map((w) => w * (0.6 + rand() * 0.8));
      const total = weights.reduce((a, b) => a + b, 0);
      let left = x.runs - int(4, 12); // extras
      weights.forEach((w, j) => {
        const r = j === 5 ? Math.max(0, left) : Math.max(0, Math.round((w / total) * (x.runs - 8)));
        left -= r;
        performances.push({ athleteId: bat[j], teamId: x.teamId, runs: r, balls: Math.max(r, Math.round(r * (0.9 + rand() * 0.6)) + int(1, 6)) });
      });
      // Share wickets and runs across five bowlers (the last five in the squad).
      let w = x.wickets;
      const bowlers = bowl.slice(6, 11);
      bowlers.forEach((b, j) => {
        const taken = j === 4 ? w : Math.min(w, int(0, 3));
        w -= taken;
        performances.push({ athleteId: b, teamId: inn[1 - i].teamId, wickets: taken, runsConceded: Math.round(x.runs / 5 + int(-6, 6)) });
      });
    }
    const winTeam = inn[0].runs > inn[1].runs ? inn[0].teamId : inn[1].teamId;
    const top = performances.filter((p) => p.teamId === winTeam).sort((a, b) => (b.runs ?? 0) + (b.wickets ?? 0) * 20 - ((a.runs ?? 0) + (a.wickets ?? 0) * 20))[0];
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
  return { kind: "cricket", slug, leagueSlug, name, sport: "Cricket", season, venue, categories: ["U-12"], oversPerSide: overs, teams, matches };
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
function track({ slug, leagueSlug, name, season, venue, pool }) {
  const cats = [["U-12", "M"], ["U-12", "F"], ["U-14", "M"], ["U-14", "F"]];
  const events = [];
  for (const [age, sex] of cats) {
    const category = `${age} ${sex === "M" ? "Boys" : "Girls"}`;
    const entrants = pool.filter((a) => a.sex === sex && a.age === age);
    for (const ev of TRACK) {
      const field = shuffle(entrants).slice(0, 8);
      const factor = age === "U-14" ? (ev.measure === "time" ? 0.93 : 1.08) : 1;
      const results = field.map((a) => {
        const talent = a.talent; // 0 (best) .. 1
        const base = ev.base[sex] * factor;
        const mark = ev.measure === "time" ? base - ev.spread * 0.4 + talent * ev.spread + (rand() - 0.5) * ev.spread * 0.3 : base + ev.spread * 0.4 - talent * ev.spread + (rand() - 0.5) * ev.spread * 0.3;
        return { athleteId: a.id, mark: round(mark, 2) };
      });
      events.push({ id: `${slug}-${age}-${sex}-${ev.name}`.toLowerCase().replace(/[^a-z0-9]+/g, "-"), name: ev.name, category, measure: ev.measure, results });
    }
  }
  return { kind: "track", slug, leagueSlug, name, sport: "Athletics", season, venue, categories: cats.map(([a, s]) => `${a} ${s === "M" ? "Boys" : "Girls"}`), events };
}

// ---- Gymnastics ---------------------------------------------------------------
function gymnastics({ slug, leagueSlug, name, season, venue, pool }) {
  const apparatus = { "U-12 Girls": ["Vault", "Bars", "Beam", "Floor"], "U-12 Boys": ["Floor", "Pommel horse", "Vault", "High bar"] };
  const scores = [];
  for (const [category, list] of Object.entries(apparatus)) {
    const sex = category.endsWith("Girls") ? "F" : "M";
    for (const a of pool.filter((x) => x.sex === sex)) {
      const byApparatus = Object.fromEntries(list.map((ap) => [ap, round(12.6 - a.talent * 3 + (rand() - 0.5) * 1.2, 3)]));
      scores.push({ athleteId: a.id, category, byApparatus });
    }
  }
  return { kind: "gymnastics", slug, leagueSlug, name, sport: "Gymnastics", season, venue, categories: Object.keys(apparatus), apparatus, scores };
}

// ---- Build --------------------------------------------------------------------
const editions = [];

editions.push(football({
  slug: "u10-inter-school-football-2026", leagueSlug: "u10-inter-school-football-2026",
  name: "1st Burgeoning U-10 Inter-School Football League", season: "2026",
  venue: "SAP 12th Battalion Ground, Jalpaiguri", city: "Jalpaiguri", category: "U-10", squadSize: 10, days: 2,
}));
editions.push(football({
  slug: "burgeoning-football-league-2025", leagueSlug: "burgeoning-football-league",
  name: "2nd Burgeoning Football League", season: "2025",
  venue: "LNIPE, Gwalior", city: "Gwalior", category: "U-13", squadSize: 12, days: 2,
}));

// Dehradun pool: athletes who do track, and some of them gymnastics or cricket too.
const dehradun = schoolsIn("Dehradun");
const pool = [];
for (const age of ["U-12", "U-14"]) {
  for (const sex of ["M", "F"]) {
    for (let i = 0; i < 14; i++) {
      const a = newAthlete(sex, pick(dehradun).id);
      pool.push({ ...a, age, talent: rand() });
    }
  }
}
editions.push(track({
  slug: "track-and-field-championship-2025", leagueSlug: "track-and-field-championship",
  name: "1st Burgeoning Track and Field Championship", season: "2025", venue: "Dehradun", city: "Dehradun", pool,
}));

const gymPool = [...shuffle(pool.filter((a) => a.age === "U-12")).slice(0, 10)];
for (const sex of ["M", "F", "F"]) for (let i = 0; i < 4; i++) gymPool.push({ ...newAthlete(sex, pick(dehradun).id), talent: rand() });
editions.push(gymnastics({
  slug: "gymnastics-premier-league-2025", leagueSlug: "gymnastics-premier-league",
  name: "Gymnastics Premier League", season: "2025", venue: "Dehradun", pool: gymPool,
}));

const cricketEd = cricket({
  slug: "u12-cricket-league-2025", leagueSlug: "u12-cricket-league",
  name: "U12 Cricket League", season: "2025", venue: "Dehradun", city: "Dehradun", overs: 15,
});
// A few track athletes also play cricket for their school.
const crossovers = shuffle(pool.filter((a) => a.age === "U-12" && a.sex === "M" && cricketEd.teams.some((t) => t.schoolId === a.schoolId))).slice(0, 6);
const nextSlot = {};
for (const a of crossovers) {
  const team = cricketEd.teams.find((t) => t.schoolId === a.schoolId);
  const slot = (nextSlot[team.id] = (nextSlot[team.id] ?? -1) + 1);
  if (slot > 5) continue;
  const old = team.squad[slot];
  team.squad[slot] = a.id;
  for (const m of cricketEd.matches) for (const p of m.performances) if (p.athleteId === old) p.athleteId = a.id;
  for (const m of cricketEd.matches) if (m.playerOfMatch === old) m.playerOfMatch = a.id;
}
editions.push(cricketEd);

// Drop athletes that ended up in no edition (replaced cricket squad members).
const used = new Set();
for (const e of editions) {
  if (e.kind === "football" || e.kind === "cricket") e.teams.forEach((t) => t.squad.forEach((id) => used.add(id)));
  if (e.kind === "track") e.events.forEach((ev) => ev.results.forEach((r) => used.add(r.athleteId)));
  if (e.kind === "gymnastics") e.scores.forEach((s) => used.add(s.athleteId));
}
const data = {
  sample: true,
  schools,
  athletes: athletes.filter((a) => used.has(a.id)),
  editions,
};

mkdirSync("src/data/results", { recursive: true });
writeFileSync("src/data/results/sample.json", JSON.stringify(data));
console.log(`${data.athletes.length} athletes, ${schools.length} schools, ${editions.length} editions`);
