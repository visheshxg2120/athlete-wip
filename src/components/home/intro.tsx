import Link from "next/link";

import { ArrowRight } from "@/components/ui/icons";
import { sports } from "@/content/general";

export function Intro() {
  return (
    <section className="py-24 md:py-32">
      <div className="shell">
        <p className="eyebrow text-muted">Sports for all</p>
        <p className="mt-6 max-w-5xl text-3xl font-medium leading-tight tracking-tight md:text-5xl">
          We find talent at the grassroots and give it a stage: school leagues at home, world-class
          coaches and{" "}
          <span className="text-muted">international camps across Southeast Asia and beyond.</span>
        </p>
        <Link
          href="/about"
          className="group mt-10 inline-flex items-center gap-2 font-semibold underline-offset-4 hover:underline"
        >
          Our story
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>

        <div className="mt-20 border-t pt-10">
          <p className="eyebrow text-muted">Eight sports · One pathway</p>
          <ul className="mt-6 grid grid-cols-2 gap-x-4 sm:grid-cols-4 sm:gap-x-6">
            {sports.map((sport, i) => (
              <li
                key={sport}
                className="group flex items-baseline gap-3 border-b py-4 transition-colors hover:border-ink"
              >
                <span className="eyebrow text-muted">{String(i + 1).padStart(2, "0")}</span>
                <span className="display text-[1.7rem] transition-colors group-hover:text-indigo sm:text-3xl md:text-4xl">
                  {sport}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
