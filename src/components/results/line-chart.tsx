"use client";

import { useEffect, useRef, useState } from "react";

type Point = { label: string; value: number; detail?: string };

// Single-series line chart (2px indigo line, 8px markers) with a crosshair and
// tooltip that follow the pointer. Width follows the container.
export function LineChart({ title, points, unit, note }: { title: string; points: Point[]; unit: string; note?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(560);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const height = 200;
  const m = { t: 16, r: 16, b: 28, l: 36 };
  const max = Math.max(1, ...points.map((p) => p.value));
  const niceMax = Math.ceil(max / 10) * 10 || max;
  const x = (i: number) => m.l + (points.length === 1 ? 0.5 : i / (points.length - 1)) * (width - m.l - m.r);
  const y = (v: number) => m.t + (1 - v / niceMax) * (height - m.t - m.b);
  const ticks = [0, niceMax / 2, niceMax];

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    let best = 0;
    points.forEach((_, i) => {
      if (Math.abs(x(i) - px) < Math.abs(x(best) - px)) best = i;
    });
    setActive(best);
  };

  return (
    <figure className="rounded-2xl border bg-surface p-5">
      <figcaption className="text-sm font-medium">
        {title}
        {note ? <span className="mt-0.5 block text-xs font-normal text-muted">{note}</span> : null}
      </figcaption>
      <div ref={box} className="relative mt-4">
        <svg width={width} height={height} onPointerMove={onMove} onPointerLeave={() => setActive(null)} role="img" aria-label={`${title}: ${points.map((p) => `${p.label} ${p.value} ${unit}`).join(", ")}`}>
          {ticks.map((t) => (
            <g key={t}>
              <line x1={m.l} x2={width - m.r} y1={y(t)} y2={y(t)} stroke="var(--line)" />
              <text x={m.l - 8} y={y(t)} textAnchor="end" dominantBaseline="middle" className="fill-muted text-[11px] tabular-nums">{t}</text>
            </g>
          ))}
          {points.map((p, i) => (
            <text key={p.label} x={x(i)} y={height - 8} textAnchor="middle" className="fill-muted text-[11px]">{i + 1}</text>
          ))}
          {active !== null ? <line x1={x(active)} x2={x(active)} y1={m.t} y2={height - m.b} stroke="var(--ink)" strokeOpacity={0.25} /> : null}
          <polyline points={points.map((p, i) => `${x(i)},${y(p.value)}`).join(" ")} fill="none" stroke="var(--indigo)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
          {points.map((p, i) => (
            <circle key={p.label} cx={x(i)} cy={y(p.value)} r={active === i ? 5.5 : 4} fill="var(--indigo)" stroke="var(--surface)" strokeWidth={2} />
          ))}
          <text x={x(points.length - 1)} y={y(points[points.length - 1].value) - 12} textAnchor="end" className="fill-ink text-[12px] font-semibold tabular-nums">
            {points[points.length - 1].value} {unit}
          </text>
        </svg>
        {active !== null ? (
          <div
            className="pointer-events-none absolute z-10 whitespace-nowrap rounded-lg bg-ink px-3 py-1.5 text-xs text-white shadow-lg"
            style={{ left: Math.min(Math.max(x(active) - 60, 0), width - 180), top: Math.max(0, y(points[active].value) - 44) }}
          >
            <strong className="font-semibold">{points[active].value} {unit}</strong>
            <span className="text-white/70"> · {points[active].detail ?? points[active].label}</span>
          </div>
        ) : null}
      </div>
      <p className="mt-1 text-center text-xs text-muted">Match</p>
    </figure>
  );
}
