import { frameRuns, PET_ART, type Frame } from "@/lib/pet-art";
import { PET_ORDER, PETS } from "@/lib/pets";

function Sprite({
  frame,
  colors,
  scale,
}: {
  frame: Frame;
  colors: Readonly<Record<string, string>>;
  scale: number;
}) {
  const w = frame[0]?.length ?? 0;
  const h = frame.length;
  return (
    <svg
      width={w * scale}
      height={h * scale}
      viewBox={`0 0 ${w} ${h}`}
      shapeRendering="crispEdges"
      role="presentation"
    >
      {frameRuns(frame, colors).map((r) => (
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
}

/** Every frame of every pet, at 4× and actual size (styleguide only). */
export function PetSheet() {
  return (
    <div className="flex flex-col gap-12">
      {PET_ORDER.map((id) => {
        const art = PET_ART[id];
        return (
          <div key={id} className="flex flex-col gap-5">
            <p className="caption text-faint">
              {PETS[id].name} · {art.names.length} frames · {art.w}×{art.h} px
            </p>
            <ul className="flex flex-wrap gap-6">
              {art.names.map((name) => (
                <li key={name} className="flex flex-col items-center gap-2">
                  <Sprite
                    frame={art.frame(name)}
                    colors={art.colors}
                    scale={4}
                  />
                  <Sprite
                    frame={art.frame(name)}
                    colors={art.colors}
                    scale={1}
                  />
                  <span className="caption text-faint">{name}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
