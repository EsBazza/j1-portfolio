# Motion and layout plan

Nov 13, 2026 · follows `docs/PORTFOLIO_BUILD_PLAN.md` and `CLAUDE.md`

Seven animations, plus the layout changes three of them depend on. No new packages: GSAP and Motion are already installed. three.js is not part of this plan.

Rules that apply throughout (from `CLAUDE.md`): animate only `transform` and `opacity`; every animation has a `prefers-reduced-motion` fallback; content is visible without JavaScript; GSAP effects are built in `components/motion/engine.ts` from data attributes; client components stay at the leaves.

## Phase A: layout the animations need

Three of the seven animations have nothing to attach to yet.

| New piece        | What it is                                                                                                                                                           | Replaces                                                      |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| The log          | One section. Every project is a row on a vertical line. Award projects are large rows (screenshot, event photo, award); the rest are one-line rows. Ordered by date. | `FeaturedProjects`, `MoreProjects`, `StatusBoard`, `Timeline` |
| Award stamps     | A stamp mark per award on the large rows ("Hackathon winner", "Best Technical Implementation", "Best User Experience", "1st Runner-Up", "Top 3", "Top 20").          | The award `Tag` on project panels                             |
| Live dot per row | The status check result shown beside each project that has a live site.                                                                                              | The separate Live demos list                                  |
| 30-second switch | A header toggle that hides everything except the hero, the award rows in compact form, and contact.                                                                  | Nothing (new)                                                 |

Done when: the home page is hero, award strip, the log, skills, about (with certifications folded in), contact; it works with JavaScript off; e2e tests are updated and pass.

## Phase B: the seven animations

### 1. Log line draws, dots fill

- **Exists:** `engine.ts` already scrubs `[data-timeline-progress]` from `scaleY: 0` to `1`. `Timeline.tsx` already draws the branch-and-merge marks.
- **Change:** move the line to the new log. Give each row's dot `data-log-dot`; one ScrollTrigger per dot fills it (`scale 0.4 → 1`, `opacity 0 → 1`, 200ms) when the line reaches it. Dots fill once and stay filled on scroll back.
- **Reduced motion:** line fully drawn, all dots filled.

### 2. Award stamps press in

- **Build:** `data-stamp` on each stamp. On enter: `scale 1.18 → 1`, `opacity 0 → 1`, 300ms on the shared ease-out curve. Stamps in one row stagger 50ms. Plays once.
- **No overshoot (recommended):** unslop and apple-design both rule out bounce on UI that wasn't thrown by a gesture. The press reads from the fast scale-down alone. Adding `back.out(1.4)` stays possible if Juno wants it, as the single exception to the shared curve.
- **Reduced motion:** stamps shown, no motion.

### 3. Odometer numbers

- **Exists:** `data-countup` in `engine.ts` counts 0 to N by rewriting text.
- **Change:** replace it with `data-odometer`. The server renders the plain number. The engine splits it into one column per digit (0 to 9 stacked) and moves each column with `translateY`, 600ms, staggered 50ms from the right. The real number stays in an `aria-label`; the columns are `aria-hidden`. `tabular-nums` is already set, so nothing shifts.
- **Reduced motion and no JS:** the plain number.

### 4. Hover preview follows the cursor

- **Build:** one client leaf, `components/projects/RowPreview.tsx`. A single fixed-position image shared by all compact rows.
  - Position: two independent springs, one for x and one for y, critically damped (Motion `useSpring`, `bounce: 0`, about 0.35s).
  - Appears on `pointerenter` in 150ms. Leaves in 100ms on `pointerleave`, with no trailing motion.
  - Only on `(hover: hover) and (pointer: fine)`. On touch, a row expands on tap to show its screenshot.
- **Reduced motion:** the preview appears beside the row and does not follow.

### 5. 30-second switch

- **Build:** a toggle in the header sets `data-view="brief"` on `<html>` and remembers the choice. Hidden without JavaScript, since the full page is the fallback.
- **Motion:** Motion layout animation on the section wrappers. Hidden sections fade out; the sections below slide up by transform. Layout animation starts from where things are on screen, so toggling again mid-motion reverses cleanly. A native view transition would not: it restarts from the end state.
- **Reduced motion:** sections show and hide with a 200ms cross-fade.

