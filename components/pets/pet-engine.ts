import {
  BONE_COLOR,
  HEART_COLOR,
  PET_H,
  PET_W,
  type FrameName,
  type Pet,
  type PetId,
} from "@/lib/pets";

/**
 * The awake pet. Plain DOM + canvas on one requestAnimationFrame loop, loaded
 * only when the pet wakes. Animates transform and opacity only.
 *
 * Behaviour (a small state machine with some randomness):
 * wake (stretch, hop down) → chase the pointer → sniff → sit (blink, wag or
 * tail flick, head tilt, the odd bark) → yawn → nap. Shaking the pointer sets
 * off zoomies; a click near it makes it hop; double-click throws a bone (the
 * dog fetches it, the cat refuses); the cat sometimes ignores you to groom and
 * pounces on a cursor that stops at a distance. Clicking the pet opens its
 * card. D sends it back to bed on the D of "J1 Dev.".
 */

const RES = 6; // canvas pixels per sprite pixel
const SLEEP_AFTER = 9; // s without pointer movement
const EDGE = 8;

type Mode =
  | "wake"
  | "chase"
  | "sniff"
  | "sit"
  | "groom"
  | "crouch"
  | "pounce"
  | "yawn"
  | "nap"
  | "zoomies"
  | "fetch"
  | "return"
  | "bed"
  | "card";

export type PetEngine = {
  goToBed: () => void;
  setPet: (pet: Pet) => void;
  treat: () => void;
  destroy: () => void;
};

// ------------------------------------------------------------------- stats

type Stats = { petted: number; caught: number; treats: number };
const STATS_KEY = "pet-stats";

function readStats(id: PetId): Stats {
  try {
    const all = JSON.parse(localStorage.getItem(STATS_KEY) ?? "{}") as Record<
      string,
      Partial<Stats>
    >;
    const s = all[id] ?? {};
    return {
      petted: s.petted ?? 0,
      caught: s.caught ?? 0,
      treats: s.treats ?? 0,
    };
  } catch {
    return { petted: 0, caught: 0, treats: 0 };
  }
}

function bump(id: PetId, key: keyof Stats) {
  try {
    const all = JSON.parse(localStorage.getItem(STATS_KEY) ?? "{}") as Record<
      string,
      Stats
    >;
    const s = readStats(id);
    s[key] += 1;
    all[id] = s;
    localStorage.setItem(STATS_KEY, JSON.stringify(all));
  } catch {
    // Stats are a nicety; ignore storage errors.
  }
}

// --------------------------------------------------------------- drawing

function makeCanvas(scale: number) {
  const canvas = document.createElement("canvas");
  canvas.width = PET_W * RES;
  canvas.height = PET_H * RES;
  canvas.style.cssText = `display:block;width:${PET_W * scale}px;height:${PET_H * scale}px;image-rendering:pixelated`;
  return canvas;
}

function painter(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  let last = "";
  return (pet: Pet, frame: FrameName) => {
    const key = `${pet.id}:${frame}`;
    if (!ctx || key === last) return;
    last = key;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pet.frames[frame].forEach((row, y) => {
      for (let x = 0; x < row.length; x++) {
        const color = pet.colors[row[x] ?? "."];
        if (!color) continue;
        ctx.fillStyle = color;
        ctx.fillRect(x * RES, y * RES, RES, RES);
      }
    });
  };
}

const HEART_SVG = `<svg viewBox="0 0 7 6" shape-rendering="crispEdges" width="100%" height="100%"><path fill="${HEART_COLOR}" d="M1 0h2v1h1V0h2v1h1v2H6v1H5v1H4v1H3V5H2V4H1V3H0V1h1z"/></svg>`;
const BONE_SVG = `<svg viewBox="0 0 9 4" shape-rendering="crispEdges" width="100%" height="100%"><g fill="${BONE_COLOR}"><rect x="0" y="0" width="2" height="4"/><rect x="7" y="0" width="2" height="4"/><rect x="1" y="1" width="7" height="2"/></g></svg>`;

