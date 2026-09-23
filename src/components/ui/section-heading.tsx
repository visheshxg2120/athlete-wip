import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  className,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  className?: string;
  /** Optional action (e.g. a link) aligned to the right on wide screens. */
  children?: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-6 md:flex-row md:items-end md:justify-between", className)}>
      <div className="max-w-2xl">
        <p className="eyebrow opacity-60">{eyebrow}</p>
        <h2 className="display mt-4 text-5xl md:text-7xl">{title}</h2>
        {intro ? <p className="mt-5 max-w-xl text-lg opacity-70">{intro}</p> : null}
      </div>
      {children}
    </div>
  );
}
