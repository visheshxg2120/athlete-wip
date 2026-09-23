export type SportEvent = {
  slug: string;
  title: string;
  sport: string;
  venue: string;
  city: string;
  country: string;
  /** ISO date, e.g. "2026-11-14" */
  date: string;
  summary: string;
};
