import type { Metadata } from "next";

import { PageShell } from "@/components/layout/page-shell";

export const metadata: Metadata = { title: "Partners" };

export default function PartnersPage() {
  return <PageShell title="Partners" />;
}
