# Boat Brokers Frontend — Conventions & Design System

**Read this before writing any UI code in this project.** Every rule below is stated as MUST/NEVER with a one-line reason. The reason matters: it lets you judge a genuine edge case instead of pattern-matching blindly. If a rule's reason doesn't apply to your situation, say so out loud rather than silently breaking it.

---

## 1. Stack & commands

React 19 · TypeScript ~6 · Vite 8 · Tailwind CSS v4 · oxlint. No router library. No test suite.

Run from `Boat-Brokers/Frontend/`:

| Command | Does |
|---|---|
| `npm run dev` | Vite dev server. **Auto-increments the port if busy — always read the actual port from its output**, don't assume 5173. |
| `npm run build` | `tsc -b && vite build` — type errors fail the build |
| `npm run lint` | oxlint (config: `.oxlintrc.json`) |

Hard constraints:

- **NEVER create `tailwind.config.js/ts`.** Tailwind v4 is configured entirely by `@theme` in `src/index.css`. A config file would create a second, competing source of truth.
- **No path aliases exist.** Imports are relative: `../../components/Button/Button`.
- `verbatimModuleSyntax: true` → type-only imports MUST use `import type { X } from '...'`.
- `noUnusedLocals` / `noUnusedParameters` are on → an unused import fails `npm run build`.
- Prettier/ESLint are NOT set up. Match surrounding formatting by hand (2-space indent, single quotes, no semicolons).

---

## 2. Design tokens — the single source of truth

All tokens live in `src/index.css` under `@theme`. Tailwind generates utilities from them (`--color-navy-dark` → `bg-navy-dark`, `--text-h2` → `text-h2`).

### Rule: NEVER hardcode a value that already has a token.

*Why: the codebase already contains ~20 files that hand-copied the token values. Changing a token today silently fails to update any of them. Every new hardcode makes that worse.*

### Colors

| Token | Hex | Typical use |
|---|---|---|
| `navy-darkest` | `#073040` | dark section backgrounds |
| `navy-dark` | `#0a4359` | `dark` button fill |
| `blue` | `#1cc0ff` | accent dot, active states |
| `blue-light` / `blue-lighter` / `blue-active` / `blue-hover` | `#6bd6ff` / `#99e3ff` / `#b9ebff` / `#84ddff` | accents on dark, nav hover/active |
| `gold` | `#f4c850` | boat price |
| `ink` | `#1a1a1a` | headings on light |
| `text-body` | `#6e6e6e` | body copy |
| `text-muted` | `#a7a7a7` | body copy on dark |
| `body-light` | `#ededed` | body copy on photos |
| `border` / `border-dark` | `#e5e4e7` / `#094165` | dividers (light / on navy) |
| `badge-bg` / `badge-text` | `#e3f7fe` / `#14b2ef` | eyebrow pill on light |
| `slate` / `taupe` / `frost` | `#639dbf` / `#d2c8c8` / `#f8fcff` | card borders, spec text |

No dark mode exists. Don't add `dark:` variants.

### Fonts

| Token | Stack |
|---|---|
| `font-display` | `'Gideon Roman', 'Playfair Display', Georgia, serif` — headings |
| `font-accent` | `'Gilda Display', Georgia, serif` — alternate hero/FAQ headings |
| `font-body` | `'Inter', system-ui, 'Segoe UI', Roboto, sans-serif` |

**Gotcha: `font-bold` on a `font-display`/`font-accent` element does nothing visible.** Gideon Roman ships a single 400 weight and `body` sets `font-synthesis: none`, so there is no real bold face and the browser won't fake one. Inter has 300–700 available; use weight only on body text.

`h1`–`h6` already get `font-display`, `font-weight: 400` and `margin: 0` from the base layer — don't re-declare them.

### Type scale (all fluid `clamp()`, no breakpoint steps needed)

`text-h1` · `text-h1-short` · `text-h2` · `text-h3` · `text-h4` · `text-h6` · `text-body` · `text-body-sm` · `text-label` · `text-caption` · `text-accent` · `text-cta`

Each carries its own line-height and letter-spacing, so `text-h2` alone is complete — **don't add `leading-*`/`tracking-*` next to it.**

- There is **no `text-h5`**.
- `text-h1-short` is a separate token, not a variant. Pair it: `text-h1 short:text-h1-short`.

### Spacing & shadows

- `px-section-x` / `py-section-y` (also `pt-`, `right-`, `inset-x-`) — fluid section insets. **Use these instead of hardcoded `px-6 ... sm:px-16`.**
- `shadow-btn` (buttons, raised cards) · `shadow-badge`

