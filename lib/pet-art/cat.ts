import {
  ellipse,
  limb,
  limbEnd,
  pixels,
  polygon,
  rasterize,
  type Frame,
  type Shape,
  type Tones,
} from "./raster";

// Pixel, the cat: a grey tabby with pointed ears, yellow eyes, a white
// muzzle, chest and paws, and a long tail with a dark tip. Original art,
// drawn from shapes (see raster.ts).

export const CAT_COLORS = {
  o: "#1c1d24", // outline
  L: "#a7acbc", // fur, lit
  b: "#80869a", // fur
  s: "#5c6172", // fur, shadow
  d: "#464a58", // stripes, tail tip
  w: "#eef0f4", // white
  W: "#c3c8d3", // white, shadow
  y: "#e9c46a", // eye
  k: "#121318", // pupil, mouth
  h: "#ffffff", // eye shine
  n: "#e58fa3", // nose, tongue
  i: "#d98a9b", // inner ear
} as const;

const FUR: Tones = { L: "L", M: "b", S: "s" };
const FAR: Tones = { L: "b", M: "s", S: "s" };
const WHITE: Tones = { L: "w", M: "w", S: "W" };
const FAR_WHITE: Tones = { L: "W", M: "W", S: "W" };
const TIP: Tones = { L: "d", M: "d", S: "d" };
const DARK: Tones = { L: "k", M: "k", S: "k" };
const SEAM = { L: "s", b: "s", w: "W" } as const;

type Eyes = "open" | "closed" | "happy" | "wide" | "squint";
type Mouth = "closed" | "open" | "tongue";
type Pt = readonly [number, number];

type HeadOpts = {
  x: number;
  y: number;
  tilt?: number;
  eyes?: Eyes;
  mouth?: Mouth;
  /** Ears back (+) or pricked forward (-), radians. */
  ear?: number;
};
type HeadMove = Omit<HeadOpts, "x" | "y"> & { dx?: number; dy?: number };

function eyePixels(ex: number, ey: number, eyes: Eyes): Shape[] {
  const x = Math.round(ex);
  const y = Math.round(ey);
  switch (eyes) {
    case "closed":
      return [
        pixels(
          [
            [x, y + 1],
            [x + 1, y + 1],
          ],
          "k",
        ),
      ];
    case "happy":
      return [
        pixels(
          [
            [x - 1, y + 1],
            [x, y],
            [x + 1, y + 1],
          ],
          "k",
        ),
      ];
    case "squint":
      return [
        pixels(
          [
            [x, y + 1],
            [x + 1, y + 1],
          ],
          "k",
        ),
        pixels([[x + 1, y]], "y"),
      ];
    case "wide":
      return [
        pixels(
          [
            [x, y],
            [x + 1, y],
            [x, y + 1],
            [x + 1, y + 1],
          ],
          "k",
        ),
        pixels([[x, y]], "h"),
      ];
    default:
      return [
        pixels(
          [
            [x, y],
            [x, y + 1],
          ],
          "y",
        ),
        pixels(
          [
            [x + 1, y],
            [x + 1, y + 1],
          ],
          "k",
        ),
      ];
  }
}

function head(o: HeadOpts): Shape[] {
  const t = o.tilt ?? 0;
  const c = Math.cos(t);
  const s = Math.sin(t);
  const at = (dx: number, dy: number): Pt => [
    o.x + dx * c - dy * s,
    o.y + dx * s + dy * c,
  ];
  // Ear tips swing back (+) or forward (-) around the middle of their base.
  const ear = (a: Pt, b: Pt, tip: Pt): Pt[] => {
    const mx = (a[0] + b[0]) / 2;
    const my = (a[1] + b[1]) / 2;
    const e = -(o.ear ?? 0);
    const tx = tip[0] - mx;
    const ty = tip[1] - my;
    const rotated: Pt = [
      mx + tx * Math.cos(e) - ty * Math.sin(e),
      my + tx * Math.sin(e) + ty * Math.cos(e),
    ];
    return [at(...a), at(...b), at(...rotated)];
  };
  const mouth = o.mouth ?? "closed";
  const shapes: Shape[] = [
    polygon(ear([-4.2, -1.4], [-0.6, -3.6], [-3.4, -6.6]), FAR),
    ellipse(o.x, o.y, 5.2, 4.6, FUR, t),
    polygon(ear([-1.6, -3.6], [2.8, -3.4], [0.6, -7.6]), FUR),
    pixels([at(0.5, -4.6), at(0.5, -5.6)], "i"),
    pixels([at(-2.2, -3.4), at(-1.6, -2.4), at(-3.6, -2.2)], "d"),
  ];
  if (mouth !== "closed") {
    const [mx, my] = at(3.8, 3.7);
    shapes.push(ellipse(mx, my, 1.6, 1.1, DARK, t));
    if (mouth === "tongue")
      shapes.push(pixels([at(3.6, 4.2), at(4.4, 4.2)], "n"));
  }
  const [mzx, mzy] = at(3.6, 2.0 - (mouth === "closed" ? 0 : 0.5));
  shapes.push(ellipse(mzx, mzy, 2.5, 1.7, WHITE, t));
  shapes.push(pixels([at(5.6, 0.8 - (mouth === "closed" ? 0 : 0.5))], "n"));
  const [ex, ey] = at(1.2, -1.2);
  shapes.push(...eyePixels(ex, ey, o.eyes ?? "open"));
  return shapes;
}

