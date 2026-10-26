import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container } from "./Container";

/** A page section on the shared vertical rhythm, with optional grid lines. */
export function Section({
  grid = false,
  className,
  children,
  ...props
}: ComponentProps<"section"> & { grid?: boolean }) {
  return (
    <section
      className={cn("py-20 md:py-32", grid && "bg-grid", className)}
      {...props}
    >
      <Container>{children}</Container>
    </section>
  );
}

/** Mono eyebrow over a display heading; pass `id` for aria-labelledby. */
export function SectionHeading({
  id,
  eyebrow,
  children,
  className,
}: {
  id?: string;
  eyebrow?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {eyebrow ? (
        <p data-scramble className="caption text-faint">
          {eyebrow}
        </p>
      ) : null}
      <h2
        id={id}
        data-split
        className="font-display text-display font-bold text-balance"
      >
        {children}
      </h2>
    </div>
  );
}
