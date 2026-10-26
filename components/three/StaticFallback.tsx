/**
 * The hero's static backdrop: a dotted sphere drawn in CSS. It shows first,
 * stays for reduced motion or missing WebGL, and sits under the 3D canvas.
 */
export function StaticFallback() {
  return (
    <div
      aria-hidden="true"
      data-static-fallback
      className="pointer-events-none absolute top-1/2 -right-[20%] aspect-square w-[min(110vw,820px)] -translate-y-1/2 sm:-right-[8%] md:w-[min(70vw,820px)] lg:-right-[12%]"
    >
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,var(--fg)_1.1px,transparent_1.5px)] [mask-image:radial-gradient(circle,#000_0%,#000_36%,transparent_68%)] bg-[length:14px_14px] opacity-35" />
      <span className="absolute top-[30%] left-[38%] size-2.5 rounded-full bg-accent" />
      <span className="absolute top-[58%] left-[58%] size-2 rounded-full bg-accent" />
      <span className="absolute top-[44%] left-[72%] size-1.5 rounded-full bg-accent" />
    </div>
  );
}
