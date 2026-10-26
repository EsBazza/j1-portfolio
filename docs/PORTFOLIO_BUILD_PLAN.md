# Portfolio Build Plan

Oct 27, 2026 · @Juno Alonzo

A plan for Claude Code to build Amaro Juno D. Alonzo’s developer portfolio: a clean, animated Next.js site that features all nine projects and the hackathon wins.

## How to use this with Claude Code

Install the skills below first, then give Claude Code this whole plan with the kickoff prompt. Claude Code loads a skill automatically when a task matches it, so installing them up front is enough.

**1. Install the skills** (run in the project folder):

```bash
# Three.js r186 + React Three Fiber 9 knowledge (13 skills)
npx skills add cloudai-x/threejs-skills

# Vercel: react-best-practices, web-design-guidelines,
# react-view-transitions, composition-patterns, deploy-to-vercel
npx skills add vercel-labs/agent-skills
```

Then, inside Claude Code, add Anthropic’s skills and install the **example-skills** set, which includes `frontend-design` and `webapp-testing`:

```
/plugin marketplace add anthropics/skills
```

| Skill                                                                                 | Repo                                                                    | Used for                                      |
| ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | --------------------------------------------- |
| threejs-react-three-fiber, threejs-fundamentals, threejs-performance, threejs-shaders | [cloudai-x/threejs-skills](https://github.com/cloudai-x/threejs-skills) | The 3D hero scene, kept fast                  |
| frontend-design                                                                       | [anthropics/skills](https://github.com/anthropics/skills)               | A distinctive look, not a template            |
| webapp-testing                                                                        | [anthropics/skills](https://github.com/anthropics/skills)               | Playwright checks of every page               |
| react-best-practices                                                                  | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) | Server components, bundle size, no waterfalls |
| react-view-transitions                                                                | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) | Page-to-page transitions                      |
| web-design-guidelines                                                                 | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) | Final accessibility and UX audit              |
| deploy-to-vercel                                                                      | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) | Shipping it                                   |

**2. Kickoff prompt** (paste with this plan):

> Build my portfolio by following this plan phase by phase. Use the installed skills: frontend-design for the visual direction, the threejs skills for the 3D hero, react-best-practices and react-view-transitions while coding, and web-design-guidelines plus webapp-testing to audit at the end. Finish each phase’s done criteria before starting the next, show me the result, and ask me before adding anything not in the plan. Never invent project facts; use only the content in the Projects section.

## Goals and tech stack

The site must get a recruiter from landing to the right project in under 10 seconds, feel animated and crafted, and still score 90+ on Lighthouse mobile.

- **Audience:** recruiters and hiring managers for web developer, full-stack and AI developer roles, plus hackathon judges.
- **Main goal:** show the hackathon wins and real, shipped projects first; make the resume and contact one click away.
- **Success:** every project has its own page; the site works with JavaScript off (minus 3D); it looks good on a 375px phone.

| Layer                | Choice                                                                  | Why                                                      |
| -------------------- | ----------------------------------------------------------------------- | -------------------------------------------------------- |
| Framework            | Next.js 16 App Router, React 19, TypeScript strict                      | Same stack as his projects; server components by default |
| Styling              | Tailwind CSS v4 with design tokens in `@theme`                          | Fast, consistent spacing and color                       |
| UI animation         | Motion (`motion/react`)                                                 | Scroll reveals, hover and layout animation               |
| Scroll-linked scenes | GSAP + ScrollTrigger via `@gsap/react`                                  | Pinned, scrubbed sections in Projects                    |
| Smooth scroll        | Lenis, synced to GSAP’s ticker                                          | Smooth but native scrolling                              |
| 3D                   | three r186, React Three Fiber 9, drei 10                                | Matches the threejs-skills versions exactly              |
| Page transitions     | React `<ViewTransition>`                                                | Native, no extra library                                 |
| Content              | Typed TypeScript files validated with Zod; MDX for project case studies | No CMS needed; type errors catch missing fields          |
| Fonts                | `next/font` (self-hosted)                                               | No layout shift, no external requests                    |
| Images               | `next/image`, AVIF/WebP                                                 | Small screenshots, no CLS                                |
| Contact              | Server Action + Resend, Zod validation, honeypot                        | Email without exposing his address to bots               |
| Hosting              | Vercel, with Vercel Analytics and Speed Insights                        | Free tier, preview URL per change                        |

