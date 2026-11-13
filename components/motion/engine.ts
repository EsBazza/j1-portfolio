import { EASE, gsap, ScrollTrigger, SplitText } from "@/lib/gsap";
import { isShown } from "./reveal";

const MOTION_OK = "(prefers-reduced-motion: no-preference)";

/**
 * Enhances the server-rendered page under `root` through data attributes:
 * - data-split: headings reveal line by line (SplitText)
 * - data-odometer: numbers roll into place once, digit by digit
 * - data-stamps / data-stamp: award stamps press in once
 * - data-timeline / data-log-dot: the log line draws, its dots fill in
 * Returns a cleanup that reverts everything.
 */
export function initMotion(root: HTMLElement) {
  const mm = gsap.matchMedia(root);

  mm.add(MOTION_OK, () => {
    root.querySelectorAll<HTMLElement>("[data-split]").forEach((el) => {
      if (!isShown(el)) return;
      SplitText.create(el, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 105,
            duration: 0.6,
            ease: EASE,
            stagger: 0.05,
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          }),
      });
    });

    const restore: Array<() => void> = [];
    // Numbers roll into place like an odometer, one column per digit.
    root.querySelectorAll<HTMLElement>("[data-odometer]").forEach((el) => {
      const text = el.textContent ?? "";
      if (!/^\d+$/.test(text) || !isShown(el)) return;
      // Already on screen: keep the number rather than flash to zero.
      if (el.getBoundingClientRect().top < window.innerHeight) return;
      const settle = () => {
        el.textContent = text;
      };
      restore.push(settle);

      // Screen readers get the plain number; the columns are decoration.
      const label = document.createElement("span");
      label.className = "sr-only";
      label.textContent = text;
      // An invisible copy of the number gives the wheel the text's exact
      // box and baseline; the rolling columns sit on top of it.
      const wheel = document.createElement("span");
      wheel.setAttribute("aria-hidden", "true");
      wheel.style.cssText =
        "position:relative;display:inline-block;line-height:1";
      const ghost = document.createElement("span");
      ghost.style.cssText = "visibility:hidden";
      ghost.textContent = text;
      const reel = document.createElement("span");
      reel.style.cssText =
        "position:absolute;inset:0;display:flex;overflow:hidden";
      const columns = [...text].map((digit) => {
        const column = document.createElement("span");
        column.style.cssText = "display:flex;flex-direction:column";
        for (let n = 0; n <= Number(digit); n++) {
          const cell = document.createElement("span");
          cell.style.cssText = "height:1em;line-height:1";
          cell.textContent = String(n);
          column.append(cell);
        }
        reel.append(column);
        return column;
      });
      wheel.append(ghost, reel);
      el.replaceChildren(label, wheel);

      gsap.to(columns, {
        // Each column holds 0…digit, so its last cell is the digit itself.
        y: (i: number) => `-${Number(text[i])}em`,
        duration: 0.6,
        ease: EASE,
        stagger: { each: 0.05, from: "end" },
        scrollTrigger: { trigger: el, start: "top 92%", once: true },
        onComplete: settle,
      });
    });

    // Award stamps press in once, a quick scale-down as the row arrives.
    root.querySelectorAll<HTMLElement>("[data-stamps]").forEach((group) => {
      if (!isShown(group)) return;
      if (group.getBoundingClientRect().top < window.innerHeight) return;
      gsap.from(group.querySelectorAll("[data-stamp]"), {
        scale: 1.18,
        autoAlpha: 0,
        duration: 0.3,
        ease: EASE,
        stagger: 0.05,
        scrollTrigger: { trigger: group, start: "top 85%", once: true },
      });
    });

    // The build log's accent line draws down as you scroll through it.
    root
      .querySelectorAll<HTMLElement>("[data-timeline]")
      .forEach((timeline) => {
        const line = timeline.querySelector("[data-timeline-progress]");
        if (!line || !isShown(timeline)) return;
        gsap.fromTo(
          line,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: timeline,
              start: "top 70%",
              end: "bottom 60%",
              scrub: 0.4,
            },
          },
        );
        // Each commit dot fills in once as the line reaches it.
        timeline
          .querySelectorAll<HTMLElement>("[data-log-dot]")
          .forEach((dot) => {
            if (dot.getBoundingClientRect().top < window.innerHeight * 0.65)
              return;
            gsap.from(dot, {
              scale: 0.4,
              autoAlpha: 0,
              duration: 0.2,
              ease: EASE,
              scrollTrigger: { trigger: dot, start: "top 65%", once: true },
            });
          });
      });

    // Big wordmarks reveal letter by letter.
    document
      .querySelectorAll<HTMLElement>("[data-split-chars]")
      .forEach((el) => {
        if (!isShown(el)) return;
        SplitText.create(el, {
          type: "chars",
          mask: "chars",
          onSplit: (self) =>
            gsap.from(self.chars, {
              yPercent: 100,
              duration: 0.6,
              ease: EASE,
              stagger: 0.05,
              scrollTrigger: { trigger: el, start: "top 95%", once: true },
            }),
        });
      });

    // Reverting mid-way (route change, preference change) must not leave a 0.
    return () => restore.forEach((fn) => fn());
  });

  ScrollTrigger.refresh();

  return () => mm.revert();
}
