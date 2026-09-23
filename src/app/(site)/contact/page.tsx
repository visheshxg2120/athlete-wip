import type { Metadata } from "next";

import { ContactForm } from "@/app/(site)/contact/contact-form";
import { Mail, Phone, Pin } from "@/components/ui/icons";
import { PageHero } from "@/components/ui/page-hero";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Enquire about leagues, camps and coaching with Athleta Games.",
};

export default function ContactPage() {
  const { contact } = siteConfig;
  const details = [
    { icon: Mail, label: "Email", value: contact.email, href: `mailto:${contact.email}` },
    { icon: Phone, label: "Phone", value: contact.phone, href: contact.phoneHref },
    { icon: Pin, label: "Office", value: contact.address.join(", ") },
  ];

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's talk"
        intro="Whether you're a school, an academy or a parent, tell us what you're looking for and we'll get back to you."
      />
      <section className="py-20 md:py-28">
        <div className="shell grid gap-14 lg:grid-cols-12">
          <ul className="space-y-8 lg:col-span-4">
            {details.map(({ icon: Icon, label, value, href }) => (
              <li key={label} className="flex gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-ink text-volt">
                  <Icon className="size-5" />
                </span>
                <div>
                  <p className="eyebrow text-muted">{label}</p>
                  {href ? (
                    <a href={href} className="mt-1 block font-medium hover:underline">
                      {value}
                    </a>
                  ) : (
                    <p className="mt-1 font-medium">{value}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <div className="rounded-2xl bg-surface p-6 md:p-10 lg:col-span-8">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
