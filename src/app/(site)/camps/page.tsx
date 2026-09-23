import type { Metadata } from "next";
import Image from "next/image";

import { CtaBand } from "@/components/layout/cta-band";
import { PageHero } from "@/components/ui/page-hero";
import { camps } from "@/content/camps";
import { programmes } from "@/content/general";

export const metadata: Metadata = {
  title: "International camps",
  description: "Training camps in Thailand and Spain with Olympic and national-team coaches.",
};

export default function CampsPage() {
  const years = [...new Set(camps.map((c) => c.year))];

  return (
    <>
      <PageHero
        eyebrow="International exposure"
        title="Train where champions train"
        intro="Two-week camps abroad with Olympic, FIBA and national-team coaches. School athletes come home with new skills, new friends and a bigger idea of what's possible."
        photo={{ src: "/images/camps/swimming.jpg", alt: "" }}
      />

      <section className="border-b py-20 md:py-28">
        <div className="shell">
          <p className="eyebrow text-muted">More than a camp</p>
          <ul className="mt-8 grid gap-px overflow-hidden rounded-2xl border bg-line md:grid-cols-3">
            {programmes.map((p, i) => (
              <li key={p.title} className="bg-paper p-8">
                <span className="eyebrow text-muted">{String(i + 1).padStart(2, "0")}</span>
                <h2 className="display mt-8 text-4xl">{p.title}</h2>
                <p className="mt-4 text-muted">{p.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="shell space-y-20">
          {years.map((year) => (
            <div key={year} className="grid gap-8 lg:grid-cols-12">
              <h2 className="display text-6xl text-ink/15 md:text-8xl lg:col-span-3">{year}</h2>
              <ul className="grid gap-4 md:grid-cols-2 lg:col-span-9">
                {camps
                  .filter((c) => c.year === year)
                  .map((camp) => (
                    <li key={camp.slug} className="flex flex-col overflow-hidden rounded-2xl bg-surface">
                      <div className="relative aspect-[16/9] bg-ink">
                        {camp.photo ? (
                          <Image src={camp.photo.src} alt={camp.photo.alt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
                        ) : (
                          <div className="lanes grid h-full place-items-center bg-gradient-to-br from-indigo to-ink">
                            <span className="display text-5xl text-white/90">{camp.sport}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col p-6">
                        <p className="eyebrow text-muted">
                          {camp.sport} · {camp.location}
                        </p>
                        <h3 className="display mt-3 text-3xl">{camp.name}</h3>
                        {camp.note ? <p className="mt-3 text-muted">{camp.note}</p> : null}
                        <p className="mt-auto pt-6 text-sm font-medium">
                          {camp.dates}
                          {camp.venue ? ` · ${camp.venue}` : ""}
                        </p>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
