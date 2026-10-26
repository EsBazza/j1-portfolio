import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date(process.env.BUILD_DATE ?? 0);
  return [
    { url: siteUrl, lastModified: now, priority: 1 },
    { url: `${siteUrl}/projects`, lastModified: now, priority: 0.9 },
    ...projects.map((p) => ({
      url: `${siteUrl}/projects/${p.slug}`,
      lastModified: now,
      priority: p.featured ? 0.8 : 0.6,
    })),
    { url: `${siteUrl}/resume`, lastModified: now, priority: 0.7 },
  ];
}
