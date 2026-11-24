// Pixel art from shapes. A pet's pose is a list of shapes (ellipses, limbs,
// rectangles, single pixels) drawn back to front; rasterize() samples them at
// pixel centres, shades each pixel by its surface normal against a light from
// the top left, adds a 1px outline around the silhouette and a shadow line
// under every part that overlaps another. The result is a character grid, one
// character per pixel, looked up in the pet's palette.

export const ART_W = 32;
export const ART_H = 26;

export type Frame = readonly string[];

/** Palette characters for the light, mid and shadow side of a material. */
export type Tones = {
  readonly L: string;
  readonly M: string;
  readonly S: string;
};

type Sampler = (x: number, y: number) => number | null;
export type Shape = { sample: Sampler; tones: Tones };

const LIGHT_X = -0.55;
const LIGHT_Y = -0.8;
const HIGH = 0.42;
const LOW = -0.3;
const OUTLINE = "o";

export const flat = (ch: string): Tones => ({ L: ch, M: ch, S: ch });

/** An ellipse; `rot` turns it clockwise (radians). */
export function ellipse(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  tones: Tones,
  rot = 0,
): Shape {
  const c = Math.cos(rot);
  const s = Math.sin(rot);
  return {
    tones,
    sample: (x, y) => {
      const dx = x - cx;
      const dy = y - cy;
      const u = (dx * c + dy * s) / rx;
      const v = (-dx * s + dy * c) / ry;
      if (u * u + v * v > 1) return null;
      return (u * c - v * s) * LIGHT_X + (u * s + v * c) * LIGHT_Y;
    },
  };
}

/** The end point of a limb that starts at (x, y): angle 0 points straight
 *  down, positive angles swing it forward (right). */
export function limbEnd(x: number, y: number, angle: number, length: number) {
  return { x: x + Math.sin(angle) * length, y: y + Math.cos(angle) * length };
}

/** A capsule from a joint, shaded across its width like a cylinder. */
export function limb(
  x: number,
  y: number,
  angle: number,
  length: number,
  radius: number,
  tones: Tones,
): Shape {
  const end = limbEnd(x, y, angle, length);
  const ex = end.x - x;
  const ey = end.y - y;
  const len2 = ex * ex + ey * ey || 1;
  return {
    tones,
    sample: (px, py) => {
      const t = Math.min(
        1,
        Math.max(0, ((px - x) * ex + (py - y) * ey) / len2),
      );
      const nx = px - (x + ex * t);
      const ny = py - (y + ey * t);
      const d = Math.hypot(nx, ny);
      if (d > radius) return null;
      return (nx / radius) * LIGHT_X * 1.3 + (ny / radius) * LIGHT_Y * 0.2;
    },
  };
}

/** A filled polygon (pointed ears), shaded from its centre outwards. */
export function polygon(
  points: readonly (readonly [number, number])[],
  tones: Tones,
): Shape {
  const cx = points.reduce((sum, [x]) => sum + x, 0) / points.length;
  const cy = points.reduce((sum, [, y]) => sum + y, 0) / points.length;
  const r = Math.max(...points.map(([x, y]) => Math.hypot(x - cx, y - cy)), 1);
  return {
    tones,
    sample: (x, y) => {
      let inside = false;
      for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
        const [xi, yi] = points[i]!;
        const [xj, yj] = points[j]!;
        if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi)
          inside = !inside;
      }
      if (!inside) return null;
      return (((x - cx) * LIGHT_X + (y - cy) * LIGHT_Y) / r) * 1.4;
    },
  };
}

/** Single pixels in one colour (eyes, noses, tags). */
export function pixels(
  points: readonly (readonly [number, number])[],
  ch: string,
): Shape {
  const set = new Set(
    points.map(([x, y]) => `${Math.round(x)},${Math.round(y)}`),
  );
  return {
    tones: flat(ch),
    sample: (x, y) => (set.has(`${Math.floor(x)},${Math.floor(y)}`) ? 0 : null),
  };
}

/**
 * Draws the shapes back to front. `seam` maps a palette character to its
 * shadow, used on the row just under a part that overlaps it.
 */
export function rasterize(
  shapes: readonly Shape[],
  seam: Readonly<Record<string, string>>,
): Frame {
  const grid: string[][] = Array.from({ length: ART_H }, () =>
    Array<string>(ART_W).fill("."),
  );
  const owner: number[][] = Array.from({ length: ART_H }, () =>
    Array<number>(ART_W).fill(-1),
  );
  shapes.forEach((shape, i) => {
    for (let y = 0; y < ART_H; y++) {
      for (let x = 0; x < ART_W; x++) {
        const v = shape.sample(x + 0.5, y + 0.5);
        if (v === null) continue;
        grid[y]![x] =
          v > HIGH ? shape.tones.L : v < LOW ? shape.tones.S : shape.tones.M;
        owner[y]![x] = i;
      }
    }
  });

  const out = grid.map((row) => [...row]);
  const filled = (x: number, y: number) =>
    x >= 0 && x < ART_W && y >= 0 && y < ART_H && grid[y]![x] !== ".";
  for (let y = 0; y < ART_H; y++) {
    for (let x = 0; x < ART_W; x++) {
      if (grid[y]![x] !== ".") {
        // Shadow under an overlapping part of a different material.
        const o = owner[y]![x]!;
        const above = y > 0 ? owner[y - 1]![x]! : -1;
        const shadow = seam[grid[y]![x]!];
        if (
          shadow &&
          above > o &&
          shapes[above]!.tones !== shapes[o]!.tones &&
          grid[y - 1]![x] !== OUTLINE
        )
          out[y]![x] = shadow;
        continue;
      }
      if (
        filled(x + 1, y) ||
        filled(x - 1, y) ||
        filled(x, y + 1) ||
        filled(x, y - 1)
      )
        out[y]![x] = OUTLINE;
    }
  }
  return out.map((row) => row.join(""));
}

/** Horizontal runs of one colour, for drawing a frame as SVG rects. */
export function frameRuns(
  frame: Frame,
  colors: Readonly<Record<string, string>>,
) {
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
