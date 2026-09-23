import Image from "next/image";
import Link from "next/link";

import { ArrowRight } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/section-heading";
import { coaches } from "@/content/people";

export function CoachesSection() {
  return (
    <section className="bg-ink-2 py-24 text-white md:py-32">
      <div className="shell">
        <SectionHeading
          eyebrow="Elite coaches"
          title="Coached by the best"
          intro="Olympic, FIBA and national-team pedigree, working directly with our athletes."
        >
          <Link href="/team" className="group inline-flex items-center gap-2 font-semibold text-volt">
            Meet the team
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </SectionHeading>

        <ul className="mt-14 grid gap-4 md:grid-cols-3">
          {coaches.map((coach) => (
            <li key={coach.slug} className="rounded-2xl border border-line-inverse bg-ink p-6">
              <div className="flex items-center gap-4">
                <div className="relative size-16 overflow-hidden rounded-full bg-ink-3">
                  <Image src={coach.photo.src} alt={coach.photo.alt} fill sizes="4rem" className="object-cover" />
                </div>
                <div>
                  <p className="eyebrow text-volt">{coach.sport}</p>
                  <h3 className="mt-1 text-lg font-semibold">{coach.name}</h3>
                </div>
              </div>
              <p className="mt-6 text-muted-inverse">{coach.headline}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
