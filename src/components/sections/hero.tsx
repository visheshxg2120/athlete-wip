import { siteConfig } from "@/config/site";

// Home page hero. Placeholder until the reference screenshots are in.
export function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-32">
      <h1 className="max-w-3xl text-5xl font-semibold tracking-tight md:text-7xl">
        {siteConfig.name}
      </h1>
      <p className="mt-6 max-w-xl text-lg text-muted-foreground">
        {siteConfig.description}
      </p>
    </section>
  );
}
