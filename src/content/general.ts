import type { Photo } from "@/types/content";

export type Sport = {
  name: string;
  /** One line on what Athleta runs in this sport. */
  detail: string;
  href: string;
  /** Shown on hover. Sports without a photo get a graphic card instead. */
  photo?: Photo;
};

export const sports: Sport[] = [
  {
    name: "Football",
    detail: "U-10 & U-13 leagues · Spanish camp",
    href: "/leagues/burgeoning-football-league",
    photo: { src: "/images/leagues/football-page-2.jpg", alt: "Young footballers on the ball" },
  },
  {
    name: "Basketball",
    detail: "Phuket camp · FIBA-certified coach",
    href: "/camps",
    photo: { src: "/images/camps/basketball.jpg", alt: "Young basketball players dribbling" },
  },
  {
    name: "Swimming",
    detail: "Phuket & Chonburi · Olympic coach",
    href: "/camps",
    photo: { src: "/images/camps/swimming.jpg", alt: "Swimmer doing freestyle" },
  },
  {
    name: "Cricket",
    detail: "U12 league for winter mornings",
    href: "/leagues/u12-cricket-league",
    photo: { src: "/images/leagues/cricket-3.jpg", alt: "Young cricketer batting" },
  },
  { name: "Tennis", detail: "Coaching & competition", href: "/contact" },
  { name: "Pickleball", detail: "Coaching & competition", href: "/contact" },
  {
    name: "Baseball",
    detail: "Asia-Pacific tournament, Korea 2017",
    href: "/contact",
    photo: { src: "/images/gallery/11.jpg", alt: "Squad at a 2017 Asia-Pacific tournament in Korea" },
  },
  { name: "Triathlon", detail: "Coaching & competition", href: "/contact" },
];

export const partners = [
  "Learner Hunt",
  "Desan International",
  "Sarathy Travel",
  "Sports Dynasty",
];

export const pillars = [
  {
    title: "Compete",
    body: "Form, run and field teams in domestic, national and international events.",
  },
  {
    title: "Develop",
    body: "Prepare a new generation of athletes with knowledge, critical thinking, integrity and the passion to succeed, with health and wellness as the highest priority.",
  },
  {
    title: "Educate",
    body: "Sport goes well beyond the athlete. We open doors to careers across sports business, law, medicine and public health.",
  },
  {
    title: "Engage",
    body: "Sport brings people together, helping them move past their differences and find common ground.",
  },
  {
    title: "Unite",
    body: "We build teams, not just players: a community of athletes, teammates, teachers, parents and coaches.",
  },
];

export const gallery: Photo[] = [
  { src: "/images/gallery/11.jpg", alt: "Squad at a 2017 Asia-Pacific tournament in Korea" },
  { src: "/images/gallery/1.jpg", alt: "Girls' basketball team with their trophy" },
  { src: "/images/gallery/10.jpg", alt: "Squad holding the Indian flag" },
  { src: "/images/gallery/12.jpg", alt: "Team photo on the pitch" },
  { src: "/images/gallery/2.jpg", alt: "Players and coaches at an international event" },
  { src: "/images/gallery/8.jpg", alt: "Swim squad together" },
  { src: "/images/gallery/3.jpg", alt: "Team in green kit" },
  { src: "/images/gallery/9.jpg", alt: "Young swimmers poolside" },
  { src: "/images/gallery/4.jpg", alt: "Mixed team after a match" },
  { src: "/images/gallery/6.jpg", alt: "Drills on an outdoor court" },
];

// From the "International Exposure" page.
export const programmes = [
  {
    title: "Elite Athlete Programme",
    body: "Working with government sports bodies and National Sports Federations, we develop athletes with the potential to win Asian Championship medals and compete at world level, from the Asian Games to the Olympics.",
  },
  {
    title: "Career networking",
    body: "Our university and career networking team builds personalised action plans with student-athletes, with experienced counsellors available full-time for students and parents.",
  },
  {
    title: "Talent identification",
    body: "Sport-specific camps with certified coaches and PE trainers, partnerships with leagues and academies, and school team organisation that spots potential early.",
  },
];
