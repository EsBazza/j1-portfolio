// The hero pets (components/pets/): who they are and how they behave. The
// art lives in lib/pet-art/, which first-load client code must not import.

export type PetId = "dog" | "cat";

export type Pet = {
  id: PetId;
  name: string;
  kind: string;
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

const dog: Pet = {
  id: "dog",
  name: "Byte",
  kind: "Dog",
  speed: 210,
  aloof: 0,
  fetches: true,
  pounces: false,
  wags: true,
  sounds: ["woof!", "arf!", "wan!"],
  mood: "curious",
};

const cat: Pet = {
  id: "cat",
  name: "Pixel",
  kind: "Cat",
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
