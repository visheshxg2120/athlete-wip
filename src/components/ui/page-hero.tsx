import Image from "next/image";

import type { Photo } from "@/types/content";

// Dark header band for inner pages. Replaces the old stadium-photo banner.
export function PageHero({
  eyebrow,
  title,
  intro,
  photo,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  photo?: Photo;
  children?: React.ReactNode;
}) {
  return (
    <section className="lanes relative overflow-hidden bg-ink text-white">
      {photo ? (
        <>
          <Image
            src={photo.src}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-35 blur-[2px] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/30" />
        </>
      ) : (
        <div className="pointer-events-none absolute -right-40 -top-40 size-[36rem] rounded-full bg-indigo/40 blur-3xl" />
      )}
      <div className="shell relative pb-16 pt-36 md:pb-24 md:pt-48">
        <p className="eyebrow text-volt">{eyebrow}</p>
        <h1 className="display mt-5 max-w-4xl text-6xl md:text-8xl">{title}</h1>
        {intro ? <p className="mt-6 max-w-2xl text-lg text-muted-inverse">{intro}</p> : null}
        {children}
      </div>
    </section>
  );
}
