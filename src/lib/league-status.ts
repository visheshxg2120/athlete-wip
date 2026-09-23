import { daysBetween, formatDate, formatRange } from "@/lib/dates";
import type { League } from "@/types/content";

export type LeagueStatus =
  | { kind: "live"; label: string; note: string }
  | { kind: "registration"; label: string; note: string }
  | { kind: "upcoming"; label: string; note: string }
  | { kind: "completed"; label: string; note?: string };

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

/** Human-readable dates: "19–20 September 2026", "2025 season" or undefined. */
export function leagueDates(league: League) {
  if (league.startsOn) return formatRange(league.startsOn, league.endsOn);
  return league.season ? `${league.season} season` : undefined;
}

export function getLeagueStatus(league: League, today: string): LeagueStatus {
  const { startsOn, registrationCloses } = league;
  // Leagues without dates are past events carried over from the old site.
  if (!startsOn) return { kind: "completed", label: "Completed", note: leagueDates(league) };

  const endsOn = league.endsOn ?? startsOn;
  if (today > endsOn) {
    return { kind: "completed", label: "Completed", note: `Played ${formatRange(startsOn, endsOn)}` };
  }
  if (today >= startsOn) {
    const total = daysBetween(startsOn, endsOn) + 1;
    const day = daysBetween(startsOn, today) + 1;
    return { kind: "live", label: "Happening now", note: total > 1 ? `Day ${day} of ${total}` : "Today" };
  }
  if (registrationCloses && today <= registrationCloses) {
    const left = daysBetween(today, registrationCloses);
    return {
      kind: "registration",
      label: "Registration open",
      note: left === 0 ? "Registration closes today" : `Closes ${formatDate(registrationCloses)} · ${plural(left, "day")} left`,
    };
  }
  const until = daysBetween(today, startsOn);
  return { kind: "upcoming", label: "Upcoming", note: until === 1 ? "Starts tomorrow" : `Starts in ${plural(until, "day")}` };
}

// Sort key: the last known day of the league.
const lastDay = (l: League) => l.endsOn ?? l.startsOn ?? (l.season ? `${l.season}-12-31` : "0000-00-00");

/** Splits leagues into live, upcoming (soonest first) and past (latest first). */
export function groupLeagues(leagues: League[], today: string) {
  const withStatus = leagues.map((league) => ({ league, status: getLeagueStatus(league, today) }));
  const is = (...kinds: LeagueStatus["kind"][]) => withStatus.filter((l) => kinds.includes(l.status.kind));
  return {
    live: is("live"),
    upcoming: is("registration", "upcoming").sort((a, b) => lastDay(a.league).localeCompare(lastDay(b.league))),
    past: is("completed").sort((a, b) => lastDay(b.league).localeCompare(lastDay(a.league))),
  };
}

/** The league to feature: live, else next upcoming, else most recent. */
export function pickFeatured(leagues: League[], today: string) {
  const { live, upcoming, past } = groupLeagues(leagues, today);
  return (live[0] ?? upcoming[0] ?? past[0]).league;
}
