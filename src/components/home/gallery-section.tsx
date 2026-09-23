import { PhotoGrid } from "@/components/ui/photo-grid";
import { SectionHeading } from "@/components/ui/section-heading";
import { gallery, partners } from "@/content/general";

export function GallerySection() {
  return (
    <section className="py-24 md:py-32">
      <div className="shell">
        <SectionHeading
          eyebrow="Moments"
          title="On the road"
          intro="From school grounds in Gwalior to tournaments across Asia."
        />
        <PhotoGrid photos={gallery.slice(0, 6)} className="mt-14" />

        <div className="mt-24 grid gap-8 border-t pt-10 md:grid-cols-12">
          <p className="eyebrow text-muted md:col-span-3">Partners</p>
          <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border bg-line md:col-span-9 md:grid-cols-4">
            {partners.map((partner) => (
              <li key={partner} className="grid h-24 place-items-center bg-paper px-4 text-center font-semibold text-ink/70">
                {partner}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
