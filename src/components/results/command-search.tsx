"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";

import { Search } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export type SearchEntry = { type: "League" | "Athlete" | "School"; label: string; sub: string; href: string };

// Global results search. Opens with the button, "/" or ⌘K / Ctrl+K.
export function CommandSearch({ entries }: { entries: SearchEntry[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const q = useDeferredValue(query.trim().toLowerCase());

  const matches = useMemo(() => {
    const list = q ? entries.filter((e) => `${e.label} ${e.sub}`.toLowerCase().includes(q)) : entries.filter((e) => e.type !== "School");
    const shown = list.slice(0, 8);
    // Athletes without a public profile are found through the rankings list.
    if (q) shown.push({ type: "Athlete", label: `Search all athletes for “${query.trim()}”`, sub: "Rankings", href: `/results/athletes?q=${encodeURIComponent(query.trim())}` });
    return shown;
  }, [entries, q, query]);

  const open = () => {
    setQuery("");
    setActive(0);
    dialog.current?.showModal();
    input.current?.focus();
  };
  const close = () => dialog.current?.close();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = e.target instanceof HTMLElement && e.target.closest("input, textarea, select");
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        if (dialog.current?.open) close();
        else open();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, matches.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && matches[active]) {
      e.preventDefault();
      close();
      router.push(matches[active].href);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={open}
        className="flex h-10 w-full items-center gap-3 rounded-xl border bg-surface px-3.5 text-sm text-muted transition-colors hover:border-ink/30 sm:max-w-sm"
      >
        <Search className="size-4" />
        <span className="flex-1 text-left">Search leagues, athletes, schools</span>
        <kbd className="hidden rounded-md border px-1.5 font-mono text-xs sm:inline">⌘K</kbd>
      </button>

      <dialog
        ref={dialog}
        aria-label="Search results"
        onClick={(e) => e.target === dialog.current && close()}
        className="m-auto mt-[12vh] w-[calc(100%-2rem)] max-w-xl rounded-2xl bg-surface p-0 text-ink shadow-2xl backdrop:bg-ink/60 backdrop:backdrop-blur-sm"
      >
        <div className="flex items-center gap-3 border-b px-4">
          <Search className="size-5 text-muted" />
          <input
            ref={input}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="Search leagues, athletes, schools"
            aria-label="Search"
            aria-controls="results-search-list"
            aria-activedescendant={matches[active] ? `results-search-${active}` : undefined}
            className="h-14 flex-1 bg-transparent text-base outline-none"
          />
          <kbd className="rounded-md border px-1.5 font-mono text-xs text-muted">esc</kbd>
        </div>
        <ul id="results-search-list" role="listbox" className="max-h-[60vh] overflow-y-auto p-2">
          {!q ? <li className="eyebrow px-3 pb-1 pt-2 text-[0.65rem] text-muted">Suggestions</li> : null}
          {matches.map((m, i) => (
            <li key={m.href} id={`results-search-${i}`} role="option" aria-selected={i === active}>
              <Link
                href={m.href}
                onClick={close}
                onPointerEnter={() => setActive(i)}
                className={cn("flex items-center justify-between gap-4 rounded-lg px-3 py-2.5", i === active && "bg-ink/5")}
              >
                <span className="min-w-0">
                  <span className="block truncate font-medium">{m.label}</span>
                  <span className="block truncate text-xs text-muted">{m.sub}</span>
                </span>
                <span className="eyebrow shrink-0 text-[0.6rem] text-muted">{m.type}</span>
              </Link>
            </li>
          ))}
          {q && matches.length === 1 ? <li className="px-3 py-2 text-sm text-muted">No leagues, profiles or schools match.</li> : null}
        </ul>
      </dialog>
    </>
  );
}
