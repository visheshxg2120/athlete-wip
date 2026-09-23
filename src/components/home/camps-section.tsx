import Image from "next/image";

import { ButtonLink } from "@/components/ui/button-link";
import { ArrowRight } from "@/components/ui/icons";
import { camps } from "@/content/camps";

export function CampsSection() {
  const withPhotos = camps.filter((c) => c.photo).slice(0, 3);

  return (
    <section className="py-24 md:py-32">
      <div className="shell grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5 lg:sticky lg:top-10 lg:self-start">
          <p className="eyebrow text-muted">International exposure</p>
          <h2 className="display mt-4 text-5xl md:text-7xl">Train where champions train</h2>
          <p className="mt-6 max-w-md text-lg text-muted">
            Two weeks abroad with Olympic and national-team coaches. Our camps in Phuket, Chonburi
            and Spain turn school athletes into international competitors.
          </p>
          <ButtonLink href="/camps" variant="ink" className="mt-10">
            See all camps
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </ButtonLink>
        </div>

        <ul className="space-y-4 lg:col-span-7">
          {withPhotos.map((camp) => (
            <li
              key={camp.slug}
              className="grid overflow-hidden rounded-2xl bg-surface sm:grid-cols-[14rem_1fr]"
            >
              <div className="relative aspect-[16/9] sm:aspect-auto">
                <Image src={camp.photo!.src} alt={camp.photo!.alt} fill sizes="(min-width: 640px) 14rem, 100vw" className="object-cover" />
              </div>
              <div className="p-6">
                <p className="eyebrow text-muted">
                  {camp.location} · {camp.dates}
                </p>
                <h3 className="display mt-3 text-3xl">{camp.name}</h3>
                {camp.note ? <p className="mt-2 text-sm text-muted">{camp.note}</p> : null}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
