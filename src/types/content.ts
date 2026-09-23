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
  /** Human-readable date or season, if known. */
  when?: string;
  /** ISO date of the last day, used to label upcoming vs. past. */
  endsOn?: string;
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
