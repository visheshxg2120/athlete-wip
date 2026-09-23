import type { Metadata } from "next";

import { AthleteSearch } from "@/components/results/athlete-search";
import { ResultsShell } from "@/components/results/results-shell";
import { athleteIndex } from "@/lib/results";

export const metadata: Metadata = {
  title: "Athletes",
  description: "Search every athlete who has competed in an Athleta league.",
};

export default function AthletesPage() {
  return (
    <ResultsShell
      eyebrow="Results · Athletes"
      title="Athlete directory"
      intro="Every athlete who has competed in an Athleta league. Names are shown as first name and surname initial."
      active="Athletes"
    >
      <div className="shell">
        <AthleteSearch athletes={athleteIndex()} />
      </div>
    </ResultsShell>
  );
}
