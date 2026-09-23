"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useDeferredValue, useMemo, useState } from "react";

import { ChevronLeft, ChevronRight } from "@/components/ui/icons";
import type { RankingRow } from "@/lib/results";
import { cn } from "@/lib/utils";

const PAGE = 25;
const field = "h-10 rounded-xl border bg-surface px-3 text-sm outline-none focus:border-ink";

/** One square per season: filled when the athlete competed that season. */
function Seasons({ all, played }: { all: string[]; played: string[] }) {
  return (
    <span className="flex gap-1" role="img" aria-label={`Competed in ${played.length} of ${all.length} seasons: ${played.join(", ")}`}>
      {all.map((s) => (
        <span key={s} title={s} className={cn("size-3 rounded-[3px]", played.includes(s) ? "bg-indigo" : "bg-ink/10")} />
      ))}
    </span>
  );
}

export function RankingsList({ rows, seasons }: { rows: RankingRow[]; seasons: string[] }) {
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [sport, setSport] = useState("");
  const [sex, setSex] = useState("");
  const [school, setSchool] = useState("");
  const [profilesOnly, setProfilesOnly] = useState(false);
  const [page, setPage] = useState(0);
  const q = useDeferredValue(query.trim().toLowerCase());

  const sports = useMemo(() => [...new Set(rows.flatMap((r) => r.sports))].sort(), [rows]);
  const schools = useMemo(() => [...new Set(rows.map((r) => r.school))].sort(), [rows]);
  const filtered = useMemo(
    () =>
      rows.filter(
        (r) =>
          (!q || r.name.toLowerCase().includes(q) || r.school.toLowerCase().includes(q)) &&
          (!sport || r.sports.includes(sport)) &&
          (!sex || r.sex === sex) &&
          (!school || r.school === school) &&
          (!profilesOnly || r.profile),
      ),
    [rows, q, sport, sex, school, profilesOnly],
  );
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const current = Math.min(page, pages - 1);
  const shown = filtered.slice(current * PAGE, current * PAGE + PAGE);
  const set = <T,>(fn: (v: T) => void) => (v: T) => {
    fn(v);
    setPage(0);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <label className="min-w-0 flex-[1_1_14rem]">
          <span className="sr-only">Search athletes</span>
          <input type="search" value={query} onChange={(e) => set(setQuery)(e.target.value)} placeholder="Search by name or school" className={cn(field, "w-full px-4")} />
        </label>
        <label>
          <span className="sr-only">Sport</span>
          <select value={sport} onChange={(e) => set(setSport)(e.target.value)} className={field}>
            <option value="">All sports</option>
            {sports.map((s) => <option key={s}>{s}</option>)}
          </select>
        </label>
        <label>
          <span className="sr-only">Gender</span>
          <select value={sex} onChange={(e) => set(setSex)(e.target.value)} className={field}>
            <option value="">Boys & girls</option>
            <option value="M">Boys</option>
            <option value="F">Girls</option>
          </select>
        </label>
        <label className="min-w-0">
          <span className="sr-only">School</span>
          <select value={school} onChange={(e) => set(setSchool)(e.target.value)} className={cn(field, "max-w-[14rem]")}>
            <option value="">All schools</option>
            {schools.map((s) => <option key={s}>{s}</option>)}
          </select>
        </label>
        <label className="flex h-10 items-center gap-2 rounded-xl border bg-surface px-3 text-sm">
          <input type="checkbox" checked={profilesOnly} onChange={(e) => set(setProfilesOnly)(e.target.checked)} className="accent-indigo" />
          With profile
        </label>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border bg-surface">
        <div className="eyebrow grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-3 border-b px-3 py-3 text-[0.65rem] text-muted sm:px-4 md:grid-cols-[2.5rem_minmax(0,1fr)_6rem_9rem_4.5rem_4.5rem]">
          <span>#</span>
          <span>Athlete</span>
          <span className="hidden md:block">Seasons</span>
          <span className="hidden md:block">Sports</span>
          <span className="hidden text-right md:block">Leagues</span>
          <span className="text-right">Podiums</span>
        </div>
        <ol aria-live="polite">
          {shown.map((r) => {
            const body = (
              <>
                <span className="text-sm tabular-nums text-muted">{r.rank}</span>
                <span className="min-w-0">
                  <span className={cn("flex items-center gap-2 font-medium", r.profile && "text-indigo")}>
                    <span className="truncate">{r.name}</span>
                    {r.profile ? <ChevronRight className="size-3.5 shrink-0" /> : null}
                  </span>
                  <span className="block truncate text-xs text-muted">{r.school} · {r.city}</span>
                </span>
                <span className="hidden md:block"><Seasons all={seasons} played={r.seasons} /></span>
                <span className="hidden truncate text-sm text-muted md:block">{r.sports.join(", ")}</span>
                <span className="hidden text-right text-sm tabular-nums md:block">{r.leagues}</span>
                <span className="text-right text-sm font-semibold tabular-nums">{r.podiums}</span>
              </>
            );
            const cls = "grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-3 px-3 py-3 sm:px-4 md:grid-cols-[2.5rem_minmax(0,1fr)_6rem_9rem_4.5rem_4.5rem]";
            return (
              <li key={r.id} className="border-b last:border-0">
                {r.profile ? (
                  <Link href={`/results/athletes/${r.id}`} className={cn(cls, "hover:bg-indigo/5")}>{body}</Link>
                ) : (
                  <div className={cls}>{body}</div>
                )}
              </li>
            );
          })}
        </ol>
        {!shown.length ? <p className="px-4 py-8 text-center text-muted">No athletes match these filters.</p> : null}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
        <p className="text-muted">
          {filtered.length} athlete{filtered.length === 1 ? "" : "s"} · Page {current + 1}/{pages}
        </p>
        <div className="flex gap-2">
          <button type="button" onClick={() => setPage(current - 1)} disabled={current === 0} className="inline-flex h-9 items-center gap-1 rounded-lg border bg-surface px-3 font-medium disabled:opacity-40">
            <ChevronLeft className="size-4" /> Prev
          </button>
          <button type="button" onClick={() => setPage(current + 1)} disabled={current >= pages - 1} className="inline-flex h-9 items-center gap-1 rounded-lg border bg-surface px-3 font-medium disabled:opacity-40">
            Next <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