### Conversion table — off-spec → token

You will meet all of these in existing files. Convert them when you're editing that code anyway; don't do a drive-by refactor of files you aren't touching.

| Hardcoded (found in repo) | Token |
|---|---|
| `bg-[#e3f7fe] … text-[#14b2ef]` | `bg-badge-bg … text-badge-text` |
| `text-sm font-medium tracking-[0.7px]` | `text-label font-medium` |
| `font-display text-[34px] leading-[1.3] tracking-[-2px] … sm:text-[3.375rem]` | `font-display text-h2` |
| `text-[#6e6e6e]` | `text-text-body` |
| `text-[#ededed]` | `text-body-light` |
| `text-[#9d9e9f]` | `text-text-muted` (closest token) |

---

## 3. Two dialects — use the canonical one

The codebase has two coexisting styles. **New code MUST use Dialect A.**

**Dialect A — canonical** (`components/CtaBanner`, `components/Faq`, `components/Testimonials`, all of `pages/Home/sections/*`): uses the `.section` class, `px-section-x`, `text-h2`, `bg-badge-bg`, `short:` variants.

**Dialect B — legacy** (most `pages/*/sections/*`): hardcoded `px-6 py-14 sm:px-16 sm:py-20`, raw hex, hand-written clamp endpoints.

Dialect B is the numeric majority. That does not make it the standard — it makes it the backlog. When you open a Dialect B file to change something, prefer converting the bit you touch.

### Canonical section recipe

```tsx
<section className="section flex flex-col items-center gap-6 short:gap-4 px-section-x">
  <div className="flex max-w-[26.25rem] flex-col items-center gap-4 short:gap-2 text-center">
    {/* eyebrow pill — always this exact shape */}
    <span className="inline-flex items-center gap-2 rounded-full bg-badge-bg px-4 py-1.5 text-label font-medium text-badge-text uppercase">
      <span className="size-2 rounded-full bg-blue" />
      Section Label
    </span>
    <h2 className="font-display text-h2 text-ink capitalize">Heading</h2>
    <p className="text-body text-text-body">Body copy.</p>
  </div>
</section>
```

Eyebrow pill on a **dark** background swaps the colors: `bg-[rgba(108,214,255,0.22)] … text-blue-light`. Add `w-fit` when it sits in a left-aligned flex column.

Sections that are link targets from the Navbar dropdowns need `id="..."` plus `scroll-mt-28`.

---

## 4. Page anatomy

Every page is this shell. There is **no layout component** — each page repeats it.

```tsx
export default function PageName() {
  return (
    <main className="flex flex-col gap-6 px-6 pt-6 pb-20">
      <PageHero image={heroBg} activeLabel="Nav Label" title="Page Title" body="One-line intro." />
      <SectionOne />
      <SectionTwo />
      <CtaBanner />
      <Footer />
    </main>
  )
}
```

- **`PageHero` renders `<Navbar />` itself. NEVER also render `<Navbar />` on a page that uses `PageHero`.** *Why: both are absolutely positioned; you get two stacked headers.* Render `Navbar` directly only in a bespoke hero (see `pages/Home/sections/Hero/Hero.tsx`).
- **`<Footer />` is per-page and MUST be the last child of `<main>`.**
- `pb-20` on `<main>` is load-bearing — Footer's circular back-to-top button overhangs its bottom edge and gets clipped without it. (`Home.tsx` uses `pb-0`; that's an inconsistency, not a pattern to copy.)
- `<CtaBanner />` sits second-to-last on 18 of 19 pages.
- Background images are `import`ed as ES modules at the top of the page file and passed as `image={...}`.

### Folder convention

```
src/pages/PageName/PageName.tsx
src/pages/PageName/sections/SectionName/SectionName.tsx
src/pages/PageName/sections/SectionName/icons.tsx   ← per-section icon helpers
```

Sub-pages nest a full page folder inside the parent (`pages/AreasWeServe/Birmingham/Birmingham.tsx` + its own `sections/`).

### Adding a new page takes THREE edits — it is easy to half-do

1. The page folder (`pages/NewPage/NewPage.tsx` + sections)
2. A branch in `src/App.tsx`
3. The link arrays — `navLinks` in `components/Navbar/Navbar.tsx` and/or `quickLinks`/`serviceLinks` in `components/Footer/Footer.tsx`

### Routing

