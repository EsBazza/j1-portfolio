/** Absolute site URL for metadata, sitemap and Open Graph images. */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

/** Home page section ids, in page order; the header links to these. */
export const sections = [
  { id: "projects", label: "Projects" },
  { id: "hackathons", label: "Hackathons" },
  { id: "skills", label: "Skills" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
] as const;

export const builtWith = [
  "Next.js",
  "Tailwind CSS",
  "Motion",
  "GSAP",
  "Three.js",
] as const;
