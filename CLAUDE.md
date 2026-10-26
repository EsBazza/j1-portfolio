@AGENTS.md

# Juno Alonzo — portfolio

Names (from `content/profile.ts`): the header and footer show the full name **Amaro Juno D. Alonzo**; the hero title is his brand **J1 Dev**; the short name in page titles and OG images is **Juno Alonzo**. Never "Amaro Alonzo".

The source of truth for this project is the build plan:

@docs/PORTFOLIO_BUILD_PLAN.md

## Corrections from Juno (override the plan)

- **RAITE 2026:** Juno won the RAITE 2026 **Hackathon** (Proctor.AI, plus Best Technical Implementation and Best User Experience). "Overall Champion" was the University of the Assumption's title, not his. Never call him Overall Champion.
- **RAITE 2024:** joined, no award. **RAITE 2025:** did not join.
- **Proctor.AI live site:** https://proctor-ai-sigma.vercel.app (not patun-ai.vercel.app).
- **Live sites** for the other projects came from Juno. psitecl.org (RAITE registration) is deliberately not linked: it served a TLS certificate for an unrelated domain on 2026-10-27.
- Event photos in `public/events/` are Juno's; captions describe what is visible, without naming people.

## Working rules

- Build phase by phase (plan → "Build phases"). Finish a phase's done criteria, then stop and show the result before starting the next.
- Ask before adding anything not in the plan.
- Never invent project facts. Project content comes only from the plan's Projects table, each project's repo (README, docs, source), its live site, the resumes, and what Juno says. Leave "My role" as a visible TODO until Juno fills it in.
- Server components by default; `"use client"` only on files that use hooks, Motion, GSAP or R3F, kept at the leaves.
- `three`, `@react-three/fiber` and `@react-three/drei` are imported only inside `components/three/`, loaded with `next/dynamic` (`ssr: false`).
- Motion architecture (keeps GSAP, Lenis and three.js out of first load):
  - Pages mark elements with data attributes (`data-reveal`, `data-reveal-group`, `data-split`, `data-split-chars`, `data-scramble`, `data-countup`, `data-featured-pin`, `data-magnetic`, `data-tilt`, `data-spotlight`, `data-timeline`).
  - `components/motion/PageMotion.tsx` (rendered from `app/template.tsx`, so it runs after hydration) starts the reveal observer and, on the first interaction, imports `components/motion/engine.ts`, which builds every GSAP effect inside `gsap.matchMedia()` and reverts them on route change.
  - `MotionLayer` (root layout) handles the header, spotlight and Lenis.
  - Register GSAP plugins once in `lib/gsap.ts`.
- Animate only `transform` and `opacity`; every animation has a `prefers-reduced-motion` fallback; content is visible without JavaScript.
- Secrets (e.g. the Resend key) live only in server code and Vercel env vars, never `NEXT_PUBLIC_`.
- `public/resume/*.pdf` are Juno's own resume files, published as-is at his request (they still say "Overall Champion" and show his phone number; he knows). Don't edit or remove them without asking. The site itself shows no phone number.
- No `any`. `three` stays pinned to 0.186.x to match the threejs skills.

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
