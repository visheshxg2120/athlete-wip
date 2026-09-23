import Link from "next/link";

import { Logo } from "@/components/ui/logo";
import { siteConfig } from "@/config/site";
import { sports } from "@/content/general";

export function SiteFooter() {
  const { contact } = siteConfig;

  return (
    <footer className="bg-ink text-white">
      <div className="shell grid gap-12 py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-5">
          <Logo />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-inverse">
            Founded in New Delhi in {siteConfig.founded}, Athleta nurtures talent from the
            grassroots and takes young athletes to competitions and camps across India and
            Southeast Asia.
          </p>
          <ul className="mt-8 flex gap-2">
            {siteConfig.social.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-9 items-center rounded-full border border-line-inverse px-4 text-xs text-white/80 transition-colors hover:border-volt hover:text-volt"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <FooterColumn title="Explore" className="md:col-span-2">
          {siteConfig.nav.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="hover:text-volt">
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/contact" className="hover:text-volt">
              Contact
            </Link>
          </li>
        </FooterColumn>

        <FooterColumn title="Sports" className="md:col-span-2">
          {sports.slice(0, 6).map((sport) => (
            <li key={sport}>{sport}</li>
          ))}
        </FooterColumn>

        <FooterColumn title="Contact" className="md:col-span-3">
          <li>
            <a href={`mailto:${contact.email}`} className="hover:text-volt">
              {contact.email}
            </a>
          </li>
          <li>
            <a href={contact.phoneHref} className="hover:text-volt">
              {contact.phone}
            </a>
          </li>
          <li className="leading-relaxed">
            {contact.address.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </li>
        </FooterColumn>
      </div>

      <div className="border-t border-line-inverse">
        <div className="shell flex flex-col gap-2 py-6 text-xs text-muted-inverse md:flex-row md:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.legalName}
          </p>
          <p>{siteConfig.tagline}</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  className,
  children,
}: {
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <p className="eyebrow text-white/50">{title}</p>
      <ul className="mt-5 space-y-3 text-sm text-white/85">{children}</ul>
    </div>
  );
}
