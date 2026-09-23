export const siteConfig = {
  name: "Athleta Games",
  shortName: "Athleta",
  tagline: "The Sporting Edge",
  description:
    "School leagues, international training camps and elite coaching for students and young athletes across India and Southeast Asia.",
  legalName: "Athleta Games Management India Private Limited",
  founded: 2017,
  nav: [
    { label: "Leagues", href: "/leagues" },
    { label: "Camps", href: "/camps" },
    { label: "Team", href: "/team" },
    { label: "Nutrition", href: "/nutrition" },
    { label: "About", href: "/about" },
  ],
  cta: { label: "Enquire", href: "/contact" },
  contact: {
    email: "contact@athletagames.com",
    phone: "+91 8588 070 307",
    phoneHref: "tel:+918588070307",
    address: ["House No. 14, Ground Floor, Block WZ", "Kailash Park, New Delhi 110015", "India"],
  },
  // TODO: swap for the real profile URLs.
  social: [
    { label: "Instagram", href: "https://www.instagram.com/" },
    { label: "Facebook", href: "https://www.facebook.com/" },
    { label: "YouTube", href: "https://www.youtube.com/" },
  ],
} as const;
