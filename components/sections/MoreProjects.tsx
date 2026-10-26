import Link from "next/link";
import { moreProjects, projects, tagLabels } from "@/content/projects";
import { Container } from "@/components/ui/Container";
import { ArrowRight } from "@/components/ui/Icons";

export function MoreProjects() {
  return (
    <section aria-labelledby="more-title" className="border-b border-line">
      <Container className="flex flex-col gap-8 py-20 md:py-28">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h2
            data-split
            id="more-title"
            className="font-display text-3xl font-bold tracking-tight"
          >
            More projects
          </h2>
          <Link
            href="/projects"
            className="inline-flex min-h-11 items-center gap-1.5 caption text-muted hover:text-fg"
          >
            All {projects.length} projects <ArrowRight />
          </Link>
        </div>
        <ul
          data-reveal-group
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {moreProjects.map((project) => (
            <li
              key={project.slug}
              data-spotlight
              className="group relative flex flex-col gap-3 overflow-hidden rounded-lg border border-line bg-surface p-6 hover:border-line-strong"
            >
              <p className="caption text-faint">
                {String(project.order).padStart(2, "0")} ·{" "}
                {project.tags.map((t) => tagLabels[t]).join(" · ")}
              </p>
              <h3 className="font-display text-xl font-semibold">
                <Link
                  href={`/projects/${project.slug}`}
                  className="after:absolute after:inset-0"
                >
                  {project.title}
                </Link>
              </h3>
              <p className="text-[0.9375rem] text-muted">{project.tagline}</p>
              <ArrowRight className="mt-auto text-faint transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
