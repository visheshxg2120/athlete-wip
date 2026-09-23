"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

type Datum = { label: string; value: number; detail?: string };

// Single-series horizontal bar chart. One hue (indigo, validated against the
// paper surface), value at each bar tip, and a hover/focus tooltip per bar.
// Bars are capped at 20px thick with a 4px rounded data end.
export function BarChart({ data, unit, title }: { data: Datum[]; unit: string; title: string }) {
  const [active, setActive] = useState<number | null>(null);
  const max = Math.max(1, ...data.map((d) => d.value));

  return (
    <figure className="rounded-2xl border bg-surface p-5">
      <figcaption className="text-sm font-medium">{title}</figcaption>
      <ul className="mt-4 space-y-2" onPointerLeave={() => setActive(null)}>
        {data.map((d, i) => (
          <li key={d.label}>
            <div
              tabIndex={0}
              role="img"
              aria-label={`${d.label}: ${d.value} ${unit}${d.detail ? `, ${d.detail}` : ""}`}
              onPointerEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              className="group relative grid grid-cols-[minmax(0,9rem)_1fr] items-center gap-3 rounded-lg py-1 outline-none focus-visible:ring-2 focus-visible:ring-indigo sm:grid-cols-[minmax(0,12rem)_1fr]"
            >
              <span className="truncate text-sm text-muted">{d.label}</span>
              <span className="flex items-center gap-2">
                <span
                  className={cn("h-5 rounded-r-[4px] bg-indigo transition-opacity", active !== null && active !== i && "opacity-40")}
                  style={{ width: `${(d.value / max) * 85}%`, minWidth: d.value ? 4 : 0 }}
                />
                <span className="text-sm font-medium tabular-nums">{d.value}</span>
              </span>
              {active === i ? (
                <span className="pointer-events-none absolute -top-10 left-[9.75rem] z-10 whitespace-nowrap rounded-lg bg-ink px-3 py-1.5 text-xs text-white shadow-lg sm:left-[12.75rem]">
                  <strong className="font-semibold">
                    {d.value} {unit}
                  </strong>{" "}
                  <span className="text-white/70">· {d.detail ?? d.label}</span>
                </span>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </figure>
  );
}
