"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { ProjectImage } from "@/content/schema";
import { cn } from "@/lib/utils";

type Item = { slug: string; cover: ProjectImage };

const WIDTH = 320;
const GAP = 24;

/**
 * One shared screenshot that follows the cursor over rows marked with
 * `data-preview="<slug>"`. Mouse and trackpad only; touch devices never see
 * it. The position eases toward the cursor from wherever it is on screen, so
 * it can change direction at any moment, and it hides the instant the
 * pointer leaves a row. With reduced motion it appears beside the row and
 * stays put.
 */
export function RowPreview({ items }: { items: Item[] }) {
  const box = useRef<HTMLDivElement>(null);
  const [slug, setSlug] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches)
      return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let x = 0;
    let y = 0;
    let targetX = 0;
    let targetY = 0;
    let frame = 0;
    let last = 0;
    let active = false;

    const place = () => {
      el.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`;
    };
    const tick = (now: number) => {
      // Exponential approach: critically damped, no overshoot.
      const k = 1 - Math.exp(-Math.min(now - last, 50) / 80);
      last = now;
      x += (targetX - x) * k;
      y += (targetY - y) * k;
      place();
      const settled =
        Math.abs(targetX - x) < 0.5 && Math.abs(targetY - y) < 0.5;
      frame = active && !settled ? requestAnimationFrame(tick) : 0;
    };
    const hide = () => {
      if (!active) return;
      active = false;
      setVisible(false);
    };
    const move = (event: PointerEvent) => {
      const row =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>("[data-preview]")
          : null;
      if (!row?.dataset.preview) return hide();

      const height = el.offsetHeight;
      if (still) {
        const rect = row.getBoundingClientRect();
        targetX = rect.right - WIDTH - GAP;
        targetY = rect.top - height - 8;
      } else {
        const right = event.clientX + GAP;
        targetX =
          right + WIDTH > window.innerWidth
            ? event.clientX - GAP - WIDTH
            : right;
        targetY = event.clientY - height / 2;
      }
      targetY = Math.max(8, Math.min(targetY, window.innerHeight - height - 8));

      if (!active || still) {
        // Appear at the cursor rather than fly in from the last row.
        x = targetX;
        y = targetY;
        place();
      }
      if (!active) {
        active = true;
        setVisible(true);
      }
      setSlug(row.dataset.preview);
      if (!still && !frame) {
        last = performance.now();
        frame = requestAnimationFrame(tick);
      }
    };

    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", hide);
    window.addEventListener("scroll", hide, { passive: true });
    return () => {
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", hide);
      window.removeEventListener("scroll", hide);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={box}
      aria-hidden="true"
      style={{ width: WIDTH }}
      className={cn(
        "pointer-events-none fixed top-0 left-0 z-30 hidden aspect-[16/10] overflow-hidden rounded-lg border border-line-strong bg-surface-2 transition-opacity [@media(hover:hover)_and_(pointer:fine)]:block",
        visible ? "opacity-100 duration-150" : "opacity-0 duration-100",
      )}
    >
      {items.map((item) => (
        <Image
          key={item.slug}
          src={item.cover.src}
          alt=""
          width={item.cover.width}
          height={item.cover.height}
          sizes={`${WIDTH}px`}
          className={cn(
            "absolute inset-0 size-full object-cover object-top",
            item.slug === slug ? "opacity-100" : "opacity-0",
          )}
        />
      ))}
    </div>
  );
}
