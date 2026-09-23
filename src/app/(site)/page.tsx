import { CampsSection } from "@/components/home/camps-section";
import { CoachesSection } from "@/components/home/coaches-section";
import { GallerySection } from "@/components/home/gallery-section";
import { Hero } from "@/components/home/hero";
import { Intro } from "@/components/home/intro";
import { LeaguesSection } from "@/components/home/leagues-section";
import { CtaBand } from "@/components/layout/cta-band";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Intro />
      <LeaguesSection />
      <CampsSection />
      <CoachesSection />
      <GallerySection />
      <CtaBand />
    </>
  );
}
