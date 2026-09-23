import Link from "next/link";

import { LeagueCard } from "@/components/ui/league-card";
import { ArrowRight } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/section-heading";
import { leagues } from "@/content/leagues";

export function LeaguesSection() {
  // Skip the featured league; it already sits in the hero.
  const [first, ...rest] = leagues.slice(1, 6);

  return (
    <section className="lanes bg-ink py-24 text-white md:py-32">
      <div className="shell">
        <SectionHeading
          eyebrow="Leagues"
          title="Where it starts"
          intro="Inter-school leagues and championships that give young athletes real competition, real venues and a reason to keep training."
        >
          <Link href="/leagues" className="group inline-flex items-center gap-2 font-semibold text-volt">
            All leagues
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </SectionHeading>

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <LeagueCard league={first} className="md:col-span-2 lg:min-h-[28rem]" />
          {rest.map((league) => (
            <LeagueCard key={league.slug} league={league} />
          ))}
        </div>
      </div>
    </section>
  );
}
