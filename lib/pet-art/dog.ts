import {
  ellipse,
  limb,
  limbEnd,
  pixels,
  rasterize,
  type Frame,
  type Shape,
  type Tones,
} from "./raster";

// Byte, the dog: a tan pup with a floppy dark ear, white snout, chest and
// paws, and a red collar. Original art, drawn from shapes (see raster.ts).

export const DOG_COLORS = {
  o: "#2a1c14", // outline
  L: "#f0c084", // fur, lit
  b: "#d79a5b", // fur
  s: "#a96b3a", // fur, shadow
  e: "#8a5530", // ear
  E: "#5e3920", // ear, shadow
  w: "#f7efdf", // white
  W: "#d8c7a6", // white, shadow
  k: "#120c09", // eye, nose
  h: "#ffffff", // eye shine
  p: "#e8798c", // tongue
  c: "#c2453a", // collar
  g: "#f2c14e", // tag
  B: "#efdcae", // bone
  D: "#c9a86a", // bone, shadow
} as const;

const FUR: Tones = { L: "L", M: "b", S: "s" };
const FAR: Tones = { L: "b", M: "s", S: "s" };
const WHITE: Tones = { L: "w", M: "w", S: "W" };
const FAR_WHITE: Tones = { L: "W", M: "W", S: "W" };
const EAR: Tones = { L: "e", M: "e", S: "E" };
const BONE: Tones = { L: "B", M: "B", S: "D" };
const SEAM = { L: "s", b: "s", w: "W", e: "E" } as const;

type Eyes = "open" | "closed" | "happy" | "wide" | "squint";
type Mouth = "closed" | "open" | "tongue" | "pant";

type HeadOpts = {
  x: number;
  y: number;
  tilt?: number;
  eyes?: Eyes;
  mouth?: Mouth;
  /** Extra ear swing, radians. */
  ear?: number;
  bone?: boolean;
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
            [x, y],
            [x + 1, y + 1],
            [x, y + 1],
          ],
          "k",
        ),
      ];
    case "wide":
      return [
        pixels(
          [
            [x, y - 1],
            [x + 1, y - 1],
            [x, y],
            [x + 1, y],
            [x, y + 1],
            [x + 1, y + 1],
          ],
          "k",
        ),
        pixels([[x, y - 1]], "h"),
      ];
    default:
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
  }
}

function head(o: HeadOpts): Shape[] {
  const t = o.tilt ?? 0;
  const c = Math.cos(t);
  const s = Math.sin(t);
  const at = (dx: number, dy: number) =>
    [o.x + dx * c - dy * s, o.y + dx * s + dy * c] as const;
  const mouth = o.mouth ?? "closed";
  const open = mouth !== "closed";
  const lift = open ? -0.6 : 0;
  const shapes: Shape[] = [ellipse(o.x, o.y, 6.2, 5.6, FUR, t)];

  if (open) {
    const [jx, jy] = at(4.4, 4.6);
    shapes.push(ellipse(jx, jy, 2.5, 1.1, WHITE, t));
    const [mx, my] = at(4.8, 3.6);
    shapes.push(ellipse(mx, my, 2.6, 0.8, { L: "k", M: "k", S: "k" }, t));
  }
  const [sx, sy] = at(5, 2.4 + lift);
  shapes.push(ellipse(sx, sy, 3.3, 2.3, WHITE, t));
  if (mouth === "tongue" || mouth === "pant") {
    const rows = mouth === "pant" ? 3 : 2;
    const tongue: (readonly [number, number])[] = [];
    for (let r = 0; r < rows; r++)
      tongue.push(at(3.8, 4.6 + r), at(4.8, 4.6 + r));
    shapes.push(pixels(tongue, "p"));
  }
  shapes.push(
    pixels(
      [
        at(6.6, 0.4 + lift),
        at(7.6, 0.4 + lift),
        at(6.6, 1.4 + lift),
        at(7.6, 1.4 + lift),
      ],
      "k",
    ),
  );
  if (o.bone) {
    const [bx, by] = at(4.2, 4.2);
    shapes.push(
      ellipse(bx, by, 4, 0.9, BONE),
      ellipse(bx - 4, by - 0.7, 1, 1, BONE),
      ellipse(bx - 4, by + 0.7, 1, 1, BONE),
      ellipse(bx + 4, by - 0.7, 1, 1, BONE),
      ellipse(bx + 4, by + 0.7, 1, 1, BONE),
    );
  }
  const [ex, ey] = at(-4, 1);
  shapes.push(ellipse(ex, ey, 2.1, 4.4, EAR, 0.25 + t + (o.ear ?? 0)));
  const [ix, iy] = at(0.6, -1.6);
  shapes.push(...eyePixels(ix, iy, o.eyes ?? "open"));
  return shapes;
}

