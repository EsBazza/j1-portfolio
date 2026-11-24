import { BED_FRAME, frameRuns, PET_ART } from "@/lib/pet-art";
import { PET_ORDER } from "@/lib/pets";

/**
 * The pet asleep on the D of "J1 Dev.": plain SVG in the server HTML, so it
 * shows before any JavaScript. Both pets are rendered; `html[data-pet]` picks
 * one (set before paint by the head script). PetLayer wakes it up.
 */
export function PetBed() {
  return (
    <span
      data-pet-bed
      title="Shh, sleeping. Hover to wake"
      className="pet-bed pointer-events-auto absolute z-10 cursor-pointer"
    >
      {PET_ORDER.map((id) => {
        const art = PET_ART[id];
        return (
          <svg
            key={id}
            data-species={id}
            viewBox={`0 0 ${art.w} ${art.h}`}
            shapeRendering="crispEdges"
            className="block h-auto w-full"
            role="presentation"
          >
            {frameRuns(art.frame(BED_FRAME[id]), art.colors).map((r) => (
              <rect
                key={`${r.x}-${r.y}`}
                x={r.x}
                y={r.y}
                width={r.w}
                height={1}
                fill={r.fill}
              />
            ))}
          </svg>
        );
      })}
      <span className="pet-z absolute right-[8%] bottom-[55%] font-mono text-[0.09em] text-faint">
        z
      </span>
    </span>
  );
}