// ----------------------------------------------------------------- effects

function fxLayer() {
  let layer = document.querySelector<HTMLElement>("[data-pet-fx]");
  if (!layer) {
    layer = document.createElement("div");
    layer.dataset.petFx = "";
    layer.setAttribute("aria-hidden", "true");
    layer.className =
      "pointer-events-none fixed inset-0 z-[69] overflow-hidden print:hidden";
    document.body.append(layer);
  }
  return layer;
}

function particle(
  className: string,
  x: number,
  y: number,
  keyframes: Keyframe[],
  duration: number,
  html = "",
) {
  const layer = fxLayer();
  if (layer.childElementCount > 60) return;
  const el = document.createElement("span");
  el.className = `absolute top-0 left-0 ${className}`;
  el.innerHTML = html;
  el.style.transform = `translate(${x}px, ${y}px)`;
  layer.append(el);
  const anim = el.animate(keyframes, {
    duration,
    easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
    fill: "forwards",
  });
  anim.onfinish = () => el.remove();
}

function dust(x: number, y: number, count = 4, spread = 1) {
  for (let i = 0; i < count; i++) {
    const dx = (Math.random() - 0.5) * 34 * spread;
    const dy = 6 + Math.random() * 12;
    const size = 4 + Math.random() * 5;
    particle(
      "rounded-full bg-faint",
      x,
      y,
      [
        {
          transform: `translate(${x}px, ${y}px) scale(1)`,
          opacity: 0.65,
          width: `${size}px`,
          height: `${size}px`,
        },
        {
          transform: `translate(${x + dx}px, ${y - dy}px) scale(0.2)`,
          opacity: 0,
          width: `${size}px`,
          height: `${size}px`,
        },
      ],
      480,
    );
  }
}

function poof(x: number, y: number) {
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    const r = 30 + Math.random() * 14;
    particle(
      "size-2 rounded-full bg-faint",
      x,
      y,
      [
        { transform: `translate(${x}px, ${y}px) scale(1.2)`, opacity: 0.8 },
        {
          transform: `translate(${x + Math.cos(a) * r}px, ${y + Math.sin(a) * r}px) scale(0.2)`,
          opacity: 0,
        },
      ],
      520,
    );
  }
}

function heart(x: number, y: number, size = 14) {
  const dx = (Math.random() - 0.5) * 30;
  particle(
    "",
    x,
    y,
    [
      {
        transform: `translate(${x}px, ${y}px) scale(0.6)`,
        opacity: 1,
        width: `${size}px`,
        height: `${size}px`,
      },
      {
        transform: `translate(${x + dx}px, ${y - 46}px) scale(1)`,
        opacity: 0,
        width: `${size}px`,
        height: `${size}px`,
      },
    ],
    900,
    HEART_SVG,
  );
}

function pawPrint(x: number, y: number) {
  particle(
    "size-1.5 rounded-[1px] bg-line-strong",
    x,
    y,
    [
      { transform: `translate(${x}px, ${y}px)`, opacity: 0.8 },
      { transform: `translate(${x}px, ${y}px)`, opacity: 0 },
    ],
    1500,
  );
}

// -------------------------------------------------------------------- card

/**
 * The pet's card: the page dims and the pet zooms up from where it stands.
 * Move the pointer over it to pet it (hearts). Esc or clicking outside closes;
 * it zooms back down. A native <dialog> handles focus and Esc.
 */
