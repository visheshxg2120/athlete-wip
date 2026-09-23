import type { Metadata } from "next";

import { PageShell } from "@/components/layout/page-shell";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return <PageShell title="Contact" />;
}
