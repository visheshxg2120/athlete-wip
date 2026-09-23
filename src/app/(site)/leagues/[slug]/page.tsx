import Link from "next/link";
import { notFound } from "next/navigation";

import { CtaBand } from "@/components/layout/cta-band";
import { LeagueStatusPanel } from "@/components/leagues/league-status-panel";
import { ArrowRight, Calendar, Pin } from "@/components/ui/icons";
import { LeagueCard } from "@/components/ui/league-card";
import { PageHero } from "@/components/ui/page-hero";
import { PhotoGrid } from "@/components/ui/photo-grid";
import { getLeague, leagues } from "@/content/leagues";
import { leagueDates } from "@/lib/league-status";

export function generateStaticParams() {
  return leagues.map((league) => ({ slug: league.slug }));
}

export async function generateMetadata(props: PageProps<"/leagues/[slug]">) {
  const { slug } = await props.params;
  const league = getLeague(slug);
  return { title: league?.shortName, description: league?.summary };
}

export default async function LeaguePage(props: PageProps<"/leagues/[slug]">) {
  const { slug } = await props.params;
  const league = getLeague(slug);
  if (!league) notFound();

  const dates = leagueDates(league);
  const others = leagues.filter((l) => l.slug !== league.slug).slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow={league.sport}
        title={league.shortName}
        intro={league.name !== league.shortName ? league.name : undefined}
        photo={league.cover}
      >
        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-white/80">
          <span className="inline-flex items-center gap-2">
            <Pin className="size-4 text-volt" />
            {league.location}
          </span>
          {dates ? (
            <span className="inline-flex items-center gap-2">
              <Calendar className="size-4 text-volt" />
              {dates}
            </span>
          ) : null}
        </div>
        <LeagueStatusPanel league={league} />
      </PageHero>

      <section className="py-20 md:py-28">
        <div className="shell grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="text-2xl font-medium leading-snug tracking-tight md:text-3xl">{league.summary}</p>
            {league.body?.map((paragraph) => (
              <p key={paragraph} className="mt-6 text-lg leading-relaxed text-muted">
                {paragraph}
              </p>
            ))}
          </div>
          {league.facts ? (
            <dl className="divide-y rounded-2xl border bg-surface lg:col-span-5">
              {league.facts.map((fact) => (
                <div key={fact.label} className="grid grid-cols-5 gap-4 p-5">
                  <dt className="eyebrow col-span-2 pt-0.5 text-muted">{fact.label}</dt>
                  <dd className="col-span-3 font-medium">{fact.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>

        {league.photos.length ? (
          <div id="photos" className="shell mt-20 scroll-mt-10">
            <p className="eyebrow text-muted">Photos · {league.photos.length}</p>
            <PhotoGrid photos={league.photos} className="mt-6" />
          </div>
        ) : null}
      </section>

      <section className="border-t py-20">
        <div className="shell">
          <div className="flex items-end justify-between">
            <h2 className="display text-4xl md:text-5xl">More leagues</h2>
            <Link href="/leagues" className="group inline-flex items-center gap-2 font-semibold">
              All leagues
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {others.map((l) => (
              <LeagueCard key={l.slug} league={l} />
            ))}
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
