import Link from "next/link";

import { cn } from "@/lib/utils";

const variants = {
  volt: "bg-volt text-ink hover:bg-white",
  ink: "bg-ink text-white hover:bg-ink-3",
  outline: "border border-current/25 hover:border-current",
} as const;

export function ButtonLink({
  href,
  variant = "volt",
  className,
  children,
}: {
  href: string;
  variant?: keyof typeof variants;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex h-12 items-center gap-2 rounded-full px-6 text-sm font-semibold transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-volt",
        variants[variant],
        className,
      )}
    >
      {children}
    </Link>
  );
}
