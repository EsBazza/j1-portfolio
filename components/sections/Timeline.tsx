import Image from "next/image";
import Link from "next/link";
import { hackathons } from "@/content/awards";
import { getProject } from "@/content/projects";
import { Section, SectionHeading } from "@/components/ui/Section";
import { cn } from "@/lib/utils";

export function Timeline() {
  const first = hackathons[0]?.year;
  const last = hackathons.at(-1)?.year;

  return (
    <Section id="hackathons" aria-labelledby="hackathons-title" grid>
      <div className="grid gap-12 lg:grid-cols-12">
        <SectionHeading
          id="hackathons-title"
          eyebrow={`Hackathons · ${first} – ${last}`}
          className="lg:col-span-4"
        >
          Hackathon log.
        </SectionHeading>
        <div data-timeline className="relative lg:col-span-8">
          {/* Accent line that draws down the log as you scroll. */}
          <span
            aria-hidden="true"
            data-timeline-progress
            className="absolute top-0 left-0 h-full w-px origin-top scale-y-0 bg-accent"
          />
          <ol data-reveal-group className="flex flex-col border-l border-line">
            {hackathons.map((h) => {
              const project = h.project ? getProject(h.project) : undefined;
              return (
                <li
                  key={`${h.event}-${h.year}`}
                  className="relative flex flex-col gap-1.5 pb-10 pl-8 last:pb-0"
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute top-1.5 -left-[5px] size-[9px] rounded-full border border-line-strong bg-bg",
                      h.highlight && "border-accent bg-accent",
                    )}
                  />
                  <p className="caption text-faint">
                    {h.date ?? h.year}
                    {h.location ? ` · ${h.location}` : ""}
                  </p>
                  <h3 className="font-display text-xl font-semibold">
                    {h.event}
                  </h3>
                  <p className={cn(h.rank ? "text-accent" : "text-muted")}>
                    {h.result}
                  </p>
                  {project ? (
                    <Link
                      href={`/projects/${project.slug}`}
                      className="inline-flex min-h-11 w-fit items-center caption text-muted underline decoration-line-strong underline-offset-4 hover:text-fg"
                    >
                      Project: {project.title}
                    </Link>
                  ) : null}
                  {h.photo ? (
                    <figure className="mt-3 max-w-md overflow-hidden rounded-lg border border-line">
                      <Image
                        src={h.photo.src}
                        alt={h.photo.alt}
                        width={h.photo.width}
                        height={h.photo.height}
                        sizes="(min-width: 768px) 448px, calc(100vw - 4rem)"
                        className="h-auto w-full"
                      />
                    </figure>
                  ) : null}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </Section>
  );
}
