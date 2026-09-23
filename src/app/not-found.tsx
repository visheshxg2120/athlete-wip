import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ButtonLink } from "@/components/ui/button-link";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="lanes flex flex-1 items-center bg-ink text-white">
        <div className="shell py-40">
          <p className="eyebrow text-volt">404</p>
          <h1 className="display mt-5 text-7xl md:text-9xl">Out of bounds</h1>
          <p className="mt-6 text-lg text-muted-inverse">This page doesn&apos;t exist, or it has moved.</p>
          <ButtonLink href="/" className="mt-10">
            Back to home
          </ButtonLink>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
