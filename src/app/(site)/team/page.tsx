import type { Metadata } from "next";
import Image from "next/image";

import { CtaBand } from "@/components/layout/cta-band";
import { PageHero } from "@/components/ui/page-hero";
import { coaches, team } from "@/content/people";

export const metadata: Metadata = {
  title: "Team & coaches",
  description: "The Athleta team and our elite coaches.",
};

export default function TeamPage() {
  return (
    <>
      <PageHero
        eyebrow="Team & coaches"
        title="The people behind the edge"
        intro="Olympic coaches, national-team leaders and educators from India, Thailand, Malaysia, Vietnam and beyond."
      />

      <section className="py-20 md:py-28">
        <div className="shell">
          <p className="eyebrow text-muted">Elite coaches</p>
          <ul className="mt-8 space-y-4">
            {coaches.map((coach) => (
              <li key={coach.slug} className="grid gap-8 rounded-2xl bg-surface p-6 md:grid-cols-12 md:p-10">
                <div className="flex items-center gap-5 md:col-span-5 md:flex-col md:items-start">
                  <div className="relative size-24 shrink-0 overflow-hidden rounded-2xl bg-ink md:size-40">
                    <Image src={coach.photo.src} alt={coach.photo.alt} fill sizes="10rem" className="object-cover" />
                  </div>
                  <div>
                    <p className="eyebrow text-indigo">{coach.sport} coach</p>
                    <h2 className="display mt-2 text-4xl md:text-5xl">{coach.name}</h2>
                    <p className="mt-3 text-muted">{coach.headline}</p>
                  </div>
                </div>
                <ul className="space-y-3 md:col-span-7 md:pt-2">
                  {coach.highlights.map((h) => (
                    <li key={h} className="flex gap-3 border-b pb-3 last:border-0">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-indigo" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t py-20 md:py-28">
        <div className="shell">
          <p className="eyebrow text-muted">Our team</p>
          <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
            {team.map((person) => (
              <li key={person.name}>
                <div className="relative aspect-square overflow-hidden rounded-full bg-ink/5">
                  <Image src={person.photo.src} alt={person.photo.alt} fill sizes="(min-width: 1024px) 16vw, 45vw" className="object-cover grayscale transition duration-500 hover:grayscale-0" />
                </div>
                <p className="mt-4 text-center font-medium leading-snug">{person.name}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
