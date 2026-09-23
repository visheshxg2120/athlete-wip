import { siteConfig } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-7xl px-6 py-10 text-sm text-muted-foreground">
        © {new Date().getFullYear()} {siteConfig.name}
      </div>
    </footer>
  );
}
