// Dates are handled as ISO "YYYY-MM-DD" strings in India time, which compare
// correctly as plain strings.

const TIME_ZONE = "Asia/Kolkata";

export function todayISO(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/** Whole days from `from` to `to` (negative if `to` is earlier). */
export function daysBetween(from: string, to: string) {
  return Math.round((Date.parse(to) - Date.parse(from)) / 86_400_000);
}

const parts = (iso: string) => {
  const d = new Date(`${iso}T00:00:00Z`);
  const get = (o: Intl.DateTimeFormatOptions) => d.toLocaleDateString("en-GB", { timeZone: "UTC", ...o });
  return { day: get({ day: "numeric" }), month: get({ month: "long" }), short: get({ month: "short" }), year: get({ year: "numeric" }) };
};

/** "12 September 2026" */
export function formatDate(iso: string) {
  const p = parts(iso);
  return `${p.day} ${p.month} ${p.year}`;
}

/** "19–20 September 2026", "30 Sep – 2 Oct 2026" or a single date. */
export function formatRange(start: string, end = start) {
  if (start === end) return formatDate(start);
  const a = parts(start);
  const b = parts(end);
  if (a.year !== b.year) return `${formatDate(start)} – ${formatDate(end)}`;
  if (a.month !== b.month) return `${a.day} ${a.short} – ${b.day} ${b.short} ${b.year}`;
  return `${a.day}–${b.day} ${b.month} ${b.year}`;
}