/** A tail in two segments with a dark tip; angles as for limbs. */
function tail(
  x: number,
  y: number,
  [a1, a2]: readonly [number, number],
  l1 = 4.5,
  l2 = 4,
) {
  const mid = limbEnd(x, y, a1, l1);
  const end = limbEnd(mid.x, mid.y, a2, l2);
  return [
    limb(x, y, a1, l1, 1, FUR),
    limb(mid.x, mid.y, a2, l2, 1, FUR),
    ellipse(end.x, end.y, 1.1, 1.1, TIP),
  ];
}

function leg(
  x: number,
  y: number,
  angle: number,
  length: number,
  near: boolean,
) {
  const end = limbEnd(x, y, angle, length);
  return [
    limb(x, y, angle, length, 1, near ? FUR : FAR),
    ellipse(end.x + 0.4, end.y + 0.5, 1.3, 0.9, near ? WHITE : FAR_WHITE),
  ];
}

const stripes = (pts: Pt[]) => pixels(pts, "d");

type StandOpts = {
  /** Back far, back near, front far, front near; radians, + is forward. */
  legs?: readonly [number, number, number, number];
  legLen?: number;
  bob?: number;
  front?: number;
  bodyRot?: number;
  /** Arched back (scared). */
  arch?: boolean;
  tail?: readonly [number, number];
  head?: HeadMove;
};

function stand(o: StandOpts = {}): Shape[] {
  const [bf, bn, ff, fn] = o.legs ?? [0, 0, 0, 0];
  const len = o.legLen ?? 5.6;
  const b = o.bob ?? 0;
  const f = o.front ?? 0;
  const hip = 17 + b;
  const hx = 22.6 + (o.head?.dx ?? 0);
  const hy = 9 + b + f + (o.head?.dy ?? 0);
  const arch = o.arch ? 1.4 : 0;
  const top = 11.4 + b - arch;
  return [
    ...tail(6.8, 13.6 + b, o.tail ?? [-2.3, -3.2]),
    ...leg(8.8, hip, bf, len, false),
    ...leg(18.8, hip + f, ff, len, false),
    ellipse(
      14,
      15.4 + b + f / 2 - arch / 2,
      8,
      4.2 + arch / 2,
      FUR,
      o.bodyRot ?? 0,
    ),
    stripes([
      [10, top + 0.6],
      [10, top + 1.6],
      [12.6, top + 0.2],
      [12.6, top + 1.2],
      [15.2, top + 0.2],
      [15.2, top + 1.2],
    ]),
    ellipse(19.4, 16.6 + b + f, 2.6, 2.6, WHITE),
    ...leg(11.2, hip, bn, len, true),
    ...leg(21, hip + f, fn, len, true),
    ...head({ ...o.head, x: hx, y: hy }),
  ];
}

type SitOpts = {
  /** Tail on the floor behind; the second angle lifts the tip. */
  tail?: readonly [number, number];
  /** Near front leg; 0 hangs down, ~2.4 is a high five, ~2.8 to the mouth. */
  paw?: number;
  pawLen?: number;
  head?: HeadMove;
};