export function openCard({
  pet,
  from,
  reduced,
  onClose,
  stay,
}: {
  pet: Pet;
  from: DOMRect | null;
  reduced: boolean;
  onClose?: () => void;
  /** Shows a Stay / Come here toggle (only for the awake pet). */
  stay?: { staying: boolean; set: (staying: boolean) => void };
}) {
  const stats = readStats(pet.id);
  const dialog = document.createElement("dialog");
  dialog.setAttribute("aria-labelledby", "pet-card-name");
  dialog.className =
    "m-auto w-[min(92vw,24rem)] overflow-visible rounded-lg border border-line bg-surface p-0 text-fg backdrop:bg-black/60";

  const scale = 12;
  const big = makeCanvas(scale);
  big.style.cursor = "grab";
  const paint = painter(big);
  paint(pet, "sit");

  const stat = (value: number, label: string) =>
    `<div class="flex flex-col gap-1 bg-surface p-3"><dd class="font-display text-xl font-semibold">${value}</dd><dt class="caption text-faint">${label}</dt></div>`;
  dialog.innerHTML = `
    <div class="flex flex-col items-center gap-5 p-6">
      <div data-stage class="relative grid place-items-center pt-4"></div>
      <div class="flex flex-col items-center gap-1 text-center">
        <p class="caption text-faint">${pet.kind} · <span data-mood>${pet.mood}</span></p>
        <h2 id="pet-card-name" class="font-display text-title font-semibold">${pet.name}</h2>
      </div>
      <dl class="grid w-full grid-cols-3 gap-px overflow-hidden rounded-md border border-line bg-line text-center">
        ${stat(stats.petted, "Pets")}
        ${stat(stats.caught, "Cursors caught")}
        ${stat(stats.treats, "Treats")}
      </dl>
      <p class="caption text-faint">Move your cursor over ${pet.name} to pet</p>
      <div class="flex flex-wrap justify-center gap-3">
        ${stay ? `<button type="button" data-stay aria-pressed="${stay.staying}" class="inline-flex min-h-11 items-center rounded-full border border-fg bg-fg px-5 text-sm text-bg">${stay.staying ? "Come here" : "Stay"}</button>` : ""}
        <button type="button" data-close class="inline-flex min-h-11 items-center rounded-full border border-line-strong px-5 text-sm hover:border-fg">Close</button>
      </div>
    </div>`;
  const stage = dialog.querySelector<HTMLElement>("[data-stage]");
  const mood = dialog.querySelector<HTMLElement>("[data-mood]");
  stage?.append(big);
  document.body.append(dialog);
  dialog.showModal();

  // Zoom from the small pet to the card.
  const to = big.getBoundingClientRect();
  const zoom = (reverse: boolean) => {
    if (reduced || !from) return null;
    const dx = from.left + from.width / 2 - (to.left + to.width / 2);
    const dy = from.top + from.height / 2 - (to.top + to.height / 2);
    const s = from.width / to.width;
    const frames: Keyframe[] = [
      { transform: `translate(${dx}px, ${dy}px) scale(${s})` },
      { transform: "none" },
    ];
    if (reverse) frames.reverse();
    dialog.animate(
      reverse
        ? [{ opacity: 1 }, { opacity: 0 }]
        : [{ opacity: 0 }, { opacity: 1 }],
      { duration: reverse ? 260 : 200, easing: "ease-out", fill: "forwards" },
    );
    return big.animate(frames, {
      duration: reverse ? 300 : 420,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      fill: "forwards",
    });
  };
  zoom(false);

  // Idle life on the card: blink and wag; petting closes the eyes.
  let pettingUntil = 0;
  let travelled = 0;
  let countedThisSession = false;
  let lastX = 0;
  let raf = 0;
  const start = performance.now();
  const loop = (now: number) => {
    const t = (now - start) / 1000;
    let frame: FrameName = "sit";
    if (now < pettingUntil) {
      frame = Math.floor(t / 0.12) % 2 ? "blink" : pet.wags ? "wag" : "blink";
    } else if (t % 3.2 < 0.14) frame = "blink";
    else if (pet.wags && Math.floor(t / 0.4) % 4 === 0)
      frame = Math.floor(t / 0.1) % 2 ? "wag" : "sit";
    paint(pet, frame);
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);

  const onPet = (e: PointerEvent) => {
    travelled += Math.abs(e.clientX - lastX);
    lastX = e.clientX;
    pettingUntil = performance.now() + 450;
    if (mood) mood.textContent = "happy";
    if (travelled > 70) {
      travelled = 0;
      heart(e.clientX - 7, e.clientY - 20, 16);
      if (!countedThisSession) {
        countedThisSession = true;
        bump(pet.id, "petted");
        const dd = dialog.querySelector("dd");
        if (dd) dd.textContent = String(stats.petted + 1);
      }
    }
  };
  big.addEventListener("pointermove", onPet);

  let closing = false;
  const close = () => {
    if (closing) return;
    closing = true;
    const anim = zoom(true);
    const finish = () => {
      cancelAnimationFrame(raf);
      dialog.close();
      dialog.remove();
      onClose?.();
    };
    if (anim) anim.onfinish = finish;
    else finish();
  };
  dialog.addEventListener("cancel", (e) => {
    e.preventDefault();
    close();
  });
  dialog.addEventListener("click", (e) => {
    const target = e.target as Element;
    if (stay && target.closest("[data-stay]")) {
      stay.staying = !stay.staying;
      stay.set(stay.staying);
      close();
      return;
    }
    if (target === dialog || target.closest("[data-close]")) close();
  });
}

