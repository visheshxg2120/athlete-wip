"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { ChevronLeft, ChevronRight, Close } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import type { Photo } from "@/types/content";

// Responsive photo grid; tapping a photo opens it in a full-screen viewer.
export function PhotoGrid({ photos, className }: { photos: Photo[]; className?: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState<number | null>(null);

  const open = (i: number) => {
    setIndex(i);
    dialog.current?.showModal();
  };
  const step = useCallback(
    (delta: number) =>
      setIndex((i) => (i === null ? i : (i + delta + photos.length) % photos.length)),
    [photos.length],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!dialog.current?.open) return;
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step]);

  const current = index === null ? null : photos[index];

  return (
    <>
      <ul className={cn("grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3", className)}>
        {photos.map((photo, i) => (
          <li key={photo.src}>
            <button
              type="button"
              onClick={() => open(i)}
              className="group relative block aspect-[4/3] w-full overflow-hidden rounded-xl bg-ink-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-volt"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(min-width: 768px) 33vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        onClose={() => setIndex(null)}
        onClick={(e) => e.target === dialog.current && dialog.current?.close()}
        className="m-auto max-h-none max-w-none border-0 bg-transparent p-0 backdrop:bg-ink/90 backdrop:backdrop-blur-sm"
      >
        {current ? (
          <figure className="relative w-[min(92vw,64rem)]">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-ink-2">
              <Image src={current.src} alt={current.alt} fill sizes="92vw" className="object-contain" />
            </div>
            <figcaption className="mt-3 flex items-center justify-between gap-4 text-sm text-white/80">
              <span>{current.alt}</span>
              <span className="eyebrow shrink-0">
                {index! + 1} / {photos.length}
              </span>
            </figcaption>
            <div className="absolute right-3 top-3 flex gap-2">
              {photos.length > 1 ? (
                <>
                  <ViewerButton label="Previous photo" onClick={() => step(-1)}>
                    <ChevronLeft />
                  </ViewerButton>
                  <ViewerButton label="Next photo" onClick={() => step(1)}>
                    <ChevronRight />
                  </ViewerButton>
                </>
              ) : null}
              <ViewerButton label="Close" onClick={() => dialog.current?.close()}>
                <Close />
              </ViewerButton>
            </div>
          </figure>
        ) : null}
      </dialog>
    </>
  );
}

function ViewerButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid size-10 place-items-center rounded-full bg-ink/70 text-white backdrop-blur transition-colors hover:bg-volt hover:text-ink"
    >
      {children}
    </button>
  );
}
