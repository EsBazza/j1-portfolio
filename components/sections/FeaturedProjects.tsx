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
      <Container className="py-16 md:py-24">
        <ol className="flex flex-col gap-20 md:gap-28">
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
      className="grid scroll-mt-24 items-center gap-8 lg:grid-cols-12 lg:gap-12"
    >
      <ProjectCover
        project={project}
        sizes="(min-width: 1024px) 58vw, 100vw"
        preload={index === 0}
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