// ------------------------------------------------------------------ engine

export function mountPet({
  pet: initialPet,
  bed,
  pointer,
  onBedded,
}: {
  pet: Pet;
  bed: () => HTMLElement | null;
  pointer: { x: number; y: number } | null;
  onBedded: () => void;
}): PetEngine {
  let pet = initialPet;
  const bedRect = () => {
    const el = bed();
    const r = el?.getBoundingClientRect();
    return r && r.width > 0 ? r : null;
  };

  // Same size as the pet on the D, or a default off the home page.
  const startBed = bedRect();
  const scale = Math.max(2, Math.min(5, (startBed?.width ?? 64) / PET_W));
  const W = PET_W * scale;
  const H = PET_H * scale;

  const root = document.createElement("div");
  root.dataset.petSprite = "";
  root.setAttribute("aria-hidden", "true");
  root.className =
    "pointer-events-none fixed top-0 left-0 z-[70] select-none print:hidden";
  const body = document.createElement("div");
  body.style.transformOrigin = "50% 100%";
  const canvas = makeCanvas(scale);
  canvas.style.pointerEvents = "auto";
  canvas.style.cursor = "pointer";
  const paint = painter(canvas);
  body.append(canvas);
  const bubble = document.createElement("span");
  bubble.className =
    "absolute bottom-full left-1/2 mb-1 -translate-x-1/2 rounded-sm border border-line-strong bg-surface px-1.5 py-0.5 font-mono text-xs whitespace-nowrap text-fg opacity-0 transition-opacity duration-200";
  root.append(body, bubble);
  document.body.append(root);

  let bubbleTimer = 0;
  const say = (text: string, ms = 1100) => {
    bubble.textContent = text;
    bubble.style.opacity = "1";
    window.clearTimeout(bubbleTimer);
    if (ms > 0)
      bubbleTimer = window.setTimeout(() => (bubble.style.opacity = "0"), ms);
  };
  const quiet = () => {
    window.clearTimeout(bubbleTimer);
    bubble.style.opacity = "0";
  };
  const pick = <T>(list: T[]) => list[Math.floor(Math.random() * list.length)];

  const clampX = (v: number) =>
    Math.min(Math.max(v, EDGE), window.innerWidth - W - EDGE);
  const clampY = (v: number) =>
    Math.min(Math.max(v, EDGE + 64), window.innerHeight - H - EDGE);

  // ---- state
  let x = startBed ? startBed.left : -W;
  let y = startBed ? startBed.bottom - H : window.innerHeight - H - 24;
  let vx = 0;
  let vy = 0;
  let facing = 1;
  let mode: Mode = startBed ? "wake" : "chase";
  let modeTime = 0;
  let modeLength = 0;
  let px = pointer?.x ?? window.innerWidth / 2;
  let py = pointer?.y ?? window.innerHeight * 0.7;
  let lastMove = performance.now();
  let tiltDone = false;
  let jump: { start: number; dur: number; h: number } | null = null;
  let sx = 1;
  let sy = 1;
  let runClock = 0;
  let runFrame: FrameName = "runA";
  let travelled = 0;
  let pawSide = 1;
  let chaseFrom = 0;
  let nextBark = 12 + Math.random() * 12;
  let nextBlink = 2 + Math.random() * 3;
  let blinkUntil = 0;
  let nextFlick = 3 + Math.random() * 3;
  let stillSince = performance.now();
  let lastPounce = 0;
  let bone: { el: HTMLElement; x: number; y: number } | null = null;
  let zoomTarget = { x: 0, y: 0 };
  let zoomiesLeft = 0;
  // Stay (from the card): it keeps its spot until called with "Come here".
  let staying = false;
  // While staying it is pinned to the page, not the screen: it scrolls away
  // with the content it sits on.
  let anchor = { x: 0, y: 0 };
  const reversals: number[] = [];
  let lastDir = 0;

  const setMode = (next: Mode, length = 0) => {
    mode = next;
    modeTime = 0;
    modeLength = length;
  };
  const hop = (h = 16, dur = 0.42) => {
    jump = { start: performance.now(), dur, h };
  };
  const land = () => {
    sx = 1.18;
    sy = 0.82;
    dust(x + W / 2, y + H - 4, 4);
  };

  if (mode === "wake") say(pet.id === "cat" ? "*stretch*" : "*yawn*", 900);
  else say(pick(pet.sounds) ?? "", 1200);

  // ---- input
  const onMove = (e: PointerEvent) => {
    const dx = e.clientX - px;
    px = e.clientX;
    py = e.clientY;
    const now = performance.now();
    lastMove = now;
    stillSince = now;
    tiltDone = false;
    // Shake detection: quick left-right reversals set off zoomies.
    if (Math.abs(dx) > 14) {
      const dir = Math.sign(dx);
      if (lastDir && dir !== lastDir) {
        reversals.push(now);
        while (reversals.length && now - (reversals[0] ?? now) > 900)
          reversals.shift();
        if (
          reversals.length >= 5 &&
          !staying &&
          !["zoomies", "card", "bed", "wake"].includes(mode)
        ) {
          reversals.length = 0;
          startZoomies();
        }
      }
      lastDir = dir;
    }
  };
  const onDown = (e: PointerEvent) => {
    if (e.target === canvas) return;
    onMove(e);
    const near = Math.hypot(e.clientX - (x + W / 2), e.clientY - (y + H / 2));
    if (near < 150 && (mode === "sit" || mode === "sniff")) {
      hop();
      say(pick(pet.sounds) ?? "", 800);
    }
  };
  const onDouble = (e: MouseEvent) => {
    if (staying || ["card", "bed", "wake"].includes(mode)) return;
    if (
      e.target instanceof Element &&
      e.target.closest("a,button,input,textarea")
    )
      return;
    if (!pet.fetches) {
      say("no.", 900);
      setMode("groom", 1.6);
      return;
    }
    bone?.el.remove();
    const el = document.createElement("span");
    el.className = "absolute top-0 left-0 h-3 w-7";
    el.innerHTML = BONE_SVG;
    fxLayer().append(el);
    const bx = Math.min(Math.max(e.clientX - 14, EDGE), window.innerWidth - 40);
    const by = Math.min(Math.max(e.clientY - 6, 80), window.innerHeight - 30);
    el.animate(
      [
        { transform: `translate(${x + W / 2}px, ${y}px) rotate(0deg)` },
        { transform: `translate(${bx}px, ${by}px) rotate(540deg)` },
      ],
      {
        duration: 450,
        easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
        fill: "forwards",
      },
    );
    bone = { el, x: bx, y: by };
    say("!", 600);
    setMode("fetch");
  };
  const onClickPet = () => {
    if (mode === "bed") return;
    const prev = mode === "nap" ? "sit" : mode;
    setMode("card");
    quiet();
    root.style.opacity = "0";
    openCard({
      pet,
      from: canvas.getBoundingClientRect(),
      reduced: false,
      stay: {
        staying,
        set: (next) => {
          staying = next;
          if (next) anchor = { x: x + window.scrollX, y: y + window.scrollY };
          window.setTimeout(
            () => say(next ? "ok, staying" : (pick(pet.sounds) ?? ""), 1100),
            350,
          );
        },
      },
      onClose: () => {
        root.style.opacity = "1";
        lastMove = performance.now();
        setMode(prev === "card" ? "sit" : "sit");
      },
    });
  };
  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("pointerdown", onDown, { passive: true });
  window.addEventListener("dblclick", onDouble);
  canvas.addEventListener("click", onClickPet);

  function startZoomies() {
    zoomiesLeft = 5;
    say("!!", 900);
    setMode("zoomies");
    zoomTarget = randomSpot();
  }
  function randomSpot() {
    return {
      x: clampX(Math.random() * window.innerWidth),
      y: clampY(Math.random() * window.innerHeight),
    };
  }

  // Where the pet wants to be in the current mode.
  const target = (): { tx: number; ty: number; free?: boolean } => {
    if (mode === "bed") {
      const r = bedRect();
      return r
        ? { tx: r.left, ty: r.bottom - H, free: true }
        : { tx: -W - 60, ty: y, free: true };
    }
    if (mode === "zoomies") return { tx: zoomTarget.x, ty: zoomTarget.y };
    if (mode === "fetch" && bone)
      return { tx: clampX(bone.x - W / 2 + 14), ty: clampY(bone.y - H + 10) };
    if (mode === "pounce")
      return { tx: clampX(px - W / 2), ty: clampY(py - H + 10) };
    const side = x + W / 2 < px ? -1 : 1;
    return {
      tx: clampX(px - W / 2 + side * (W * 0.5 + 16)),
      ty: clampY(py - H + 18),
    };
  };

  // ---- loop
  let raf = 0;
  let last = performance.now();
  const tick = (now: number) => {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    modeTime += dt;
    if (mode === "card") {
      raf = requestAnimationFrame(tick);
      return;
    }

    const { tx, ty, free } = target();
    const dx = tx - x;
    const dy = ty - y;
    const dist = Math.hypot(dx, dy);
    const idle = (now - lastMove) / 1000;
    const pointerDist = Math.hypot(px - (x + W / 2), py - (y + H / 2));
    let frame: FrameName = "sit";
    let tilt = 0;
    let wiggle = 0;

    const moving = [
      "chase",
      "bed",
      "zoomies",
      "fetch",
      "return",
      "pounce",
    ].includes(mode);
    if (moving) {
      const boost =
        mode === "zoomies"
          ? 1.7
          : mode === "bed" || mode === "pounce"
            ? 1.4
            : 1;
      const speed = Math.min(pet.speed * boost, dist * 3.4);
      const k = Math.min(1, dt * (mode === "pounce" ? 12 : 7));
      const before = Math.hypot(vx, vy);
      vx += ((dist ? dx / dist : 0) * speed - vx) * k;
      vy += ((dist ? dy / dist : 0) * speed - vy) * k;
      const pace = Math.hypot(vx, vy);
      // Stretch as it takes off, kick up dust.
      if (before < 120 && pace >= 120) {
        sx = 1.12;
        sy = 0.92;
        dust(x + W / 2 - facing * W * 0.3, y + H - 4, 3);
      }
      x += vx * dt;
      y += vy * dt;
      if (!free) {
        x = Math.min(Math.max(x, -W * 2), window.innerWidth + W);
      }
      if (Math.abs(vx) > 20) facing = vx > 0 ? 1 : -1;

      runClock += dt;
      if (runClock > Math.max(0.065, 0.16 - pace / 3200)) {
        runClock = 0;
        runFrame = runFrame === "runA" ? "runB" : "runA";
      }
      frame = pace > 25 ? runFrame : "stand";
      if (mode === "pounce") frame = "runB";

      // Paw prints every so often.
      travelled += pace * dt;
      if (pace > 140 && travelled > 34) {
        travelled = 0;
        pawSide *= -1;
        pawPrint(x + W / 2 - facing * W * 0.2, y + H - 5 + pawSide * 3);
      }

      const arrived = dist < 6 && pace < 40;
      if (mode === "chase") {
        if (arrived) {
          vx = vy = 0;
          if (chaseFrom > 260) bump(pet.id, "caught");
          chaseFrom = 0;
          setMode("sniff", 0.8);
        }
      } else if (mode === "bed") {
        if (dist < 4 || (!bedRect() && x < -W - 40)) {
          finish();
          return;
        }
      } else if (mode === "zoomies") {
        if (dist < 30) {
          zoomiesLeft -= 1;
          if (zoomiesLeft <= 0) {
            setMode("chase");
            say("*pant*", 900);
          } else {
            zoomTarget = randomSpot();
            dust(x + W / 2, y + H - 4, 3);
          }
        }
      } else if (mode === "fetch") {
        if (arrived && bone) {
          bone.el.remove();
          bone = null;
          say("got it!", 700);
          hop(10, 0.3);
          setMode("return");
        }
      } else if (mode === "return") {
        frame = pace > 25 ? runFrame : "stand";
        if (arrived) {
          vx = vy = 0;
          bump(pet.id, "caught");
          say(pick(pet.sounds) ?? "", 900);
          hop(12, 0.35);
          setMode("sit");
        }
      } else if (mode === "pounce") {
        if (arrived || modeTime > 0.6) {
          vx = vy = 0;
          land();
          bump(pet.id, "caught");
          say("got it!", 800);
          lastPounce = now;
          setMode("sit");
        }
      }
    } else {
      // Resting: face the pointer.
      facing = px >= x + W / 2 ? 1 : -1;
      // A wide comfort zone, so small mouse moves while reading don't set it off.
      const wantsToFollow = !staying && dist > 140;
      if (wantsToFollow && ["sit", "sniff", "nap", "yawn"].includes(mode)) {
        if (mode === "nap" || mode === "yawn") {
          setMode("sit", 0);
          say("!", 600);
          hop(8, 0.25);
          modeTime = -0.4; // wait a beat before running
        } else if (mode === "sit" && modeTime > 0) {
          if (Math.random() < pet.aloof) {
            setMode("groom", 1.4 + Math.random() * 1.6);
          } else {
            chaseFrom = dist;
            setMode("chase");
          }
        } else if (mode === "sniff") {
          chaseFrom = dist;
          setMode("chase");
        }
      }
    }

    switch (mode) {
      case "wake": {
        frame = modeTime < 0.7 ? "bow" : "stand";
        if (modeTime < 0.7) {
          sx += (1.08 - sx) * 0.2;
        }
        if (modeTime > 0.85) {
          hop(18, 0.4);
          chaseFrom = 0;
          setMode("chase");
        }
        break;
      }
      case "sniff":
        frame = "stand";
        tilt = Math.floor(modeTime / 0.14) % 2 ? 3 : 0;
        if (modeTime > modeLength) setMode("sit");
        break;
      case "sit": {
        frame = "sit";
        // Blink now and then.
        nextBlink -= dt;
        if (nextBlink <= 0) {
          blinkUntil = now + 140;
          nextBlink = 2.2 + Math.random() * 3.5;
        }
        // Tail: the dog wags when you're close; the cat flicks now and then.
        if (pet.wags && pointerDist < 170) {
          frame = Math.floor(modeTime / 0.11) % 2 ? "wag" : "sit";
        } else if (!pet.wags) {
          nextFlick -= dt;
          if (nextFlick <= 0 && nextFlick > -0.8)
            frame = Math.floor(-nextFlick / 0.25) % 2 ? "sit" : "wag";
          else if (nextFlick <= -0.8) nextFlick = 3 + Math.random() * 4;
        }
        if (now < blinkUntil) frame = "blink";
        // Head tilt when you hold still nearby.
        const still = (now - stillSince) / 1000;
        if (!tiltDone && still > 1.2 && pointerDist < 200) {
          tiltDone = true;
          modeLength = modeTime + 0.9; // tilt window
        }
        if (modeTime < modeLength && tiltDone) tilt = -9;
        // The cat pounces on a cursor that stops at a distance.
        if (
          pet.pounces &&
          !staying &&
          still > 1.1 &&
          pointerDist > 130 &&
          pointerDist < 420 &&
          now - lastPounce > 6000
        ) {
          setMode("crouch", 0.75);
          break;
        }
        // The odd bark or meow.
        nextBark -= dt;
        if (nextBark <= 0) {
          say(pick(pet.sounds) ?? "", 900);
          nextBark = 12 + Math.random() * 14;
        }
        if (idle > SLEEP_AFTER) setMode("yawn", 1.1);
        break;
      }
      case "groom":
        frame = Math.floor(modeTime / 0.3) % 2 ? "blink" : "sit";
        tilt = Math.floor(modeTime / 0.3) % 2 ? -6 : 0;
        if (modeTime > modeLength) {
          setMode("sit");
          modeTime = 0.01;
        }
        break;
      case "crouch":
        frame = "crouch";
        facing = px >= x + W / 2 ? 1 : -1;
        wiggle = Math.sin(modeTime * 40) * 1.5; // butt wiggle
        if (modeTime > modeLength) {
          hop(Math.min(40, 14 + pointerDist / 10), 0.45);
          setMode("pounce");
        }
        break;
      case "yawn":
        frame = modeTime < 0.8 ? "bow" : "blink";
        if (modeTime < 0.05)
          say(pet.id === "cat" ? "*stretch*" : "*yawn*", 900);
        if (modeTime > modeLength) setMode("nap");
        break;
      case "nap": {
        frame = "curl";
        sy = 1 - 0.035 * (0.5 + 0.5 * Math.sin(modeTime * 2.2));
        const zs = "z".repeat((Math.floor(modeTime / 0.8) % 3) + 1);
        if (bubble.textContent !== zs) say(zs, 0);
        break;
      }
    }
    if (mode !== "nap" && bubble.textContent?.startsWith("z")) quiet();

    // Jump arc, landing squash.
    let lift = 0;
    if (jump) {
      const p = (now - jump.start) / 1000 / jump.dur;
      if (p >= 1) {
        jump = null;
        land();
      } else lift = -Math.sin(Math.PI * p) * jump.h;
    }
    // Squash and stretch settle back to 1.
    if (mode !== "nap") sy += (1 - sy) * Math.min(1, dt * 12);
    sx += (1 - sx) * Math.min(1, dt * 12);

    if (staying) {
      x = anchor.x - window.scrollX;
      y = anchor.y - window.scrollY;
    }
    paint(pet, frame);
    root.style.transform = `translate3d(${(x + wiggle).toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    body.style.transform = `translateY(${lift.toFixed(1)}px) rotate(${(tilt * facing).toFixed(1)}deg) scale(${(facing * sx).toFixed(3)}, ${sy.toFixed(3)})`;
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);

  function destroy() {
    cancelAnimationFrame(raf);
    window.clearTimeout(bubbleTimer);
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerdown", onDown);
    window.removeEventListener("dblclick", onDouble);
    bone?.el.remove();
    root.remove();
  }
  function finish() {
    destroy();
    onBedded();
  }

  return {
    goToBed: () => {
      staying = false;
      if (mode === "card" || mode === "bed") return;
      bone?.el.remove();
      bone = null;
      say(bedRect() ? "nap time" : "bye!", 900);
      setMode("bed");
    },
    setPet: (next) => {
      poof(x + W / 2, y + H / 2);
      pet = next;
      sx = 0.6;
      sy = 1.3;
      say(next.name, 1000);
    },
    treat: () => {
      if (mode === "card") return;
      bump(pet.id, "treats");
      for (let i = 0; i < 4; i++)
        window.setTimeout(() => heart(x + W / 2 - 7, y + 4), i * 120);
      say("yum!", 900);
      if (mode === "nap" || mode === "yawn") setMode("sit");
      hop(20, 0.45);
    },
    destroy,
  };
}
