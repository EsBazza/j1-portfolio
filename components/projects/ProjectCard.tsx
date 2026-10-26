import Link from "next/link";
import { projectCaption, tagLabels } from "@/content/projects";
import type { Project } from "@/content/schema";
import { ProjectCover } from "./ProjectCover";

/** Grid card on /projects; the whole card links to the case study. */
export function ProjectCard({
  project,
  preload = false,
}: {
  project: Project;
  preload?: boolean;
}) {
  return (
    <article
      data-spotlight
      className="group relative flex h-full flex-col gap-5 overflow-hidden rounded-xl border border-line bg-surface p-3 hover:border-line-strong"
    >
      <ProjectCover
        project={project}
        sizes="(min-width: 1280px) 400px, (min-width: 768px) 50vw, 100vw"
        preload={preload}
        morph
        className="rounded-lg"
      />
      <div className="flex flex-1 flex-col gap-2.5 px-3 pb-3">
        <p className="caption text-accent">{projectCaption(project)}</p>
        <h2 className="font-display text-2xl font-bold tracking-tight">
          <Link
            href={`/projects/${project.slug}`}
            className="after:absolute after:inset-0"
          >
            {project.title}
          </Link>
        </h2>
        <p className="text-muted">{project.tagline}</p>
        <p className="mt-auto pt-2 caption text-faint">
          {project.tags
            .filter((t) => t !== "winner")
            .map((t) => tagLabels[t])
            .join(" · ")}
        </p>
      </div>
    </article>
  );
}