Use whatever versions `create-next-app@latest` installs, except pin `three@0.186` so code matches the skills. No component kits that impose a look (no default shadcn theme); build the small set of UI primitives by hand.

## Site structure

One long, animated home page that tells the story, plus a page per project and a printable resume.

| Route              | Purpose                                                                          |
| ------------------ | -------------------------------------------------------------------------------- |
| `/`                | Home: the sections below, in order                                               |
| `/projects`        | All 9 projects as a filterable grid (All, AI, Full-stack, Hackathon winners)     |
| `/projects/[slug]` | Case study per project: problem, what he built, stack, award, screenshots, links |
| `/resume`          | Web version of the resume + download buttons for both PDFs                       |
| `/not-found`       | Custom 404 with a small animated scene                                           |

**Home page sections, top to bottom:**

1. **Hero** — name, “Full-Stack & AI Developer”, one-line pitch, buttons for Projects and Resume, the 3D scene behind it.
2. **Award strip** — RAITE 2026 Overall Champion · EduTech Asia 2026 Top 8 · IBPAP Top 3 · PSC XI Regional Top 20, with numbers counting up once.
3. **Featured projects** — Proctor.AI, MapaTunAI, HeriTech and evalUAtion as large pinned panels that change as you scroll.
4. **More projects** — the other five as compact cards linking to `/projects/[slug]`.
5. **Hackathon timeline** — RAITE 2024 to RAITE 2026, each event with its result.
6. **Skills** — grouped Frontend, Backend, Databases, AI & Cloud; no percentage bars.
7. **About** — short story, education, President’s and Dean’s List, OMISS student assistant, languages.
8. **Certifications** — Cisco, AWS Academy and IT Specialist badges, each linking to its credential where one exists.
9. **Contact** — form, email, LinkedIn, GitHub, and a resume download.

Header: sticky, shrinks on scroll, links jump to sections and show the active one. Footer: socials, “built with” line, last-updated date.

## Projects

All nine projects go on the site; the first four are featured on the home page. Claude Code reads each repo’s README for case-study detail and screenshots, and must not add claims beyond the repo and this table.

