import type { PetId } from "@/lib/pets";
import { CAT_COLORS, CAT_POSES, drawCat, type CatFrameName } from "./cat";
import { DOG_COLORS, DOG_POSES, drawDog, type DogFrameName } from "./dog";
import { ART_H, ART_W, type Frame } from "./raster";

// The pets' art. Imported only by the sleeping bed (server), the styleguide
// and the lazily loaded pet engine, never by first-load client code.

export { frameRuns, type Frame } from "./raster";

/** The animations the engine plays. Each pet maps them to its own frames. */
export type ClipName =
  | "stand"
  | "walk"
  | "run"
  | "carry"
  | "carryRun"
  | "sit"
  | "blink"
  | "wag"
  | "sniff"
  | "tilt"
  | "lookUp"
  | "lie"
  | "lieBlink"
  | "sleep"
  | "stretch"
  | "yawn"
  | "jump"
  | "land"
  | "happy"
  | "pant"
  | "groom"
  | "crouch"
  | "pounce"
  | "surprised";

/** Frames played in order; `fps` is ignored for gaits, which follow speed. */
export type Clip = {
  readonly frames: readonly string[];
  readonly fps: number;
  readonly loop: boolean;
};

const still = (frame: string): Clip => ({
  frames: [frame],
  fps: 1,
  loop: false,
});
const loop = (fps: number, ...frames: string[]): Clip => ({
  frames,
  fps,
  loop: true,
});

/** The frame of a clip `t` seconds after it started. */
export function clipFrame(clip: Clip, t: number): string {
  const i = Math.max(0, Math.floor(t * clip.fps));
  const n = clip.frames.length;
  return (
    clip.frames[clip.loop ? i % n : Math.min(i, n - 1)] ?? clip.frames[0] ?? ""
  );
}

export type PetArt = {
  w: number;
  h: number;
  colors: Readonly<Record<string, string>>;
  /** Every named frame, for the styleguide sheet. */
  names: readonly string[];
  frame: (name: string) => Frame;
  clips: Readonly<Record<ClipName, Clip>>;
};

function cached(draw: (name: string) => Frame) {
  const cache = new Map<string, Frame>();
  return (name: string) => {
    let frame = cache.get(name);
    if (!frame) {
      frame = draw(name);
      cache.set(name, frame);
    }
    return frame;
  };
}

// The four-frame gaits are shared by both pets.
const GAITS = {
  walk: loop(8, "walk1", "walk2", "walk3", "walk4"),
  run: loop(12, "run1", "run2", "run3", "run4"),
};

const SHARED = {
  ...GAITS,
  stand: still("stand"),
  sit: still("sit"),
  blink: still("blink"),
  sniff: loop(5, "sniff1", "sniff2"),
  tilt: still("tilt"),
  lookUp: still("lookUp"),
  lie: still("lie"),
  lieBlink: still("lieBlink"),
  sleep: loop(0.6, "curl1", "curl2"),
  stretch: still("stretch"),
  yawn: still("yawn"),
  jump: still("jump"),
  land: still("land"),
  happy: still("happy"),
  surprised: still("surprised"),
} satisfies Partial<Record<ClipName, Clip>>;

const isDogFrame = (name: string): name is DogFrameName => name in DOG_POSES;
const dogFrame = cached((name) => {
  if (!isDogFrame(name)) throw new Error(`Unknown dog frame "${name}"`);
  return drawDog(name);
});

const dog: PetArt = {
  w: ART_W,
  h: ART_H,
  colors: DOG_COLORS,
  names: Object.keys(DOG_POSES),
  frame: dogFrame,
  clips: {
    ...SHARED,
    carry: still("carry"),
    carryRun: loop(12, "carryRun1", "carryRun2", "carryRun3", "carryRun4"),
    wag: loop(12, "wag1", "wag2", "wag3", "wag2"),
    pant: loop(6, "pant1", "pant2"),
    groom: loop(6, "pant1", "pant2"),
    crouch: still("stretch"),
    pounce: still("jump"),
  },
};

const isCatFrame = (name: string): name is CatFrameName => name in CAT_POSES;
const catFrame = cached((name) => {
  if (!isCatFrame(name)) throw new Error(`Unknown cat frame "${name}"`);
  return drawCat(name);
});

const cat: PetArt = {
  w: ART_W,
  h: ART_H,
  colors: CAT_COLORS,
  names: Object.keys(CAT_POSES),
  frame: catFrame,
  clips: {
    ...SHARED,
    carry: still("stand"),
    carryRun: GAITS.run,
    wag: loop(5, "swish1", "swish2", "swish3", "swish2"),
    pant: still("purr"),
    groom: loop(3, "groom1", "groom2"),
    crouch: loop(10, "crouch1", "crouch2"),
    pounce: still("pounce"),
  },
};

export const PET_ART: Record<PetId, PetArt> = { dog, cat };

/** The sleeping frame drawn on the D of "J1 Dev.". */
export const BED_FRAME: Record<PetId, string> = { dog: "curl1", cat: "curl1" };
