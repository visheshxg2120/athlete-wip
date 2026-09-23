"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

export type FieldPoint = { id: string; name: string; value: number; display: string; place: number; me?: boolean };

// Where one athlete sits in the whole field: every competitor is a dot on one
// axis, better to the right. The athlete is the indigo dot; everyone else is
// neutral. Hover or focus a dot for the name, mark and place.
export function FieldStrip({ title, points, better }: { title: string; points: FieldPoint[]; better: "lower" | "higher" }) {
  const [active, setActive] = useState<string | null>(null);
  const values = points.map((p) => p.value);
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  const pad = (hi - lo) * 0.06 || 1;
  const [worst, best] = better === "lower" ? [hi + pad, lo - pad] : [lo - pad, hi + pad];
  const x = (v: number) => ((v - worst) / (best - worst)) * 100;

  // Stack dots that would overlap into up to three rows.
  const rows = new Map<string, number>();
  const lastX: number[] = [];
  for (const p of [...points].sort((a, b) => x(a.value) - x(b.value))) {
    let row = lastX.findIndex((lx) => x(p.value) - lx > 3.2);
    if (row === -1) row = lastX.length < 3 ? lastX.length : 0;
    lastX[row] = x(p.value);
    rows.set(p.id, row);
  }
  const me = points.find((p) => p.me);
  const worstPoint = points.reduce((a, b) => (x(b.value) < x(a.value) ? b : a));
  const bestPoint = points.reduce((a, b) => (x(b.value) > x(a.value) ? b : a));

  return (
    <figure className="rounded-2xl border bg-surface p-5">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="text-sm font-medium">{title}</span>
        <span className="text-xs text-muted">{points.length} competitors · better →</span>
      </figcaption>
      <div className="relative mx-2 mt-10 h-16" onPointerLeave={() => setActive(null)}>
        <div className="absolute inset-x-0 bottom-3 h-px bg-ink/15" />
        {points.map((p) => {
          const row = rows.get(p.id) ?? 0;
          const shown = active === p.id || (active === null && p.me);
          return (
            <button
              key={p.id}
              type="button"
              aria-label={`${p.name}: ${p.display}, place ${p.place} of ${points.length}`}
              onPointerEnter={() => setActive(p.id)}
              onFocus={() => setActive(p.id)}
              onBlur={() => setActive(null)}
              className="absolute grid size-6 -translate-x-1/2 place-items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-indigo"
              style={{ left: `${x(p.value)}%`, bottom: `${row * 14}px`, zIndex: p.me ? 2 : 1 }}
            >
              <span
                className={cn(
                  "block rounded-full ring-2 ring-surface transition-transform",
                  p.me ? "size-3.5 bg-indigo" : "size-2.5 bg-ink/30",
                  active === p.id && "scale-125",
                )}
              />
              {shown ? (
                <span
                  className={cn(
                    "pointer-events-none absolute bottom-full mb-1 whitespace-nowrap rounded-lg px-2.5 py-1 text-xs shadow-lg",
                    p.me ? "bg-indigo text-white" : "bg-ink text-white",
                    x(p.value) > 75 ? "right-0" : x(p.value) < 25 ? "left-0" : "left-1/2 -translate-x-1/2",
                  )}
                >
                  <strong className="font-semibold">{p.display}</strong> <span className="opacity-75">· {p.me ? "" : `${p.name} · `}{p.place}/{points.length}</span>
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
      <div className="mx-2 flex justify-between text-xs tabular-nums text-muted">
        <span>{worstPoint.display}</span>
        <span>{bestPoint.display}</span>
      </div>
      {me ? <p className="sr-only">{`Place ${me.place} of ${points.length}.`}</p> : null}
    </figure>
  );
}
