"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { formatRange, relativeTo } from "@/lib/dates";
import { getLeagueStatus, type LeagueStatus } from "@/lib/league-status";
import type { CalendarItem } from "@/lib/results";
import { useToday } from "@/lib/use-today";
import { cn } from "@/lib/utils";

const field = "h-10 rounded-xl border bg-surface px-3 text-sm outline-none focus:border-ink";

function Badge({ status, today, item }: { status: LeagueStatus; today: string; item: CalendarItem }) {
  if (status.kind === "live")
    return (
      <span className="eyebrow inline-flex items-center gap-1.5 rounded-md bg-volt px-2 py-1 text-[0.65rem] text-ink">
        <span className="size-1.5 animate-pulse rounded-full bg-ink" aria-hidden />
        Live
      </span>
    );
  if (status.kind === "registration")
    return <span className="eyebrow rounded-md bg-white px-2 py-1 text-[0.65rem] text-ink">Registration open</span>;
  if (status.kind === "upcoming")
    return <span className="eyebrow rounded-md bg-white/15 px-2 py-1 text-[0.65rem] text-white backdrop-blur">{relativeTo(item.startsOn, today)}</span>;
  return <span className="eyebrow rounded-md bg-white/15 px-2 py-1 text-[0.65rem] text-white backdrop-blur">Results</span>;
}

function Card({ item, today }: { item: CalendarItem; today: string }) {
  const status = getLeagueStatus(item, today);
  const when0 = status.kind === "completed" ? relativeTo(item.endsOn, today) : status.kind === "live" ? status.note : relativeTo(item.startsOn, today);
  const when = when0[0].toUpperCase() + when0.slice(1);
  return (
    <Link href={item.href} className="group relative flex aspect-[16/10] flex-col justify-between overflow-hidden rounded-2xl bg-ink p-4 text-white sm:aspect-[16/11] md:p-5">
      {item.photo ? (
        <Image
          src={item.photo}
          alt=""
          fill
          sizes="(min-width: 1024px) 40vw, (min-width: 640px) 50vw, 100vw"
          className={cn("object-cover transition duration-500 group-hover:scale-[1.03]", status.kind === "completed" ? "grayscale" : "grayscale-[40%]")}
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/10" />
      <div className="relative flex items-start justify-between gap-2">
        <Badge status={status} today={today} item={item} />
        <span className="eyebrow rounded-md bg-ink/60 px-2 py-1 text-[0.65rem] text-white/80 backdrop-blur">{item.sport}</span>
      </div>
      <div className="relative">
        <p className="text-sm text-white/70">{formatRange(item.startsOn, item.endsOn)} · {when}</p>
        <h3 className="display mt-1.5 text-2xl md:text-3xl">
          {item.name} <span className="text-volt">{item.season}</span>
        </h3>
        <p className="mt-2 text-sm text-white/70">
          {item.venue}
          {item.athletes ? ` · ${item.athletes} athletes` : status.kind === "completed" ? "" : " · Results after the event"}
        </p>
      </div>
    </Link>
  );
}

// Leagues calendar: live and upcoming first, then results by season.
export function CalendarGrid({ items }: { items: CalendarItem[] }) {
  const today = useToday();
  const [sport, setSport] = useState("");
  const [season, setSeason] = useState("");
  const sports = useMemo(() => [...new Set(items.map((i) => i.sport))].sort(), [items]);
  const seasons = useMemo(() => [...new Set(items.map((i) => i.season))].sort().reverse(), [items]);

  const filtered = items.filter((i) => (!sport || i.sport === sport) && (!season || i.season === season));
  const withStatus = filtered.map((item) => ({ item, status: getLeagueStatus(item, today) }));
  const live = withStatus.filter((x) => x.status.kind === "live");
  const upcoming = withStatus.filter((x) => x.status.kind === "upcoming" || x.status.kind === "registration").reverse();
  const past = withStatus.filter((x) => x.status.kind === "completed");
  const bySeason = [...new Set(past.map((x) => x.item.season))].map((s) => ({ season: s, list: past.filter((x) => x.item.season === s) }));

  const groups = [
    { title: "Happening now", list: live },
    { title: "Coming up", list: upcoming },
    ...bySeason.map((g) => ({ title: `${g.season} results`, list: g.list })),
  ].filter((g) => g.list.length);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <label>
          <span className="sr-only">Season</span>
          <select value={season} onChange={(e) => setSeason(e.target.value)} className={field}>
            <option value="">All seasons</option>
            {seasons.map((s) => <option key={s}>{s}</option>)}
          </select>
        </label>
        <label>
          <span className="sr-only">Sport</span>
          <select value={sport} onChange={(e) => setSport(e.target.value)} className={field}>
            <option value="">All sports</option>
            {sports.map((s) => <option key={s}>{s}</option>)}
          </select>
        </label>
        <p className="ml-auto self-center text-sm text-muted" aria-live="polite">
          {filtered.length} league{filtered.length === 1 ? "" : "s"}
        </p>
      </div>
      {groups.map((g) => (
        <section key={g.title} className="mt-8">
          <h2 className="eyebrow text-muted">{g.title}</h2>
          <ul className="mt-3 grid gap-4 sm:grid-cols-2">
            {g.list.map(({ item }) => (
              <li key={item.slug}>
                <Card item={item} today={today} />
              </li>
            ))}
          </ul>
        </section>
      ))}
      {!groups.length ? <p className="mt-8 text-muted">No leagues match these filters.</p> : null}
    </div>
  );
}
