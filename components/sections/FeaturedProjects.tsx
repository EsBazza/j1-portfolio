import { featuredProjects, projectCaption } from "@/content/projects";
import type { Project } from "@/content/schema";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/Section";
import { ProjectCover } from "@/components/projects/ProjectCover";
import { ProjectLinks } from "@/components/projects/ProjectLinks";
import { StackTags } from "@/components/projects/StackTags";

/**
 * The four featured projects as large panels: a plain vertical stack without
 * JavaScript, with reduced motion and on phones.
 */
export function FeaturedProjects() {
  return (
    <section
      id="projects"
      aria-labelledby="featured-title"
      className="border-b border-line"
    >
      <Container className="pt-20 md:pt-32">
        <SectionHeading
          id="featured-title"
          eyebrow={`Featured · 01–${String(featuredProjects.length).padStart(2, "0")}`}
        >
          Built, shipped and judged.
        </SectionHeading>
      </Container>
      {/* On large screens the motion layer pins this block (data-pinned) and
          scrubs between the panels; otherwise it is a vertical stack. */}
      <Container
        data-featured-pin
        data-reveal
        className="py-16 data-pinned:flex data-pinned:min-h-svh data-pinned:flex-col data-pinned:justify-center data-pinned:gap-8 data-pinned:py-10 md:py-24"
      >
        <div
          aria-hidden="true"
          className="hidden items-center gap-2 [[data-pinned]_&]:flex"
        >
          {featuredProjects.map((p) => (
            <span
              key={p.slug}
              data-panel-index
              className="h-0.5 w-10 bg-line-strong data-active:bg-accent"
            />
          ))}
        </div>
        <ol className="flex flex-col gap-20 md:gap-28 [[data-pinned]_&]:grid [[data-pinned]_&]:gap-0">
          {featuredProjects.map((project, i) => (
            <FeaturedPanel key={project.slug} project={project} index={i} />
          ))}
        </ol>
      </Container>
    </section>
  );
}

function FeaturedPanel({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  return (
    <li
      data-panel
      id={`featured-${project.slug}`}
      className="grid scroll-mt-24 items-center gap-8 lg:grid-cols-12 lg:gap-12 [[data-pinned]_&]:[grid-area:1/1]"
    >
      <ProjectCover
        project={project}
        sizes="(min-width: 1024px) 58vw, 100vw"
        preload={index === 0}
        morph
        className="lg:col-span-7"
      />
      <div className="flex flex-col gap-4 lg:col-span-5">
        <p className="caption text-accent">{projectCaption(project)}</p>
        <h3 className="font-display text-title font-bold">
          {project.title}
          {project.aka ? (
            <span className="ml-3 align-middle font-mono text-sm font-normal tracking-normal text-faint">
              aka {project.aka}
            </span>
          ) : null}
        </h3>
        <p className="text-muted">{project.summary}</p>
        <StackTags project={project} />
        <ProjectLinks project={project} />
      </div>
    </li>
  );
}