function sit(o: SitOpts = {}): Shape[] {
  const hx = 19.8 + (o.head?.dx ?? 0);
  const hy = 8.2 + (o.head?.dy ?? 0);
  return [
    ...tail(10.4, 22.8, o.tail ?? [-1.5, -1.5], 4, 4),
    ellipse(14.4, 19.6, 5.2, 4.4, FUR),
    ...leg(18.4, 17.6, 0, 5.8, false),
    ellipse(18, 15.6, 3.6, 5.8, FUR, -0.12),
    stripes([
      [11.6, 16.6],
      [11.6, 17.6],
      [13.6, 15.8],
      [13.6, 16.8],
    ]),
    ellipse(19.6, 16.4, 2.2, 3.4, WHITE),
    ...leg(20.4, 17.6, o.paw ?? 0, o.pawLen ?? 5.8, true),
    ...head({ ...o.head, x: hx, y: hy }),
  ];
}

function lie(
  o: { tail?: readonly [number, number]; head?: HeadMove } = {},
): Shape[] {
  const hx = 22.2 + (o.head?.dx ?? 0);
  const hy = 13.6 + (o.head?.dy ?? 0);
  return [
    ...tail(7.4, 21.8, o.tail ?? [-1.6, -1.4], 4, 3.5),
    ...leg(17.6, 21, 1.5, 5.2, false),
    ellipse(14.4, 19.8, 8.4, 4, FUR),
    stripes([
      [10.4, 16.4],
      [10.4, 17.4],
      [13, 16],
      [13, 17],
      [15.6, 16],
      [15.6, 17],
    ]),
    ellipse(19.8, 20.4, 2.6, 2.2, WHITE),
    ...leg(19.4, 21.6, 1.5, 5.2, true),
    ...head({ ...o.head, x: hx, y: hy }),
  ];
}

function loaf(): Shape[] {
  return [
    ellipse(15, 20, 8, 4.2, FUR),
    stripes([
      [11, 16.4],
      [11, 17.4],
      [13.6, 16],
      [13.6, 17],
      [16.2, 16],
      [16.2, 17],
    ]),
    ellipse(21.4, 23.2, 1.8, 0.9, WHITE),
    limb(8.4, 22.6, 1.45, 8.6, 1, FUR),
    ellipse(17, 23.4, 1.1, 1.1, TIP),
    ...head({ x: 21.8, y: 14, eyes: "squint" }),
  ];
}

function curl(breath: number): Shape[] {
  return [
    ellipse(14.6, 20.2 - breath * 0.3, 9.6, 4 + breath * 0.3, FUR),
    stripes([
      [10, 16.8 - breath * 0.6],
      [10, 17.8 - breath * 0.6],
      [12.6, 16.4 - breath * 0.6],
      [12.6, 17.4 - breath * 0.6],
      [15.2, 16.4 - breath * 0.6],
      [15.2, 17.4 - breath * 0.6],
    ]),
    ...head({
      x: 21.8,
      y: 18 + breath * 0.3,
      eyes: "closed",
      ear: 0.15,
      tilt: 0.1,
    }),
    limb(6, 22.4, 1.48, 15.5, 1, FUR),
    ellipse(21.4, 22.9, 1.1, 1.1, TIP),
  ];
}

// --------------------------------------------------------------- frames

const RUN = [
  { legs: [-0.75, -0.5, 0.85, 0.6], bob: -1 },
  { legs: [0.35, 0.55, -0.35, -0.55], bob: 0 },
  { legs: [-0.5, -0.75, 0.6, 0.85], bob: -1 },
  { legs: [0.55, 0.35, -0.55, -0.35], bob: 0 },
] as const;
const WALK = [
  { legs: [0.3, -0.3, -0.3, 0.3], tail: [-2.2, -3.0] },
  { legs: [0, 0, 0, 0], tail: [-2.3, -3.2] },
  { legs: [-0.3, 0.3, 0.3, -0.3], tail: [-2.2, -3.3] },
  { legs: [0, 0, 0, 0], tail: [-2.3, -3.1] },
] as const;

const run = (i: 0 | 1 | 2 | 3) =>
  stand({
    legs: RUN[i].legs,
    bob: RUN[i].bob,
    tail: [-1.9, -2.2 + (i % 2) * 0.2],
  });
const walk = (i: 0 | 1 | 2 | 3) =>
  stand({ legs: WALK[i].legs, tail: WALK[i].tail });

