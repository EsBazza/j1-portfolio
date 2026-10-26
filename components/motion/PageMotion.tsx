"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { resizeSmoothScroll } from "./MotionLayer";

/**
 * Per-page enhancements: reveals, split headings, count-ups, pinning, magnetic
 * buttons and the header's active section. Rendered from app/template.tsx so
 * its first effect runs only after the page itself has hydrated (the engine
 * changes the DOM, which must not happen mid-hydration).
 */
export function PageMotion() {
  const pathname = usePathname();

  useEffect(() => {
    const main = document.getElementById("main");
    if (!main) return;
    document.documentElement.classList.add("motion-ready");
    resizeSmoothScroll();

    let cancelled = false;
    let cleanup: (() => void) | undefined;
    import("./engine").then(({ initMotion }) => {
      if (!cancelled) cleanup = initMotion(main);
    });
    const stopSpy = pathname === "/" ? spyOnSections() : clearSpy();

    return () => {
      cancelled = true;
      cleanup?.();
      stopSpy?.();
    };
  }, [pathname]);

  return null;
}

/** Marks the header link for the section in the middle of the viewport. */
function spyOnSections() {
  const links = [
    ...document.querySelectorAll<HTMLAnchorElement>("[data-nav-link]"),
  ];
  const sections = links
    .map((link) => document.getElementById(link.dataset.navLink ?? ""))
    .filter((el): el is HTMLElement => el !== null);
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        for (const link of links) {
          if (link.dataset.navLink === entry.target.id) {
            link.setAttribute("aria-current", "location");
          } else {
            link.removeAttribute("aria-current");
          }
        }
      }
    },
    { rootMargin: "-45% 0px -50% 0px" },
  );
  sections.forEach((s) => observer.observe(s));
  return () => observer.disconnect();
}

function clearSpy() {
  document
    .querySelectorAll("[data-nav-link]")
    .forEach((link) => link.removeAttribute("aria-current"));
  return undefined;
}
