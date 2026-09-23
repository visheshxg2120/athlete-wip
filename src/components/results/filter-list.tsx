"use client";

import { useState } from "react";

const field = "h-9 rounded-lg border bg-surface px-3 text-sm outline-none focus:border-ink";

type Item = { key: string; sport: string; season: string; node: React.ReactNode };

// Sport and season filters over server-rendered items.
export function FilterList({ items }: { items: Item[] }) {
  const [sport, setSport] = useState("");
  const [season, setSeason] = useState("");
  const sports = [...new Set(items.map((i) => i.sport))].sort();
  const seasons = [...new Set(items.map((i) => i.season))].sort().reverse();
  const shown = items.filter((i) => (!sport || i.sport === sport) && (!season || i.season === season));

  return (
    <div>
      {sports.length > 1 || seasons.length > 1 ? (
        <div className="flex flex-wrap gap-2">
          {sports.length > 1 ? (
            <label>
              <span className="sr-only">Sport</span>
              <select value={sport} onChange={(e) => setSport(e.target.value)} className={field}>
                <option value="">All sports</option>
                {sports.map((s) => <option key={s}>{s}</option>)}
              </select>
            </label>
          ) : null}
          {seasons.length > 1 ? (
            <label>
              <span className="sr-only">Season</span>
              <select value={season} onChange={(e) => setSeason(e.target.value)} className={field}>
                <option value="">All seasons</option>
                {seasons.map((s) => <option key={s}>{s}</option>)}
              </select>
            </label>
          ) : null}
        </div>
      ) : null}
      <ol className="mt-4 space-y-4">
        {shown.map((i) => <li key={i.key}>{i.node}</li>)}
      </ol>
    </div>
  );
}
