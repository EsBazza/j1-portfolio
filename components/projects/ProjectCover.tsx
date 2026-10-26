import Image from "next/image";
import { ViewTransition } from "react";
import type { Project } from "@/content/schema";
import { BrowserFrame } from "@/components/ui/BrowserFrame";

function frameUrl(project: Project) {
  if (project.live) return new URL(project.live).host;
  if (project.repo) return new URL(project.repo).pathname.slice(1);
  return project.title.toLowerCase();
}

/**
 * A project's cover in browser chrome: the real screenshot when there is one,
 * otherwise a typographic card (never a stock image). With `morph`, the cover
 * is a shared view-transition element that morphs between the project lists
 * and the case study.
 */
export function ProjectCover({
  project,
  sizes,
  preload = false,
  morph = false,
  className,
}: {
  project: Project;
  sizes: string;
  preload?: boolean;
  morph?: boolean;
  className?: string;
}) {
  const frame = (
    <BrowserFrame url={frameUrl(project)} className={className}>
      {project.cover ? (
        <Image
          src={project.cover.src}
          alt={project.cover.alt}
          width={project.cover.width}
          height={project.cover.height}
          sizes={sizes}
          preload={preload}
          className="aspect-[16/10] w-full object-cover object-top"
        />
      ) : (
        <div className="relative flex aspect-[16/10] flex-col justify-between overflow-hidden bg-grid p-5 sm:p-8">
          <span
            aria-hidden="true"
            className="absolute -right-4 -bottom-10 font-display text-[10rem] leading-none font-bold text-line select-none sm:text-[14rem]"
          >
            {String(project.order).padStart(2, "0")}
          </span>
          <span className="relative caption text-faint">
            Screenshot coming soon
          </span>
          <span className="relative font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {project.title}
          </span>
        </div>
      )}
    </BrowserFrame>
  );

  if (!morph) return frame;
  return (
    <ViewTransition
      name={`project-cover-${project.slug}`}
      share="morph"
      default="none"
    >
      {frame}
    </ViewTransition>
  );
}