`src/App.tsx` is a hand-rolled `window.location.pathname` if-ladder. No router library; all links are plain `<a href>` full page loads.

- **More specific checks MUST come before parent-path checks** (`/blog/:slug` before `/blog`). *Why: the ladder returns on first match.*
- The catch-all returns `<Home />` — there is no 404 page.
- `vercel.json` provides the SPA rewrite.

---

## 5. Sizing

- **Heroes cover one viewport frame: `min-h-[95svh]`.** All three `PageHero` sizes use it; Home's bespoke hero uses `sm:h-[95svh]`. *Why 95 and not 100: the next section peeks above the fold and invites the scroll.*
- **`.section`** (defined in `index.css`) = `min-height: 100svh` + centered flex column + `padding-block: var(--spacing-section-y)`. Use it for full-height sections.
  - To opt out for a banner-height block, add `min-h-0` — see `CtaBanner`.
- **`.media-frame`** wraps any `<img>`/`<video>` that must scale with its container without unpredictable cropping. The frame sizes itself (`aspect-[608/650]`, a percentage width, etc.); the media inside is absolutely positioned and `object-cover`'d. *Why: prevents the media's height stepping independently of its box.*
- Prefer `svh` over `vh` for full-height work — it accounts for mobile browser chrome.

---

## 6. Buttons

**NEVER hand-roll a button. Always use `components/Button/Button.tsx`.**

*Why: `components/Faq/Faq.tsx` duplicates the dark-button classes by hand, and it's precisely the one CTA that drifts out of sync. It is known debt — don't copy it.*

```tsx
<Button variant="dark" label="Buy Boats Now" href="/boats-for-sale" />
```

### Canonical pairs

Wrap in `<div className="flex flex-wrap items-center gap-3">`:

| Background | Primary | Secondary |
|---|---|---|
| Light | `variant="dark"` | `variant="outline-dark"` |
| Dark / photographic | `variant="light"` | `variant="outline-white"` |

### Arrow icons are decided centrally

`arrowByVariant` in `Button.tsx` maps each variant to its arrow asset. `dark` and `outline-white` use the **white** arrow; `light` and `outline-dark` use the dark one.

**NEVER add a per-instance icon override prop.** *Why: we tried that for one CTA, and it immediately created a button that looked different from every other `outline-white` button on the site. If an arrow is wrong, fix the map so every call site moves together.*

Other notes: `href` is passed at every current call site (the `<button>` branch exists but is unused). `sublabel` is Navbar-only. `icon="none"` is available but never currently used.

---

## 7. Effects

### Glass (boat spec cards)

Full glass is the **DEFAULT** state; it goes **lighter on hover**. Exact recipe lives in `pages/Home/sections/FeaturedBoats/BoatCard.tsx`:

```
border border-white/15
bg-[linear-gradient(45deg,rgba(210,200,200,0.12)_0%,rgba(248,252,255,0.10)_50%,rgba(235,242,255,0.08)_100%)]
shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_8px_24px_rgba(0,0,0,0.18)]
backdrop-blur-md
transition-[background,box-shadow,border-color,backdrop-filter] duration-300

lg:group-hover:border-white/10
lg:group-hover:bg-[#EBF2FF0A]
lg:group-hover:shadow-none
lg:group-hover:backdrop-blur-[2px]
```

The gradient tones (`D2C8C8` → `F8FCFF` → `EBF2FF @ 8%`) and the 45° light angle come from the approved Figma "Glass" effect. Reuse this recipe verbatim for any new glass surface so they stay consistent.

### Hover conventions

- Hover treatments are **`lg:`-scoped** and driven by a `group` class on the card root. *Why: hover doesn't exist on touch devices, so an un-scoped hover state can get stuck on mobile.*
- Standard transition: `transition-colors duration-300` (or an explicit property list when animating shadow/blur).

### Motion

`animate-marquee` (28s linear infinite) for logo strips. It already has a `prefers-reduced-motion: reduce` guard in `index.css` — keep that guard on any new looping animation.

---

## 8. Responsive rules

### The scale

`xs` 480 · `sm` 640 · `md` 768 · `lg` 1024 · `xl` 1280 · **`nav` 1440** · `2xl` 1536 · `3xl` 1920

Plus height-based variants: `short` (≤750px tall) · `medium` (751–899) · `tall` (≥900). `short:` is used to compress gaps and step headings down on laptop screens — see any `Home` section.

### In practice this is a two-breakpoint system