| #   | Project                              | What it is                                                                                                                                                                         | Award                                                                                                                             | Stack                                                                            | Links                                                                                         | Tags                   |
| --- | ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ---------------------- |
| 1   | **Proctor.AI** (PatunAI)             | AI exam platform: every student gets a different but equivalent exam; Gemini Vision rates webcam clips of suspected cheating; two-strike lockout; Google Classroom sync            | RAITE 2026 Overall Champion, Best Technical Implementation, Best User Experience; Philippine Startup Challenge XI Regional Top 20 | Next.js, Prisma, PostgreSQL (Supabase), NextAuth, Gemini, Google Classroom API   | [repo](https://github.com/EsBazza/Proctor.AI) · [live](https://patun-ai.vercel.app)           | AI, Full-stack, Winner |
| 2   | **MapaTunAI**                        | Public infrastructure transparency map of DPWH projects, contractors, citizen reports and satellite history; Gemini audit flags irregularities; 26-endpoint API                    | Top 3, Can You HackIT: The IBPAP Challenge                                                                                        | Next.js, Prisma, PostgreSQL (Supabase), Mapbox GL, Gemini                        | [repo](https://github.com/EsBazza/MapaTunAI)                                                  | AI, Full-stack, Winner |
| 3   | **HeriTech**                         | Circular marketplace: festival waste goes to artisans; each craft gets a QR-verifiable Impact Pass in Google Wallet; Gemini classifies materials from photos                       | Top 8 Finalist, EduTech Asia 2026 (Singapore)                                                                                     | Next.js, Firebase, Gemini, Google Maps, Google Wallet, Cloud Translation, Vitest | [repo](https://github.com/EsBazza/HeriTech-WebApp) · [live](https://heritech-demo.vercel.app) | AI, Full-stack, Winner |
| 4   | **evalUAtion**                       | University of the Assumption faculty evaluation system: UA Google sign-in, role-based access, AES-256-GCM encrypted anonymous responses, Gemini feedback summaries, PDF/CSV export | —                                                                                                                                 | Next.js, Prisma, PostgreSQL, NextAuth, Gemini                                    | [repo](https://github.com/EsBazza/evalUAtion)                                                 | AI, Full-stack         |
| 5   | **RAITE 2026 Registration Platform** | Team-built registration site for PSITE Region III’s RAITE 2026: bulk CSV imports, 1.2 GB uploads, VPS with Nginx, PM2 and Cloudflare                                               | —                                                                                                                                 | Next.js, Supabase, Prisma, Clerk, Upstash Redis                                  | [repo](https://github.com/AaronPublic/Raite_Website)                                          | Full-stack             |
| 6   | **UACAP** (capstone)                 | Unified Access to Clinic Administration Portal, a PhilHealth-integrated clinic EMR                                                                                                 | —                                                                                                                                 | To confirm                                                                       | No public repo yet                                                                            | Full-stack             |
| 7   | **J1 Movies**                        | Movie and TV discovery site with TMDB data, search, filters, watchlist and JSON backup; plays third-party embedded streams, so no video is stored or hosted                        | —                                                                                                                                 | Next.js, Tailwind CSS, TMDB API                                                  | [repo](https://github.com/EsBazza/j1-movies)                                                  | Frontend               |
| 8   | **PixelForge AI**                    | Browser photo editor with AI background removal, smart cropping and palette extraction                                                                                             | Built for the IBM Bob Hackathon                                                                                                   | React, TypeScript, Vite, Fabric.js, TensorFlow.js                                | [repo](https://github.com/EsBazza/PixelForge)                                                 | AI, Frontend           |
| 9   | **Reel To You**                      | Movie-quote time capsule: send a quote and dedication to a name; anyone can search a name to read messages left for it; no accounts                                                | —                                                                                                                                 | Next.js, Supabase, TMDB, Upstash Redis                                           | [repo](https://github.com/EsBazza/reeltoyou)                                                  | Full-stack             |

Each case study page uses the same outline: **The problem → What I built → How it works → My role → Results/award → Stack → Links**. Leave “My role” as a visible TODO for Amaro to fill in on team projects.

## Design and animation direction

The concept is a **“build log”**: a calm, editorial layout with engineering details (mono labels, grid lines, version tags), so the motion feels purposeful instead of flashy. Run the frontend-design skill on this brief before writing any UI, and let it refine the choices below.

**Look**

- Dark by default with a light theme toggle; colors as tokens in Tailwind `@theme`, e.g. ink background, off-white text, one warm accent used only for awards and calls to action.
- Type: one expressive display face for headings, one clean sans for body, one mono for labels and stack tags, all through `next/font`.
- A faint 12-column grid shows behind sections; project panels carry small mono captions like `PROJECT 01 · RAITE 2026 CHAMPION`.
- Real screenshots of each project, framed in a simple browser chrome; no stock images or emoji.

**3D hero** (use the threejs-react-three-fiber, threejs-shaders and threejs-performance skills)

- A slowly turning sphere of about 2,000 instanced points with a few brighter nodes; lines connect the nodes like a network, and it tilts toward the cursor.
- On scroll it drifts back and fades as the award strip arrives; it never sits behind body text at full strength.
- Loaded with `next/dynamic` and `ssr: false` after the page is interactive, with a static gradient image shown first; it pauses when off screen or the tab is hidden.
- Capped device pixel ratio (max 1.75); swap to the static image on `prefers-reduced-motion`, when WebGL is missing, or when the frame rate drops (drei `PerformanceMonitor`).

**Motion rules**

1. Animate only `transform` and `opacity`; durations 200–600 ms; one shared easing curve; stagger lists 40–60 ms.
2. Headings reveal by line with GSAP SplitText; sections fade and rise once as they enter, never again on scroll back.
3. Featured projects: GSAP ScrollTrigger pins the section and scrubs between the four panels; on phones it becomes a normal vertical stack.
4. Micro-interactions: magnetic primary buttons, a soft cursor spotlight on project cards, award numbers count up once.
5. Route changes use `<ViewTransition>`; the project card image morphs into the case-study header.
6. `prefers-reduced-motion`: Motion’s `MotionConfig reducedMotion="user"`, `gsap.matchMedia()`, Lenis off, no pinning, no 3D; everything still readable.
7. Content is visible without JavaScript: hidden-before-reveal styles apply only once a `js` class is on `<html>`.

## Architecture

Pages are server components that read typed content files; only the animated pieces are client components, kept small and at the leaves.

```text
portfolio/
├─ app/
│  ├─ layout.tsx            # fonts, theme, metadata, <MotionConfig>, Lenis provider
│  ├─ page.tsx              # home: composes the sections
│  ├─ projects/page.tsx     # filterable grid (filter state in the URL: ?tag=ai)
│  ├─ projects/[slug]/page.tsx   # generateStaticParams + generateMetadata
│  ├─ projects/[slug]/opengraph-image.tsx
│  ├─ resume/page.tsx
│  ├─ actions/contact.ts    # "use server": Zod + honeypot + rate limit + Resend
│  ├─ sitemap.ts · robots.ts · not-found.tsx · opengraph-image.tsx
├─ components/
│  ├─ sections/             # Hero, AwardStrip, FeaturedProjects, Timeline, Skills, About, Certs, Contact
│  ├─ three/                # HeroScene.tsx (client), PointSphere.tsx, StaticFallback.tsx
│  ├─ motion/               # Reveal, SplitHeading, Magnetic, CountUp (client)
│  └─ ui/                   # Button, Tag, Card, Section, Container
├─ content/
│  ├─ profile.ts            # name, links, summary, education, honors, languages
│  ├─ projects.ts           # the 9 projects (schema below)
│  ├─ projects/*.mdx        # one case study per slug
│  ├─ awards.ts · skills.ts · certifications.ts · experience.ts
│  └─ schema.ts             # Zod schemas; build fails on bad data
├─ lib/                     # gsap.ts (registers plugins once), utils
├─ public/
│  ├─ projects/<slug>/      # screenshots (AVIF/WebP), cover.png
│  └─ resume/               # Amaro_Alonzo_Resume_Classic.pdf, _Modern.pdf
└─ .claude/skills/          # installed skills
```

**Project schema** (`content/schema.ts`): `slug`, `title`, `tagline`, `summary`, `award?` (`title`, `event`, `year`), `stack[]`, `tags[]` (`ai` | `fullstack` | `frontend` | `winner`), `featured`, `order`, `repo?`, `live?`, `cover`, `screenshots[]`, `role?`, `year`.

**Rules for Claude Code**

- Server components by default; add `"use client"` only to files that use hooks, Motion, GSAP or R3F.
- Register GSAP plugins once in `lib/gsap.ts`; create animations inside `useGSAP()` so they clean up.
- Import three and R3F only inside `components/three/`, loaded dynamically, so they never enter the main bundle.
- Secrets (Resend key) only in server code and Vercel environment variables, never `NEXT_PUBLIC_`.

## Best practices and targets

Every phase is checked against these numbers; a phase isn’t done until they pass on a mid-range phone profile.

| Area                | Target                                                                                                                     | How                                                                          |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Lighthouse (mobile) | Performance ≥ 90, Accessibility 100, Best Practices 100, SEO 100                                                           | Run on the Vercel preview URL                                                |
| Core Web Vitals     | LCP < 2.5 s, INP < 200 ms, CLS < 0.1                                                                                       | Hero text is the LCP element, not the 3D canvas; Speed Insights after launch |
| JavaScript          | First-load JS for `/` under \~180 KB gzipped, before the 3D chunk                                                          | Three.js loads in its own chunk after interaction-ready                      |
| 3D                  | 60 fps on a laptop, never below 30 fps on a phone; under \~80 draw calls                                                   | Instancing, capped pixel ratio, pause off screen                             |
| Images              | Every image sized, AVIF/WebP, lazy below the fold                                                                          | `next/image` with `sizes`                                                    |
| Accessibility       | WCAG 2.2 AA: contrast ≥ 4.5:1, visible focus, keyboard reachable, skip link, landmarks                                     | Canvas is `aria-hidden`; every link and button has an accessible name        |
| Motion              | Full `prefers-reduced-motion` support; nothing flashes more than 3 times a second                                          | Rules in the design section                                                  |
| SEO                 | Unique title and description per page, Open Graph image per project, `sitemap.xml`, `robots.txt`, JSON-LD `Person` on home | Next.js Metadata API                                                         |
| Code quality        | TypeScript strict, ESLint clean, no `any`, Prettier                                                                        | CI runs `lint`, `typecheck`, `build` on every push                           |
| Security            | Contact action validates with Zod, honeypot field, rate limit, no secrets in client code                                   | Server Action only                                                           |

Run `web-design-guidelines` on all UI and `react-best-practices` on all components before each phase is marked done.

## Build phases

Seven phases, each ending in a working, deployed preview. Claude Code should stop and show the result after every phase.

1. **Setup** — `create-next-app` (TypeScript, Tailwind, App Router, ESLint), install Motion, GSAP, `@gsap/react`, Lenis, three@0.186, R3F, drei, Zod; add Prettier, a CI workflow and a `CLAUDE.md` that points to this plan.
   - Done: `lint`, `typecheck` and `build` pass; deployed to a Vercel preview.
2. **Design system** — run frontend-design on the brief; set color, type, spacing and easing tokens; build `ui/` primitives and the light/dark theme.
   - Done: a `/styleguide` dev-only page shows every token and primitive in both themes.
3. **Content** — write `content/*.ts` and the Zod schemas from this plan; pull README details and screenshots from each repo into the MDX case studies.
   - Done: all 9 projects validate; nothing on the site is hard-coded in components.
4. **Static pages** — build every home section, `/projects`, `/projects/[slug]`, `/resume` and 404 with no animation yet; header, footer, metadata, sitemap, OG images.
   - Done: whole site usable with JavaScript off; Lighthouse Accessibility and SEO at 100.
5. **Motion** — add Lenis, reveals, SplitText headings, the pinned featured-projects scroll, micro-interactions and view transitions, all with reduced-motion fallbacks.
   - Done: smooth at 60 fps on a laptop; reduced-motion mode tested and readable.
6. **3D hero** — build the point-sphere scene with the threejs skills; dynamic import, static fallback, pause off screen, `PerformanceMonitor`.
   - Done: LCP and JS budgets still met; fallback shows with WebGL off and with reduced motion.
7. **Contact, audit and launch** — contact Server Action with Resend; run web-design-guidelines and react-best-practices reviews and fix findings; webapp-testing Playwright checks of every route at 375 px and 1440 px; deploy with deploy-to-vercel.
   - Done: every target in the best-practices table passes on production.

## Open questions

Claude Code can start without these, using placeholders, but the site isn’t ready to share until they’re answered.

- [ ] Domain name (e.g. a `.dev` or `.com`), or use the free `vercel.app` address for now?
- [ ] A formal photo for About, or keep the site photo-free?
- [ ] Screenshots for each project; Claude Code can capture them from live demos where they exist (Proctor.AI, HeriTech).
- [ ] Live demo links for MapaTunAI, evalUAtion, RAITE, J1 Movies, PixelForge and Reel To You, if deployed.
- [ ] Your role on each team project (Proctor.AI, MapaTunAI, HeriTech, RAITE, UACAP).
- [ ] UACAP’s stack and whether it can be shown publicly yet.
- [ ] Correct phone number; the one on the resume has 12 digits. Decide whether it appears on the site at all (email and form are safer).
- [ ] Credential links for the certifications that don’t have one yet.

## Sources

- [cloudai-x/threejs-skills](https://github.com/cloudai-x/threejs-skills) — skill list and target versions (three r186, R3F 9.8, drei 10.7)
- [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) — react-best-practices, web-design-guidelines, react-view-transitions, deploy-to-vercel
- [anthropics/skills](https://github.com/anthropics/skills) — frontend-design, webapp-testing
- Project READMEs: [Proctor.AI](https://github.com/EsBazza/Proctor.AI), [MapaTunAI](https://github.com/EsBazza/MapaTunAI), [HeriTech](https://github.com/EsBazza/HeriTech-WebApp), [evalUAtion](https://github.com/EsBazza/evalUAtion), [RAITE](https://github.com/AaronPublic/Raite_Website), [J1 Movies](https://github.com/EsBazza/j1-movies), [PixelForge](https://github.com/EsBazza/PixelForge), [Reel To You](https://github.com/EsBazza/reeltoyou)
