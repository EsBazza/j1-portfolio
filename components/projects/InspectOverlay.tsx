/**
 * The DevTools-style hover layer for a project card: a tinted, dashed box
 * and a tooltip like `article.heritech 380 × 412 · Next.js · Firebase`.
 * Put it inside an element marked `data-inspect`; MotionLayer fills in the
 * size on hover. Decorative, and hidden on touch screens (globals.css).
 */
export function InspectOverlay({
  tag,
  name,
  stack,
}: {
  tag: string;
  name: string;
  stack: string[];
}) {
  return (
    <span data-inspect-box aria-hidden="true">
      <span
        data-inspect-tag
        className="absolute top-2 left-2 flex max-w-[calc(100%-1rem)] items-center gap-2 rounded-md border border-inspect/60 bg-surface-2 px-2.5 py-1.5 font-mono text-[0.6875rem] whitespace-nowrap text-fg shadow-lg shadow-black/30"
      >
        <span>
          <span className="text-inspect">{tag}</span>.{name}
        </span>
        <span data-inspect-size className="text-muted tabular-nums" />
        {stack.length > 0 ? (
          <span className="truncate text-faint">
            {stack.slice(0, 3).join(" · ")}
          </span>
        ) : null}
      </span>
    </span>
  );
}
