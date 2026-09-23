"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Close, Menu } from "@/components/ui/icons";
import { siteConfig } from "@/config/site";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="relative z-50 grid size-10 place-items-center rounded-full bg-white/10 text-white backdrop-blur"
      >
        {open ? <Close /> : <Menu />}
      </button>

      {open ? (
        <div className="fixed inset-0 z-40 flex flex-col bg-ink px-5 pb-10 pt-28 text-white">
          <nav aria-label="Mobile" className="flex flex-col">
            {[{ label: "Home", href: "/" }, ...siteConfig.nav].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="display border-b border-line-inverse py-4 text-5xl transition-colors hover:text-volt"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            href={siteConfig.cta.href}
            onClick={() => setOpen(false)}
            className="mt-auto flex h-14 items-center justify-center rounded-full bg-volt font-semibold text-ink"
          >
            {siteConfig.cta.label}
          </Link>
        </div>
      ) : null}
    </div>
  );
}
