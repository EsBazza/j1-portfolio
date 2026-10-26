import Link from "next/link";
import type { Project } from "@/content/schema";
import { ArrowRight, ArrowUpRight } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

const linkClass =
  "inline-flex min-h-11 items-center gap-1.5 underline decoration-line-strong underline-offset-4 hover:decoration-fg";

/** Case study, live demo and repository links for a project. */
export function ProjectLinks({
  project,
  caseStudy = true,
  className,
}: {
  project: Project;
  caseStudy?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap gap-x-6 gap-y-1", className)}>
      {caseStudy ? (
        <Link
          href={`/projects/${project.slug}`}
          className={cn(linkClass, "font-semibold text-fg")}
        >
          Read the case study
          <span className="sr-only">: {project.title}</span>
          <ArrowRight />
        </Link>
      ) : null}
      {project.live ? (
        <a
          href={project.live}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(linkClass, "text-muted hover:text-fg")}
        >
          Live demo<span className="sr-only"> of {project.title}</span>
          <ArrowUpRight />
        </a>
      ) : null}
      {project.repo ? (
        <a
          href={project.repo}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(linkClass, "text-muted hover:text-fg")}
        >
          Repository<span className="sr-only"> for {project.title}</span>
          <ArrowUpRight />
        </a>
      ) : null}
    </div>
  );
}
