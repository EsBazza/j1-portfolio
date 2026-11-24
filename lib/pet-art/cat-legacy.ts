import type { Frame } from "./raster";

// Pixel, the cat, as first drawn: 18 x 14 character grids. Replaced by the
// shaded 32 x 26 rig in phase 2 of the pets plan (docs: lib/pet-art/).

export const LEGACY_W = 18;
export const LEGACY_H = 14;

const BLANK = ".".repeat(LEGACY_W);
const blankRows = (n: number) => Array.from({ length: n }, () => BLANK);

/** Moves the columns from `fromCol` rightward down by `dy` rows. */
function shiftCols(frame: Frame, fromCol: number, dy: number): Frame {
  return frame.map((row, y) =>
    [...row]
      .map((ch, x) => (x < fromCol ? ch : (frame[y - dy]?.[x] ?? ".")))
      .join(""),
  );
}

const lower = (frame: Frame, dy: number): Frame => [
  ...blankRows(dy),
  ...frame.slice(0, LEGACY_H - dy),
];

const swap = (frame: Frame, from: string, to: string): Frame =>
  frame.map((row) => row.split(from).join(to));

const catEars = [
  "..........o...o...",
  ".........obo.obo..",
  ".........obbbbbbo.",
];

const catStand = [
  ...catEars,
  "..o......obbbbbbo.",
  ".obo.....obebbebo.",
  ".obo.....obbwnwbo.",
  ".obo......owwwwo..",
  "..obooooooobbbbo..",
  "...obdbdbdbbbbwo..",
  "...obbbbbbbbbbwo..",
  "...obbbbbbbbbwwo..",
  "....obo....obo....",
  "....obo....obo....",
  "....oo.....oo.....",
];

const catRunA = [
  ...catStand.slice(0, 11),
  "...obo......obo...",
  "..obo........obo..",
  "..oo..........oo..",
];

const catRunB = [
  ...catEars,
  ".........obbbbbbo.",
  ".........obebbebo.",
  "oo.......obbwnwbo.",
  ".oo.......owwwwo..",
  "..obooooooobbbbo..",
  ...catStand.slice(8, 11),
  ".....obo..obo.....",
  "......oboobo......",
  ".......oooo.......",
];

const catSit = [
  ...catEars,
  ".........obbbbbbo.",
  ".........obebbebo.",
  ".........obbwnwbo.",
  "..........owwwwo..",
  ".........obbbwwo..",
  "........obbbbwwo..",
  ".......obdbbbwwo..",
  ".......obbdbbwwo..",
  "......obbbbbbwwo..",
  ".ooooobbbbbbbbwo..",
  "obbbbbboooooooo...",
];

const catFlick = [
  ...catSit.slice(0, 11),
  "oo....obbbbbbwwo..",
  ".obooobbbbbbbbwo..",
  "..obbbboooooooo...",
];

const catCurl = [
  ...blankRows(7),
  ".........o...o....",
  ".........obo.obo..",
  "...oooooobbbbbbbo.",
  "..obbdbdbbbobbobo.",
  ".obbbbbbbbbbwnwbo.",
  "obbbbbbbbbbbwwwo..",
  ".oooooooooooooo...",
];

export const CAT_LEGACY_COLORS = {
  o: "#1c1d24",
  b: "#737888",
  d: "#4a4d5a",
  w: "#eef0f4",
  e: "#e9c46a",
  n: "#e58fa3",
} as const;

export const CAT_LEGACY_FRAMES = {
  stand: catStand,
  runA: catRunA,
  runB: catRunB,
  sit: catSit,
  blink: swap(catSit, "e", "o"),
  wag: catFlick,
  curl: catCurl,
  bow: shiftCols(catStand, 9, 3),
  crouch: lower(catStand.slice(0, 11), 3),
} satisfies Record<string, Frame>;
