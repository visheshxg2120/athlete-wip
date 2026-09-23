"use client";

import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";

import type { AthleteIndexEntry } from "@/lib/results";

const field =
  "h-11 rounded-xl border bg-surface px-4 text-sm outline-none transition focus:border-ink";

// Client-side athlete search. `compact` shows a short list for the overview page.
export function AthleteSearch({ athletes, compact = false }: { athletes: AthleteIndexEntry[]; compact?: boolean }) {
  const [query, setQuery] = useState("");
  const [sport, setSport] = useState("");
  const [school, setSchool] = useState("");
  const q = useDeferredValue(query.trim().toLowerCase());

  const sports = useMemo(() => [...new Set(athletes.flatMap((a) => a.sports))].sort(), [athletes]);
  const schools = useMemo(() => [...new Set(athletes.map((a) => a.school))].sort(), [athletes]);

  const matches = useMemo(
    () =>
      athletes
        .filter((a) => (!q || a.name.toLowerCase().includes(q) || a.school.toLowerCase().includes(q)) && (!sport || a.sports.includes(sport)) && (!school || a.school === school))
        .sort((a, b) => b.editions.length - a.editions.length || b.podiums - a.podiums || a.name.localeCompare(b.name)),
    [athletes, q, sport, school],
  );

  const shown = compact ? (q ? matches.slice(0, 6) : []) : matches.slice(0, 200);

  return (
    <div>
      <div className="flex flex-col gap-3 md:flex-row">
        <label className="flex-1">
          <span className="sr-only">Search athletes</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by athlete or school"
            className={`${field} w-full`}
          />
        </label>
        {!compact ? (
          <>
            <label>
              <span className="sr-only">Sport</span>
              <select value={sport} onChange={(e) => setSport(e.target.value)} className={`${field} w-full md:w-48`}>
                <option value="">All sports</option>
                {sports.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
            <label>
              <span className="sr-only">School</span>
              <select value={school} onChange={(e) => setSchool(e.target.value)} className={`${field} w-full md:w-64`}>
                <option value="">All schools</option>
                {schools.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
          </>
        ) : null}
      </div>

      {!compact ? (
        <p className="mt-4 text-sm text-muted" aria-live="polite">
          {matches.length} athlete{matches.length === 1 ? "" : "s"}
          {matches.length > shown.length ? ` · showing the first ${shown.length}` : ""}
        </p>
      ) : null}

      {shown.length ? (
        <ul className={compact ? "mt-3 divide-y rounded-2xl border bg-surface" : "mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"}>
          {shown.map((a) => (
            <li key={a.id}>
              <Link
                href={`/results/athletes/${a.id}`}
                className={
                  compact
                    ? "flex items-center justify-between gap-4 px-4 py-3 hover:bg-ink/[0.03]"
                    : "flex h-full flex-col rounded-2xl border bg-surface p-4 transition-colors hover:border-ink/40"
                }
              >
                <span>
                  <span className="block font-medium">{a.name}</span>
                  <span className="block text-sm text-muted">
                    {a.school} · {a.city}
                  </span>
                </span>
                <span className={compact ? "text-right text-xs text-muted" : "mt-3 flex flex-wrap gap-1.5"}>
                  {compact ? (
                    a.sports.join(", ")
                  ) : (
                    <>
                      {a.sports.map((s) => (
                        <span key={s} className="rounded-full bg-ink/5 px-2.5 py-0.5 text-xs">
                          {s}
                        </span>
                      ))}
                      {a.editions.length > 1 ? (
                        <span className="rounded-full bg-indigo/10 px-2.5 py-0.5 text-xs text-indigo">{a.editions.length} leagues</span>
                      ) : null}
                      {a.podiums ? (
                        <span className="rounded-full bg-volt px-2.5 py-0.5 text-xs">{a.podiums} podium{a.podiums === 1 ? "" : "s"}</span>
                      ) : null}
                    </>
                  )}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : compact && q ? (
        <p className="mt-3 text-sm text-muted">No athletes match “{query}”.</p>
      ) : !compact ? (
        <p className="mt-6 text-muted">No athletes match these filters.</p>
      ) : null}
    </div>
  );
}
