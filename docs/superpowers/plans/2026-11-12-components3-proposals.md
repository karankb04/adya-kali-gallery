# /components3 — "She can't do basic" Proposals Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a review page, `/components3`, that shows the owner concrete, working proposals for (1) a new type system, (2) a Kargo-style curved gallery that never crops Maa's images, and (3) the clicktokeep-style editorial look and feel — so they can pick before anything touches the live site.

**Architecture:** Same pattern as `/components2`: one noindex page built from `ShowcaseSection` blocks, each proposal a self-contained client component in `components/showcase3/`. Fonts load through `next/font` declared in a module only this page imports, so no other page gets heavier. Pure layout math (arc transforms, pile positions) lives in small `lib/` modules with unit tests; React Bits components are vendored (copied in) with their licence header, not installed.

**Tech Stack:** Next.js 16.4.6, React 19, existing `gsap` + `motion`; one new runtime dependency (`@use-gesture/react`, for the Dome gallery only); `tsx` as a dev dependency for `node:test` unit tests.

**Spec:** The owner's request of 2026-11-12 plus the reference research summarised in "Research findings" below. There is no separate spec doc; this section is it.

## Research findings (the spec)

**Kargo Studio `/works`** — a horizontal ribbon of tall portrait panels on a *concave* cylinder. Measured from their DOM: each panel is a `div` with `matrix3d` = `rotateY(θ)` + `translateZ(z)`, where θ grows ≈ 4° per panel away from centre (12.1°, 16.3°, 20.3°, 24.5°, 28.7°, 32.9°) and z grows with the square of the distance (20 → 46 → 84 → 131 → 189 → 257 → 335 px). Panels are ~1:3.9 (147 × 572) — far too narrow for Maa's images. Labels (title + year) sit under each panel in a thin sans. CSS 3D only, no WebGL.

**clicktokeep.com** — "exaggerated minimalism": a light grey page, black text, headlines in a neo-grotesk at ~190 px with tracking ≈ −0.06 em, section titles in square brackets (`[ Our Mission ]`), small uppercase file-name captions on media (`VIBES.mp4`, `INFO.JPG`), a serif (Libre Baskerville) for single-word accents, a dense collage of images that piles up as you scroll, edges that blur into depth, and a playful counter ("You've saved 00 items" / "Tap to Save"). ui-ux-pro-max classifies this as *Exaggerated Minimalism*: `clamp(3rem,10vw,12rem)`, `letter-spacing:-0.05em`, one accent colour, performance cost low.