export const CAT_POSES = {
  stand: () => stand(),
  walk1: () => walk(0),
  walk2: () => walk(1),
  walk3: () => walk(2),
  walk4: () => walk(3),
  run1: () => run(0),
  run2: () => run(1),
  run3: () => run(2),
  run4: () => run(3),
  sit: () => sit(),
  blink: () => sit({ head: { eyes: "closed" } }),
  tilt: () => sit({ head: { tilt: 0.25 } }),
  lookUp: () => sit({ head: { tilt: -0.3 } }),
  sniff1: () => stand({ head: { dx: 1, dy: 3, tilt: 0.25 } }),
  sniff2: () => stand({ head: { dx: 1, dy: 3.6, tilt: 0.32 } }),
  lie: () => lie(),
  lieBlink: () => lie({ head: { eyes: "closed" } }),
  curl1: () => curl(0),
  curl2: () => curl(1),
  stretch: () =>
    stand({
      legs: [0, 0, 1, 1],
      front: 3,
      bodyRot: 0.22,
      tail: [-2.8, -3],
      head: { eyes: "closed" },
    }),
  yawn: () => sit({ head: { eyes: "closed", mouth: "tongue", tilt: -0.2 } }),
  jump: () =>
    stand({
      legs: [-0.9, -0.7, 0.9, 0.7],
      legLen: 4.2,
      bob: -1,
      tail: [-2.4, -2.9],
    }),
  land: () => stand({ legs: [-0.3, -0.2, 0.3, 0.2], legLen: 4.8, bob: 0.8 }),
  happy: () => sit({ head: { eyes: "happy" } }),
  squint: () => sit({ head: { eyes: "squint" } }),
  highFive: () => sit({ paw: 2.4, head: { eyes: "happy" } }),
  surprised: () =>
    stand({
      arch: true,
      bob: -1.6,
      legLen: 7.2,
      tail: [-3, -3.1],
      head: { eyes: "wide", mouth: "open", ear: 0.6 },
    }),
  swish1: () => sit({ tail: [-1.5, -1.5] }),
  swish2: () => sit({ tail: [-1.5, -2.1] }),
  swish3: () => sit({ tail: [-1.5, -2.6] }),
  groom1: () =>
    sit({ paw: 2.7, pawLen: 4.6, head: { eyes: "closed", tilt: 0.3 } }),
  groom2: () =>
    sit({
      paw: 2.9,
      pawLen: 4.4,
      head: { eyes: "closed", tilt: 0.35, mouth: "tongue" },
    }),
  knead1: () => stand({ legs: [0, 0, -0.1, 0.7], head: { eyes: "happy" } }),
  knead2: () => stand({ legs: [0, 0, 0.7, -0.1], head: { eyes: "happy" } }),
  loaf: () => loaf(),
  crouch1: () =>
    stand({
      legs: [-0.5, -0.5, 0.5, 0.5],
      legLen: 4.2,
      bob: 1.6,
      tail: [-1.65, -1.5],
      head: { dx: 1, dy: 1.5, eyes: "wide", ear: -0.3 },
    }),
  crouch2: () =>
    stand({
      legs: [-0.5, -0.5, 0.5, 0.5],
      legLen: 4.2,
      bob: 1.6,
      bodyRot: -0.06,
      tail: [-1.65, -1.2],
      head: { dx: 1, dy: 1.5, eyes: "wide", ear: -0.3 },
    }),
  pounce: () =>
    stand({
      legs: [-1.3, -1.1, 1.3, 1.1],
      legLen: 5,
      bob: -1.5,
      bodyRot: -0.1,
      tail: [-1.7, -1.75],
      head: { eyes: "wide", ear: -0.3 },
    }),
  bat1: () => sit({ paw: 1.9, head: { eyes: "wide" } }),
  bat2: () => sit({ paw: 1.1, head: { eyes: "wide" } }),
  refuse: () =>
    sit({ tail: [-1.5, -2.3], head: { eyes: "closed", tilt: -0.35 } }),
  purr: () => sit({ tail: [-1.5, -1.8], head: { eyes: "happy", ear: 0.1 } }),
} satisfies Record<string, () => Shape[]>;

export type CatFrameName = keyof typeof CAT_POSES;

export const drawCat = (name: CatFrameName): Frame =>
  rasterize(CAT_POSES[name](), SEAM);
