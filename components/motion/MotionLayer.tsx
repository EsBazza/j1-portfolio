"use client";

import { useEffect } from "react";
import type Lenis from "lenis";
import "lenis/dist/lenis.css";
import { onFirstInteraction } from "./interaction";

let lenis: Lenis | null = null;

/** Back to the top: smooth through Lenis when it runs, native otherwise. */
export function scrollToTop() {
  if (lenis) {
    lenis.scrollTo(0);
    return;
  }
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
}

/** Jumps to the top at once, e.g. when the page layout is swapped. */
export function jumpToTop() {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
  else window.scrollTo(0, 0);
}

/** Lets per-page code re-measure after a route change. */
export function resizeSmoothScroll() {
  lenis?.resize();
}

/**
 * Stop Lenis's glide on the spot, so the next page starts where the router
 * puts it. If Lenis is still easing toward an old target when a link is
 * clicked, its next frame would drag the new page back down to that target.
 */
function freezeSmoothScroll() {
  lenis?.scrollTo(window.scrollY, { immediate: true, force: true });
}

/** A click that will make the router load another page. */
function isPageChangeClick(event: MouseEvent) {
  if (event.defaultPrevented || event.button !== 0) return false;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
    return false;
  const link = (event.target as Element | null)?.closest?.("a[href]");
  if (!(link instanceof HTMLAnchorElement)) return false;
  if (link.target && link.target !== "_self") return false;
  const url = new URL(link.href, window.location.href);
  return (
    url.origin === window.location.origin &&
    url.pathname !== window.location.pathname
  );
}

/**
 * App-wide motion, mounted once in the root layout and loaded after the page
 * is interactive: header shrink, card spotlight and Lenis smooth scrolling.
 * Per-page effects live in PageMotion. Without JavaScript none of this runs
 * and every page stays fully readable.
 */
export function MotionLayer() {
  // Header: shrink once the page scrolls.
  useEffect(() => {
    const root = document.documentElement;
    let queued = false;
    const update = () => {
      queued = false;
      root.toggleAttribute("data-scrolled", window.scrollY > 24);
    };
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cards: a soft spotlight that follows the cursor (one shared listener).
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }
    const onMove = (e: PointerEvent) => {
      const card = (e.target as Element | null)?.closest?.<HTMLElement>(
        "[data-spotlight]",
      );
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--sx", `${e.clientX - r.left}px`);
      card.style.setProperty("--sy", `${e.clientY - r.top}px`);
    };
    // Inspect overlay: show the hovered card's real size, like DevTools.
    const onOver = (e: PointerEvent) => {
      const card = (e.target as Element | null)?.closest?.<HTMLElement>(
        "[data-inspect]",
      );
      const size = card?.querySelector("[data-inspect-size]");
      if (!card || !size) return;
      const r = card.getBoundingClientRect();
      size.textContent = `${Math.round(r.width)} × ${Math.round(r.height)}`;
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
    };
  }, []);

  // Smooth scrolling with Lenis, driven by GSAP's ticker. Off for reduced motion.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cancelled = false;
    let cleanup: (() => void) | undefined;
    // Loaded on the first interaction so it never competes with page load.
    const stopWaiting = onFirstInteraction(() =>
      Promise.all([import("lenis"), import("@/lib/gsap")]).then(
        ([{ default: LenisClass }, { gsap, ScrollTrigger }]) => {
          if (cancelled) return;
          const instance = new LenisClass({
            autoRaf: false,
            anchors: { offset: -80 },
          });
          instance.on("scroll", ScrollTrigger.update);
          const tick = (time: number) => instance.raf(time * 1000);
          gsap.ticker.add(tick);
          gsap.ticker.lagSmoothing(0);
          lenis = instance;
          const onClick = (event: MouseEvent) => {
            if (isPageChangeClick(event)) freezeSmoothScroll();
          };
          // Capture phase: runs before the router starts navigating.
          document.addEventListener("click", onClick, true);
          window.addEventListener("popstate", freezeSmoothScroll);
          cleanup = () => {
            document.removeEventListener("click", onClick, true);
            window.removeEventListener("popstate", freezeSmoothScroll);
            gsap.ticker.remove(tick);
            instance.destroy();
            lenis = null;
          };
        },
      ),
    );
    return () => {
      cancelled = true;
      stopWaiting();
      cleanup?.();
    };
  }, []);

  return null;
}
