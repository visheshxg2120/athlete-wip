"use client";

import { useId, useState } from "react";

import { cn } from "@/lib/utils";

// Accessible tab list; panels are rendered on the server and passed in.
export function Tabs({ tabs }: { tabs: { label: string; content: React.ReactNode }[] }) {
  const [index, setIndex] = useState(0);
  const id = useId();

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") setIndex((i) => (i + 1) % tabs.length);
    if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + tabs.length) % tabs.length);
  };

  return (
    <div>
      <div role="tablist" className="flex flex-wrap gap-2" onKeyDown={onKeyDown}>
        {tabs.map((t, i) => (
          <button
            key={t.label}
            type="button"
            role="tab"
            id={`${id}-tab-${i}`}
            aria-selected={i === index}
            aria-controls={`${id}-panel-${i}`}
            tabIndex={i === index ? 0 : -1}
            onClick={() => setIndex(i)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              i === index ? "border-ink bg-ink text-white" : "bg-surface text-ink hover:border-ink/40",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t, i) => (
        <div key={t.label} role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={i !== index} className="mt-6">
          {t.content}
        </div>
      ))}
    </div>
  );
}
