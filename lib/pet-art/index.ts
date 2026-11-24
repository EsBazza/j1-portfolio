import type { PetId } from "@/lib/pets";
import {
  CAT_LEGACY_COLORS,
  CAT_LEGACY_FRAMES,
  LEGACY_H,
  LEGACY_W,
} from "./cat-legacy";
import { DOG_COLORS, DOG_POSES, drawDog, type DogFrameName } from "./dog";
import { ART_H, ART_W, type Frame } from "./raster";

// The pets' art. Imported only by the sleeping bed (server), the styleguide
// and the lazily loaded pet engine, never by first-load client code.

export { frameRuns, type Frame } from "./raster";

/** The frames the engine asks for today; phase 3 replaces them with clips. */
export type EngineFrame =
  | "stand"
  | "runA"
  | "runB"
  | "sit"
  | "blink"
  | "wag"
  | "curl"
  | "bow"
  | "crouch";

export type PetArt = {
  w: number;
  h: number;
  colors: Readonly<Record<string, string>>;
  /** Every named frame, for the styleguide sheet. */
  names: readonly string[];
  frame: (name: string) => Frame;
  /** The frame used for an engine state. */
  engine: (name: EngineFrame) => Frame;
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

const isDogFrame = (name: string): name is DogFrameName => name in DOG_POSES;

const DOG_ENGINE: Record<EngineFrame, DogFrameName> = {
  stand: "stand",
  runA: "run1",
  runB: "run3",
  sit: "sit",
  blink: "blink",
  wag: "wag1",
  curl: "curl1",
  bow: "stretch",
  crouch: "lie",
};

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
  engine: (name) => dogFrame(DOG_ENGINE[name]),
};

const catFrame = (name: string): Frame => {
  const frame = (CAT_LEGACY_FRAMES as Record<string, Frame>)[name];
  if (!frame) throw new Error(`Unknown cat frame "${name}"`);
  return frame;
};

const cat: PetArt = {
  w: LEGACY_W,
  h: LEGACY_H,
  colors: CAT_LEGACY_COLORS,
  names: Object.keys(CAT_LEGACY_FRAMES),
  frame: catFrame,
  engine: catFrame,
};

export const PET_ART: Record<PetId, PetArt> = { dog, cat };

/** The sleeping frame drawn on the D of "J1 Dev.". */
export const BED_FRAME: Record<PetId, string> = { dog: "curl1", cat: "curl" };
