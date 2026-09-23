// Results data model. The site reads one ResultsData object (see
// src/data/results/); standings, leaderboards and athlete histories are all
// derived from it in src/lib/results.ts, so only raw results are stored.

export type Sex = "M" | "F";

export type School = {
  id: string;
  name: string;
  city: string;
};

// Privacy: athletes are mostly minors, so the public data holds only a display
// name (first name + surname initial). No full names, photos or dates of birth.
export type Athlete = {
  id: string;
  name: string;
  sex: Sex;
  schoolId: string;
};

type EditionBase = {
  /** URL segment under /results. */
  slug: string;
  /** Matching league on the marketing site (src/content/leagues.ts), if any. */
  leagueSlug?: string;
  name: string;
  sport: string;
  season: string;
  venue: string;
  /** Categories contested, e.g. "U-10" or "U-12 Girls". */
  categories: string[];
};

// ---- Team sports -------------------------------------------------------------

export type Team = {
  id: string;
  name: string;
  schoolId: string;
  squad: string[];
};

export type MatchStage = "Group" | "Semi-final" | "3rd place" | "Final";

export type FootballMatch = {
  id: string;
  day: number;
  stage: MatchStage;
  group?: string;
  home: string;
  away: string;
  homeGoals: number;
  awayGoals: number;
  /** Knockout draws are settled on penalties, e.g. { home: 4, away: 3 }. */
  penalties?: { home: number; away: number };
  /** One entry per goal. */
  goals: { athleteId: string; teamId: string; minute: number }[];
  playerOfMatch?: string;
};

export type FootballEdition = EditionBase & {
  kind: "football";
  teams: Team[];
  groups: { name: string; teamIds: string[] }[];
  matches: FootballMatch[];
};

export type CricketInnings = { teamId: string; runs: number; wickets: number; overs: number };

export type CricketMatch = {
  id: string;
  day: number;
  stage: MatchStage;
  innings: [CricketInnings, CricketInnings];
  performances: {
    athleteId: string;
    teamId: string;
    runs?: number;
    balls?: number;
    wickets?: number;
    runsConceded?: number;
  }[];
  playerOfMatch?: string;
};

export type CricketEdition = EditionBase & {
  kind: "cricket";
  oversPerSide: number;
  teams: Team[];
  matches: CricketMatch[];
};

// ---- Individual sports -------------------------------------------------------

export type TrackEvent = {
  id: string;
  name: string;
  category: string;
  /** "time" = lower is better (seconds); "distance" = higher is better (metres). */
  measure: "time" | "distance";
  results: { athleteId: string; mark: number }[];
};

export type TrackEdition = EditionBase & {
  kind: "track";
  events: TrackEvent[];
};

export type GymnasticsEdition = EditionBase & {
  kind: "gymnastics";
  apparatus: Record<string, string[]>;
  scores: { athleteId: string; category: string; byApparatus: Record<string, number> }[];
};

export type Edition = FootballEdition | CricketEdition | TrackEdition | GymnasticsEdition;

export type ResultsData = {
  /** True while the site shows generated demo data. */
  sample: boolean;
  schools: School[];
  athletes: Athlete[];
  editions: Edition[];
};
