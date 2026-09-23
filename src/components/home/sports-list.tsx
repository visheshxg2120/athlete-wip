"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

import { ArrowUpRight } from "@/components/ui/icons";
import type { Sport } from "@/content/general";
import { cn } from "@/lib/utils";

// Sports index. On devices with a mouse, hovering a sport reveals a photo card
// that follows the cursor and expands a one-line detail. On touch devices the
// details are always shown instead.
export function SportsList({ sports }: { sports: Sport[] }) {
  const list = useRef<HTMLUListElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  // The card only follows a mouse; keyboard focus just expands the detail.
  const [pointerInside, setPointerInside] = useState(false);

  // Move the card with the cursor (kept inside the list), without re-rendering.
  function onPointerMove(e: React.PointerEvent) {
    const rect = list.current?.getBoundingClientRect();
    if (!rect || !card.current) return;
    const half = card.current.offsetWidth / 2;
    const x = Math.min(Math.max(e.clientX - rect.left, half), rect.width - half);
    card.current.style.transform = `translate(${x}px, ${e.clientY - rect.top}px) translate(-50%, calc(-100% - 2.5rem)) rotate(-3deg)`;
  }

  return (
    <div className="relative">
      <ul
        ref={list}
        onPointerMove={onPointerMove}
        onPointerEnter={(e) => e.pointerType === "mouse" && setPointerInside(true)}
        onPointerLeave={() => {
          setPointerInside(false);
          setActive(null);
        }}
        className="mt-6 grid grid-cols-2 gap-x-4 sm:grid-cols-4 sm:gap-x-6"
      >
        {sports.map((sport, i) => (
          <li key={sport.name}>
            <Link
              href={sport.href}
              onPointerEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              className={cn(
                "group block border-b py-4 outline-none transition-[opacity,border-color] duration-300",
                active === i && "border-ink",
                active !== null && active !== i && "pointer-fine:opacity-35",
              )}
            >
              <span className="flex items-baseline gap-3">
                <span className="eyebrow text-muted">{String(i + 1).padStart(2, "0")}</span>
                <span
                  className={cn(
                    "display text-[1.7rem] transition-[color,translate] duration-300 sm:text-3xl md:text-4xl",
                    active === i && "text-indigo pointer-fine:translate-x-1.5",
                  )}
                >
                  {sport.name}
                </span>
                <ArrowUpRight
                  className={cn(
                    "ml-auto hidden size-4 shrink-0 self-center text-indigo opacity-0 transition-opacity duration-300 pointer-fine:block",
                    active === i && "opacity-100",
                  )}
                />
              </span>
              {/* Space is always reserved so revealing it doesn't shift the rows below. */}
              <span
                className={cn(
                  "block pl-8 pt-1.5 text-sm text-muted transition-[opacity,translate] duration-300 ease-out",
                  "pointer-fine:-translate-y-1 pointer-fine:opacity-0",
                  active === i && "pointer-fine:translate-y-0 pointer-fine:opacity-100",
                )}
              >
                {sport.detail}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Floating preview card (mouse only). */}
      <div
        ref={card}
        aria-hidden
        className={cn(
          "pointer-events-none absolute left-0 top-0 z-10 hidden w-64 transition-opacity duration-200 pointer-fine:block",
          pointerInside && active !== null ? "opacity-100" : "opacity-0",
        )}
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-ink shadow-2xl shadow-ink/30 ring-1 ring-ink/10">
          {sports.map((sport, i) => (
            <div
              key={sport.name}
              className={cn(
                "absolute inset-0 transition-[opacity,scale] duration-300",
                active === i ? "scale-100 opacity-100" : "scale-105 opacity-0",
              )}
            >
              {sport.photo ? (
                <Image src={sport.photo.src} alt="" fill sizes="16rem" className="object-cover" />
              ) : (
                <div className="lanes grid h-full place-items-center bg-gradient-to-br from-indigo to-ink p-4">
                  <span className="display text-center text-4xl text-volt">{sport.name}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
