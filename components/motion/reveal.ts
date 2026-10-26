// Element visibility check: Activity keeps previously visited routes in the
// DOM but hidden, so skip those.
export const isShown = (el: Element) => el.checkVisibility?.() ?? true;

/**
 * Marks [data-reveal] and [data-reveal-group] elements as revealed the first
 * time they scroll into view; CSS does the motion. Tiny and dependency-free,
 * so it runs as soon as the page hydrates.
 */
export function initReveals(root: HTMLElement) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.setAttribute("data-revealed", "");
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -8% 0px" },
  );
  root
    .querySelectorAll(
      "[data-reveal]:not([data-revealed]), [data-reveal-group]:not([data-revealed])",
    )
    .forEach((el) => isShown(el) && observer.observe(el));
  return () => observer.disconnect();
}
