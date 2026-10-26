"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

// three, R3F and drei live in their own chunk, outside the first-load bundle.
const PointSphere = dynamic(() => import("./PointSphere"), { ssr: false });

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Decides whether the 3D sphere runs at all, and when. It loads once the page
 * is idle; it is skipped for reduced motion or without WebGL, and it gives up
 * (back to the static sphere) if the frame rate keeps dropping. It pauses
 * whenever the hero is off screen or the tab is hidden.
 */
export function HeroScene() {
  const box = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [onScreen, setOnScreen] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!hasWebGL()) return;
    const start = () => setEnabled(true);
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(start, { timeout: 2500 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(start, 1200);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!enabled || !box.current) return;
    const hero = box.current.closest("section") ?? box.current;
    const observer = new IntersectionObserver(([entry]) =>
      setOnScreen(entry?.isIntersecting ?? true),
    );
    observer.observe(hero);
    const onVisibility = () => setTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [enabled]);

  // Fade out as the hero scrolls away, so it never sits behind body text.
  useEffect(() => {
    if (!enabled || !box.current) return;
    const el = box.current;
    const hero = el.closest("section");
    let queued = false;
    const update = () => {
      queued = false;
      const height = hero?.clientHeight ?? window.innerHeight;
      const progress = Math.min(window.scrollY / (height * 0.8), 1);
      el.style.opacity = String(1 - progress);
    };
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [enabled]);

  if (!enabled) return null;

  const setReady = (ready: boolean) =>
    box.current
      ?.closest("[data-hero-backdrop]")
      ?.toggleAttribute("data-3d-ready", ready);

  return (
    <div
      ref={box}
      aria-hidden="true"
      className="pointer-events-none absolute top-1/2 -right-[20%] aspect-square w-[min(110vw,820px)] -translate-y-1/2 sm:-right-[8%] md:w-[min(70vw,820px)] lg:-right-[12%]"
    >
      {/* fade in once ready (CSS) > dimmer on phones, behind the text */}
      <div className="scene-fade size-full">
        <div className="size-full max-md:opacity-55">
          <PointSphere
            active={onScreen && tabVisible}
            onReady={() => setReady(true)}
            onFallback={() => {
              setReady(false);
              setEnabled(false);
            }}
          />
        </div>
      </div>
    </div>
  );
}
