import type { Coach, TeamMember } from "@/types/content";

export const coaches: Coach[] = [
  {
    slug: "paul-hardman",
    name: "Paul Hardman",
    sport: "Swimming",
    headline: "Two-time Olympic coach: Seoul 1988 and Atlanta 1996.",
    photo: { src: "/images/coaches/paul-hardman.jpg", alt: "Paul Hardman" },
    highlights: [
      "Australian National Team coach in 1987, 1988, 1990, 1991, 1995 and 1996",
      "Coached 13 individual swimmers selected for Australian national teams, including Olympic and Commonwealth Games medallists",
      "Holds Australian Swimming's highest coaching qualification: Platinum Licence Coach",
      "Awarded a 1985 scholarship to train under renowned coach Dr James ‘Doc’ Counsilman",
    ],
  },
  {
    slug: "yong-taek-yoo",
    name: "Yong-Taek Yoo",
    sport: "Taekwondo",
    headline: "7th Dan master and head coach of Thailand's National Para Taekwondo Team.",
    photo: { src: "/images/coaches/yong-taek-yoo.jpg", alt: "Yong-Taek Yoo" },
    highlights: [
      "Head coach, Thailand National Para Taekwondo Team (2023–present)",
      "Former coach of the Thailand National Team and Dragon Taekwondo, Phuket",
      "Athletes coached to podiums at the World Cadet and Asian Junior Championships and the SEA Games",
      "Degree in Sports in Life and Coach Training from Hanyang University",
    ],
  },
  {
    slug: "mateja-gorunovic",
    name: "Mateja Gorunović",
    sport: "Basketball",
    headline: "FIBA-certified senior coach who led Borac Zemun to the 2022 Radivoj Korać Cup.",
    photo: { src: "/images/coaches/mateja-gorunovic.jpg", alt: "Mateja Gorunović" },
    highlights: [
      "Holds Serbia's highest professional coaching title",
      "Coached in Serbia, Taiwan, Mongolia, Montenegro and Russia",
      "Assistant coach for the Mozambique Women's National Team in World Cup qualifiers (2024)",
      "Founder of the MGB Player Development Camp, Belgrade (2021)",
    ],
  },
];

const member = (name: string, file: string): TeamMember => ({
  name,
  photo: { src: `/images/team/${file}.jpg`, alt: name },
});

// Roles weren't on the current site; add them here when known.
export const team: TeamMember[] = [
  member("Dr. H. L. Sharma", "hl-sharma"),
  member("Lt. Col. Anil K. Suri", "anil-k-suri"),
  member("Twinkle Bose", "twinkle-bose"),
  member("Paul Hardman", "paul-hardman"),
  member("Neetu Sharma", "neetu-sharma"),
  member("Prof. V. K. Dabas (Retd.)", "vk-dabas"),
  member("T. Chandra Sekran", "t-chandra-sekran"),
  member("Prasanna Menon", "prasanna-menon"),
  member("Dr. Hanafiah Ayub", "hanafiah-ayub"),
  member("Tran Thi Hieu Trung", "tran-thi-hieu-trung"),
  member("Jay Shankar Menon", "jay-shankar-menon"),
  member("Mpattarinrada Boonsong", "mpattarinrada-boonsong"),
  member("Tribhuvan Ram Narayan", "tribhuvan-ram-narayan"),
  member("Yash Sharma", "yash-sharma"),
  member("Gurjyot Singh", "gurjyot-singh"),
  member("Pulkit", "pulkit"),
  member("Sanam Khan", "sanam-khan"),
  member("Kshitij Sahu", "kshitij-sahu"),
];
