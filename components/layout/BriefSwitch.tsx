"use client";

import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { jumpToTop, resizeSmoothScroll } from "@/components/motion/MotionLayer";
import { BRIEF_STORAGE_KEY } from "@/lib/theme";
import { cn } from "@/lib/utils";

type TransitionDocument = Document & {
  startViewTransition?: (update: () => void) => unknown;
};

/** The view lives on <html data-view>, set before paint by the head script. */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-view"],
  });
  return () => observer.disconnect();
}
const isBrief = () => document.documentElement.dataset.view === "brief";

/**
 * The 30-second switch: hides everything on the home page except the hero,
 * the award strip, the award rows in compact form and contact. The hiding is
 * plain CSS on `html[data-view="brief"]` (see globals.css); the browser's
 * view transition cross-fades between the two layouts, and is skipped with
 * reduced motion. Home page only, and only with JavaScript.
 */
export function BriefSwitch() {
  const pathname = usePathname();
  const brief = useSyncExternalStore(subscribe, isBrief, () => false);

  if (pathname !== "/") return null;

  const toggle = () => {
    const next = !brief;
    const apply = () => {
      if (next) document.documentElement.dataset.view = "brief";
      else delete document.documentElement.dataset.view;
      resizeSmoothScroll();
      if (next) jumpToTop();
      // Scroll-linked effects measure the page; let them re-measure.
      window.dispatchEvent(new Event("resize"));
    };
    const doc: TransitionDocument = document;
    if (doc.startViewTransition) doc.startViewTransition(apply);
    else apply();
    try {
      if (next) localStorage.setItem(BRIEF_STORAGE_KEY, "brief");
      else localStorage.removeItem(BRIEF_STORAGE_KEY);
    } catch {
      // Storage can be unavailable (private mode); the switch still applies.
    }
  };

  return (
    <button
      type="button"
      aria-pressed={brief}
      onClick={toggle}
      title={brief ? "Show the full page" : "Show the 30-second version"}
      className={cn(
        "hidden min-h-11 items-center rounded-full border px-4 font-mono text-sm transition-transform duration-200 active:scale-[0.98] motion-reduce:transition-none [.js_&]:inline-flex",
        brief
          ? "border-fg bg-fg text-bg"
          : "border-line-strong text-fg hover:border-fg",
      )}
    >
      30s
      <span className="sr-only"> version of this page</span>
    </button>
  );
}
