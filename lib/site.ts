/** Absolute site URL for metadata, sitemap and Open Graph images. */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

/** Home page section ids, in page order; the header links to these. */
export const sections = [
  { id: "projects", label: "Build log" },
  { id: "skills", label: "Skills" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
] as const;

/** Juno's own resume PDFs in public/resume/. */
export const resumePdfs = [
  { label: "PDF", file: "Amaro_Juno_Alonzo_Main_Resume.pdf" },
] as const;
