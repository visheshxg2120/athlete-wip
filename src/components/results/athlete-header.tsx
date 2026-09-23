import { getSchool } from "@/lib/results";
import type { Athlete } from "@/types/results";

/** Initials instead of a photo: profiles never show pictures of young athletes. */
export function Avatar({ name, className = "size-16 text-xl" }: { name: string; className?: string }) {
  const initials = name.replace(".", "").split(" ").map((w) => w[0]).join("");
  return (
    <span aria-hidden className={`grid shrink-0 place-items-center rounded-full bg-ink font-display font-extrabold text-volt [font-stretch:70%] ${className}`}>
      {initials}
    </span>
  );
}

export function AthleteHeader({ athlete, sports }: { athlete: Athlete; sports: string[] }) {
  const school = getSchool(athlete.schoolId);
  return (
    <div className="flex items-center gap-4">
      <Avatar name={athlete.name} className="size-14 text-lg md:size-16 md:text-xl" />
      <div className="min-w-0">
        <h1 className="display text-4xl md:text-5xl">{athlete.name}</h1>
        <p className="mt-1.5 text-sm text-muted">
          {school.name} · {school.city} · {sports.join(", ")}
        </p>
      </div>
    </div>
  );
}
