import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { BrowserFrame } from "@/components/ui/BrowserFrame";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Tag } from "@/components/ui/Tag";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import type { Theme } from "@/lib/theme";

export const metadata: Metadata = {
  title: "Styleguide",
  robots: { index: false, follow: false },
};

const colors = [
  { token: "bg", use: "Page background" },
  { token: "surface", use: "Cards, panels" },
  { token: "surface-2", use: "Screenshot wells" },
  { token: "fg", use: "Body text, headings" },
  { token: "muted", use: "Secondary text" },
  { token: "faint", use: "Captions, labels" },
  { token: "line", use: "Dividers, card borders" },
  { token: "line-strong", use: "Input and button borders" },
  { token: "accent", use: "Awards and calls to action only" },
  { token: "on-accent", use: "Text on accent" },
] as const;

const typeScale = [
  {
    name: "hero",
    className: "font-display text-hero font-bold text-balance",
    sample: "Juno Alonzo",
  },
  {
    name: "display",
    className: "font-display text-display font-bold",
    sample: "Featured projects",
  },
  {
    name: "title",
    className: "font-display text-title font-bold",
    sample: "Proctor.AI",
  },
  {
    name: "stat",
    className: "font-display text-stat font-bold text-accent tabular-nums",
    sample: "Top 3",
  },
  {
    name: "lead",
    className: "font-display text-2xl font-semibold",
    sample: "Full-Stack & AI Developer",
  },
  {
    name: "body",
    className: "text-base text-muted",
    sample: "Every student gets a different but equivalent exam.",
  },
  {
    name: "caption",
    className: "caption text-faint",
    sample: "Project 01 · Hackathon Winner · RAITE 2026",
  },
] as const;

const spacing = [1, 2, 3, 4, 6, 8, 12, 16, 24] as const;

const motion = [
  ["--ease-out", "cubic-bezier(0.22, 1, 0.36, 1)", "The one easing curve"],
  ["--duration-fast", "200ms", "Hover, press"],
  ["--duration-base", "400ms", "Reveals"],
  ["--duration-slow", "600ms", "Panels, route changes"],
  ["--stagger", "50ms", "List stagger"],
] as const;

// Dev and preview only; production builds render the 404.
export default function StyleguidePage() {
  if (process.env.VERCEL_ENV === "production") notFound();

  return (
    <main className="min-h-dvh">
      <Container className="flex flex-wrap items-end justify-between gap-6 border-b border-line py-12">
        <div className="flex flex-col gap-3">
          <p className="caption text-faint">Design system · v0.1 · Build log</p>
          <h1 className="font-display text-hero font-bold">
            Styleguide<span className="text-accent">.</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <p className="caption text-faint">Page theme</p>
          <ThemeToggle />
        </div>
      </Container>

      <div className="grid xl:grid-cols-2">
        <ThemePanel theme="dark" />
        <ThemePanel theme="light" />
      </div>
    </main>
  );
}

