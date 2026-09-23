import { CommandSearch, type SearchEntry } from "@/components/results/command-search";
import { ResultsNav } from "@/components/results/results-nav";
import { calendar, getSchool, profiledAthletes, results } from "@/lib/results";

// App-style frame for the results dashboard: sidebar, search and the
// sample-data notice. The site header floats over the dark band at the top.
export default function ResultsLayout({ children }: { children: React.ReactNode }) {
  const entries: SearchEntry[] = [
    ...calendar().map((c) => ({ type: "League" as const, label: `${c.name} ${c.season}`, sub: `${c.sport} · ${c.venue}`, href: c.href })),
    ...profiledAthletes.map((a) => ({ type: "Athlete" as const, label: a.name, sub: `${getSchool(a.schoolId).name} · ${getSchool(a.schoolId).city}`, href: `/results/athletes/${a.id}` })),
    ...results.schools.map((s) => ({ type: "School" as const, label: s.name, sub: s.city, href: `/results/schools#${s.id}` })),
  ];

  return (
    <>
      <div className="lanes bg-ink pt-20 text-white">
        <div className="shell flex items-center justify-between gap-4 border-t border-line-inverse py-3">
          <p className="eyebrow text-volt">Results</p>
          {results.sample ? <span className="eyebrow rounded-full bg-white/10 px-3 py-1 text-[0.65rem] text-white/80">Sample data</span> : null}
        </div>
      </div>
      <div className="shell gap-10 pb-20 pt-6 lg:grid lg:grid-cols-[12rem_minmax(0,1fr)] lg:pt-10">
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <ResultsNav />
        </aside>
        <div className="mt-5 min-w-0 lg:mt-0">
          <CommandSearch entries={entries} />
          {results.sample ? (
            <p className="mt-4 rounded-xl border border-indigo/20 bg-indigo/5 px-4 py-3 text-sm">
              <strong className="font-semibold">Demo data.</strong> Athletes, schools and results here are generated examples of how
              the dashboard works. Real results replace them once they&apos;re published.
            </p>
          ) : null}
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </>
  );
}
