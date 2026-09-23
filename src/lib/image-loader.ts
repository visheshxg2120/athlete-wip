"use client";

// Static export has no image optimisation server, so serve files as-is,
// prefixed with the base path (e.g. /athlete-wip on GitHub Pages).
export default function imageLoader({ src, width }: { src: string; width: number }) {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${src}?w=${width}`;
}
