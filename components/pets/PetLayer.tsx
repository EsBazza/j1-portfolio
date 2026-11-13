"use client";

import { useEffect } from "react";
import { isPetId, nextPet, PETS, type PetId } from "@/lib/pets";
import { PET_STORAGE_KEY } from "@/lib/theme";
import type { PetEngine } from "./pet-engine";

export type PetCommand = "toggle" | "switch" | "treat";
const PET_EVENT = "pet:command";

/** Lets other parts of the site (the command palette) talk to the pet. */
export function petCommand(command: PetCommand) {
  window.dispatchEvent(new CustomEvent(PET_EVENT, { detail: command }));
}

const isTyping = (el: EventTarget | null) =>
  el instanceof HTMLElement &&
  (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));

const currentPet = (): PetId => {
  const id = document.documentElement.dataset.pet;
  return isPetId(id) ? id : "dog";
};

/**
 * The hero pet's controller. The pet sleeps on the D of "J1 Dev." (PetBed,
 * server-rendered). Hovering or clicking it wakes it; D (or the palette)
 * wakes it or sends it back to bed; the dot in "J1 Dev." switches pets. The
 * engine is only downloaded when the pet first wakes. With reduced motion the
 * pet stays asleep and clicking it opens its card.
 */
export function PetLayer() {
  useEffect(() => {
    const html = document.documentElement;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = matchMedia("(hover: hover) and (pointer: fine)");
    let engine: PetEngine | null = null;
    let loading = false;
    let pointer: { x: number; y: number } | null = null;
    const bed = () => document.querySelector<HTMLElement>("[data-pet-bed]");

    const load = () => import("./pet-engine");

    const wake = async () => {
      if (engine || loading) return;
      loading = true;
      const mod = await load();
      loading = false;
      if (engine) return;
      if (reduced.matches) {
        const el = bed();
        mod.openCard({
          pet: PETS[currentPet()],
          from: el?.getBoundingClientRect() ?? null,
          reduced: true,
        });
        return;
      }
      html.dataset.petAwake = "";
      engine = mod.mountPet({
        pet: PETS[currentPet()],
        bed,
        pointer,
        onBedded: () => {
          engine = null;
          delete html.dataset.petAwake;
        },
      });
    };

    const toggle = () => {
      if (engine) engine.goToBed();
      else void wake();
    };

    const switchPet = () => {
      const next = nextPet(currentPet());
      html.dataset.pet = next;
      try {
        localStorage.setItem(PET_STORAGE_KEY, next);
      } catch {
        // Storage can be unavailable; the switch still applies.
      }
      if (engine) engine.setPet(PETS[next]);
      else {
        const el = bed();
        el?.classList.remove("pet-poof");
        void el?.offsetWidth; // restart the animation
        el?.classList.add("pet-poof");
      }
    };

    const treat = async () => {
      if (!engine) await wake();
      window.setTimeout(() => engine?.treat(), 900);
    };

    // Hovering the sleeping pet wakes it (mouse only; touch taps it).
    let frame = 0;
    const onPointer = (e: PointerEvent) => {
      pointer = { x: e.clientX, y: e.clientY };
      if (engine || loading || reduced.matches || !finePointer.matches) return;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const r = bed()?.getBoundingClientRect();
        if (!r || !pointer || r.width === 0) return;
        const pad = 10;
        if (
          pointer.x > r.left - pad &&
          pointer.x < r.right + pad &&
          pointer.y > r.top - pad &&
          pointer.y < r.bottom + pad
        )
          void wake();
      });
    };
    const onClick = (e: MouseEvent) => {
      if (!(e.target instanceof Element)) return;
      if (e.target.closest("[data-pet-switch]")) switchPet();
      else if (e.target.closest("[data-pet-bed]")) void wake();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== "d" || e.repeat) return;
      if (e.metaKey || e.ctrlKey || e.altKey || isTyping(e.target)) return;
      if (document.querySelector("dialog[open]")) return;
      toggle();
    };
    const onCommand = (e: Event) => {
      const command = (e as CustomEvent<PetCommand>).detail;
      if (command === "toggle") toggle();
      else if (command === "switch") switchPet();
      else if (command === "treat") void treat();
    };

    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("click", onClick);
    window.addEventListener("keydown", onKey);
    window.addEventListener(PET_EVENT, onCommand);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("click", onClick);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(PET_EVENT, onCommand);
      engine?.destroy();
      delete html.dataset.petAwake;
    };
  }, []);

  return null;
}
