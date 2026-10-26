import type { ReactNode } from "react";
import { profile } from "@/content/profile";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ArrowRight } from "@/components/ui/Icons";
import { StaticFallback } from "@/components/three/StaticFallback";

export function Hero({ scene }: { scene?: ReactNode }) {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden border-b border-line"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-grid" />
      <div data-hero-backdrop className="absolute inset-0 -z-10">
        <StaticFallback />
        {scene}
      </div>
      <Container className="flex min-h-[calc(100svh-4.25rem)] flex-col justify-center gap-6 py-20 md:gap-7">
        <p className="caption text-faint">
          Build log · {profile.education.degree} · {profile.education.school}
        </p>
        <h1
          id="hero-title"
          className="max-w-[11ch] font-display text-hero font-bold text-balance"
        >
          {profile.name}
        </h1>
        <p className="font-display text-2xl font-semibold md:text-3xl">
          {profile.role}
        </p>
        <p className="max-w-[54ch] text-lg text-muted">{profile.pitch}</p>
        <div className="mt-2 flex flex-wrap gap-3">
          <span data-magnetic className="inline-flex">
            <ButtonLink href="/projects" size="lg">
              View projects <ArrowRight />
            </ButtonLink>
          </span>
          <ButtonLink href="/resume" variant="secondary" size="lg">
            Resume
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
