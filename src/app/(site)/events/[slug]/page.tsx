import { notFound } from "next/navigation";

import { PageShell } from "@/components/layout/page-shell";
import { events, getEvent } from "@/content/events";

export function generateStaticParams() {
  return events.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata(props: PageProps<"/events/[slug]">) {
  const { slug } = await props.params;
  return { title: getEvent(slug)?.title };
}

export default async function EventPage(props: PageProps<"/events/[slug]">) {
  const { slug } = await props.params;
  const event = getEvent(slug);
  if (!event) notFound();

  return (
    <PageShell title={event.title}>
      <p className="mt-4 text-muted-foreground">
        {event.venue} · {event.city}, {event.country} · {event.date}
      </p>
      <p className="mt-6 max-w-2xl">{event.summary}</p>
    </PageShell>
  );
}
