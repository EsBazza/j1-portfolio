import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ArrowRight } from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <Container className="grid min-h-[70svh] items-center gap-12 py-20 md:grid-cols-2">
      <div className="flex flex-col gap-5">
        <p className="caption text-faint">Error 404 · Route not in the build</p>
        <h1 className="font-display text-hero font-bold">Lost node.</h1>
        <p className="max-w-[42ch] text-lg text-muted">
          This page isn&apos;t part of the network. Head back to the projects or
          the home page.
        </p>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/projects" size="lg">
            View projects <ArrowRight />
          </ButtonLink>
          <ButtonLink href="/" variant="secondary" size="lg">
            Home
          </ButtonLink>
        </div>
      </div>

      {/* A small orbit: one accent node circling, out of reach of the rest. */}
      <div
        aria-hidden="true"
        className="relative mx-auto aspect-square w-full max-w-sm"
      >
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,var(--fg)_1.1px,transparent_1.5px)] [mask-image:radial-gradient(circle,#000_0%,#000_40%,transparent_70%)] bg-[length:14px_14px] opacity-30" />
        <div className="absolute inset-[12%] rounded-full border border-dashed border-line-strong" />
        <div className="absolute inset-[12%] animate-[spin_14s_linear_infinite] motion-reduce:animate-none">
          <span className="absolute -top-1.5 left-1/2 size-3 -translate-x-1/2 rounded-full bg-accent" />
        </div>
      </div>
    </Container>
  );
}