Base → `sm:` (640) → `lg:` (1024). Those two carry ~900 of the ~930 responsive utilities in the codebase. **Prefer them.** Reach for `md:`/`xl:`/`2xl:` only when you have measured a specific problem in that range.

Mobile-first: a bare utility applies at every width; prefixed variants override upward. Inserting a `md:` between an existing base value and an existing `lg:` value is **safe by construction** — `lg:` still wins at ≥1024px.

### NEVER introduce ad-hoc arbitrary breakpoints

No `max-[900px]:`, no `min-[1101px]:`.

*Why: the Navbar previously used `700px` and `1100px`, which created a dead zone at 1024–1100px where the page had switched to desktop layout but the nav was still showing a hamburger. Values that aren't in the scale drift out of sync with the layout around them.*

If you genuinely need a new width, **add a named `--breakpoint-*` token** to `@theme` in `index.css` and use it as a variant. There is one survivor to clean up when convenient: `max-[900px]:p-5` in `PageHero.tsx`.

### `nav` (1440px) is deliberate — don't "simplify" it

The full desktop navbar (logo + 6 links + 2 buttons with sublabels) measures **1311px of content**. It does not fit in a 1240px content box at 1440px viewport width until spacing is tightened, and it doesn't fit at all below that. So:

- `max-nav:hidden` → desktop nav + buttons hidden below 1440px
- `nav:hidden` → hamburger + mobile panel hidden at ≥1440px
- `2xl:` (1536) restores the fully generous spacing

Below 1440px the site uses the hamburger menu at every width, including 1024–1439px. That is intentional, not a bug.

---

## 9. Two Tailwind traps (both cost real time on this project)

### Trap 1 — an unprefixed utility passed via `className` may silently lose

Passing `className="px-3"` to a component whose base classes already include `px-5` is a coin flip. Both are single-class selectors with equal specificity, so the winner is decided by **stylesheet order**, not by the order in the `class` attribute.

**Fix: use a prefixed variant** — `className="lg:px-3"`. The media query raises precedence and the override becomes deterministic.

### Trap 2 — arbitrary `max-[...]` variants can lose to a base utility

`max-[1439px]:hidden` failed to override a base `flex` on the same element. The identical rule written against a **named** breakpoint — `max-nav:hidden` — worked immediately.

**Fix: define a `--breakpoint-*` token and use the named variant** rather than inlining a pixel value. (This is the same conclusion as §8, arrived at from the other direction.)

---

## 10. Verification is mandatory

**UI work is not done until you have seen it rendered.** Type-checking and linting verify code correctness, not visual correctness.

1. `npm run dev` from `Frontend/` — read the actual port from the output.
2. Screenshot sweep with Playwright at **375, 480, 640, 768, 1024, 1280, 1440, 1536, 1920**, plus the boundary pair either side of any breakpoint you touched (e.g. 1439 / 1440).
3. Check **both default and hover states** for anything with a hover treatment.
4. If you changed something that was already approved at desktop width, diff the before/after screenshots at ≥1440px to prove you didn't regress it.

### Measure — don't eyeball

A scaled-down screenshot hides overflow. Get numbers:

```js
// true content width, ignoring current wrapping
el.style.flexWrap = 'nowrap'
const needed = el.scrollWidth
el.style.flexWrap = ''
// compare against the container's content box (width minus its own padding)
```

*Why this matters: the navbar was overflowing at 1280–1440px for the entire life of the project and nobody noticed, because at thumbnail scale a two-line nav looks like a one-line nav. The measurement showed 1311px of content in a 1240px box in one line of output.*

If you could not verify something, **say so plainly** rather than describing it in a way that implies you did.

---

## 11. Known debt — don't copy, fix when nearby

- Dialect B hardcoded styling across ~20 page sections (see §3)
- `GetInTouch` duplicated three times (Buying, Selling, BoatForSale) instead of shared
- `components/Faq/Faq.tsx` CTA is a raw `<button>` instead of `<Button>`
- `Home.tsx` uses `pb-0` where every other page uses `pb-20`
- `max-[900px]:p-5` in `PageHero.tsx` — the last ad-hoc breakpoint
- `src/assets/gideon-roman-webfont/style.css` is unimported and declares a decoy family name `'Gideon Roman Regular'`. The live `@font-face` is the one in `index.css` using `'Gideon Roman'`. Don't reference the decoy.
- `Boat-Brokers/README.md` documents `client/`/`server/` but the directories are `Frontend/`/`Backend/`; the root workspace scripts (`npm run dev:client`) are broken as a result. Run commands from inside `Frontend/`.
