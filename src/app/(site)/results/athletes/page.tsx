import type { Metadata } from "next";
import { Suspense } from "react";

import { PageHead } from "@/components/results/page-head";
import { RankingsList } from "@/components/results/rankings-list";
import { athleteRankings, SEASONS } from "@/lib/results";

export const metadata: Metadata = {
  title: "Athlete rankings",
  description: "Every athlete who has competed in an Athleta league, ranked by podium finishes.",
};

export default function AthletesPage() {
  return (
    <>
      <PageHead
        crumbs={[{ label: "Results", href: "/results" }, { label: "Rankings" }, { label: "Athletes" }]}
        title="Athletes"
        description="Everyone who has competed in an Athleta league, ranked by podium finishes (team and individual), then leagues played. Names show a first name and surname initial only; full profiles are shown only for athletes whose parents have opted in."
      />
      <div className="mt-8">
        <Suspense>
          <RankingsList rows={athleteRankings()} seasons={SEASONS} />
        </Suspense>
      </div>
    </>
  );
}
