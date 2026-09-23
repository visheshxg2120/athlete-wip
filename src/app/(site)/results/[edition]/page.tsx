import Link from "next/link";
import { notFound } from "next/navigation";

import { CtaBand } from "@/components/layout/cta-band";
import { CricketView, FootballView, GymnasticsView, TrackView } from "@/components/results/edition-views";
import { ResultsShell } from "@/components/results/results-shell";
import { ArrowRight } from "@/components/ui/icons";
import { getLeague } from "@/content/leagues";
import { editions, getEdition, KIND_LABEL } from "@/lib/results";

export function generateStaticParams() {
  return editions.map((e) => ({ edition: e.slug }));
}

export async function generateMetadata(props: PageProps<"/results/[edition]">) {
  const { edition } = await props.params;
  const e = getEdition(edition);
  return { title: e ? `${e.name} results` : "Results", description: e ? `Standings, leaderboards and results: ${e.name}, ${e.season}.` : undefined };
}

export default async function EditionResultsPage(props: PageProps<"/results/[edition]">) {
  const { edition } = await props.params;
  const e = getEdition(edition);
  if (!e) notFound();
  const league = e.leagueSlug ? getLeague(e.leagueSlug) : undefined;
  const title = league?.shortName ?? e.name;

  return (
    <>
      <ResultsShell
        eyebrow={`${e.sport} · ${e.season}`}
        title={title}
        intro={`${title === e.name ? "" : `${e.name} · `}${e.venue} · ${KIND_LABEL[e.kind]} · ${e.categories.join(", ")}`}
        heroExtra={
          e.leagueSlug ? (
            <Link href={`/leagues/${e.leagueSlug}`} className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-volt">
              About this league
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          ) : null
        }
      >
        {e.kind === "football" ? <FootballView e={e} /> : null}
        {e.kind === "cricket" ? <CricketView e={e} /> : null}
        {e.kind === "track" ? <TrackView e={e} /> : null}
        {e.kind === "gymnastics" ? <GymnasticsView e={e} /> : null}
      </ResultsShell>
      <CtaBand />
    </>
  );
}
