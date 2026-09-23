"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Calendar, School, Trophy, Users } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

const GROUPS = [
  {
    label: "Leagues",
    items: [{ label: "Calendar", href: "/results", icon: Calendar, match: (p: string) => p === "/results" || /^\/results\/(?!athletes|schools|records)[^/]+$/.test(p) }],
  },
  {
    label: "Rankings",
    items: [
      { label: "Athletes", href: "/results/athletes", icon: Users, match: (p: string) => p.startsWith("/results/athletes") },
      { label: "Schools", href: "/results/schools", icon: School, match: (p: string) => p.startsWith("/results/schools") },
    ],
  },
  {
    label: "Analysis",
    items: [{ label: "Records", href: "/results/records", icon: Trophy, match: (p: string) => p.startsWith("/results/records") }],
  },
];

// Sidebar on large screens; a scrollable row of links on smaller ones.
export function ResultsNav() {
  const pathname = usePathname().replace(/\/$/, "") || "/";

  return (
    <nav aria-label="Results">
      <ul className="-mx-5 flex gap-1 overflow-x-auto px-5 lg:mx-0 lg:hidden">
        {GROUPS.flatMap((g) => g.items).map((item) => {
          const active = item.match(pathname);
          return (
            <li key={item.href} className="shrink-0">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn("flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium", active ? "bg-ink text-white" : "text-muted hover:bg-ink/5 hover:text-ink")}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="hidden space-y-7 lg:block">
        {GROUPS.map((g) => (
          <div key={g.label}>
            <p className="eyebrow px-3 text-[0.65rem] text-muted">{g.label}</p>
            <ul className="mt-2 space-y-0.5">
              {g.items.map((item) => {
                const active = item.match(pathname);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        active ? "bg-ink text-white" : "text-ink/80 hover:bg-ink/5 hover:text-ink",
                      )}
                    >
                      <item.icon className={cn("size-4", active ? "text-volt" : "text-muted")} />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}
