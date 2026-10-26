import { z } from "zod";
import { projectSchema, type Project, type ProjectTag } from "./schema";

// Sources: the build plan's Projects table, the resume, and each repo's README.
// Nothing here goes beyond those. `role` stays empty until Juno fills it in.
export const projects: Project[] = z
  .array(projectSchema)
  .parse([
    {
      slug: "proctor-ai",
      title: "Proctor.AI",
      aka: "PatunAI",
      tagline:
        "AI exam platform where every student gets a different but equivalent exam.",
      summary:
        "Gemini builds a different but equivalent exam for every student from the teacher's PDFs and notes. Gemini Vision rates webcam clips of suspected cheating, a second strike locks the exam, and exams post straight to Google Classroom.",
      awards: [
        { title: "Hackathon Winner", event: "RAITE 2026", year: 2026 },
        {
          title: "Best Technical Implementation",
          event: "RAITE 2026",
          year: 2026,
        },
        { title: "Best User Experience", event: "RAITE 2026", year: 2026 },
        {
          title: "Regional Top 20",
          event: "Philippine Startup Challenge XI",
          year: 2026,
        },
      ],
      stack: [
        "Next.js",
        "Prisma",
        "PostgreSQL (Supabase)",
        "NextAuth",
        "Gemini",
        "Google Classroom API",
      ],
      tags: ["ai", "fullstack", "winner"],
      featured: true,
      order: 1,
      team: true,
      repo: "https://github.com/EsBazza/Proctor.AI",
      live: "https://proctor-ai-sigma.vercel.app",
      cover: {
        src: "/projects/proctor-ai/landing.webp",
        alt: 'Proctor.AI landing page: "Smarter Assessments. Stronger Integrity." with a Get Started button',
        width: 1440,
        height: 900,
      },
      year: 2026,
    },
    {
      slug: "mapatunai",
      title: "MapaTunAI",
      tagline: "Public infrastructure transparency map with an AI audit.",
      summary:
        "Maps DPWH projects with contractor records, citizen reports and satellite history, served by a 26-endpoint API. A Gemini audit cross-checks project records, satellite images and citizen reports to flag irregularities.",
      awards: [
        {
          title: "Top 3",
          event: "Can You HackIT: The IBPAP Challenge",
          year: 2026,
        },
      ],
      stack: [
        "Next.js",
        "Prisma",
        "PostgreSQL (Supabase)",
        "Mapbox GL",
        "Gemini",
      ],
      tags: ["ai", "fullstack", "winner"],
      featured: true,
      order: 2,
      team: true,
      repo: "https://github.com/EsBazza/MapaTunAI",
      year: 2026,
    },
    {
      slug: "heritech",
      title: "HeriTech",
      tagline: "Festival waste, traced into heritage craft.",
      summary:
        "A circular marketplace that routes festival leftovers to local artisans and gives each finished craft a QR-verifiable Impact Pass in Google Wallet. Gemini classifies materials from a photo.",
      awards: [
        {
          title: "Top 8 Finalist",
          event: "EduTech Asia 2026, Singapore",
          year: 2026,
        },
      ],
      stack: [
        "Next.js",
        "Firebase",
        "Gemini",
        "Google Maps",
        "Google Wallet",
        "Cloud Translation",
        "Vitest",
      ],
      tags: ["ai", "fullstack", "winner"],
      featured: true,
      order: 3,
      team: true,
      repo: "https://github.com/EsBazza/HeriTech-WebApp",
      live: "https://heritech-demo.vercel.app",
      cover: {
        src: "/projects/heritech/cover.webp",
        alt: "HeriTech home page: leftover strips assemble into a lit lantern above an artisan's workshop",
        width: 1440,
        height: 756,
      },
      screenshots: [
        {
          src: "/projects/heritech/shop.webp",
          alt: "The shop: a grid of crafts, each with its festival, origin and kilograms diverted",
          width: 1440,
          height: 1240,
        },
        {
          src: "/projects/heritech/product.webp",
          alt: "Product page with a before and after slider, the provenance timeline and the 70/25/5 payment split",
          width: 1440,
          height: 1060,
        },
        {
          src: "/projects/heritech/verify.webp",
          alt: "Public record of an Impact Pass with the timeline of where the material came from and the payment split",
          width: 1440,
          height: 1100,
        },
        {
          src: "/projects/heritech/impact.webp",
          alt: "Impact page: kilograms diverted, money paid to artisans and local governments, and a breakdown by festival",
          width: 1440,
          height: 1000,
        },
      ],
      year: 2026,
    },
    {
      slug: "evaluation",
      title: "evalUAtion",
      tagline:
        "Secure faculty evaluation system for the University of the Assumption.",
      summary:
        "University-wide portal with UA Google sign-in and role-based access for admins, departments, faculty and students. Anonymous responses are encrypted with AES-256-GCM, duplicates are blocked with HMAC, Gemini writes feedback summaries, and reports export to PDF and CSV.",
      stack: ["Next.js", "Prisma", "PostgreSQL", "NextAuth", "Gemini"],
      tags: ["ai", "fullstack"],
      featured: true,
      order: 4,
      team: false,
      repo: "https://github.com/EsBazza/evalUAtion",
      year: 2026,
    },
    {
      slug: "raite-registration",
      title: "RAITE 2026 Registration Platform",
      tagline: "Registration site for PSITE Region III's RAITE 2026.",
      summary:
        "Team-built event registration platform with bulk CSV imports and uploads up to 1.2 GB, hosted on a VPS behind Nginx, PM2 and Cloudflare.",
      stack: ["Next.js", "Supabase", "Prisma", "Clerk", "Upstash Redis"],
      tags: ["fullstack"],
      featured: false,
      order: 5,
      team: true,
      repo: "https://github.com/AaronPublic/Raite_Website",
      year: 2026,
    },
    {
      slug: "uacap",
      title: "UACAP",
      tagline: "Unified Access to Clinic Administration Portal.",
      summary:
        "Capstone project: a PhilHealth-integrated clinic EMR (electronic medical record) system.",
      stack: [],
      tags: ["fullstack"],
      featured: false,
      order: 6,
      team: true,
    },
    {
      slug: "j1-movies",
      title: "J1 Movies",
      tagline: "Movie and TV discovery site powered by TMDB.",
      summary:
        "Browse, search and filter movies and TV series with TMDB data, and keep a watchlist with JSON backup and restore. Titles play through third-party embedded streams, so no video is stored or hosted.",
      stack: ["Next.js", "Tailwind CSS", "TMDB API"],
      tags: ["frontend"],
      featured: false,
      order: 7,
      team: false,
      repo: "https://github.com/EsBazza/j1-movies",
      year: 2026,
    },
    {
      slug: "pixelforge-ai",
      title: "PixelForge AI",
      tagline: "Browser photo editor with AI tools.",
      summary:
        "A canvas photo editor with one-click AI background removal, smart crop suggestions and color palette extraction, running in the browser.",
      context: "Built for the IBM Bob Hackathon",
      stack: ["React", "TypeScript", "Vite", "Fabric.js", "TensorFlow.js"],
      tags: ["ai", "frontend"],
      featured: false,
      order: 8,
      team: false,
      repo: "https://github.com/EsBazza/PixelForge",
      year: 2026,
    },
    {
      slug: "reel-to-you",
      title: "Reel To You",
      tagline: "A movie-quote time capsule.",
      summary:
        "Send a movie quote and a dedication to a name. Anyone can search a name to read the messages left for it. No accounts.",
      stack: ["Next.js", "Supabase", "TMDB", "Upstash Redis"],
      tags: ["fullstack"],
      featured: false,
      order: 9,
      team: false,
      repo: "https://github.com/EsBazza/reeltoyou",
      year: 2026,
    },
  ])
  .toSorted((a, b) => a.order - b.order);

export const featuredProjects = projects.filter((p) => p.featured);
export const moreProjects = projects.filter((p) => !p.featured);

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export const tagLabels: Record<ProjectTag, string> = {
  ai: "AI",
  fullstack: "Full-stack",
  frontend: "Frontend",
  winner: "Hackathon winner",
};

/** Filters on /projects, in display order. */
export const projectFilters = [
  { value: "all", label: "All" },
  { value: "ai", label: "AI" },
  { value: "fullstack", label: "Full-stack" },
  { value: "winner", label: "Hackathon winners" },
] as const;

export type ProjectFilter = (typeof projectFilters)[number]["value"];

export function isProjectFilter(value: unknown): value is ProjectFilter {
  return projectFilters.some((f) => f.value === value);
}

/** "PROJECT 01 · HACKATHON WINNER · RAITE 2026"-style caption. */
export function projectCaption(project: Project) {
  const number = `Project ${String(project.order).padStart(2, "0")}`;
  const award = project.awards[0];
  if (award) return `${number} · ${award.title} · ${award.event}`;
  if (project.context) return `${number} · ${project.context}`;
  return number;
}
