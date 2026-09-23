import type { Metadata } from "next";

import { CtaBand } from "@/components/layout/cta-band";
import { PageHero } from "@/components/ui/page-hero";

export const metadata: Metadata = {
  title: "Sports nutrition",
  description: "Personalised nutrition plans for young athletes.",
};

const expertise = [
  { title: "Game-day fuelling", body: "Nutrition, hydration, game-day and on-the-go eating, built on a baseline diet." },
  { title: "Body composition", body: "Body fat, skeletal muscle and resting metabolism, giving each athlete's baseline energy needs." },
  { title: "Bloodwork review", body: "In-depth assessment of biochemical markers like haemoglobin and micronutrients." },
  { title: "Habits & lifestyle", body: "A review of current food, lifestyle, fitness and training schedules." },
  { title: "Special diets", body: "Plans for vegetarian athletes, lactose intolerance and other dietary needs." },
  { title: "Supplements", body: "Honest guidance on the safety and effectiveness of supplements, prescribed only where they help." },
  { title: "Season planning", body: "Different needs for off-season and in-season, and for travel and tournaments." },
  { title: "Recipes kids enjoy", body: "Delicious ideas so young athletes actually stick with the plan." },
];

const goals = ["Optimal performance", "Fast recovery and mental clarity", "Injury prevention", "A stronger immune system", "Muscle building and repair", "Proper hydration"];

const homeStaples = {
  Drinks: ["Lemon water", "Dal soup", "Buttermilk", "Homemade sweet lassi", "Nut shake", "Glucon-D"],
  Foods: ["Porridge", "Sprouts", "Cheela", "Dosa and other fermented foods", "Rava idli", "Chyawanprash"],
};

export default function NutritionPage() {
  return (
    <>
      <PageHero
        eyebrow="Sports nutrition"
        title="Fuel for the podium"
        intro="Proper training and a sensible approach to food go together. We build one-to-one plans for swimmers, footballers, cricketers, badminton players and more, around each athlete's body, sport and season."
      />

      <section className="py-20 md:py-28">
        <div className="shell">
          <p className="eyebrow text-muted">Areas of expertise</p>
          <ul className="mt-8 grid gap-px overflow-hidden rounded-2xl border bg-line sm:grid-cols-2 lg:grid-cols-4">
            {expertise.map((item, i) => (
              <li key={item.title} className="bg-paper p-6">
                <span className="eyebrow text-muted">{String(i + 1).padStart(2, "0")}</span>
                <h2 className="mt-6 text-lg font-semibold">{item.title}</h2>
                <p className="mt-2 text-sm text-muted">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-ink py-20 text-white md:py-28">
        <div className="shell grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow text-volt">Goals</p>
            <h2 className="display mt-4 text-5xl md:text-6xl">What a good plan does</h2>
            <ul className="mt-8 space-y-3">
              {goals.map((g) => (
                <li key={g} className="flex items-center gap-3 border-b border-line-inverse pb-3 text-lg">
                  <span className="size-1.5 rounded-full bg-volt" />
                  {g}
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="eyebrow text-volt">From the home kitchen</p>
            <h2 className="display mt-4 text-5xl md:text-6xl">Everyday staples</h2>
            <p className="mt-4 text-muted-inverse">
              Great nutrition doesn&apos;t need to be expensive. These are easy to find at home.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              {Object.entries(homeStaples).map(([group, items]) => (
                <div key={group} className="rounded-2xl bg-ink-2 p-6">
                  <p className="font-semibold text-volt">{group}</p>
                  <ul className="mt-4 space-y-2 text-sm text-white/85">
                    {items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
