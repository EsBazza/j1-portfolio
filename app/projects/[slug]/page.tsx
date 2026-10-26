import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, projectCaption, projects } from "@/content/projects";
import { Container } from "@/components/ui/Container";
import { ArrowLeft, ArrowRight } from "@/components/ui/Icons";
import { Tag } from "@/components/ui/Tag";
import { BrowserFrame } from "@/components/ui/BrowserFrame";
import { ProjectCover } from "@/components/projects/ProjectCover";
import { ProjectLinks } from "@/components/projects/ProjectLinks";
import { StackTags } from "@/components/projects/StackTags";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: `${project.tagline} ${project.summary}`,
    alternates: { canonical: `/projects/${slug}` },
    openGraph: { title: project.title, description: project.tagline },
  };
}

export default async function CaseStudyPage({
  params,
}: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const { default: CaseStudy } = await import(`@/content/projects/${slug}.mdx`);

  const index = projects.indexOf(project);
  const prev = projects[index - 1];
  const next = projects[index + 1];

  return (
    <article className="pb-20 md:pb-32">
      <Container className="flex flex-col gap-8 pt-10 md:pt-16">
        <Link
          href="/projects"
          className="inline-flex min-h-11 w-fit items-center gap-2 caption text-muted hover:text-fg"
        >
          <ArrowLeft /> All projects
        </Link>
        <header className="flex flex-col gap-5">
          <p className="caption text-accent">{projectCaption(project)}</p>
          <h1 className="font-display text-hero font-bold text-balance">
            {project.title}
          </h1>
          {project.aka ? (
            <p className="caption text-faint">Also known as {project.aka}</p>
          ) : null}
          <p className="max-w-[48ch] font-display text-xl font-medium md:text-2xl">
            {project.tagline}
          </p>
          <ProjectLinks project={project} caseStudy={false} />
        </header>
        <ProjectCover
          project={project}
          sizes="(min-width: 1280px) 1120px, 100vw"
          preload
        />
      </Container>

      <Container className="mt-16 grid gap-14 md:mt-24 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <CaseStudy />

          <section aria-labelledby="role-title">
            <h2
              id="role-title"
              className="mt-14 mb-5 font-display text-title font-bold"
            >
              My role
            </h2>
            {project.role ? (
              <p className="text-muted">{project.role}</p>
            ) : (
              <div className="rounded-lg border border-dashed border-accent p-5">
                <p className="caption text-accent">To do</p>
                <p className="mt-2 text-muted">
                  Juno will describe his part in this{" "}
                  {project.team ? "team " : ""}project here.
                </p>
              </div>
            )}
          </section>

          {project.awards.length > 0 || project.context ? (
            <section aria-labelledby="results-title">
              <h2
                id="results-title"
                className="mt-14 mb-5 font-display text-title font-bold"
              >
                Results
              </h2>
              <ul className="flex flex-col gap-3">
                {project.awards.map((award) => (
                  <li
                    key={award.title}
                    className="flex flex-wrap items-baseline gap-x-3 gap-y-1"
                  >
                    <Tag tone="award">{award.title}</Tag>
                    <span className="text-muted">{award.event}</span>
                  </li>
                ))}
                {project.context ? (
                  <li className="text-muted">{project.context}</li>
                ) : null}
              </ul>
            </section>
          ) : null}
        </div>

        <aside
          aria-label="Project facts"
          className="flex flex-col gap-8 self-start lg:sticky lg:top-24 lg:col-span-4"
        >
          <div className="flex flex-col gap-3">
            <h2 className="caption text-faint">Stack</h2>
            <StackTags project={project} />
          </div>
          <dl className="grid grid-cols-2 gap-4 border-t border-line pt-6">
            <div>
              <dt className="caption text-faint">Year</dt>
              <dd className="mt-1">{project.year ?? "To confirm"}</dd>
            </div>
            {project.team ? (
              <div>
                <dt className="caption text-faint">Type</dt>
                <dd className="mt-1">Team project</dd>
              </div>
            ) : null}
          </dl>
          <div className="flex flex-col gap-2 border-t border-line pt-6">
            <h2 className="caption text-faint">Links</h2>
            {project.live || project.repo ? (
              <ProjectLinks
                project={project}
                caseStudy={false}
                className="flex-col"
              />
            ) : (
              <p className="text-muted">No public links yet.</p>
            )}
          </div>
        </aside>
      </Container>

      {project.screenshots.length > 0 ? (
        <Container className="mt-20 flex flex-col gap-8">
          <h2 className="font-display text-title font-bold">Screenshots</h2>
          <ul className="grid gap-6 md:grid-cols-2">
            {project.screenshots.map((shot) => (
              <li key={shot.src}>
                <figure className="flex flex-col gap-3">
                  <BrowserFrame>
                    <Image
                      src={shot.src}
                      alt={shot.alt}
                      width={shot.width}
                      height={shot.height}
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="h-auto w-full"
                    />
                  </BrowserFrame>
                  <figcaption className="text-sm text-muted">
                    {shot.alt}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </Container>
      ) : null}

      <Container className="mt-24">
        <nav
          aria-label="More projects"
          className="grid gap-4 border-t border-line pt-8 sm:grid-cols-2"
        >
          {prev ? (
            <Link
              href={`/projects/${prev.slug}`}
              className="group flex min-h-11 flex-col gap-1"
            >
              <span className="inline-flex items-center gap-2 caption text-faint">
                <ArrowLeft /> Previous
              </span>
              <span className="font-display text-xl font-semibold group-hover:underline">
                {prev.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/projects/${next.slug}`}
              className="group flex min-h-11 flex-col gap-1 sm:items-end sm:text-right"
            >
              <span className="inline-flex items-center gap-2 caption text-faint">
                Next <ArrowRight />
              </span>
              <span className="font-display text-xl font-semibold group-hover:underline">
                {next.title}
              </span>
            </Link>
          ) : null}
        </nav>
      </Container>
    </article>
  );
}
