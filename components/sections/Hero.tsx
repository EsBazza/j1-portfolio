import type { CSSProperties } from "react";
import { profile } from "@/content/profile";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ArrowRight } from "@/components/ui/Icons";
import { HeroScene } from "@/components/three/HeroScene";
import { StaticFallback } from "@/components/three/StaticFallback";

/** Staggered CSS intro; runs on load without waiting for JavaScript. */
const intro = (step: number) => ({ "--intro": step }) as CSSProperties;

export function Hero() {
  const chars = [...profile.brand];

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden border-b border-line"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-grid" />
      <div data-hero-backdrop className="absolute inset-0 -z-10">
        <StaticFallback />
        <HeroScene />
      </div>
      <Container className="flex min-h-[calc(100svh-4.25rem)] flex-col justify-center gap-6 py-20 md:gap-7">
        <p className="hero-intro caption text-faint" style={intro(0)}>
          Build log · {profile.education.degree} · {profile.education.school}
        </p>
        <h1
          id="hero-title"
          aria-label={`${profile.brand}, ${profile.name}`}
          className="font-display text-[clamp(5.25rem,24vw,13rem)] leading-[0.85] font-bold tracking-[-0.05em]"
        >
          <span
            aria-hidden="true"
            className="-mb-[0.16em] inline-flex overflow-hidden pr-[0.12em] pb-[0.16em]"
          >
            {chars.map((ch, i) => (
              <span
                key={i}
                className="hero-char inline-block whitespace-pre"
                style={{ "--i": i } as CSSProperties}
              >
                {ch}
              </span>
            ))}
            <span
              className="hero-char inline-block text-accent"
              style={{ "--i": chars.length } as CSSProperties}
            >
              .
            </span>
          </span>
        </h1>
        <p
          className="hero-intro font-display text-2xl font-semibold md:text-3xl"
          style={intro(1)}
        >
          {profile.role}
        </p>
        <p
          className="hero-intro max-w-[52ch] text-lg text-muted md:text-xl md:leading-relaxed"
          style={intro(2)}
        >
          {profile.intro}
        </p>
        <ul
          aria-label="Core stack"
          className="hero-intro flex flex-wrap gap-x-4 gap-y-1"
          style={intro(3)}
        >
          {profile.coreStack.map((item) => (
            <li key={item} translate="no" className="caption text-faint">
              <span aria-hidden="true" className="text-accent">
                ▸{" "}
              </span>
              {item}
            </li>
          ))}
        </ul>
        <div className="hero-intro mt-2 flex flex-wrap gap-3" style={intro(4)}>
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
