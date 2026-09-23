// Site-wide config: name, navigation, regions. Placeholder copy until the
// real brand details come in with the reference screenshots.

export const siteConfig = {
  name: "Athlete",
  description:
    "Large-scale sports events at stadiums and schools for students and athletes across Southeast Asia.",
  nav: [
    { label: "Events", href: "/events" },
    { label: "Community", href: "/community" },
    { label: "Partners", href: "/partners" },
    { label: "About", href: "/about" },
  ],
  cta: { label: "Get in touch", href: "/contact" },
  regions: [
    "Singapore",
    "Malaysia",
    "Indonesia",
    "Thailand",
    "Vietnam",
    "Philippines",
  ],
} as const;
