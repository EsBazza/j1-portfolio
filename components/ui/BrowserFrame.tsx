import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Minimal browser chrome around a project screenshot. */
export function BrowserFrame({
  url,
  children,
  className,
}: {
  url?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-line bg-surface",
        className,
      )}
    >
      <div className="flex items-center gap-1.5 border-b border-line px-4 py-3">
        <span
          aria-hidden="true"
          className="size-2 rounded-full bg-line-strong"
        />
        <span
          aria-hidden="true"
          className="size-2 rounded-full bg-line-strong"
        />
        <span
          aria-hidden="true"
          className="size-2 rounded-full bg-line-strong"
        />
        {url ? (
          <span
            translate="no"
            className="ml-3 min-w-0 truncate font-mono text-[0.6875rem] text-faint"
          >
            {url}
          </span>
        ) : null}
      </div>
      <div className="bg-surface-2">{children}</div>
    </div>
  );
}
