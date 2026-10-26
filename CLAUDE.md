@AGENTS.md

# Amaro Alonzo — portfolio

The source of truth for this project is the build plan:

@docs/PORTFOLIO_BUILD_PLAN.md

## Working rules

- Build phase by phase (plan → "Build phases"). Finish a phase's done criteria, then stop and show the result before starting the next.
- Ask before adding anything not in the plan.
- Never invent project facts. Project content comes only from the plan's Projects table, each project's repo README, and the resume. Leave "My role" as a visible TODO on team projects.
- Server components by default; `"use client"` only on files that use hooks, Motion, GSAP or R3F, kept at the leaves.
- `three`, `@react-three/fiber` and `@react-three/drei` are imported only inside `components/three/`, loaded with `next/dynamic` (`ssr: false`).
- Register GSAP plugins once in `lib/gsap.ts`; create animations inside `useGSAP()`.
- Animate only `transform` and `opacity`; every animation has a `prefers-reduced-motion` fallback; content is visible without JavaScript.
- Secrets (e.g. the Resend key) live only in server code and Vercel env vars, never `NEXT_PUBLIC_`.
- The repo is public: no phone number or resume PDFs until the plan's open questions are answered.
- No `any`. `three` stays pinned to 0.186.x to match the threejs skills.

## Before calling work done

```bash
npm run lint
npm run typecheck
npm run format:check   # npm run format to fix
npm run build
```

CI (`.github/workflows/ci.yml`) runs the same four on every push and PR. Deploys go through Vercel's GitHub integration (repo: EsBazza/j1-portfolio).

## Skills

Project skills live in `.claude/skills/` (installed with `npx skills add`; see `skills-lock.json`): the `threejs-*` set and `vercel-react-best-practices`, `vercel-react-view-transitions`, `vercel-composition-patterns`, `web-design-guidelines`, `deploy-to-vercel`. `frontend-design` and `webapp-testing` come from the `anthropics/skills` plugin marketplace.
