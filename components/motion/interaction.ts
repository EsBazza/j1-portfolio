const EVENTS = [
  "pointermove",
  "pointerdown",
  "wheel",
  "touchstart",
  "keydown",
  "scroll",
] as const;

let interacted = false;

/**
 * Runs `callback` once, on the visitor's first interaction (or right away if
 * they already interacted, e.g. after a client-side navigation). Heavy motion
 * code waits for this so it never competes with the initial page load.
 */
export function onFirstInteraction(callback: () => void) {
  if (interacted) {
    const id = setTimeout(callback, 0);
    return () => clearTimeout(id);
  }
  let done = false;
  const run = () => {
    if (done) return;
    done = interacted = true;
    cleanup();
    callback();
  };
  const cleanup = () =>
    EVENTS.forEach((e) => window.removeEventListener(e, run));
  EVENTS.forEach((e) =>
    window.addEventListener(e, run, { passive: true, once: true }),
  );
  return cleanup;
}
