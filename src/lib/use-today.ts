"use client";

import { useSyncExternalStore } from "react";

import { todayISO } from "@/lib/dates";

// The site is prebuilt, so pages are first rendered with the build date and
// then switch to the visitor's actual date once loaded in the browser.
const BUILD_DAY = todayISO(new Date(Number(process.env.NEXT_PUBLIC_BUILD_TIME)));

function subscribe(onChange: () => void) {
  // Re-check every minute so an open tab rolls over at midnight.
  const id = setInterval(onChange, 60_000);
  return () => clearInterval(id);
}

/** Today's date in India time as "YYYY-MM-DD". */
export function useToday() {
  return useSyncExternalStore(subscribe, () => todayISO(), () => BUILD_DAY);
}
