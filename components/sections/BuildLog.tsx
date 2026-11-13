import Image from "next/image";
import Link from "next/link";
import { hackathons } from "@/content/awards";
import { projects } from "@/content/projects";
import type { Hackathon, Project } from "@/content/schema";
import { ProjectCover } from "@/components/projects/ProjectCover";
import { RowPreview } from "@/components/projects/RowPreview";
import { StackTags } from "@/components/projects/StackTags";
import { LiveStatus } from "@/components/status/LiveStatus";
import { ArrowRight, ArrowUpRight } from "@/components/ui/Icons";
import { Section, SectionHeading } from "@/components/ui/Section";
import { cn } from "@/lib/utils";

/** A project's main event: the highlighted result, else any ranked one. */
function mainEvent(project: Project) {
  const own = hackathons.filter((h) => h.project === project.slug);
  return own.find((h) => h.highlight) ?? own.find((h) => h.rank);
}

/** Award projects, newest result first (hackathons are listed oldest first). */
const awarded = projects
  .filter((p) => p.awards.length > 0)
  .map((project) => ({ project, event: mainEvent(project) }))
  .sort(
    (a, b) =>
      (b.event ? hackathons.indexOf(b.event) : -1) -
      (a.event ? hackathons.indexOf(a.event) : -1),
  );

/** The rest, newest first; projects without a date go last. */
const shipped = projects
  .filter((p) => p.awards.length === 0)
  .sort(
    (a, b) =>
      (b.logMonth ?? "").localeCompare(a.logMonth ?? "") || a.order - b.order,
  );

