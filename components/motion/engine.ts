import { EASE, gsap, ScrollTrigger, SplitText } from "@/lib/gsap";

const MOTION_OK = "(prefers-reduced-motion: no-preference)";
const FINE_POINTER = "(hover: hover) and (pointer: fine)";

// Activity keeps previously visited routes in the DOM but hidden; skip them.
const isShown = (el: Element) => el.checkVisibility?.() ?? true;

/**
 * Enhances the server-rendered page under `root` through data attributes:
 * - data-reveal / data-reveal-group: fade and rise once (CSS does the motion)
 * - data-split: headings reveal line by line (SplitText)
 * - data-countup: numbers count up once
 * - data-featured-pin: featured projects pin and scrub on large screens
 * - data-magnetic: primary buttons lean toward the cursor
 * Returns a cleanup that reverts everything.
 */
export function initMotion(root: HTMLElement) {
  const reveal = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.setAttribute("data-revealed", "");
        reveal.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -8% 0px" },
  );
  root
    .querySelectorAll(
      "[data-reveal]:not([data-revealed]), [data-reveal-group]:not([data-revealed])",
    )
    .forEach((el) => isShown(el) && reveal.observe(el));

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
    root.querySelectorAll<HTMLElement>("[data-countup]").forEach((el) => {
      const end = Number(el.dataset.countup);
      if (!Number.isFinite(end) || !isShown(el)) return;
      // Already on screen: keep the final value rather than flash to zero.
      if (el.getBoundingClientRect().top < window.innerHeight) return;
      const state = { value: 0 };
      el.textContent = "0";
      restore.push(() => {
        el.textContent = String(end);
      });
      gsap.to(state, {
        value: end,
        duration: 0.6,
        ease: EASE,
        snap: { value: 1 },
        onUpdate: () => {
          el.textContent = String(state.value);
        },
        scrollTrigger: { trigger: el, start: "top 92%", once: true },
      });
    });
    // Captions decode like a terminal line when they scroll in.
    root.querySelectorAll<HTMLElement>("[data-scramble]").forEach((el) => {
      if (!isShown(el)) return;
      const text = el.textContent ?? "";
      gsap.to(el, {
        duration: 0.6,
        ease: "none",
        scrambleText: { text, chars: "01<>/_#", speed: 0.6 },
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
      });
    });

    // The hackathon log's accent line draws down as you scroll through it.
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

  mm.add(`${MOTION_OK} and (min-width: 1024px)`, () => {
    const pin = root.querySelector<HTMLElement>("[data-featured-pin]");
    if (!pin || !isShown(pin)) return;
    const panels = gsap.utils.toArray<HTMLElement>("[data-panel]", pin);
    const markers = gsap.utils.toArray<HTMLElement>("[data-panel-index]", pin);
    if (panels.length < 2) return;

    const steps = panels.length - 1;
    const setActive = (index: number) =>
      markers.forEach((m, i) => m.toggleAttribute("data-active", i === index));

    pin.setAttribute("data-pinned", "");
    setActive(0);
    gsap.set(panels.slice(1), { autoAlpha: 0, y: 48 });

    const timeline = gsap.timeline({
      defaults: { ease: "none", duration: 1 },
      scrollTrigger: {
        trigger: pin,
        start: "top top",
        end: () => `+=${steps * window.innerHeight * 0.9}`,
        pin: true,
        scrub: 0.5,
        snap: {
          snapTo: 1 / steps,
          duration: { min: 0.2, max: 0.6 },
          ease: "power1.inOut",
        },
        invalidateOnRefresh: true,
        onUpdate: (self) => setActive(Math.round(self.progress * steps)),
      },
    });
    // Hand off in sequence (old out, then new in) so text never overlaps.
    panels.slice(1).forEach((panel, i) => {
      timeline
        .to(panels[i], { autoAlpha: 0, y: -48, duration: 0.5 })
        .fromTo(
          panel,
          { autoAlpha: 0, y: 48 },
          { autoAlpha: 1, y: 0, duration: 0.5 },
        );
    });

    return () => {
      pin.removeAttribute("data-pinned");
      markers.forEach((m) => m.removeAttribute("data-active"));
    };
  });

  mm.add(`${MOTION_OK} and ${FINE_POINTER}`, () => {
    const cleanups = [...root.querySelectorAll<HTMLElement>("[data-magnetic]")]
      .filter(isShown)
      .map((el) => {
        const toX = gsap.quickTo(el, "x", { duration: 0.4, ease: EASE });
        const toY = gsap.quickTo(el, "y", { duration: 0.4, ease: EASE });
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          toX((e.clientX - (r.left + r.width / 2)) * 0.25);
          toY((e.clientY - (r.top + r.height / 2)) * 0.25);
        };
        const leave = () => {
          toX(0);
          toY(0);
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        return () => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        };
      });

    // Cards tilt toward the cursor in 3D.
    const tilts = [...root.querySelectorAll<HTMLElement>("[data-tilt]")]
      .filter(isShown)
      .map((el) => {
        gsap.set(el, { transformPerspective: 900 });
        const toX = gsap.quickTo(el, "rotationX", {
          duration: 0.5,
          ease: EASE,
        });
        const toY = gsap.quickTo(el, "rotationY", {
          duration: 0.5,
          ease: EASE,
        });
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          toY(((e.clientX - r.left) / r.width - 0.5) * 8);
          toX(-((e.clientY - r.top) / r.height - 0.5) * 8);
        };
        const leave = () => {
          toX(0);
          toY(0);
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        return () => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        };
      });

    return () => [...cleanups, ...tilts].forEach((fn) => fn());
  });

  ScrollTrigger.refresh();

  return () => {
    reveal.disconnect();
    mm.revert();
  };
}
