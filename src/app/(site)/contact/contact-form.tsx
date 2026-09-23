"use client";

import { siteConfig } from "@/config/site";

const interests = ["School leagues", "International camps", "Coaching", "Nutrition", "Partnerships", "Something else"];

const field =
  "mt-2 w-full rounded-xl border bg-paper px-4 py-3 outline-none transition focus:border-ink focus:bg-surface";

// No backend yet: submitting opens the visitor's email app with the message
// filled in. Swap for a real form endpoint when one exists.
export function ContactForm() {
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const get = (k: string) => String(data.get(k) ?? "");
    const subject = `${get("interest")} enquiry from ${get("name")}`;
    const body = [
      get("message"),
      "",
      `Name: ${get("name")}`,
      `Organisation: ${get("organisation") || "-"}`,
      `Phone: ${get("phone") || "-"}`,
      `Email: ${get("email")}`,
    ].join("\n");
    window.location.href = `mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
      <label className="text-sm font-medium">
        Name
        <input name="name" required autoComplete="name" className={field} />
      </label>
      <label className="text-sm font-medium">
        School or organisation <span className="text-muted">(optional)</span>
        <input name="organisation" autoComplete="organization" className={field} />
      </label>
      <label className="text-sm font-medium">
        Email
        <input name="email" type="email" required autoComplete="email" className={field} />
      </label>
      <label className="text-sm font-medium">
        Phone <span className="text-muted">(optional)</span>
        <input name="phone" type="tel" autoComplete="tel" className={field} />
      </label>
      <label className="text-sm font-medium sm:col-span-2">
        I&apos;m interested in
        <select name="interest" className={field} defaultValue={interests[0]}>
          {interests.map((i) => (
            <option key={i}>{i}</option>
          ))}
        </select>
      </label>
      <label className="text-sm font-medium sm:col-span-2">
        Message
        <textarea name="message" required rows={5} className={field} />
      </label>
      <div className="sm:col-span-2">
        <button
          type="submit"
          className="inline-flex h-12 items-center rounded-full bg-ink px-8 text-sm font-semibold text-white transition-colors hover:bg-indigo"
        >
          Send enquiry
        </button>
      </div>
    </form>
  );
}
