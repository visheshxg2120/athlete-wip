import type { Metadata } from "next";
import Link from "next/link";

import { PageShell } from "@/components/layout/page-shell";
import { events } from "@/content/events";

export const metadata: Metadata = { title: "Events" };

export default function EventsPage() {
  return (
    <PageShell title="Events">
      <ul className="mt-10 divide-y border-y">
        {events.map((event) => (
          <li key={event.slug}>
            <Link href={`/events/${event.slug}`} className="flex justify-between py-4">
              <span>{event.title}</span>
              <span className="text-muted-foreground">
                {event.city}, {event.country}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
