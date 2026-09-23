import Link from "next/link";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

// Wordmark stand-in until we have the official logo as SVG.
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label={`${siteConfig.name} home`}
      className={cn("flex items-center gap-2.5", className)}
    >
      <span className="grid size-8 place-items-center rounded-full bg-volt text-ink">
        <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
          <path d="M4 20 13 4h3l-9 16H4Zm7 0 6-10.5L20 15v5h-9Z" fill="currentColor" />
        </svg>
      </span>
      <span className="display text-2xl leading-none tracking-wide">Athleta</span>
    </Link>
  );
}
