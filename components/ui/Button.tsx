import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

// Hover feedback fades an overlay (opacity only) so no color property animates.
const base =
  "relative isolate inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap select-none disabled:cursor-not-allowed disabled:opacity-50";

const pill =
  "rounded-full before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:opacity-0 before:transition-opacity before:duration-200 hover:before:opacity-100 " +
  "transition-transform duration-200 active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100";

const variants: Record<Variant, string> = {
  // The overlay tints toward fg, which raises label contrast in both themes.
  primary: cn(pill, "bg-accent font-semibold text-on-accent before:bg-fg/15"),
  secondary: cn(pill, "border border-line-strong text-fg before:bg-fg/8"),
  ghost:
    "min-h-11 px-1 text-fg underline decoration-line-strong underline-offset-4 hover:decoration-fg",
};

// Ghost buttons are inline links, so sizes only apply to the pill variants.
const sizes: Record<Size, string> = {
  md: "min-h-11 px-5 text-[0.9375rem]",
  lg: "min-h-12 px-6 text-base",
};

type StyleProps = { variant?: Variant; size?: Size };

export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: StyleProps & { className?: string }) {
  return cn(
    base,
    variants[variant],
    variant !== "ghost" && sizes[size],
    className,
  );
}

export function Button({
  variant,
  size,
  className,
  type = "button",
  ...props
}: ComponentProps<"button"> & StyleProps) {
  return (
    <button
      type={type}
      className={buttonStyles({ variant, size, className })}
      {...props}
    />
  );
}

export function ButtonLink({
  variant,
  size,
  className,
  ...props
}: ComponentProps<typeof Link> & StyleProps) {
  return (
    <Link className={buttonStyles({ variant, size, className })} {...props} />
  );
}
