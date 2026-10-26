import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type Tone = "stack" | "award";

const tones: Record<Tone, string> = {
  stack: "border border-line text-muted",
  award: "bg-accent text-on-accent",
};

export function Tag({
  tone = "stack",
  className,
  ...props
}: ComponentProps<"span"> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2.5 py-1 caption text-[0.6875rem]",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