**React Bits** (MIT + Commons Clause: free on a website, can't resell the components). Candidates and their imports, checked in the repo:
- DomeGallery: `@use-gesture/react`
- TextPressure, VariableProximity, GradualBlur, CircularGallery, FlyingPosters, DriftWall: no dependencies
- ScrollFloat, MaskedHeading, ImageTrail: `gsap` (already installed)

**Owner's constraints:** never crop Maa's images; SEO and speed still matter; they dislike the current fonts (Clash Display + Roboto Slab, now with Tiro for Hindi) and find the UI "basic".

## Global Constraints

- Route is `/components3`, `robots: { index: false, follow: false }`, not linked from the site nav, not added to `app/sitemap.xml/route.ts`.
- No proposal may crop a darshan image: every image is shown at its own aspect ratio (`object-fit: contain`, or a box sized from `width`/`height`).
- Fonts for proposals are declared only in `app/components3/fonts.ts`; nothing in `app/layout.tsx` or `app/globals.css` changes in this plan.
- Only licences that allow commercial web use: Google Fonts (OFL), Fontshare (ITF Free Font Licence), React Bits (MIT + Commons Clause).
- Every vendored React Bits file starts with: `// Adapted from React Bits (https://github.com/DavidHDev/react-bits) — MIT + Commons Clause.`
- Every animated proposal honours `prefers-reduced-motion: reduce` with a static or plain-scroll fallback.
- Images come from `getImages()` (server) and render through the existing `RImage` component; clicking one opens the existing `DarshanModal`.
- Hindi text uses `var(--deva)` (Tiro Devanagari Hindi) with `lang="hi"`.
- Work happens on branch `preview/components3`; it is pushed as a Vercel preview only. Nothing merges to `main`/`master` without the owner's go.

## Review Focus

1. **An image whose data lacks `width`/`height`** — the panel must fall back to a 3:4 box and still show the whole image, never `NaN` sizes or a collapsed panel. *(Task 3 test `panelSize falls back to 3:4`)*
2. **A landscape image in the portrait arc** — it must stay whole (letterboxed inside a capped-width panel), not cropped and not three screens wide. *(Task 3 test `panelSize caps landscape width`)*
3. **Scrolling past the pinned gallery with a mouse wheel or on a phone** — the page must never trap the visitor: the pinned section releases after its scroll distance, and on touch, vertical swipes scroll the page. *(Task 4 Step: Playwright wheel-through check)*
4. **Keyboard-only visitor in the arc** — Tab moves panel to panel, the focused panel turns to face the centre, and Enter opens the darshan viewer. *(Task 4 Step: keyboard check)*
5. **Private browsing in the offering counter** — `localStorage` throwing must not break the pile; the count just starts at 0 each visit. *(Task 7 test `readCount survives a throwing storage`)*

---

## File Structure

| File | Responsibility |
|---|---|
| `app/components3/page.tsx` | The page: metadata, `getImages()`, the ordered `ShowcaseSection`s |
| `app/components3/showcase3.css` | All styles for this page's proposals (prefix `s3-`) |
| `app/components3/fonts.ts` | `next/font` declarations for every candidate type system |
| `app/components3/fonts/*.woff2` | Self-hosted Fontshare files (Boska, Switzer, Satoshi) |
| `lib/arc.ts` + `lib/arc.test.ts` | Pure math: panel size from image aspect; rotateY/translateZ from offset |
| `lib/pile.ts` + `lib/pile.test.ts` | Pure, seeded layout for the offering pile; safe counter storage |
| `components/showcase3/TypeSystems.tsx` | Five full type-system specimens |
| `components/showcase3/KargoArc.tsx` | The curved ribbon gallery |
| `components/showcase3/DomeDarshan.tsx` | React Bits DomeGallery fed with Maa's images |
| `components/showcase3/KineticName.tsx` | Oversized kinetic headline (TextPressure + ScrollFloat) |
| `components/showcase3/EditorialChrome.tsx` | Bracket labels, file captions, grain, gradual-blur edges, applied to a sample section |
| `components/showcase3/OfferingPile.tsx` | Clicktokeep's pile, reimagined as flowers offered at her feet, with a counter |
| `components/reactbits/*` | Vendored React Bits sources (DomeGallery, TextPressure, ScrollFloat, GradualBlur) |
| `package.json` | `@use-gesture/react` dependency; `tsx` dev dependency; `"test": "tsx --test lib/*.test.ts"` |

---

### Task 1: Page shell, fonts, and test runner

**Files:**
- Create: `app/components3/page.tsx`, `app/components3/showcase3.css`, `app/components3/fonts.ts`, `app/components3/fonts/{Boska-Variable,Boska-VariableItalic,Switzer-Variable,Satoshi-Variable}.woff2`
- Modify: `package.json`

**Interfaces:**
- Produces: `fonts.ts` exports `interTight`, `instrumentSerif`, `bricolage`, `jetbrainsMono`, `boska`, `switzer`, `satoshi` (each a `next/font` result with `.variable` = `--f3-inter-tight`, `--f3-instrument`, `--f3-bricolage`, `--f3-mono`, `--f3-boska`, `--f3-switzer`, `--f3-satoshi`) and `FONT_VARS: string` (all `.variable` classes joined with spaces).
- Produces: the page wraps everything in `<div className={`sc-page s3-page ${FONT_VARS}`}>` so every section can use the variables.

- [ ] **Step 1:** Create branch `preview/components3` from `master`.
- [ ] **Step 2:** `npm i @use-gesture/react` and `npm i -D tsx`; add `"test": "tsx --test lib/*.test.ts"` to `package.json` scripts.
- [ ] **Step 3:** Download the Fontshare variable woff2 files for Boska (roman + italic), Switzer and Satoshi from the URLs in `https://api.fontshare.com/v2/css?f[]=boska@1,2&f[]=switzer@1&f[]=satoshi@1&display=swap`. Verify each file starts with the bytes `wOF2`.
- [ ] **Step 4:** Write `app/components3/fonts.ts`:
  - Google: Inter Tight (`weight: "variable"`, `subsets: ["latin"]`), Instrument Serif (400, normal + italic), Bricolage Grotesque (`axes: ["wdth","opsz"]`), JetBrains Mono (400, 500).
  - Local: Boska (roman + italic), Switzer and Satoshi via `next/font/local`.
  - `display: "swap"` on all of them.
- [ ] **Step 5:** Write `page.tsx` with metadata `title: "Component Proposals III"`, `robots: { index: false, follow: false }`, `export const revalidate = 3600`, and the intro header reusing `s2-intro` markup:
  - deva `रूप`
  - h1 `Proposals III — She can't do basic`
  - one-paragraph dek naming the three references
- [ ] **Step 6:** Run `npx tsc --noEmit` (expect no output) and `curl -s localhost:3000/components3 | grep -o 'noindex, nofollow'` (expect a match).
- [ ] **Step 7:** Commit `feat(components3): page shell, candidate fonts, test runner`.

### Task 2: Five type systems

**Files:**
- Create: `components/showcase3/TypeSystems.tsx`
- Modify: `app/components3/page.tsx`, `app/components3/showcase3.css`

**Interfaces:**
- Consumes: the CSS variables from Task 1.
- Produces: `<TypeSystems />` (no props).

Each specimen is a full mini-page at 100% width on the site's dark maroon background (`#170907`) with cream text, all built from the same content so they can be compared fairly:
- a nav row (logo, Gallery / About / Music / Katha, and the two existing buttons via the `NavButtons` markup from `components/showcase2/NavTypeSpecimen.tsx`, moved to an exported function there)
- a hero line, `MAA ADYA KALI`
- a Hindi line, `॥ जय माँ आद्या काली ॥`
- a bracket label, `[ Darshan ]`
- a body paragraph: the first `teachingCaption` from `data/images.json`
- a mono caption, `MAHAKALI_01.JPG · 2026`

| Key | Display | Body | Accent | Label |
|---|---|---|---|---|
| `grotesk` "Sanctum Grotesk" (closest to clicktokeep) | Inter Tight 800, uppercase, `clamp(3.5rem,11vw,11rem)`, `letter-spacing:-0.055em`, `line-height:.86` | Inter Tight 400 | Instrument Serif italic for one word, e.g. *Mother* | JetBrains Mono 500, uppercase, `.72rem`, `+.08em` |
| `bricolage` "Living Grotesque" | Bricolage Grotesque 800 at `wdth 75`, `opsz 96` | Bricolage 400 | none | JetBrains Mono |
| `boska` "Devotional Serif" | Boska italic 700, `clamp(3rem,9vw,9rem)`, `-0.03em` | Switzer 400 | none | JetBrains Mono |
| `instrument` "Gallery Editorial" | Instrument Serif 400, `clamp(3.5rem,12vw,12rem)`, `-0.04em` | Inter Tight 400 | none | JetBrains Mono |
| `clash` "Clash, minus the slab" (least change) | Clash Display 700 (existing `var(--disp)`) | Satoshi 400 | none | JetBrains Mono |

Below each specimen: name, the fonts used, an approximate weight cost (filled in from the Network panel during Step 3, not guessed), and one sentence on the feeling. The first row of this section (the `current` specimen) shows today's fonts for comparison.

- [ ] **Step 1:** Move `NavButtons` in `components/showcase2/NavTypeSpecimen.tsx` to an `export function NavButtons()` and import it in both places. Run `npx tsc --noEmit`: no errors.
- [ ] **Step 2:** Build `TypeSystems.tsx` with the six rows (current + the five above), driven by one `SYSTEMS` array of `{ key, name, fonts, feeling }` with a `s3-type-${key}` class per row; all font rules go in `showcase3.css`. Add it to the page as `ShowcaseSection` index 1 (`bleed`), title `A voice worthy of her`, technique `Type systems · same words, five voices`.
- [ ] **Step 3:** Open `/components3` in Playwright. Check that each `document.fonts.check('16px <family>')` is true for all seven families and that no specimen row overflows sideways at 375 px and 1440 px (`scrollWidth <= clientWidth`). Read each family's transferred KB from `performance.getEntriesByType('resource')` and write the real numbers into the `SYSTEMS` cost text.
- [ ] **Step 4:** Commit `feat(components3): five type-system specimens`.

### Task 3: Arc math (tested)

**Files:**
- Create: `lib/arc.ts`, `lib/arc.test.ts`

**Interfaces:**
- Produces:
  - `panelSize(img: { width?: number; height?: number }, panelHeight: number, maxRatio?: number): { width: number; height: number; letterbox: boolean }`. The width is `panelHeight × (w/h)`, clamped to `panelHeight × maxRatio`, with `maxRatio` defaulting to `0.9`. `letterbox` is true when clamped.
  - `arcTransform(offsetPx: number, viewportW: number, opts?: { degPerVw?: number; depth?: number }): { rotateY: number; translateZ: number }`. `offsetPx` is the panel centre's distance from the viewport centre, and the result is concave like Kargo: `rotateY = -sign(offset) × |offset|/viewportW × degPerVw` (default `degPerVw = 70`), and `translateZ = depth × (offset/viewportW)²` (default `depth = 900`).

- [ ] **Step 1: Write the failing tests** in `lib/arc.test.ts` with `node:test` + `node:assert/strict`:
  - `panelSize keeps the image's own aspect`: `{width:3000,height:4000}` at 600 → `{width:450,height:600,letterbox:false}`.
  - `panelSize falls back to 3:4`: `{}` at 600 → `{width:450,height:600,letterbox:false}`.
  - `panelSize caps landscape width`: `{width:1600,height:900}` at 600 → `{width:540,height:600,letterbox:true}`.
  - `arcTransform is flat at centre`: `arcTransform(0,1000)` → `{rotateY:0,translateZ:0}`.
  - `arcTransform is concave and symmetric`: at ±500 px of 1000 → `rotateY` is `-35` and `35`, and `translateZ` is `225` for both.
- [ ] **Step 2:** Run `npm test`. Expected: fail because `lib/arc.ts` doesn't exist yet.
- [ ] **Step 3:** Implement both functions in `lib/arc.ts`.
- [ ] **Step 4:** Run `npm test`. Expected: 5 passing.
- [ ] **Step 5:** Commit `feat(arc): uncropped panel sizing and concave arc transform`.

### Task 4: Kargo arc gallery

**Files:**
- Create: `components/showcase3/KargoArc.tsx`
- Modify: `app/components3/page.tsx`, `app/components3/showcase3.css`

**Interfaces:**
- Consumes: `panelSize`, `arcTransform` (Task 3), `RImage`, `DarshanModal`, `KaliImage`.
- Produces: `<KargoArc images={KaliImage[]} />`.

Behaviour:
- A full-viewport section pinned with GSAP ScrollTrigger (`pin: true`, `end: "+=" + trackWidth`). Vertical scroll moves the ribbon sideways, and the section releases at the end.
- Pointer drag also moves the ribbon, with inertia decaying at `0.92` per frame.
- Every frame, each panel gets `transform: rotateY(..) translateZ(..)` from `arcTransform`. The ribbon sits inside `perspective: 1200px`.
- Panel height is `min(72vh, 680px)` and the width comes from `panelSize`. Images use `object-fit: contain` on a `#0d0503` letterbox.
- Under each panel is a label row with the form on the left (Clash 500 uppercase `.72rem`) and the transliteration on the right.
- Each panel is a `<button>`. Focusing one scrolls it to the centre; Enter or click opens `DarshanModal`.
- With reduced motion: no pin, no 3D, just a horizontal `scroll-snap` row.

- [ ] **Step 1:** Build the component and add a `ShowcaseSection` (`bleed`): index 2, title `The sanctum's curved wall`, technique `Kargo-style arc · CSS 3D · whole images`.
- [ ] **Step 2:** Run `npx tsc --noEmit`: no errors.
- [ ] **Step 3: Wheel-through check (Review Focus 3).** In Playwright, at 1440 × 900 and with `page.mouse.wheel` (real wheel, not `scrollTo`):
  - Wheel until the arc pins, and confirm the first panel's `rotateY` changes as you go.
  - Keep wheeling. `window.scrollY` must keep increasing past the section's end, and the next section's heading must come into view.
  - At 375 × 812, repeat with `page.touchscreen` swipes.
- [ ] **Step 4: Keyboard check (Review Focus 4).** Tab into the arc: `document.activeElement` is a panel button and its `rotateY` is within ±3° of 0 after 600 ms. Press Enter: `.modal` exists. Press Escape: focus returns to that panel.
- [ ] **Step 5: No-crop check.** For every panel, assert the rendered `img` box has the image's own aspect ratio (± 1%) and `object-fit: contain`.
- [ ] **Step 6:** Reduced-motion check: with `emulateMedia({ reducedMotion: "reduce" })`, no element has a `matrix3d` transform and the row scrolls sideways.
- [ ] **Step 7:** Commit `feat(components3): Kargo-style curved darshan wall`.

### Task 5: Dome gallery (React Bits alternative)

**Files:**
- Create: `components/reactbits/DomeGallery.tsx`, `components/reactbits/DomeGallery.css`, `components/showcase3/DomeDarshan.tsx`
- Modify: `app/components3/page.tsx`

**Interfaces:**
- Consumes: `KaliImage[]`, `r2url`.
- Produces: `<DomeDarshan images={KaliImage[]} />`, which maps images to DomeGallery's `images` prop as `{ src: r2url(img.r2Key), alt: img.altText }`.

- [ ] **Step 1:** Copy `src/ts-default/Components/DomeGallery/DomeGallery.{tsx,css}` from React Bits at its current commit, add the licence header line, and record the commit SHA in that header.
- [ ] **Step 2:** Set its tiles to `object-fit: contain` (whole images), its dome background to `#170907`, and turn on `grayscale={false}`.
- [ ] **Step 3:** Add a `ShowcaseSection` (`bleed`): index 3, title `A dome of her forms`.
- [ ] **Step 4:** Check in Playwright: dragging rotates the dome (a tile's transform changes), clicking a tile enlarges it, Escape closes it, and there are no console errors.
- [ ] **Step 5:** Commit `feat(components3): React Bits dome gallery`.

### Task 6: Oversized kinetic name + editorial chrome

**Files:**
- Create: `components/reactbits/TextPressure.tsx`, `components/reactbits/ScrollFloat.tsx`, `components/reactbits/ScrollFloat.css`, `components/reactbits/GradualBlur.tsx`, `components/reactbits/GradualBlur.css`, `components/showcase3/KineticName.tsx`, `components/showcase3/EditorialChrome.tsx`
- Modify: `app/components3/page.tsx`, `app/components3/showcase3.css`

**Interfaces:**
- Produces: `<KineticName />` (no props) and `<EditorialChrome images={KaliImage[]} />`.

**KineticName:**
- `MAHAKALI` across the full width in Bricolage Grotesque via TextPressure, using the page's own font variable instead of React Bits' remote default font. The letters swell in weight and width toward the cursor.
- Underneath, a ScrollFloat line: `She who is beyond time`.
- On touch devices it's static text.

**EditorialChrome:** one sample homepage-style section that applies clicktokeep's details to our content:
- bracket section labels (`[ Darshan ]`, `[ Katha ]`)
- mono file captions on each image (`MAHAKALI_03.JPG`, built from the image's form and index)
- a 4% film-grain overlay (CSS SVG `feTurbulence`, no canvas)
- GradualBlur at the top and bottom edges of a 3-image strip
- an Instrument Serif italic accent word in the heading

- [ ] **Step 1:** Vendor the three React Bits files with the licence header.
- [ ] **Step 2:** Build both components and add sections with index 4 (`Her name, felt`) and index 5 (`The details that make it not basic`).
- [ ] **Step 3:** Check in Playwright:
  - Moving the mouse over KineticName changes a letter's computed `font-variation-settings`.
  - Scrolling plays ScrollFloat; with reduced motion the text is fully visible straight away.
  - Every EditorialChrome image is whole (same aspect check as Task 4 Step 5).
- [ ] **Step 4:** Commit `feat(components3): kinetic name and editorial chrome`.

### Task 7: Offering pile + counter (tested)

**Files:**
- Create: `lib/pile.ts`, `lib/pile.test.ts`, `components/showcase3/OfferingPile.tsx`
- Modify: `app/components3/page.tsx`, `app/components3/showcase3.css`

**Interfaces:**
- Produces:
  - `pileLayout(count: number, seed: number, area: { w: number; h: number }): { x: number; y: number; rotate: number; scale: number }[]`. It's deterministic for the same inputs, every card's centre stays inside the area, and `rotate` falls in −12…12.
  - `readCount(storage: Pick<Storage,"getItem"> | null): number` returns 0 on a missing or bad value, or when storage throws.
  - `writeCount(storage: Pick<Storage,"setItem"> | null, n: number): void` never throws.
  - Storage key: `adya-pranams`.

Behaviour: clicktokeep's pile reimagined as offerings. As the section scrolls, darshan cards (whole images, small) drop one by one into a soft heap at the bottom, like flowers at her feet. A pill button reads `Offer a pranam` and a counter reads `You've offered 00 pranams`. Each tap adds one marigold-coloured petal card to the heap and increments the stored count.

- [ ] **Step 1: Write the failing tests:**
  - `pileLayout is deterministic`: two calls with `(12, 7, {w:800,h:500})` are deep-equal.
  - `pileLayout stays inside the area`: every `x` is in [0,800] and every `y` in [0,500].
  - `pileLayout rotation is gentle`: every `rotate` is in [−12,12].
  - `readCount survives a throwing storage`: a `getItem` that throws → `0`.
  - `readCount rejects junk`: `"abc"` → `0` and `"-3"` → `0`.
- [ ] **Step 2:** Run `npm test`. Expected: the new tests fail.
- [ ] **Step 3:** Implement `lib/pile.ts` with a mulberry32 seeded random number generator.
- [ ] **Step 4:** Run `npm test`. Expected: all tests pass (Tasks 3 and 7).
- [ ] **Step 5:** Build `OfferingPile.tsx` and add the section: index 6, title `An offering, not a hoard`.
- [ ] **Step 6:** Check in Playwright: clicking the button 3 times shows `03`, and reloading still shows `03`. Then, in a fresh context where `Storage.prototype.getItem` is overridden to throw, the page loads with no console error and shows `00`.
- [ ] **Step 7:** Commit `feat(components3): offering pile with pranam counter`.

### Task 8: Verify, budget, publish preview

**Files:**
- Modify: none (fix only what this step finds)

- [ ] **Step 1:** Run `npm test` (all pass), `npx tsc --noEmit` (clean), then stop the dev server, `rm -rf .next` and run `npm run build`. The build must succeed and `/components3` must appear in the route table.
- [ ] **Step 2: Isolation check.** On `/` and `/gallery`, `performance.getEntriesByType('resource')` shows none of the new font files and no `use-gesture` chunk.
- [ ] **Step 3:** Run the Playwright console sweep on `/components3` at 1440 × 900 and 375 × 812: 0 errors and no sideways page scroll (`documentElement.scrollWidth <= innerWidth`).
- [ ] **Step 4:** Push `preview/components3` only (`git -c credential.helper= -c "credential.helper=!gh auth git-credential" push -u origin preview/components3`) and get the Vercel preview URL.
- [ ] **Step 5:** Write the owner a plain-language summary listing each section, what to look for, and the open choices.

---

## What comes after review (separate plan, not this one)

Once the owner picks:
1. **Type system:** swap `--disp`, `--body` and `--read` in `app/layout.tsx` and `app/globals.css` to the chosen fonts, re-run the contrast audit, and check page weight against today's.
2. **Gallery:** put the chosen arc or dome on `/gallery` (and maybe the homepage), keeping the existing grid as the crawlable fallback so SEO doesn't lose the images.
3. **Look and feel:** roll out bracket labels, file captions, grain, blur edges and the kinetic name section by section, starting with the homepage hero.
4. **Leftovers:** the footer sign-up form, `placehold.co`, and the nav pick from `/components2` (the type choice will probably decide it).