function ThemePanel({ theme }: { theme: Theme }) {
  const id = `${theme}-theme`;
  return (
    <div data-theme={theme} className="bg-bg text-fg">
      <Section grid aria-labelledby={id} className="md:py-20">
        <div className="flex flex-col gap-16">
          <SectionHeading id={id} eyebrow="Theme">
            {theme === "dark" ? "Dark · default" : "Light"}
          </SectionHeading>

          <Group title="Color">
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-5 xl:grid-cols-5">
              {colors.map(({ token, use }) => (
                <li key={token} className="flex flex-col gap-2">
                  <span
                    className="h-16 rounded-md border border-line"
                    style={{ background: `var(--${token})` }}
                  />
                  <span className="caption text-fg">{token}</span>
                  <span className="text-xs text-muted">{use}</span>
                </li>
              ))}
            </ul>
          </Group>

          <Group title="Type">
            <p className="text-sm text-muted">
              Display: Bricolage Grotesque · Body: Geist · Labels: JetBrains
              Mono
            </p>
            <ul className="flex flex-col gap-6">
              {typeScale.map(({ name, className, sample }) => (
                <li key={name} className="flex flex-col gap-1">
                  <span className="caption text-faint">{name}</span>
                  <span className={className}>{sample}</span>
                </li>
              ))}
            </ul>
          </Group>

          <Group title="Space · 4px base">
            <ul className="flex flex-wrap items-end gap-3">
              {spacing.map((step) => (
                <li key={step} className="flex flex-col items-center gap-2">
                  <span
                    className="bg-fg"
                    style={{
                      width: `calc(var(--spacing) * ${step})`,
                      height: `calc(var(--spacing) * ${step})`,
                    }}
                  />
                  <span className="caption text-faint">{step * 4}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-muted">
              12 columns · 24px gutter · page margin 16 / 32 / 80px · max width
              1280px · section rhythm 80px phone, 128px desktop.
            </p>
          </Group>

          <Group title="Radius">
            <ul className="flex flex-wrap gap-4">
              {(["sm", "md", "lg", "xl", "full"] as const).map((r) => (
                <li key={r} className="flex flex-col items-center gap-2">
                  <span
                    className="size-14 border border-line-strong bg-surface"
                    style={{
                      borderRadius:
                        r === "full" ? "9999px" : `var(--radius-${r})`,
                    }}
                  />
                  <span className="caption text-faint">{r}</span>
                </li>
              ))}
            </ul>
          </Group>

          <Group title="Motion">
            <dl className="grid gap-x-6 gap-y-2 font-mono text-xs sm:grid-cols-[auto_auto_1fr]">
              {motion.map(([token, value, use]) => (
                <div key={token} className="contents">
                  <dt className="text-fg">{token}</dt>
                  <dd className="text-muted">{value}</dd>
                  <dd className="text-faint">{use}</dd>
                </div>
              ))}
            </dl>
            <p className="text-sm text-muted">
              Animate transform and opacity only. Reveals rise and fade once.
              Reduced motion shows the final state.
            </p>
          </Group>

          <Group title="Buttons">
            <div className="flex flex-wrap items-center gap-3">
              <ButtonLink href="#">
                View projects <span aria-hidden="true">→</span>
              </ButtonLink>
              <ButtonLink href="#" variant="secondary">
                Resume
              </ButtonLink>
              <ButtonLink href="#" variant="ghost">
                Case study
              </ButtonLink>
              <Button size="lg">Send message</Button>
              <Button variant="secondary" disabled>
                Disabled
              </Button>
            </div>
          </Group>

          <Group title="Tags">
            <div className="flex flex-wrap gap-2">
              <Tag>Next.js</Tag>
              <Tag>Prisma</Tag>
              <Tag>Gemini</Tag>
              <Tag tone="award">Winner</Tag>
            </div>
          </Group>

          <Group title="Form field">
            <div className="flex max-w-sm flex-col gap-2">
              <label htmlFor={`${theme}-email`} className="caption text-muted">
                Your email
              </label>
              <input
                id={`${theme}-email`}
                name="email"
                type="email"
                autoComplete="email"
                spellCheck={false}
                placeholder="you@company.com"
                className="min-h-11 rounded-md border border-line-strong bg-surface px-3.5 text-fg placeholder:text-faint"
              />
            </div>
          </Group>

          <Group title="Card + browser frame">
            <Card className="max-w-xl">
              <BrowserFrame
                url="proctor-ai-sigma.vercel.app"
                className="rounded-none border-0 border-b"
              >
                <div className="flex aspect-video items-center justify-center caption text-faint">
                  [Screenshot]
                </div>
              </BrowserFrame>
              <CardBody>
                <p className="caption text-accent">
                  Project 01 · Hackathon Winner · RAITE 2026
                </p>
                <h4 className="font-display text-title font-bold">
                  Proctor.AI
                </h4>
                <p className="text-muted">
                  AI exam platform: every student gets a different but
                  equivalent exam.
                </p>
              </CardBody>
            </Card>
          </Group>
        </div>
      </Section>
    </div>
  );
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-5 border-t border-line pt-6">
      <h3 className="caption text-faint">{title}</h3>
      {children}
    </div>
  );
}
