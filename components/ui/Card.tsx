import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: ComponentProps<"article">) {
  return (
    <article
      className={cn(
        "overflow-hidden rounded-lg border border-line bg-surface",
        className,
      )}
      {...props}
    />
  );
}

export function CardBody({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-col gap-2 p-5 sm:p-6", className)}
      {...props}
    />
  );
}
