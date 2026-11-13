@AGENTS.md

# Juno Alonzo — portfolio

Names (from `content/profile.ts`): the header and footer show the full name **Amaro Juno D. Alonzo**; the hero title is his brand **J1 Dev**; the short name in page titles and OG images is **Juno Alonzo**. Never "Amaro Alonzo".

The source of truth for this project is the build plan:

@docs/PORTFOLIO_BUILD_PLAN.md

## Corrections from Juno (override the plan)

- **RAITE 2026:** Juno won the RAITE 2026 **Hackathon** (Proctor.AI, plus Best Technical Implementation and Best User Experience). "Overall Champion" was the University of the Assumption's title, not his. Never call him Overall Champion.
- **EDUtech Asia 2026 (Singapore):** HeriTech was **1st Runner-Up** in the Planet Protectors Challenge, top 2 of 285 teams (Juno's LinkedIn post). Not "Top 8 Finalist" as the plan says, and not 1st place. Spell it "EDUtech Asia" (the event's own spelling), as Juno chose.
- **RAITE 2024:** joined, no award. **RAITE 2025:** did not join.
- **Proctor.AI live site:** https://proctor-ai-sigma.vercel.app (not patun-ai.vercel.app).
- **Live sites** for the other projects came from Juno. psitecl.org (RAITE registration) is deliberately not linked: it served a TLS certificate for an unrelated domain on 2026-10-27.
- Event photos in `public/events/` are Juno's; captions describe what is visible, without naming people.

## Working rules

- Build phase by phase (plan → "Build phases"). Finish a phase's done criteria, then stop and show the result before starting the next.
- Ask before adding anything not in the plan.
- Never invent project facts. Project content comes only from the plan's Projects table, each project's source code and live site, the resumes, and what Juno says. **Don't use the repos' READMEs:** Juno said on 2026-11-13 that some are outdated. Existing copy that came from a README needs his confirmation before it is reused or extended. Leave "My role" as a visible TODO until Juno fills it in.
- Server components by default; `"use client"` only on files that use hooks, Motion or GSAP, kept at the leaves.
- The 3D globe hero was removed at Juno's request (2026-11-10), along with three.js, R3F and drei. The hero terminal that replaced it was cut too (2026-11-13); the hero is type plus one live status line (`components/status/HeroStatus.tsx`). Don't bring 3D back without asking.
- The redesign plan is `docs/MOTION_PLAN.md` (approved 2026-11-13). The home page is hero, award strip, build log (`components/sections/BuildLog.tsx`), skills, about (with certifications), contact. The header's 30s switch (`components/layout/BriefSwitch.tsx`) sets `html[data-view="brief"]`, which hides everything but the hero, award strip, award rows and contact.
- Hero pets (Juno, 2026-11-13): Byte the dog and Pixel the cat (`components/pets/`, sprites and personalities in `lib/pets.ts`). One sleeps on the D of "J1 Dev." by default, small so it isn't distracting (`PetBed`, plain SVG, no JS needed). Hovering or clicking wakes it; it chases the pointer, naps, does zoomies, fetches (dog) or pounces (cat), and clicking it opens its card, where Stay pins it to its spot on the page, so it scrolls away with the content (Come here releases it). It moves slowly and ignores small mouse moves so it does not distract readers. The dot in "J1 Dev." switches pets; D sends it back to bed. The engine (`pet-engine.ts`) loads only on wake; with reduced motion the pet stays asleep and clicking opens the card. The real cursor stays as is.
- Motion architecture (keeps GSAP and Lenis out of first load):
  - Pages mark elements with data attributes (`data-reveal`, `data-reveal-group`, `data-split`, `data-split-chars`, `data-odometer`, `data-stamps`, `data-log-dot`, `data-spotlight`, `data-timeline`).
  - `components/motion/PageMotion.tsx` (rendered from `app/template.tsx`, so it runs after hydration) starts the reveal observer and, on the first interaction, imports `components/motion/engine.ts`, which builds every GSAP effect inside `gsap.matchMedia()` and reverts them on route change.
  - `MotionLayer` (root layout) handles the header, spotlight and Lenis.
  - Register GSAP plugins once in `lib/gsap.ts`.
- Animate only `transform` and `opacity`; every animation has a `prefers-reduced-motion` fallback; content is visible without JavaScript.
- Secrets (e.g. the Resend key) live only in server code and Vercel env vars, never `NEXT_PUBLIC_`.
- `public/resume/*.pdf` are Juno's own resume files, published as-is at his request (they still say "Overall Champion" and show his phone number; he knows). Don't edit or remove them without asking. The site itself shows no phone number.
- No `any`.

## Design system

Tokens, type, motion and primitives are documented in `docs/DESIGN_SYSTEM.md`; see them rendered at `/styleguide`. Use the tokens (`bg-surface`, `text-muted`, `caption`, `text-display`…), never raw hex in components. The accent is for awards and calls to action only.

## Before calling work done

```bash
npm run lint
npm run typecheck
npm run format:check   # npm run format to fix
npm run build
npm run test:e2e       # Playwright, 375px + 1440px, against the build
```

CI (`.github/workflows/ci.yml`) runs all five on every push and PR. Deploys go through Vercel's GitHub integration (repo: EsBazza/j1-portfolio).

## Skills

Project skills live in `.claude/skills/` (installed with `npx skills add`; see `skills-lock.json`): the `threejs-*` set and `vercel-react-best-practices`, `vercel-react-view-transitions`, `vercel-composition-patterns`, `web-design-guidelines`, `deploy-to-vercel`. `frontend-design` and `webapp-testing` come from the `anthropics/skills` plugin marketplace.
