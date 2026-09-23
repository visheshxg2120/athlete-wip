"use client";

import { useState } from "react";

// Two-series radar: the athlete (indigo) against a reference such as the
// field's median (neutral, dashed). All axes share one scale, stated below the
// chart. Hover or focus a point for both values.
export function RadarChart({
  title,
  axes,
  me,
  reference,
  labels,
  domain,
}: {
  title: string;
  axes: string[];
  me: number[];
  reference: number[];
  labels: [string, string];
  domain: [number, number];
}) {
  const [active, setActive] = useState<number | null>(null);
  const size = 320;
  const c = size / 2;
  const r = c - 56;
  const angle = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / axes.length;
  const pt = (i: number, v: number) => {
    const k = Math.max(0, Math.min(1, (v - domain[0]) / (domain[1] - domain[0])));
    return [c + Math.cos(angle(i)) * r * k, c + Math.sin(angle(i)) * r * k] as const;
  };
  const poly = (vals: number[]) => vals.map((v, i) => pt(i, v).join(",")).join(" ");
  const rings = [0.25, 0.5, 0.75, 1];

  return (
    <figure className="rounded-2xl border bg-surface p-5">
      <figcaption className="text-sm font-medium">{title}</figcaption>
      <div className="relative mx-auto mt-2 max-w-[20rem]">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full" role="img" aria-label={`${title}. ${axes.map((a, i) => `${a}: ${me[i].toFixed(3)} (${labels[1]} ${reference[i].toFixed(3)})`).join("; ")}`}>
          {rings.map((k) => (
            <polygon key={k} points={axes.map((_, i) => [c + Math.cos(angle(i)) * r * k, c + Math.sin(angle(i)) * r * k].join(",")).join(" ")} fill="none" stroke="var(--line)" />
          ))}
          {axes.map((a, i) => {
            const [x, y] = [c + Math.cos(angle(i)) * (r + 22), c + Math.sin(angle(i)) * (r + 22)];
            return (
              <g key={a}>
                <line x1={c} y1={c} x2={c + Math.cos(angle(i)) * r} y2={c + Math.sin(angle(i)) * r} stroke="var(--line)" />
                <text x={x} y={y} textAnchor="middle" dominantBaseline="middle" className="fill-muted text-[11px]">{a}</text>
              </g>
            );
          })}
          <polygon points={poly(reference)} fill="none" stroke="var(--muted)" strokeWidth={2} strokeDasharray="4 4" strokeLinejoin="round" />
          <polygon points={poly(me)} fill="var(--indigo)" fillOpacity={0.14} stroke="var(--indigo)" strokeWidth={2} strokeLinejoin="round" />
          {me.map((v, i) => {
            const [x, y] = pt(i, v);
            return (
              <g key={axes[i]}>
                <circle cx={x} cy={y} r={active === i ? 6 : 4.5} fill="var(--indigo)" stroke="var(--surface)" strokeWidth={2} />
                <circle
                  cx={x}
                  cy={y}
                  r={16}
                  fill="transparent"
                  tabIndex={0}
                  aria-label={`${axes[i]}: ${v.toFixed(3)}; ${labels[1]} ${reference[i].toFixed(3)}`}
                  onPointerEnter={() => setActive(i)}
                  onPointerLeave={() => setActive(null)}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                  className="cursor-default outline-none"
                />
              </g>
            );
          })}
        </svg>
        {active !== null ? (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg bg-ink px-3 py-1.5 text-xs text-white shadow-lg"
            style={{ left: `${(pt(active, me[active])[0] / size) * 100}%`, top: `calc(${(pt(active, me[active])[1] / size) * 100}% - 10px)` }}
          >
            <strong className="font-semibold">{axes[active]}</strong> · {me[active].toFixed(3)}
            <span className="text-white/70"> · {labels[1]} {reference[active].toFixed(3)}</span>
          </div>
        ) : null}
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-xs text-muted">
        <span className="flex items-center gap-2"><span className="h-0.5 w-4 bg-indigo" />{labels[0]}</span>
        <span className="flex items-center gap-2"><span className="w-4 border-t-2 border-dashed border-muted" />{labels[1]}</span>
        <span>Scale {domain[0]}–{domain[1]} pts</span>
      </div>
    </figure>
  );
}
