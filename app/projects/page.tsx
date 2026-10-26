import type { Metadata } from "next";
import Link from "next/link";
import { ViewTransition } from "react";
import {
  isProjectFilter,
  projectFilters,
  projects,
  type ProjectFilter,
} from "@/content/projects";
import { Container } from "@/components/ui/Container";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Projects",
  description: `All ${projects.length} projects: AI, full-stack and hackathon-winning web apps built with Next.js, TypeScript, PostgreSQL and Gemini.`,
  alternates: { canonical: "/projects" },
};

// The filter lives in the URL (?tag=ai) and must work without JavaScript, so
// this route renders fully on the server instead of streaming a fallback.
export const instant = false;

export default async function ProjectsPage({
  searchParams,
}: PageProps<"/projects">) {
  const { tag } = await searchParams;
  return (
    <Container className="flex flex-col gap-10 py-16 md:py-24">
      <header className="flex flex-col gap-4">
        <p className="caption text-faint">Index · {projects.length} projects</p>
        <h1 className="font-display text-hero font-bold">Projects</h1>
      </header>
      <ProjectIndex filter={isProjectFilter(tag) ? tag : "all"} />
    </Container>
  );
}

function ProjectIndex({ filter }: { filter: ProjectFilter }) {
  const shown =
    filter === "all"
      ? projects
      : projects.filter((p) => p.tags.includes(filter));

  return (
    <>
      <nav aria-label="Filter projects" className="flex flex-col gap-3">
        <ul className="flex flex-wrap gap-2">
          {projectFilters.map((f) => {
            const active = f.value === filter;
            return (
              <li key={f.value}>
                <Link
                  href={
                    f.value === "all" ? "/projects" : `/projects?tag=${f.value}`
                  }
                  scroll={false}
                  transitionTypes={["filter"]}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "inline-flex min-h-11 items-center rounded-full border px-4 caption",
                    active
                      ? "border-accent bg-accent text-on-accent"
                      : "border-line-strong text-muted hover:border-fg hover:text-fg",
                  )}
                >
                  {f.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <p role="status" className="caption text-faint">
          Showing {shown.length} of {projects.length}
        </p>
      </nav>

      <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {shown.map((project, i) => (
          // List identity: cards fade in/out and glide when the filter changes.
          <ViewTransition
            key={project.slug}
            enter={{ filter: "filter-in", default: "none" }}
            exit={{ filter: "filter-out", default: "none" }}
            update={{ filter: "filter-move", default: "none" }}
            default="none"
          >
            <li>
              <ProjectCard project={project} preload={i < 2} />
            </li>
          </ViewTransition>
        ))}
      </ul>
    </>
  );
}
