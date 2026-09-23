import type { Metadata } from "next";

import { MedalBadge, TableCard, Td, Th } from "@/components/results/data";
import { PageHead } from "@/components/results/page-head";
import { schoolRankings } from "@/lib/results";

export const metadata: Metadata = {
  title: "School rankings",
  description: "Schools ranked by league titles and medals across every Athleta league.",
};

export default function SchoolsPage() {
  const rows = schoolRankings();
  return (
    <>
      <PageHead
        crumbs={[{ label: "Results", href: "/results" }, { label: "Rankings" }, { label: "Schools" }]}
        title="Schools"
        description="Ranked by league titles (football and cricket), then medals in athletics and gymnastics."
      />
      <TableCard className="mt-8 [&_table]:min-w-[40rem]">
        <thead>
          <tr>
            <Th>#</Th><Th>School</Th><Th numeric>Titles</Th><Th numeric>Team podiums</Th>
            <Th numeric><MedalBadge medal="gold" /></Th><Th numeric><MedalBadge medal="silver" /></Th><Th numeric><MedalBadge medal="bronze" /></Th>
            <Th numeric>Athletes</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((s, i) => (
            <tr key={s.id} id={s.id} className="scroll-mt-24 target:bg-volt/20">
              <Td className="tabular-nums text-muted">{i + 1}</Td>
              <Td><span className="font-medium">{s.name}</span><span className="block text-xs text-muted">{s.city}</span></Td>
              <Td numeric className="font-semibold">{s.titles}</Td>
              <Td numeric>{s.teamPodiums}</Td>
              <Td numeric>{s.gold}</Td><Td numeric>{s.silver}</Td><Td numeric>{s.bronze}</Td>
              <Td numeric className="text-muted">{s.athletes}</Td>
            </tr>
          ))}
        </tbody>
      </TableCard>
    </>
  );
}
