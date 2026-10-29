# Affiliate UI Kit

Multi-vertical affiliate & editorial commerce primitives. **One behavioral codebase,
radically different verticals** — a luxury editorial publication and a clinical
performance/testing database render the *same components and the same data* and
look nothing alike, because every structural property binds to a token profile.

```
bun install
bun run storybook      # http://localhost:6006 — switch verticals from the toolbar
bun run dev            # Next.js app (kit index)
bun run check          # typecheck + lint + structural-token audit
bun run verify:stories # headless Storybook verification (see below)
```

## Stack

Bun · Next.js 16 (App Router, Server Components by default) · React 19 ·
Tailwind CSS 4 · class-variance-authority · Radix primitives · vaul ·
lucide-react · Storybook 10 (`@storybook/nextjs-vite`).

## Architecture

### 1. Token contract — `src/styles/tokens.css`

Two baseline profiles, selected by `[data-vertical="luxury-editorial"]` /
`[data-vertical="clinical-performance"]`. Five tiers: color, structure
(radius / border / density / aspect / fit), elevation, motion, typography.
Nested wrappers work, so one page can host both verticals side by side.

| | luxury-editorial | clinical-performance |
| --- | --- | --- |
| Display face | Instrument Serif | Inter (600) |
| Eyebrow | 10px · 0.18em · uppercase | 10px · 0.14em · uppercase |
| Surface radius | 0 | 10px |
| Badge radius | 0 | 6px (technical tag) |
| Media | 4:5 · full-bleed cover | 1:1 · padded pedestal (contain) |
| Elevation | none (hairlines) | tactile |
| Motion | 400ms / 700ms media | 180ms / 500ms media |

### 2. Tailwind ↔ token bridge — `src/styles/globals.css`

`@theme reference` registers the token names so `bg-surface`, `rounded-surface`,
`p-card-pad`, `shadow-surface`, `ease-spring`, `aspect-product-media` … exist,
but emits **no** `:root` values — every utility resolves `var(--token)` at the
element. Composite voices (`type-eyebrow`, `type-display`, `type-metric`,
`type-label-mono`) are the only way primitives speak.

### 3. Mechanics — `src/styles/mechanics.css`

21st.dev micro-interactions sanitized into pure, token-bound CSS: spotlight
ring (`@property`-registered alpha), sheen sweep, arrow nudge, check-draw,
media crossfade / zoom. Nothing instantiates a JS animation controller, so
every primitive is safe inside a 30-item `.map()`.

### 4. Guardrails (enforced)

1. **Structural tokens over color swaps** — `bun run audit:tokens` fails on any
   hardcoded `rounded-*`, `p-*`, `gap-*`, `shadow-*`, `aspect-*`, `duration-*`,
   `ease-*`, `tracking-*`, `border-<n>` or zinc/white "SaaS slop" color inside
   `src/primitives/**`.
2. **Zero runtime JS in loops** — primitives rendered in grids are Server
   Components; interaction physics are CSS.
3. **Affiliate compliance** — monetized links route through `<AffiliateAction />`
   (`rel="sponsored nofollow noopener"`, UTM/subId injection, `onClick` +
   `onAuxClick` tracking).
4. **SEO-safe disclosure** — collapsibles stay mounted (`forceMount` + CSS grid
   `0fr → 1fr`).

## Primitive choreography

Every primitive is built with the same four steps, recorded in its file header:

1. **Mobbin** — real editorial/commerce patterns at 375 px → DOM slots + mobile rules.
2. **21st.dev** — interaction physics, stripped of styling → `mechanics.css`.
3. **Implement** — `src/primitives/<name>/<name>.tsx`: CVA structural variants,
   `data-slot` hooks, Radix `Slot` where polymorphism matters.
4. **Verify** — `<name>.stories.tsx`: every variant, a ★ multi-vertical
   side-by-side story with an identical payload, and a real 375 / 1280 story.

## Verification harness — `scripts/verify-stories.mjs`

Builds Storybook, serves it, and loads every story in headless Chromium at
375 px and 1280 px under both verticals. Each check records console errors,
failed requests, CLS (after `document.fonts.ready` and above-the-fold images),
horizontal overflow, and a full-page screenshot in `.verify/screens/`.
`--filter`, `--widths`, `--verticals`, `--interact` (hover sweep), `--no-screens`,
`--concurrency`.

## Fixtures

`src/fixtures/products.ts` — canonical `AffiliateProductEntity` payloads
(running-shoe roundup, a luxury watch, a lab-tested supplement, a 30-item
directory). Photography is real studio packshots from Unsplash
(`public/fixtures/ATTRIBUTION.md`); each image carries a sampled `backdrop`
colour so contain-fit frames match their tile to the shot.
