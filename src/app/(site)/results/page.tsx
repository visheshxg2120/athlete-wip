import type { Metadata } from "next";

import { CalendarGrid } from "@/components/results/calendar-grid";
import { PageHead } from "@/components/results/page-head";
import { calendar, totals } from "@/lib/results";

export const metadata: Metadata = {
  title: "Results",
  description: "Results, rankings and athlete profiles from every Athleta league.",
};

export default function ResultsPage() {
  const t = totals();
  return (
    <>
      <PageHead
        crumbs={[{ label: "Results", href: "/results" }, { label: "Calendar" }]}
        title="League calendar"
        description={`${t.editions} leagues played so far, with ${t.athletes} athletes from ${t.schools} schools. Open a league for standings, leaderboards and every result.`}
      />
      <div className="mt-8">
        <CalendarGrid items={calendar()} />
      </div>
    </>
  );
}
