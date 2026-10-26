import { getProject, projectCaption, projects } from "@/content/projects";
import { ogCard, ogSize } from "@/lib/og";

export const alt = "Project case study";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  return ogCard({
    caption: project ? projectCaption(project) : "Project",
    title: project?.title ?? "Project",
    subtitle: project?.tagline ?? "",
  });
}
