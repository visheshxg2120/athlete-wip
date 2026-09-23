import Link from "next/link";

import { MobileNav } from "@/components/layout/mobile-nav";
import { ButtonLink } from "@/components/ui/button-link";
import { Logo } from "@/components/ui/logo";
import { siteConfig } from "@/config/site";

// Floats over the dark hero at the top of every page.
export function SiteHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-40 text-white">
      <div className="shell flex h-20 items-center justify-between gap-6">
        <Logo />
        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm text-white/75 transition-colors hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ButtonLink href="/results" variant="outline" className="hidden h-10 px-5 sm:inline-flex">
            Results
          </ButtonLink>
          <ButtonLink href={siteConfig.cta.href} className="hidden h-10 px-5 sm:inline-flex">
            {siteConfig.cta.label}
          </ButtonLink>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
