import { skills } from "@/content/skills";

/**
 * Every skill on one slowly scrolling line. The list is rendered twice so the
 * loop is seamless; the copy is hidden from assistive tech. Pauses on hover
 * and focus, and becomes a static wrapped list with reduced motion.
 */
export function StackMarquee() {
  const items = skills.flatMap((g) => g.items);
  const list = (copy: boolean) => (
    <ul
      aria-hidden={copy ? "true" : undefined}
      aria-label={copy ? undefined : "Technologies"}
      className={copy ? "marquee-copy" : undefined}
    >
      {items.map((item) => (
        <li key={item} translate="no">
          {item}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="marquee border-b border-line py-5">
      <div className="marquee-track">
        {list(false)}
        {list(true)}
      </div>
    </div>
  );
}
