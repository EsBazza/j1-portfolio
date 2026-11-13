"use client";

import { ArrowUpRight } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import { useStatusReport } from "./useStatusReport";

/**
 * A project's live link with its real status. Without JavaScript it is a
 * plain link; with it, the dot turns green and the response time appears
 * once the check returns.
 */
export function LiveStatus({
  slug,
  title,
  url,
  host,
  className,
}: {
  slug: string;
  title: string;
  url: string;
  host: string;
  className?: string;
}) {
  const { report } = useStatusReport();
  const status = report?.demos.find((d) => d.slug === slug);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex min-h-11 min-w-0 items-center gap-2 font-mono text-sm text-muted hover:text-fg",
        className,
      )}
    >
      <span className="relative inline-flex size-2 shrink-0">
        <span
          className={cn(
            "size-2 rounded-full",
            status?.ok
              ? "status-ok bg-ok"
              : status
                ? "border border-faint"
                : "bg-line-strong",
          )}
        />
      </span>
      <span className="truncate underline decoration-line-strong underline-offset-4">
        {host}
      </span>
      {/* Fixed width, so the row doesn't shift when the time arrives. */}
      <span className="w-16 shrink-0 text-right whitespace-nowrap text-faint tabular-nums">
        {status ? (status.ok ? `${status.ms} ms` : "down") : ""}
      </span>
      <ArrowUpRight className="shrink-0" />
      <span className="sr-only">
        {title} live site
        {status ? (status.ok ? ", online" : ", not responding") : ""} (opens in
        a new tab)
      </span>
    </a>
  );
}
