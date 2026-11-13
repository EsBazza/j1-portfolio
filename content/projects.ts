import { z } from "zod";
import { photos } from "./photos";
import { projectSchema, type Project, type ProjectTag } from "./schema";

// Sources: the build plan's Projects table, the resume, and each repo's README.
// Nothing here goes beyond those. `role` stays empty until Juno fills it in.
// logMonth orders the build log: each repository's creation month from the
// GitHub API (read 2026-11-13), or for UACAP the month of its defense.
export const projects: Project[] = z
  .array(projectSchema)
  .parse([
    {
      slug: "proctor-ai",
      logMonth: "2026-10",
      photos: [
        photos.raiteHackathon,
        photos.raiteTrophy,
        photos.raiteWork,
        photos.raiteTeamWork,
        photos.raiteChampionStage,
      ],
      title: "Proctor.AI",
      aka: "PatunAI",
      tagline:
        "AI exam platform where every student gets a different but equivalent exam.",
      summary:
        "An AI exam platform where every student gets a different but equivalent exam, built from the teacher's notes. AI vision reviews webcam clips of suspected cheating, a second strike locks the exam, and exams post to Google Classroom.",
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
      logMonth: "2026-10",
      photos: [photos.canYouHackIt],
      title: "MapaTunAI",
      tagline:
        "Mapping what's real: exposing ghost projects across the Philippines.",
      summary:
        "A civic transparency map that checks every public works project against government records, OTP-verified citizen reports and satellite imagery. An AI audit flags irregularities across more than 240,000 contracts in 18 regions, served by a 26-endpoint API.",
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
        "ESRI Wayback",
        "Google Street View",
      ],
      tags: ["ai", "fullstack", "winner"],
      featured: true,
      order: 2,
      team: true,
      repo: "https://github.com/EsBazza/MapaTunAI",
      live: "https://mapatunai.vercel.app",
      cover: {
        src: "/projects/mapatunai/cover.webp",
        alt: "MapaTunAI landing page: Mapping What's Real — Exposing Ghost Projects Across the Philippines",
        width: 1440,
        height: 900,
      },
      screenshots: [
        {
          src: "/projects/mapatunai/map.webp",
          alt: "The national map: clustered public works projects across the Philippines on satellite imagery, with region filters and search",
          width: 1440,
          height: 900,
        },
        {
          src: "/projects/mapatunai/contractors.webp",
          alt: "The contractor accountability registry: contractors ranked by award value, with completion rates and overdue flags",
          width: 1440,
          height: 900,
        },
      ],
      year: 2026,
    },
    {
      slug: "heritech",
      logMonth: "2026-08",
      title: "HeriTech",
      tagline: "Festival waste, traced into heritage craft.",
      summary:
        "A circular marketplace that routes festival leftovers to local artisans. Each finished craft gets a QR-verifiable Impact Pass in a digital wallet, and AI classifies materials from a photo.",
      awards: [
        {
          title: "1st Runner-Up, Planet Protectors Challenge",
          event: "EDUtech Asia 2026, Singapore",
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
          alt: "Product page with a before and after slider of the collected material and the finished piece, a preview of its Verified Impact Pass, and how much goes to the maker",
          width: 1440,
          height: 1060,
        },
        {
          src: "/projects/heritech/verify.webp",
          alt: "Public record of an Impact Pass: the collected material beside the finished piece, the pass code, and the amounts paid to the maker and the local government",
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
      photos: [
        // Lead photo, then ordered so the masonry columns end level.
        photos.edutechCeremony,
        photos.edutechStage,
        photos.edutechTrophy,
        photos.edutechSign,
        photos.edutechSpeakers,
        photos.edutechBooth,
        photos.edutechMarinaBay,
        photos.edutechBoothMentor,
      ],
      ogPhoto: "/og/heritech.jpg",
      year: 2026,
    },
    {
      slug: "evaluation",
      logMonth: "2026-07",
      title: "evalUAtion",
      tagline:
        "Anonymous, encrypted faculty evaluations for the University of the Assumption.",
      summary:
        "A university evaluation portal with UA sign-in and four access tiers. Responses are encrypted and anonymous, admin actions go to an encrypted audit log, and AI turns written feedback into summaries.",
      stack: ["Next.js", "Prisma", "PostgreSQL", "NextAuth", "Gemini"],
      tags: ["ai", "fullstack"],
      featured: true,
      order: 4,
      team: false,
      repo: "https://github.com/EsBazza/evalUAtion",
      live: "https://eval-ua-te.vercel.app",
      cover: {
        src: "/projects/evaluation/cover.webp",
        alt: "evalUAte sign-in page: University of the Assumption branding and Sign in with Google",
        width: 1440,
        height: 900,
      },
      year: 2026,
    },
    {
      slug: "raite-registration",
      logMonth: "2026-06",
      photos: [photos.raiteRegistration],
      title: "RAITE 2026 Registration Platform",
      tagline: "Registration site for PSITE Region III's RAITE 2026.",
      summary:
        "A registration platform for RAITE 2026's 12 competitions: coaches register teams through a four-step flow or a bulk CSV upload, track approvals, and submit entries of up to 1.2 GB.",
      stack: ["Next.js", "Supabase", "Prisma", "Clerk", "Upstash Redis"],
      tags: ["fullstack"],
      featured: false,
      order: 5,
      team: true,
      repo: "https://github.com/AaronPublic/Raite_Website",
      // Screenshot from Juno, 2026-11-10.
      cover: {
        src: "/projects/raite-registration/cover.webp",
        alt: "RAITE 2026 registration home page: the CTRL + NEXT theme and an event countdown over a photo of participants, with Get Started, General Guidelines and Event Programme buttons",
        width: 1280,
        height: 653,
      },
      year: 2026,
    },
    {
      slug: "uacap",
      // Juno, 2026-11-13: the capstone and its paper were defended on 10 Nov 2026.
      logMonth: "2026-11",
      context: "Capstone defended 10 November 2026",
      year: 2026,
      title: "UACAP",
      tagline: "Unified Access to Clinic Administration Portal.",
      summary:
        "Capstone project: a PhilHealth-integrated clinic EMR (electronic medical record) system.",
      stack: [],
      tags: ["fullstack"],
      featured: false,
      order: 6,
      team: true,
      photos: [photos.uacapDefense],
      // Screenshot from Juno, 2026-11-10.
      cover: {
        src: "/projects/uacap/cover.webp",
        alt: "UACAP sign-in page for the University of the Assumption Medical & Dental Clinic: a Register, Screen, Consult, Report workflow beside the clinic staff sign-in form",
        width: 1721,
        height: 1010,
      },
    },
    {
      slug: "j1-movies",
      logMonth: "2026-08",
      title: "J1 Movies",
      tagline: "Movie and TV discovery site powered by TMDB.",
      summary:
        "A dark cinema-style discovery site for movies, series, anime and K-drama, with filters and instant search. Your watchlist, watch history and resume points stay in your browser with a JSON backup. Titles play through third-party embedded streams, so no video is stored or hosted.",
      stack: ["Next.js", "Tailwind CSS", "TMDB API", "ArtPlayer.js", "hls.js"],
      tags: ["frontend"],
      featured: false,
      order: 7,
      team: false,
      repo: "https://github.com/EsBazza/j1-movies",
      live: "https://j1-movies.vercel.app",
      cover: {
        src: "/projects/j1-movies/cover.webp",
        alt: "J1 Movies home page: a featured movie hero with its rating, genres and synopsis, Play and watchlist buttons, and a strip of upcoming trailers",
        width: 1440,
        height: 900,
      },
      year: 2026,
    },
    {
      slug: "pixelforge-ai",
      logMonth: "2026-05",
      title: "PixelForge AI",
      tagline: "Browser photo editor with AI tools.",
      summary:
        "A browser photo editor where background removal and palette extraction run on your device: one-click background removal, five-color palettes you can copy, and undo, redo and clean exports. The command box and image suggestions send your photo to Google's Gemini API.",
      context: "Built for the IBM Bob Hackathon",
      stack: ["React", "TypeScript", "Vite", "Fabric.js", "Gemini API"],
      tags: ["ai", "frontend"],
      featured: false,
      order: 8,
      team: false,
      repo: "https://github.com/EsBazza/PixelForge",
      live: "https://pixel-forge-flax.vercel.app",
      cover: {
        src: "/projects/pixelforge-ai/cover.webp",
        alt: "PixelForge AI editor: tool panel with Smart Suggestions such as Remove Background and Auto Enhance, with a photo loaded on the canvas",
        width: 1440,
        height: 900,
      },
      year: 2026,
    },
    {
      slug: "reel-to-you",
      logMonth: "2026-06",
      title: "Reel To You",
      tagline: "A movie-quote time capsule.",
      summary:
        "A time capsule of movie quotes, addressed to someone and public forever. Pick a film and a line, add a dedication and a name; anyone can search a name to read what was left for it. No accounts, with moderation built in from day one.",
      stack: ["Next.js", "Supabase", "TMDB", "Upstash Redis"],
      tags: ["fullstack"],
      featured: false,
      order: 9,
      team: false,
      repo: "https://github.com/EsBazza/reeltoyou",
      live: "https://reeltoyou.vercel.app",
      cover: {
        src: "/projects/reel-to-you/cover.webp",
        alt: 'Reel To You home page: "A time capsule of movie quotes. Addressed to someone. Public forever." with Send a moment and Find a name',
        width: 1440,
        height: 900,
      },
      year: 2026,
    },
  ])
  .toSorted((a, b) => a.order - b.order);

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
