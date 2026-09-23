import type { Metadata } from "next";

import { CtaBand } from "@/components/layout/cta-band";
import { LeagueCard } from "@/components/ui/league-card";
import { PageHero } from "@/components/ui/page-hero";
import { leagues } from "@/content/leagues";

export const metadata: Metadata = {
  title: "Leagues",
  description: "Inter-school leagues and championships run by Athleta Games.",
};

export default function LeaguesPage() {
  return (
    <>
      <PageHero
        eyebrow="Leagues"
        title="Where it starts"
        intro="Inter-school leagues and championships across football, cricket, gymnastics and athletics, plus an inclusive art and culture programme."
        photo={{ src: "/images/leagues/cricket-page-5.jpg", alt: "" }}
      />
      <section className="py-20 md:py-28">
        <div className="shell grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {leagues.map((league, i) => (
            <LeagueCard
              key={league.slug}
              league={league}
              className={i === 0 ? "md:col-span-2 lg:min-h-[28rem]" : undefined}
            />
          ))}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