const monthFormat = new Intl.DateTimeFormat("en", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

/** "2026-08" → "Aug 2026". */
function monthLabel(month: string) {
  return monthFormat.format(new Date(`${month}-01T00:00:00Z`));
}

/** Events with no project attached, e.g. the first hackathon joined. */
const joined = [...hackathons].reverse().filter((h) => !h.project);

/** Screenshots for the hover preview on the one-line rows. */
const previews = shipped.flatMap((p) =>
  p.cover ? [{ slug: p.slug, cover: p.cover }] : [],
);

const linkClass =
  "inline-flex min-h-11 items-center gap-1.5 underline decoration-line-strong underline-offset-4 hover:decoration-fg";

/**
 * The build log: every project as a row on one line. Award projects are
 * large rows with the screenshot, the awards and the event photo; the rest
 * are one-line rows that link to their case study.
 */
export function BuildLog() {
  const years = hackathons.map((h) => h.year);

  return (
    <Section
      id="projects"
      aria-labelledby="log-title"
      grid
      className="overflow-x-clip"
    >
      <SectionHeading
        id="log-title"
        eyebrow={`Build log · ${Math.min(...years)} – ${Math.max(...years)}`}
      >
        Built, shipped and judged
      </SectionHeading>
      <div data-timeline className="relative mt-12 md:mt-20">
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-px bg-line"
        />
        {/* Accent line that draws down the log as you scroll. */}
        <span
          aria-hidden="true"
          data-timeline-progress
          className="absolute inset-y-0 left-0 w-px origin-top scale-y-0 bg-accent"
        />
        <ol className="flex flex-col">
          {awarded.map(({ project, event }, i) => (
            <AwardRow
              key={project.slug}
              project={project}
              event={event}
              preload={i === 0}
            />
          ))}
          <li data-brief="hide" className="relative pb-2 pl-6 sm:pl-10">
            <p className="caption text-faint">Also shipped</p>
          </li>
          {shipped.map((project) => (
            <ShippedRow key={project.slug} project={project} />
          ))}
          {joined.map((h) => (
            <li
              key={`${h.event}-${h.year}`}
              data-reveal
              data-brief="hide"
              className="relative pl-6 sm:pl-10"
            >
              <LogDot kind="joined" className="top-1/2 -mt-1" />
              <div className="grid grid-cols-1 gap-x-6 gap-y-1 py-4 sm:grid-cols-[13rem_minmax(0,1fr)]">
                <h3 className="font-display text-lg font-semibold">
                  {h.event}
                </h3>
                <p className="text-muted">
                  {h.result} · {h.year}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <RowPreview items={previews} />
    </Section>
  );
}

/** The commit dot on the log line: amber for a win, filled for shipped. */
function LogDot({
  kind,
  className,
}: {
  kind: "win" | "shipped" | "joined";
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      data-log-dot
      className={cn(
        "absolute left-0 -ml-1 size-2 rounded-full",
        kind === "win" && "bg-accent",
        kind === "shipped" && "bg-fg",
        kind === "joined" && "border border-line-strong bg-bg",
        className,
      )}
    />
  );
}

function AwardRow({
  project,
  event,
  preload,
}: {
  project: Project;
  event?: Hackathon;
  preload: boolean;
}) {
  return (
    <li
      data-reveal
      id={`log-${project.slug}`}
      data-brief="tight"
      className="relative scroll-mt-24 pb-16 pl-6 sm:pl-10 md:pb-24"
    >
      <LogDot kind="win" className="top-1" />
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
        <div data-brief="hide" className="flex flex-col gap-4 lg:col-span-7">
          <ProjectCover
            project={project}
            sizes="(min-width: 1024px) 55vw, 100vw"
            preload={preload}
            morph
          />
          {event?.photo ? (
            <figure className="max-w-sm overflow-hidden rounded-lg border border-line">
              <Image
                src={event.photo.src}
                alt={event.photo.alt}
                width={event.photo.width}
                height={event.photo.height}
                sizes="(min-width: 640px) 384px, calc(100vw - 4rem)"
                className="h-auto w-full"
              />
            </figure>
          ) : null}
        </div>
        <div className="flex flex-col gap-4 lg:sticky lg:top-24 lg:col-span-5">
          {event ? (
            <p className="caption text-faint">
              {event.date ?? event.year}
              {event.location ? ` · ${event.location}` : ""}
            </p>
          ) : null}
          <h3 className="font-display text-title font-semibold">
            {project.title}
            {project.aka ? (
              <span className="ml-3 align-middle font-mono text-sm font-normal tracking-normal text-faint">
                aka {project.aka}
              </span>
            ) : null}
          </h3>
          <ul aria-label="Awards" data-stamps className="flex flex-wrap gap-2">
            {project.awards.map((award) => (
              <li
                key={`${award.title}-${award.event}`}
                data-stamp
                className="inline-flex flex-wrap items-center gap-x-2 rounded-sm border border-accent px-2.5 py-1 caption"
              >
                <span className="font-semibold text-accent">{award.title}</span>
                <span className="text-muted">{award.event}</span>
              </li>
            ))}
          </ul>
          <p data-brief="hide" className="text-muted">
            {project.summary}
          </p>
          <div data-brief="hide">
            <StackTags project={project} />
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
            <Link
              href={`/projects/${project.slug}`}
              className={cn(linkClass, "font-semibold text-fg")}
            >
              Read the case study
              <span className="sr-only">: {project.title}</span>
              <ArrowRight />
            </Link>
            {project.repo ? (
              <a
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(linkClass, "text-muted hover:text-fg")}
              >
                Repository
                <span className="sr-only">
                  {" "}
                  for {project.title} (opens in a new tab)
                </span>
                <ArrowUpRight />
              </a>
            ) : null}
            {event?.source ? (
              <a
                href={event.source.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(linkClass, "text-muted hover:text-fg")}
              >
                {event.source.label}
                <span className="sr-only">
                  {" "}
                  about {project.title} (opens in a new tab)
                </span>
                <ArrowUpRight />
              </a>
            ) : null}
          </div>
          {project.live ? (
            <LiveStatus
              slug={project.slug}
              title={project.title}
              url={project.live}
              host={new URL(project.live).host}
              className="w-fit max-w-full"
            />
          ) : null}
        </div>
      </div>
    </li>
  );
}

function ShippedRow({ project }: { project: Project }) {
  return (
    <li data-reveal data-brief="hide" className="relative pl-6 sm:pl-10">
      <LogDot kind="shipped" className="top-1/2 -mt-1" />
      <div
        data-preview={project.slug}
        className="group relative grid grid-cols-1 items-center gap-x-6 gap-y-1 border-b border-line py-4 sm:grid-cols-[13rem_minmax(0,1fr)] lg:grid-cols-[13rem_minmax(0,1fr)_21rem_auto]"
      >
        <div className="flex flex-col gap-1">
          {project.logMonth ? (
            <p className="caption text-faint">{monthLabel(project.logMonth)}</p>
          ) : null}
          <h3 className="font-display text-lg font-semibold">
            <Link
              href={`/projects/${project.slug}`}
              className="after:absolute after:inset-0"
            >
              {project.title}
            </Link>
          </h3>
        </div>
        <p className="text-[0.9375rem] text-muted">
          {project.tagline}
          {project.context ? (
            <span className="text-faint"> · {project.context}</span>
          ) : null}
        </p>
        {project.live ? (
          <LiveStatus
            slug={project.slug}
            title={project.title}
            url={project.live}
            host={new URL(project.live).host}
            className="relative z-10 w-fit max-w-full sm:col-start-2 lg:col-start-auto"
          />
        ) : (
          <span className="hidden lg:block" />
        )}
        <ArrowRight className="hidden text-faint transition-transform group-hover:translate-x-1 motion-reduce:transition-none lg:block" />
      </div>
    </li>
  );
}
