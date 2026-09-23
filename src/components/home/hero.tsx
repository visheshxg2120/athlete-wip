import Image from "next/image";

import { FeaturedLeague } from "@/components/home/featured-league";
import { ButtonLink } from "@/components/ui/button-link";
import { ArrowRight } from "@/components/ui/icons";
import { siteConfig } from "@/config/site";
import { leagues } from "@/content/leagues";

const stats = [
  { value: "2017", label: "Founded in New Delhi" },
  { value: "8", label: "Sports covered" },
  { value: "3", label: "Countries: India, Thailand & Spain" },
  { value: "2×", label: "Olympic coach on our bench" },
];

export function Hero() {
  return (
    // On desktop the hero fills exactly one screen, stats row included, and the
    // headline scales with both width and height so nothing drops below the fold.
    <section className="lanes relative flex flex-col overflow-hidden bg-ink text-white lg:min-h-svh">
      <div className="pointer-events-none absolute -left-48 top-1/3 size-[40rem] rounded-full bg-indigo/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 -top-24 size-[28rem] rounded-full bg-volt/10 blur-3xl" />

      <div className="shell relative grid flex-1 items-center gap-12 pb-14 pt-28 lg:grid-cols-12 lg:gap-10 lg:pb-8 lg:pt-24">
        <div className="lg:col-span-7">
          <p className="eyebrow text-volt">India · Southeast Asia · Since {siteConfig.founded}</p>
          <h1 className="display mt-5 text-[length:clamp(3.25rem,14vw,5.5rem)] lg:text-[length:min(8.4vw,12.5svh,7.5rem)]">
            Play local.
            <br />
            Compete <br className="hidden lg:inline" />
            <span className="text-volt">global.</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg text-muted-inverse">{siteConfig.description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/leagues">
              Explore leagues
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </ButtonLink>
            <ButtonLink href="/camps" variant="outline">
              International camps
            </ButtonLink>
          </div>
        </div>

        <div className="relative lg:col-span-5">
          <div className="grid h-80 grid-cols-2 grid-rows-2 gap-3 lg:h-[clamp(16rem,44svh,28rem)]">
            <HeroPhoto src="/images/leagues/football-page-4.jpg" alt="Young footballers in a huddle" className="row-span-2" />
            <HeroPhoto src="/images/gallery/11.jpg" alt="Squad at an Asia-Pacific tournament" />
            <HeroPhoto src="/images/leagues/gymnastics-1.jpg" alt="Gymnast on the floor" />
          </div>

          <FeaturedLeague leagues={leagues} />
        </div>
      </div>

      <div className="relative border-t border-line-inverse">
        <dl className="shell grid grid-cols-2 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="border-line-inverse py-5 odd:pr-4 md:border-l md:px-6 md:first:border-l-0 md:first:pl-0">
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <span className="display block text-4xl md:text-5xl">{s.value}</span>
                <span className="mt-2 block text-sm text-muted-inverse">{s.label}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function HeroPhoto({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-ink-2 ${className ?? ""}`}>
      <Image src={src} alt={alt} fill priority sizes="(min-width: 1024px) 20vw, 50vw" className="object-cover" />
    </div>
  );
}
