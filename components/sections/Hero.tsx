import type { CSSProperties } from "react";
import Link from "next/link";
import { announcement } from "@/content/awards";
import { profile } from "@/content/profile";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ArrowRight } from "@/components/ui/Icons";
import { HeroStatus } from "@/components/status/HeroStatus";
import { PetBed } from "@/components/pets/PetBed";
import { liveDemos } from "@/lib/status";

/** Staggered CSS intro; runs on load without waiting for JavaScript. */
const intro = (step: number) => ({ "--intro": step }) as CSSProperties;

export function Hero() {
  const chars = [...profile.brand];
  // The pet sleeps on the D (or the last letter, if the brand changes).
  const bedAt = chars.includes("D") ? chars.indexOf("D") : chars.length - 1;

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden border-b border-line"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-grid" />
      <Container className="grid min-h-[calc(100svh-4.25rem)] content-center items-center py-20">
        <div className="flex flex-col gap-6 md:gap-7">
          <Link
            href={announcement.href}
            className="hero-intro group inline-flex min-h-11 w-fit max-w-full items-center gap-3 text-sm text-muted transition-colors hover:text-fg"
            style={intro(0)}
          >
            <span className="shrink-0 caption font-semibold text-accent">
              {announcement.label}
            </span>
            <span className="min-w-0 underline decoration-line-strong underline-offset-4">
              {announcement.text}
            </span>
            <ArrowRight className="shrink-0 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
          </Link>
          <p className="hero-intro caption text-faint" style={intro(0)}>
            Build log · {profile.education.degree} · {profile.education.school}
          </p>
          <h1
            id="hero-title"
            aria-label={`${profile.brand}, ${profile.name}`}
            className="mt-[0.1em] font-display text-[clamp(5.25rem,24vw,13rem)] leading-[0.85] font-semibold tracking-[-0.05em]"
          >
            <span className="relative inline-flex">
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
                  data-pet-switch
                  title="Switch pet"
                  className="hero-char inline-block cursor-pointer text-accent"
                  style={{ "--i": chars.length } as CSSProperties}
                >
                  .
                </span>
              </span>
              {/* An invisible copy of the title, laid out exactly like it, so the
                sleeping pet can sit on the D without the intro mask clipping it. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 flex pr-[0.12em] pb-[0.16em] text-transparent select-none"
              >
                {chars.map((ch, i) => (
                  <span
                    key={i}
                    className={
                      i === bedAt
                        ? "relative inline-block"
                        : "inline-block whitespace-pre"
                    }
                  >
                    {ch}
                    {i === bedAt ? <PetBed /> : null}
                  </span>
                ))}
              </span>
            </span>
          </h1>
          <p
            className="hero-intro max-w-[52ch] text-lg text-muted md:text-xl md:leading-relaxed"
            style={intro(1)}
          >
            {profile.intro}
          </p>
          <div className="hero-intro" style={intro(2)}>
            <HeroStatus count={liveDemos.length} />
          </div>
          <div
            className="hero-intro mt-2 flex flex-wrap gap-3"
            style={intro(3)}
          >
            <span className="inline-flex">
              <ButtonLink href="/projects" size="lg">
                View projects <ArrowRight />
              </ButtonLink>
            </span>
            <ButtonLink href="/resume" variant="secondary" size="lg">
              Resume
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
