import Link from "next/link";
import { notFound } from "next/navigation";

import { Chip } from "@/components/results/data";
import { CricketView, FootballView, GymnasticsView, TrackView } from "@/components/results/edition-views";
import { PageHead } from "@/components/results/page-head";
import { ArrowRight } from "@/components/ui/icons";
import { formatRange } from "@/lib/dates";
import { editions, getEdition, KIND_LABEL, participantCount, seasonsOfLeague } from "@/lib/results";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return editions.map((e) => ({ edition: e.slug }));
}

export async function generateMetadata(props: PageProps<"/results/[edition]">) {
  const { edition } = await props.params;
  const e = getEdition(edition);
  return { title: e ? `${e.name} ${e.season} results` : "Results", description: e ? `Standings, leaderboards and results: ${e.name}, ${e.season}.` : undefined };
}

export default async function EditionResultsPage(props: PageProps<"/results/[edition]">) {
  const { edition } = await props.params;
  const e = getEdition(edition);
  if (!e) notFound();
  const seasons = seasonsOfLeague(e);
  const matches = e.kind === "football" || e.kind === "cricket" ? e.matches.length : undefined;

  return (
    <>
      <PageHead
        crumbs={[{ label: "Results", href: "/results" }, { label: "Leagues", href: "/results" }, { label: `${e.sport} ${e.season}` }]}
        title={<>{e.name} <span className="text-indigo">{e.season}</span></>}
        description={`${formatRange(e.startsOn, e.endsOn)} · ${e.venue} · ${KIND_LABEL[e.kind]}`}
        aside={
          e.leagueSlug ? (
            <Link href={`/leagues/${e.leagueSlug}`} className="group inline-flex items-center gap-2 text-sm font-semibold">
              About this league
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          ) : null
        }
      >
        <div className="flex flex-wrap items-center gap-2">
          <Chip value={participantCount(e)} label="Athletes" />
          {matches ? <Chip value={matches} label="Matches" /> : null}
          {e.kind === "track" ? <Chip value={e.events.length} label="Events" /> : null}
          <Chip value={e.categories.length === 1 ? e.categories[0] : e.categories.length} label={e.categories.length === 1 ? "Category" : "Categories"} />
          {seasons.length > 1 ? (
            <nav aria-label="Seasons" className="ml-auto flex gap-1 rounded-xl border bg-surface p-1">
              {seasons.map((s) => (
                <Link
                  key={s.slug}
                  href={`/results/${s.slug}`}
                  aria-current={s.slug === e.slug ? "page" : undefined}
                  className={cn("rounded-lg px-3 py-1.5 text-sm font-medium tabular-nums", s.slug === e.slug ? "bg-ink text-white" : "text-muted hover:text-ink")}
                >
                  {s.season}
                </Link>
              ))}
            </nav>
          ) : null}
        </div>
      </PageHead>
      <div className="mt-10">
        {e.kind === "football" ? <FootballView e={e} /> : null}
        {e.kind === "cricket" ? <CricketView e={e} /> : null}
        {e.kind === "track" ? <TrackView e={e} /> : null}
        {e.kind === "gymnastics" ? <GymnasticsView e={e} /> : null}
      </div>
    </>
  );
}