function collar(hx: number, hy: number): Shape[] {
  const band: [number, number][] = [];
  for (let x = Math.round(hx - 4.4); x <= Math.round(hx + 1.6); x++)
    band.push([x, hy + 4.4]);
  for (let x = Math.round(hx - 3.4); x <= Math.round(hx + 1.6); x++)
    band.push([x, hy + 5.4]);
  return [pixels(band, "c"), pixels([[hx - 0.4, hy + 6.4]], "g")];
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
    limb(x, y, angle, length, 1.2, near ? FUR : FAR),
    ellipse(end.x + 0.5, end.y + 0.6, 1.6, 1, near ? WHITE : FAR_WHITE),
  ];
}

type StandOpts = {
  /** Back far, back near, front far, front near; radians, + is forward. */
  legs?: readonly [number, number, number, number];
  legLen?: number;
  /** Moves the whole body down (+) or up (-). */
  bob?: number;
  /** Drops the front end (a play bow). */
  front?: number;
  bodyRot?: number;
  tail?: number;
  head?: HeadMove;
};

function stand(o: StandOpts = {}): Shape[] {
  const [bf, bn, ff, fn] = o.legs ?? [0, 0, 0, 0];
  const len = o.legLen ?? 5.8;
  const b = o.bob ?? 0;
  const f = o.front ?? 0;
  const hip = 16.5 + b;
  const hx = 22.4 + (o.head?.dx ?? 0);
  const hy = 7.6 + b + f + (o.head?.dy ?? 0);
  return [
    limb(8.6, 12.6 + b, o.tail ?? -2.55, 5, 1.2, FUR),
    ...leg(9.2, hip, bf, len, false),
    ...leg(19.7, hip + f, ff, len, false),
    ellipse(14, 15.2 + b + f / 2, 8.2, 5, FUR, o.bodyRot ?? 0),
    ellipse(19.5, 16.8 + b + f, 3.2, 3.2, WHITE),
    ...leg(11.7, hip, bn, len, true),
    ...leg(22.2, hip + f, fn, len, true),
    ...collar(hx, hy),
    ...head({ ...o.head, x: hx, y: hy }),
  ];
}

type SitOpts = {
  tail?: number;
  /** Near front leg; 0 hangs down, ~1.4 offers a paw, ~2.4 is a high five. */
  paw?: number;
  head?: HeadMove;
};

function sit(o: SitOpts = {}): Shape[] {
  const hx = 20.4 + (o.head?.dx ?? 0);
  const hy = 6.8 + (o.head?.dy ?? 0);
  return [
    limb(10.8, 21.6, o.tail ?? -1.75, 5.2, 1.15, FUR),
    ellipse(13.8, 19, 6.2, 5.4, FUR),
    ...leg(19, 17.5, 0, 5.8, false),
    ellipse(18, 16.8, 4.4, 6, FUR),
    ellipse(19.8, 17.6, 2.8, 3.6, WHITE),
    ellipse(12.8, 23.6, 3.6, 1.4, WHITE),
    ...leg(21.6, 17.5, o.paw ?? 0, 5.8, true),
    ...collar(hx, hy),
    ...head({ ...o.head, x: hx, y: hy }),
  ];
}

function lie(o: { tail?: number; head?: HeadMove } = {}): Shape[] {
  const hx = 23 + (o.head?.dx ?? 0);
  const hy = 12.6 + (o.head?.dy ?? 0);
  return [
    limb(7, 21.2, o.tail ?? -1.65, 5.5, 1.15, FUR),
    ...leg(17.5, 20.6, 1.5, 6.2, false),
    ellipse(14, 19.6, 8.6, 4.4, FUR),
    ellipse(20, 20, 3, 2.6, WHITE),
    ellipse(11, 22.2, 3.2, 1.3, WHITE),
    ...leg(19.5, 21.2, 1.5, 6.2, true),
    ...collar(hx, hy),
    ...head({ ...o.head, x: hx, y: hy }),
  ];
}

function curl(breath: number): Shape[] {
  return [
    ellipse(14, 19.4 - breath * 0.3, 10.5, 4.6 + breath * 0.3, FUR),
    ellipse(9, 21.6, 5.5, 1.9, WHITE),
    ellipse(23.6, 18.6, 4.4, 1.6, WHITE),
    ...head({ x: 21.6, y: 15.4 + breath * 0.3, eyes: "closed", ear: 0.25 }),
  ];
}

