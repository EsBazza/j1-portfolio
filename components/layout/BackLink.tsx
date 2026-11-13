"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { ArrowLeft } from "@/components/ui/Icons";

// The page the visitor was on before this one, within this visit.
let current: string | null = null;
let previous: string | null = null;

/** Records in-site navigation so back links know where the visitor came from. */
export function RouteTracker() {
  const pathname = usePathname();
  useEffect(() => {
    if (pathname === current) return;
    previous = current;
    current = pathname;
  }, [pathname]);
  return null;
}

/**
 * A back link. If the visitor arrived from one of the `from` pages, it steps
 * back in history, which returns them to the exact spot they left. Otherwise
 * (direct visit, new tab, no JavaScript) it is a plain link to `href`.
 */
export function BackLink({
  href,
  from,
  children,
}: {
  href: string;
  from: string[];
  children: ReactNode;
}) {
  const router = useRouter();
  return (
    <Link
      href={href}
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey) return;
        if (previous === null || !from.includes(previous)) return;
        event.preventDefault();
        router.back();
      }}
      className="inline-flex min-h-11 w-fit items-center gap-2 caption text-muted transition-colors hover:text-fg"
    >
      <ArrowLeft /> {children}
    </Link>
  );
}
