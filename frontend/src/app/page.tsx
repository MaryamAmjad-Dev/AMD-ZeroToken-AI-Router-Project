"use client";

import LandingShell from "@/components/landing/LandingShell";
import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingHero from "@/components/landing/LandingHero";
import LandingPipeline from "@/components/landing/LandingPipeline";
import LandingSections from "@/components/landing/LandingSections";

export default function LandingPage() {
  return (
    <LandingShell>
      <LandingNavbar />
      <main>
        <LandingHero />
        <LandingPipeline />
        <LandingSections />
      </main>
    </LandingShell>
  );
}
