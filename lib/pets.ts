// The hero pets (components/pets/): original pixel sprites drawn as character
// grids, facing right, 18 x 14 pixels. Each character is one pixel:
//   . transparent  o outline  b fur  d dark fur  w white  k black
//   e eye (cat)    n nose (cat)

export const PET_W = 18;
export const PET_H = 14;

export type PetId = "dog" | "cat";
export type FrameName =
  | "stand"
  | "runA"
  | "runB"
  | "sit"
  | "blink"
  | "wag"
  | "curl"
  | "bow"
  | "crouch";
export type Frame = readonly string[];

export type Pet = {
  id: PetId;
  name: string;
  kind: string;
  colors: Record<string, string>;
  frames: Record<FrameName, Frame>;
  /** Top running speed, px/s. */
  speed: number;
  /** Chance (0–1) that it ignores the cursor moving away and grooms instead. */
  aloof: number;
  /** Chases a thrown bone (double-click). */
  fetches: boolean;
  /** Pounces on a cursor that stops at a distance. */
  pounces: boolean;
  /** Wags its tail fast when the cursor is near (otherwise a slow flick). */
  wags: boolean;
  sounds: string[];
  mood: string;
};

/** Pink pixel heart for petting. */
export const HEART_COLOR = "#e8798c";
export const BONE_COLOR = "#f3ead6";

const BLANK = ".".repeat(PET_W);
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
  ...frame.slice(0, PET_H - dy),
];

const swap = (frame: Frame, from: string, to: string): Frame =>
  frame.map((row) => row.split(from).join(to));

// ---------------------------------------------------------------- dog (Byte)

const dogHead = [
  "..........oo......",
  ".........oddoooo..",
  ".........oddbbbbo.",
];

const dogStand = [
  ...dogHead,
  ".o.......oddbkbbo.",
  "obo.......odbbbwwo",
  ".obo......obbbwwko",
  "..obooooooobbbwwo.",
  "...obbbbbbbbbbbo..",
  "...obbbbbbbbbbwo..",
  "...obbbbbbbbbwwo..",
  "....owwbbbbbwwo...",
  "....obo....obo....",
  "....obo....obo....",
  "....oo.....oo.....",
];

const dogRunA = [
  ...dogStand.slice(0, 11),
  "...obo......obo...",
  "..obo........obo..",
  "..oo..........oo..",
];

const dogRunB = [
  ...dogHead,
  ".........oddbkbbo.",
  "oo........odbbbwwo",
  ".oo.......obbbwwko",
  "..obooooooobbbwwo.",
  ...dogStand.slice(7, 11),
  ".....obo..obo.....",
  "......oboobo......",
  ".......oooo.......",
];

const dogFace = [
  ".........oddbkbbo.",
  "..........odbbbwwo",
  "..........obbbwwko",
];
const dogFaceClosed = [
  ".........oddbbbbo.",
  "..........odoobwwo",
  "..........obbbwwko",
];

const dogSitBody = [
  ".........oobbbwwo.",
  "........obbbbbwo..",
  ".......obbbbbbwo..",
  "......obbbbbbwwo..",
  ".oo..obbbbbbbwwo..",
  "obbooobbbbbbobwo..",
  ".oobbbbbbbbbobwo..",
  "...oooooooooo.oo..",
];

const dogWagBody = [
  ".........oobbbwwo.",
  "........obbbbbwo..",
  ".o.....obbbbbbwo..",
  "obo...obbbbbbwwo..",
  ".obo.obbbbbbbwwo..",
  "..obbobbbbbbobwo..",
  "...obbbbbbbbobwo..",
  "...oooooooooo.oo..",
];

const dogCurl = [
  ...blankRows(6),
  "..........oo......",
  ".........oddoooo..",
  "..oooooooddbbbbo..",
  ".obbbbbbbodoobbwo.",
  "obbbbbbbbbbbbwwko.",
  "obbbbbbbbbbbwwwo..",
  ".obbwwwwwwwwwwo...",
  "..oooooooooooo....",
];

const dog: Pet = {
  id: "dog",
  name: "Byte",
  kind: "Dog",
  colors: {
    o: "#2a1c14",
    b: "#d79a5b",
    d: "#8a5530",
    w: "#f3ead6",
    k: "#120c09",
  },
  frames: {
    stand: dogStand,
    runA: dogRunA,
    runB: dogRunB,
    sit: [...dogHead, ...dogFace, ...dogSitBody],
    blink: [...dogHead, ...dogFaceClosed, ...dogSitBody],
    wag: [...dogHead, ...dogFace, ...dogWagBody],
    curl: dogCurl,
    bow: shiftCols(dogStand, 9, 3),
    crouch: lower(dogStand.slice(0, 11), 3),
  },
  speed: 210,
  aloof: 0,
  fetches: true,
  pounces: false,
  wags: true,
  sounds: ["woof!", "arf!", "wan!"],
  mood: "curious",
};

// --------------------------------------------------------------- cat (Pixel)

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

const cat: Pet = {
  id: "cat",
  name: "Pixel",
  kind: "Cat",
  colors: {
    o: "#1c1d24",
    b: "#737888",
    d: "#4a4d5a",
    w: "#eef0f4",
    e: "#e9c46a",
    n: "#e58fa3",
  },
  frames: {
    stand: catStand,
    runA: catRunA,
    runB: catRunB,
    sit: catSit,
    blink: swap(catSit, "e", "o"),
    wag: catFlick,
    curl: catCurl,
    bow: shiftCols(catStand, 9, 3),
    crouch: lower(catStand.slice(0, 11), 3),
  },
  speed: 180,
  aloof: 0.45,
  fetches: false,
  pounces: true,
  wags: false,
  sounds: ["mrrp", "meow", "mew"],
  mood: "unbothered",
};

export const PETS: Record<PetId, Pet> = { dog, cat };
export const PET_ORDER: PetId[] = ["dog", "cat"];

export const isPetId = (value: unknown): value is PetId =>
  value === "dog" || value === "cat";

export const nextPet = (id: PetId): PetId =>
  PET_ORDER[(PET_ORDER.indexOf(id) + 1) % PET_ORDER.length] ?? "dog";

/** Horizontal runs of one color, for drawing a frame as SVG rects. */
export function frameRuns(frame: Frame, colors: Record<string, string>) {
  const runs: { x: number; y: number; w: number; fill: string }[] = [];
  frame.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const ch = row[x] ?? ".";
      const fill = colors[ch];
      let end = x + 1;
      while (end < row.length && row[end] === ch) end++;
      if (fill) runs.push({ x, y, w: end - x, fill });
      x = end;
    }
  });
  return runs;
}