function belly(wiggle: number): Shape[] {
  const up = Math.PI;
  return [
    limb(6.5, 20.5, -1.9, 4.5, 1.15, FUR),
    ...leg(8.5, 17.5, up + 0.35 + wiggle, 3.6, false),
    ...leg(17.5, 17.5, up - 0.35 - wiggle, 3.6, false),
    ellipse(14, 20, 9, 4, FUR),
    ellipse(14.5, 18.2, 6, 2, WHITE),
    ...leg(11, 17, up + 0.2 - wiggle, 3.6, true),
    ...leg(20, 17, up - 0.2 + wiggle, 3.6, true),
    ...head({
      x: 24.4,
      y: 18.6,
      tilt: 0.5,
      eyes: "happy",
      mouth: "tongue",
      ear: -0.6,
    }),
  ];
}

// --------------------------------------------------------------- frames

const RUN = [
  { legs: [-0.7, -0.45, 0.8, 0.55], bob: -1, tail: -2.3, ear: -0.25 },
  { legs: [0.35, 0.55, -0.35, -0.55], bob: 0, tail: -2.65, ear: 0.15 },
  { legs: [-0.45, -0.7, 0.55, 0.8], bob: -1, tail: -2.3, ear: -0.25 },
  { legs: [0.55, 0.35, -0.55, -0.35], bob: 0, tail: -2.65, ear: 0.15 },
] as const;
const WALK = [
  { legs: [0.3, -0.3, -0.3, 0.3], tail: -2.45 },
  { legs: [0, 0, 0, 0], tail: -2.6 },
  { legs: [-0.3, 0.3, 0.3, -0.3], tail: -2.45 },
  { legs: [0, 0, 0, 0], tail: -2.65 },
] as const;

const run = (i: 0 | 1 | 2 | 3, bone = false) => {
  const r = RUN[i];
  return stand({
    legs: r.legs,
    bob: r.bob,
    tail: r.tail,
    head: { ear: r.ear, bone },
  });
};
const walk = (i: 0 | 1 | 2 | 3) =>
  stand({ legs: WALK[i].legs, tail: WALK[i].tail });

export const DOG_POSES = {
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
  tilt: () => sit({ head: { tilt: 0.28 } }),
  lookUp: () => sit({ head: { tilt: -0.3 } }),
  sniff1: () => stand({ head: { dx: 1, dy: 3.5, tilt: 0.25 } }),
  sniff2: () => stand({ head: { dx: 1, dy: 4.2, tilt: 0.32 } }),
  lie: () => lie(),
  lieBlink: () => lie({ head: { eyes: "closed" } }),
  curl1: () => curl(0),
  curl2: () => curl(1),
  stretch: () =>
    stand({
      legs: [0, 0, 0.9, 0.9],
      front: 3,
      bodyRot: 0.22,
      tail: -2.95,
      head: { eyes: "closed" },
    }),
  yawn: () => sit({ head: { eyes: "closed", mouth: "open", tilt: -0.25 } }),
  jump: () =>
    stand({
      legs: [-1.1, -0.9, 1.1, 0.9],
      legLen: 4.6,
      bob: -1,
      tail: -2.2,
      head: { ear: -0.5 },
    }),
  land: () =>
    stand({
      legs: [-0.3, -0.2, 0.3, 0.2],
      legLen: 5,
      bob: 0.8,
      head: { ear: 0.3 },
    }),
  happy: () => sit({ tail: -2.1, head: { eyes: "happy", mouth: "tongue" } }),
  squint: () => sit({ head: { eyes: "squint" } }),
  shake: () => sit({ paw: 1.4, head: { mouth: "tongue" } }),
  highFive: () => sit({ paw: 2.4, head: { eyes: "happy", mouth: "tongue" } }),
  surprised: () =>
    stand({ bob: -1, tail: -3, head: { eyes: "wide", ear: -0.7 } }),
  wag1: () => sit({ tail: -1.45 }),
  wag2: () => sit({ tail: -1.8 }),
  wag3: () => sit({ tail: -2.15 }),
  belly1: () => belly(0),
  belly2: () => belly(0.3),
  carry: () => stand({ head: { bone: true } }),
  carryRun1: () => run(0, true),
  carryRun2: () => run(1, true),
  carryRun3: () => run(2, true),
  carryRun4: () => run(3, true),
  pant1: () => sit({ head: { mouth: "tongue" } }),
  pant2: () => sit({ head: { mouth: "pant" } }),
} satisfies Record<string, () => Shape[]>;

export type DogFrameName = keyof typeof DOG_POSES;

export const drawDog = (name: DogFrameName): Frame =>
  rasterize(DOG_POSES[name](), SEAM);
