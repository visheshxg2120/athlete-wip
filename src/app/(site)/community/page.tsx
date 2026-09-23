import type { Metadata } from "next";

import { PageShell } from "@/components/layout/page-shell";

export const metadata: Metadata = { title: "Community" };

export default function CommunityPage() {
  return <PageShell title="Community" />;
}
