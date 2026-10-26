# Design system — "build log"

Phase 2 output. Tokens live in `app/globals.css`; primitives in `components/ui/`; every token and primitive renders in both themes at `/styleguide` (hidden on production deploys).

Visual direction canvas (Claude Design, private to the owner): https://claude.ai/artifact/338HnEbguE4W9bEzbj9qGU

## Sources

- The plan's design brief (`docs/PORTFOLIO_BUILD_PLAN.md` → Design and animation direction).
- ui-ux-pro-max: Portfolio/Personal → Motion-Driven + Swiss minimalism, storytelling landing; triple type stack (display + body + mono); warm ink + amber accent palette family. Its generic `--design-system` output (docs pattern, green accent, no light mode) did not fit the brief and was not used.

## Tokens

| Token         | Dark (default) | Light     | Use                             |
| ------------- | -------------- | --------- | ------------------------------- |
| `bg`          | `#0D0D0B`      | `#F4F2EB` | Page                            |
| `surface`     | `#161614`      | `#FBFAF6` | Cards, panels                   |
| `surface-2`   | `#1E1E1B`      | `#ECE9E0` | Screenshot wells                |
| `fg`          | `#EDEBE4`      | `#141412` | Text (16.3 / 16.5 : 1)          |
| `muted`       | `#A3A097`      | `#5C5951` | Secondary text (7.4 / 6.2 : 1)  |
| `faint`       | `#8A877E`      | `#6B685F` | Captions (5.4 / 5.0 : 1)        |
| `line`        | `#2B2A26`      | `#DEDACF` | Dividers (decorative)           |
| `line-strong` | `#6E6B62`      | `#8F8B80` | Input/button borders (≥ 3 : 1)  |
| `accent`      | `#F2A93B`      | `#A6560A` | Awards and calls to action only |
| `on-accent`   | `#0D0D0B`      | `#FFFFFF` | Text on accent (9.7 / 5.3 : 1)  |

- **Type:** Bricolage Grotesque (display, opsz axis), Geist (body, 16/1.6), JetBrains Mono (`caption` utility: 12px uppercase, +8% tracking). Scale utilities: `text-hero`, `text-display`, `text-title`, `text-stat`, `text-label`.
- **Space:** 4px base (Tailwind default). 12 columns, page margin 16 / 32 / 80px, max width 1280px (`Container`), section rhythm 80px phone / 128px desktop (`Section`).
- **Motion:** one curve, `--ease-out: cubic-bezier(0.22, 1, 0.36, 1)`; `--duration-fast` 200ms, `--duration-base` 400ms, `--duration-slow` 600ms, `--stagger` 50ms. Transform and opacity only.
- **Theme:** `data-theme` on `<html>` (dark default, stored choice applied before paint by `lib/theme.ts`). Any subtree can set `data-theme` to scope a theme.

## Primitives

`Button` / `ButtonLink` (primary, secondary, ghost; md, lg), `Tag` (stack, award), `Card` + `CardBody`, `BrowserFrame`, `Container`, `Section` + `SectionHeading`, `ThemeToggle`.
