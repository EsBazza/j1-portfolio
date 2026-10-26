"use client";

import { useEffect } from "react";
import type Lenis from "lenis";
import "lenis/dist/lenis.css";
import { onFirstInteraction } from "./interaction";

let lenis: Lenis | null = null;

/** Lets per-page code re-measure after a route change. */
export function resizeSmoothScroll() {
  lenis?.resize();
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
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => document.removeEventListener("pointermove", onMove);
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
          cleanup = () => {
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
