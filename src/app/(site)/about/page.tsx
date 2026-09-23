import type { Metadata } from "next";
import Image from "next/image";

import { CtaBand } from "@/components/layout/cta-band";
import { PageHero } from "@/components/ui/page-hero";
import { siteConfig } from "@/config/site";
import { partners, pillars } from "@/content/general";

export const metadata: Metadata = {
  title: "About",
  description: "Athleta Games: sports for all, from the grassroots to the international stage.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Athleta"
        title="Quality over quantity"
        intro={`Since ${siteConfig.founded}, Athleta has grown from a small group business into a multi-sport company running leagues, camps and coaching across India and Southeast Asia.`}
      />

      <section className="py-20 md:py-28">
        <div className="shell grid gap-14 lg:grid-cols-12">
          <div className="space-y-6 text-lg leading-relaxed text-muted lg:col-span-6">
            <p className="text-2xl font-medium leading-snug tracking-tight text-ink md:text-3xl">
              Our vision is simple: sports for all.
            </p>
            <p>
              We search for talent right from the grassroots, nurture it, and give young athletes the
              chance to compete in national and international leagues and training programmes, all
              to international standards and on schedule.
            </p>
            <p>
              We take immense pride in training students to the level where they represent their
              country abroad. Alongside competition, Athleta offers exposure to sports conferences
              and workshops, and counselling for students&apos; future careers.
            </p>
            <p>
              As we say: we don&apos;t sell products and expertise, we sell satisfaction.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:col-span-6">
            {["/images/leagues/track-2.jpg", "/images/gallery/10.jpg", "/images/leagues/football-page-9.jpg", "/images/gallery/8.jpg"].map((src) => (
              <div key={src} className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-ink/5">
                <Image src={src} alt="" fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="lanes bg-ink py-20 text-white md:py-28">
        <div className="shell">
          <p className="eyebrow text-volt">What we stand for</p>
          <ol className="mt-10 divide-y divide-line-inverse border-y border-line-inverse">
            {pillars.map((pillar, i) => (
              <li key={pillar.title} className="grid gap-4 py-8 md:grid-cols-12 md:items-baseline">
                <span className="eyebrow text-muted-inverse md:col-span-1">{String(i + 1).padStart(2, "0")}</span>
                <h2 className="display text-5xl md:col-span-4 md:text-6xl">{pillar.title}</h2>
                <p className="text-lg text-muted-inverse md:col-span-7">{pillar.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="shell grid gap-8 md:grid-cols-12">
          <div className="md:col-span-3">
            <p className="eyebrow text-muted">Working with the best</p>
            <h2 className="display mt-4 text-5xl">Partners</h2>
          </div>
          <ul className="grid grid-cols-2 gap-px self-start overflow-hidden rounded-2xl border bg-line md:col-span-9 md:grid-cols-4">
            {partners.map((partner) => (
              <li key={partner} className="grid h-28 place-items-center bg-paper px-4 text-center font-semibold text-ink/70">
                {partner}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