### 6. Screenshot morphs into the case-study header

- **Exists:** `ProjectCover.tsx` wraps covers in React `<ViewTransition>` with the `.morph` group; `globals.css` already turns it off under reduced motion.
- **Change:** give the log's large-row screenshots and the hover preview the same shared name as the case-study header. Compact rows with no screenshot on screen fall back to the page cross-fade. Tune the group to 400ms on the shared curve.

### 7. Live dot pings once

- **Exists:** `.status-ok::after` runs `status-ring` forever; `.status-pending` breathes forever (`globals.css`).
- **Change:** the ring runs one iteration, started when the status report arrives. A pending dot is a static dim dot.
- **Reduced motion:** a solid dot, as now.

## Phase C: unslop polish

The audit against unslop's `signs.md` (2026-11-13) puts the site in **light slop**, so this is polish mode: fix what the audit found, keep the palette, fonts and build-log look.

### Direction (needs Juno's yes before any edit)

- **Product:** a portfolio that shows recruiters and hackathon judges what Juno Alonzo, a BSIT student, has shipped and won.
- **Character:** exact, plain-spoken, quietly proud.
- **World:** a build log. Commit history and release notes, warm ink and off-white, amber kept for awards.
- **Moments:** the award rows in the log (screenshot plus event photo), and the row of real numbers.
- **Signature:** the commit dot on the log line, filled for shipped work and amber for a win. Used nowhere else.

### Signs found, by pass

| Pass    | Sign                                   | Where                                                             | Fix                                                        |
| ------- | -------------------------------------- | ----------------------------------------------------------------- | ---------------------------------------------------------- |
| Spacing | Off-scale values                       | `Timeline.tsx` (`left-[5px]`, `left-[23px]`, `left-[4px]`)        | Use 4px steps when the log is rebuilt                      |
| Color   | Accent on more than awards and actions | Home page captions and labels (to confirm per element)            | Amber only on awards, stamps and the primary button        |
| Copy    | Exclamation marks                      | `app/actions/contact.ts` ("Thanks!" twice)                        | Plain statement                                            |
| Copy    | Headings ending in a period            | Six section headings ("Let's talk." and others)                   | Drop the period; "J1 Dev." keeps its dot as the brand mark |
| Type    | Weight 700                             | 24 uses of `font-bold`                                            | 600 at most                                                |
| Type    | Uppercase tracked labels               | `caption` utility (`globals.css`)                                 | Sentence case, still mono                                  |
| Layout  | Pill badge above the headline          | `Hero.tsx`                                                        | A quiet text link; the news is real, so it stays           |
| Motion  | Loops on things that are not live      | `marquee`, `term-blink`, 404 `spin`                               | Remove                                                     |
| Motion  | Movement on hover and scroll           | `data-tilt` on cards, the pinned featured scroll, `data-scramble` | Remove; tilt and the pin go away with the log anyway       |
| Motion  | Magnetic buttons                       | `Hero.tsx`, `ContactForm.tsx`                                     | Replace with a press scale of 0.97                         |

Not found: hue gradients, gradient text, emoji, italics, `transition-all`, negative tracking on small text.

Kept on purpose: the header and dialog backdrop blur (translucent chrome, which apple-design supports), and the live dot, which is a real status.

### Also in this phase

- Cut the hero terminal (`HeroTerminal.tsx`). The hero's bright element becomes the headline result and the live line.
- Treat the portrait so it matches the page background.

## Order

1. Phase A, the log first, then stamps and dots, then the switch.
2. Animations 1, 7, 3 (changes to code that exists).
3. Animations 2, 6.
4. Animations 4, 5 (the two new client components).
5. Phase C, for whatever is approved.

After each step: `lint`, `typecheck`, `format:check`, `build`, `test:e2e`, then a check at 375px, 1440px and with reduced motion on. Stop and show the result before the next step.

## Skills

- **apple-design** (installed): springs critically damped by default, interruptible transitions, motion that starts from the on-screen value. Applied to animations 4 and 5.
- **unslop** (installed from github.com/heydamir/unslop into `.claude/skills/unslop`, CC BY 4.0, by Damir Sokolovsky): the audit, direction and nine passes in Phase C.
