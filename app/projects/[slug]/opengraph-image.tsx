import { readFile } from "node:fs/promises";
import { join } from "node:path";
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
  const award = project?.awards[0];

  let photo: string | undefined;
  if (project?.ogPhoto) {
    const bytes = await readFile(
      join(process.cwd(), "public", project.ogPhoto),
    );
    const type = project.ogPhoto.endsWith(".png") ? "png" : "jpeg";
    photo = `data:image/${type};base64,${bytes.toString("base64")}`;
  }

  return ogCard({
    caption: project
      ? photo && award
        ? `Project ${String(project.order).padStart(2, "0")}`
        : projectCaption(project)
      : "Project",
    title: project?.title ?? "Project",
    subtitle: project?.tagline ?? "",
    // With a photo, the award moves out of the caption into its own badge.
    badge: photo && award ? `${award.title} · ${award.event}` : undefined,
    photo,
  });
}
