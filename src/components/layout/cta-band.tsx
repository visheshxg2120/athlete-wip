import { ButtonLink } from "@/components/ui/button-link";
import { ArrowRight } from "@/components/ui/icons";
import { siteConfig } from "@/config/site";

// Closing call to action, shared by every page.
export function CtaBand() {
  return (
    <section className="bg-volt text-ink">
      <div className="shell flex flex-col gap-10 py-20 md:flex-row md:items-end md:justify-between md:py-28">
        <div>
          <p className="eyebrow opacity-60">Schools · Academies · Parents</p>
          <h2 className="display mt-4 max-w-3xl text-6xl md:text-8xl">
            Bring Athleta to your school.
          </h2>
        </div>
        <div className="flex flex-col items-start gap-4 md:items-end">
          <ButtonLink href="/contact" variant="ink">
            Start an enquiry
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </ButtonLink>
          <a href={`mailto:${siteConfig.contact.email}`} className="text-sm underline-offset-4 hover:underline">
            {siteConfig.contact.email}
          </a>
        </div>
      </div>
    </section>
  );
}
