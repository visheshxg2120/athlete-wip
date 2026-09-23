import Image from "next/image";
import Link from "next/link";

import { ArrowUpRight } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import type { League } from "@/types/content";

export function LeagueCard({ league, className }: { league: League; className?: string }) {
  return (
    <Link
      href={`/leagues/${league.slug}`}
      className={cn(
        "group relative flex min-h-80 flex-col justify-end overflow-hidden rounded-2xl bg-ink-2 p-6 text-white",
        className,
      )}
    >
      <Image
        src={league.cover.src}
        alt={league.cover.alt}
        fill
        sizes="(min-width: 1024px) 40vw, 100vw"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
      <span className="absolute right-5 top-5 grid size-10 place-items-center rounded-full bg-white/10 backdrop-blur transition-colors group-hover:bg-volt group-hover:text-ink">
        <ArrowUpRight className="size-4" />
      </span>
      <div className="relative">
        <p className="eyebrow text-volt">
          {league.sport} · {league.location}
        </p>
        <h3 className="display mt-3 text-3xl md:text-4xl">{league.shortName}</h3>
      </div>
    </Link>
  );
}
