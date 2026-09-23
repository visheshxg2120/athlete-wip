import type { League, Photo } from "@/types/content";

// Photos are cropped from screenshots of the current site. Replace with the
// original high-resolution files when available.
const photos = (prefix: string, count: number, alt: string): Photo[] =>
  Array.from({ length: count }, (_, i) => ({
    src: `/images/leagues/${prefix}-${i + 1}.jpg`,
    alt,
  }));

export const leagues: League[] = [
  {
    slug: "u10-inter-school-football-2026",
    name: "1st Burgeoning U-10 Inter-School Football Nationwide League 2026",
    shortName: "U-10 Inter-School Football League",
    sport: "Football",
    location: "Jalpaiguri, West Bengal",
    when: "19–20 September 2026",
    endsOn: "2026-09-20",
    summary:
      "A 7-a-side, league-cum-knockout tournament for under-10 school teams, with at least three matches guaranteed for every side.",
    facts: [
      { label: "Format", value: "7-a-side · league-cum-knockout" },
      { label: "Age group", value: "Under-10 (born 2017 onwards)" },
      { label: "Matches", value: "Minimum 3 guaranteed" },
      { label: "Squad", value: "Up to 18 players · rolling substitutions" },
      { label: "Venue", value: "SAP 12th Battalion Ground, Dabgram, Jalpaiguri" },
      { label: "Registration closes", value: "12 September 2026" },
    ],
    cover: { src: "/images/leagues/football-page-11.jpg", alt: "Young footballers on the ball" },
    photos: [],
  },
  {
    slug: "burgeoning-football-league",
    name: "2nd Burgeoning Football League",
    shortName: "Burgeoning Football League",
    sport: "Football",
    location: "LNIPE, Gwalior",
    summary:
      "An U-13 football league at the world-class LNIPE campus in Gwalior: the opening event of the Burgeoning Games series.",
    body: [
      "The U-13 Football League kicked off at the world-class LNIPE Gwalior, marking the beginning of an exciting series of sports tournaments. Organised by Athleta, the event showcases young talent and provides top-notch facilities for participants and spectators alike.",
      "With state-of-the-art grounds, nutritious meals and a focus on player well-being, every detail was planned for a seamless experience. Next in the series: basketball, squash, athletics, cricket, tennis and badminton.",
    ],
    cover: { src: "/images/leagues/football-2.jpg", alt: "Football match at LNIPE Gwalior" },
    photos: photos("football-page", 13, "Burgeoning Football League, Gwalior"),
  },
  {
    slug: "gymnastics-premier-league",
    name: "Gymnastics Premier League",
    shortName: "Gymnastics Premier League",
    sport: "Gymnastics",
    location: "Dehradun",
    summary: "A premier competition bringing young gymnasts together in Dehradun.",
    cover: { src: "/images/leagues/gymnastics-1.jpg", alt: "Gymnast performing on the floor" },
    photos: photos("gymnastics", 3, "Gymnastics Premier League, Dehradun"),
  },
  {
    slug: "u12-cricket-league",
    name: "U12 Cricket League",
    shortName: "U12 Cricket League",
    sport: "Cricket",
    location: "India",
    summary: "Winter-morning cricket for under-12 players, from warm-ups in the mist to the trophy table.",
    cover: { src: "/images/leagues/cricket-page-2.jpg", alt: "Cricket squads lined up with coaches" },
    photos: [
      ...photos("cricket", 3, "U12 Cricket League"),
      ...photos("cricket-page", 9, "U12 Cricket League"),
    ],
  },
  {
    slug: "track-and-field-championship",
    name: "1st Burgeoning Track and Field Championship",
    shortName: "Track & Field Championship",
    sport: "Athletics",
    location: "Dehradun",
    summary: "The first Burgeoning championship on the track, with podium finishes for young sprinters and jumpers.",
    cover: { src: "/images/leagues/track-2.jpg", alt: "Young athletes on the podium" },
    photos: photos("track", 3, "Track and Field Championship, Dehradun"),
  },
  {
    slug: "art-and-culture",
    name: "Art & Culture",
    shortName: "Art & Culture",
    sport: "Inclusive programme",
    location: "India",
    summary:
      "A two-day art workshop for children with special needs, run with the Sports, Art & Culture Association of the Differently Abled.",
    body: [
      "Organised with the Sports, Art & Culture Association of the Differently Abled, this two-day workshop helped children with special needs build their art skills.",
      "Students, teachers and parents learned canvas painting, mandala painting, fragrance candle making and candle-stand crafting, taught by Mr. Gurpreet Singh and Ms. Tejinder.",
    ],
    cover: { src: "/images/leagues/art-page-11.jpg", alt: "Hand-painted artwork from the workshop" },
    photos: photos("art-page", 14, "Art & Culture workshop"),
  },
];

export function getLeague(slug: string) {
  return leagues.find((league) => league.slug === slug);
}

/** True while the league hasn't finished yet (evaluated at build/request time). */
export function isUpcoming(league: League) {
  return league.endsOn ? new Date(`${league.endsOn}T23:59:59`) >= new Date() : false;
}
