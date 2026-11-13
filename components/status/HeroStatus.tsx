"use client";

import { timeAgo } from "@/lib/status-client";
import { cn } from "@/lib/utils";
import { useStatusReport } from "./useStatusReport";

/** The hero's one live line: how many demos answered the last check. */
export function HeroStatus({ count }: { count: number }) {
  const { report } = useStatusReport();
  const up = report?.demos.filter((d) => d.ok).length ?? 0;

  return (
    <p
      aria-live="polite"
      className="flex items-center gap-2.5 caption text-faint"
    >
      <span className="relative inline-flex size-2 shrink-0">
        <span
          className={cn(
            "size-2 rounded-full",
            report && up > 0 ? "status-ok bg-ok" : "bg-line-strong",
          )}
        />
      </span>
      {report
        ? `${up} of ${report.demos.length} projects live · checked ${timeAgo(report.checkedAt)}`
        : `${count} projects with a live site`}
    </p>
  );
}
