import { awardStrip } from "@/content/awards";
import { Container } from "@/components/ui/Container";

export function AwardStrip() {
  return (
    <section aria-label="Awards" className="border-b border-line">
      <Container>
        <ul className="grid grid-cols-2 lg:grid-cols-4">
          {awardStrip.map((award) => (
            <li
              key={award.event}
              className="flex flex-col gap-1.5 border-line py-7 max-lg:odd:border-r max-lg:odd:pr-4 max-lg:even:pl-4 sm:py-9 lg:px-6 lg:not-last:border-r lg:first:pl-0 max-lg:[&:nth-child(-n+2)]:border-b"
            >
              <span className="font-display text-[2.5rem] leading-none font-bold tracking-tight text-accent tabular-nums sm:text-stat">
                {award.rank}
                {award.value}
              </span>
              <span className="font-semibold">{award.label}</span>
              <span className="caption text-faint">{award.event}</span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
