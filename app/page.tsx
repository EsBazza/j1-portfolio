import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

// Placeholder until Phase 4 builds the real home page.
export default function Home() {
  return (
    <main className="min-h-dvh bg-grid">
      <Container className="flex min-h-dvh flex-col justify-center gap-6 py-24">
        <p className="caption text-faint">Build log · under construction</p>
        <h1 className="max-w-[11ch] font-display text-hero font-bold text-balance">
          Amaro Juno D. Alonzo
        </h1>
        <p className="font-display text-2xl font-semibold">
          Full-Stack &amp; AI Developer
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <ButtonLink href="https://github.com/EsBazza">
            GitHub <span aria-hidden="true">↗</span>
          </ButtonLink>
          <ThemeToggle />
        </div>
      </Container>
    </main>
  );
}
