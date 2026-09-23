import type { SportEvent } from "@/types/event";

// Placeholder data. Swap for a CMS or API later.
export const events: SportEvent[] = [
  {
    slug: "sample-event",
    title: "Sample Event",
    sport: "Athletics",
    venue: "National Stadium",
    city: "Singapore",
    country: "Singapore",
    date: "2026-11-14",
    summary: "Placeholder event used to wire up the events pages.",
  },
];

export function getEvent(slug: string) {
  return events.find((event) => event.slug === slug);
}
