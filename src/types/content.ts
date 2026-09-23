export type Photo = {
  src: string;
  alt: string;
};

export type League = {
  slug: string;
  name: string;
  /** Short name for cards and tight spaces. */
  shortName: string;
  sport: string;
  location: string;
  // Dates are ISO "YYYY-MM-DD" in India time; they drive the league's status
  // (registration open / upcoming / happening now / completed).
  startsOn?: string;
  /** Defaults to startsOn for one-day events. */
  endsOn?: string;
  registrationCloses?: string;
  /** For past leagues without exact dates, e.g. "2025". */
  season?: string;
  summary: string;
  body?: string[];
  facts?: { label: string; value: string }[];
  cover: Photo;
  photos: Photo[];
};

export type Camp = {
  slug: string;
  name: string;
  sport: string;
  location: string;
  venue?: string;
  dates: string;
  year: number;
  note?: string;
  photo?: Photo;
};

export type Coach = {
  slug: string;
  name: string;
  sport: string;
  headline: string;
  photo: Photo;
  highlights: string[];
};

export type TeamMember = {
  name: string;
  photo: Photo;
};
