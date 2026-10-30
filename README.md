# Affiliate UI Kit

Multi-vertical affiliate & editorial commerce primitives. **One structural
spine, two tones.** A luxury editorial publication and a clinical
performance/testing database render the *same components and the same data*;
every keyline, radius, inset and rhythm is shared ("Editorial Precision"), and a
vertical only shifts chromatic temperature and the display voice.

```
bun install
bun run storybook      # http://localhost:6006 — switch tones from the toolbar
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

`:root` carries the **structural spine** — identical in every vertical:

| Tier | Tokens | Values |
| --- | --- | --- |
| Spatial modulus | `--space-1 … --space-12` | strict 4px / 8px scale |
| Anatomy | `--inset-card` 24 · `--inset-well` 20 · `--inset-bar-*` 24/12 · `--row-y` 12 · `--gap-cluster` 8 · `--gap-stack` 16 · `--gap-section` 40 | named rhythm, never raw numbers |
| Keylines | `--keyline-monogram` 40 · `--keyline-price` 110 · `--keyline-cta` 148 · `--keyline-label` 180 · `--keyline-subscore` 110 · `--keyline-value` 36 · `--keyline-status` 90 · `--keyline-toggle` 28 | fixed grid tracks (Law of Continuity) |
| Site chrome | `--size-masthead` 64 · `--size-ribbon` 44 · `--size-row-touch` 48 · `--measure-page` 80rem · `--inset-page-x` 24 (`page-well` utility) | masthead, ribbon and footer share one page well |
| Geometry | `--radius-container` 6 · `--radius-inner` 4 · `--radius-control` 4 · `--radius-tag` 3 · `--radius-pill` (dots + gauge tracks) · 1px hairlines · `--size-control` 36 · `--size-portrait` 56 | crisp architectural geometry |
| Type scale | 11 eyebrow · 12 caption · 13 body-sm · 15 body (1.6, 62ch) · 20 title · 30 display · 36 hero metric | modular, shared |
| Motion | `--duration-interactive` 220ms · `--duration-reveal` 360ms · `--duration-media` 600ms · `--ease-standard` | one timing for the whole kit |

A `[data-vertical]` block may only change **tone**:

| | luxury-editorial | clinical-performance |
| --- | --- | --- |
| Canvas → surface → recessed → inverse | `#F7F5F0` → `#FFFFFF` → `#F1EFEA` → `#141413` | `#F4F6F8` → `#FFFFFF` → `#EEF1F5` → `#0F172A` |
| Ink primary / secondary / tertiary | `#141413` / `#57534E` / `#8C867E` | `#0F172A` / `#475569` / `#94A3B8` |
| Hairline / strong rule | `rgba(20,20,19,.09)` / `.18` | `rgba(15,23,42,.09)` / `.18` |
| Display voice | Playfair Display 400 · −0.02em · 1.12 | Plus Jakarta Sans 600 · −0.025em · 1.15 |

Semantic status hues (emerald / amber / rose) are shared — meaning never
changes with tone.

**System presets** (set beside `data-vertical`, never per component) move the
whole kit at once, so a page always shares one geometry and one elevation
language: `data-shape="architectural | soft | pill"` (6/4/3 → 10/8/6 →
capsule controls and tags; media frames and wells stay rectangular) and
`data-elevation="flat | soft | tactile"` (`--shadow-surface` on resting cards,
`--shadow-elevated` on floating ones). Both are toolbar globals in Storybook
and rendered as a matrix under Foundations → Presets. Prices, scores and measured values are always Inter 600,
tabular, −0.02em (`type-metric`); monospace is reserved for short uppercase
metadata (`type-mono`).

### 2. Tailwind ↔ token bridge — `src/styles/globals.css`

`@theme reference` registers the token names so `bg-surface`, `bg-recessed`,
`text-ink-secondary`, `border-hairline`, `rounded-container`, `p-card`,
`px-bar-x`, `w-cta`, `gap-cluster`, `text-body-sm`, `ease-standard` … exist,
but emits **no** `:root` values — every utility resolves `var(--token)` at the
element. Composite voices (`type-eyebrow`, `type-mono`, `type-title`,
`type-display`, `type-hero-metric`, `type-metric`) are the only way primitives
speak.

### 3. Mechanics — `src/styles/mechanics.css`

21st.dev micro-interactions sanitized into pure, token-bound CSS: spotlight
ring (`@property`-registered alpha), sheen sweep, arrow nudge, check-draw,
media crossfade / zoom, loupe crossfade (stacked frames, opacity only),
split reveal (`clip-path: inset()` driven by one `--split` custom property),
menu-panel (viewport enter/exit keyed to `[data-state]`), ribbon-scroller /
ribbon-indicator (edge fades from `data-fade`; the active rule glides on two
measured custom properties) and drill-track (a two-stage `translate` track).
Nothing instantiates a JS animation controller — framer-motion is banned by
the audit — so every primitive is safe inside a 30-item `.map()`.

### 4. Guardrails (enforced)

1. **Structural tokens over color swaps** — `bun run audit:tokens` fails on any
   hardcoded `rounded-*`, `p-*`, `gap-*`, `shadow-*`, `aspect-*`, `duration-*`,
   `ease-*`, `tracking-*`, `border-<n>` or zinc/white "SaaS slop" color inside
   `src/primitives/**`.
2. **Zero runtime JS in loops** — primitives rendered in grids are Server
   Components; interaction physics are CSS.
3. **Affiliate compliance** — monetized links route through `<AffiliateAction />`
   (`rel="sponsored nofollow noopener"`, UTM/subId injection, `onClick` +
   `onAuxClick` tracking). Under `asChild` compliance still wins: the child's
   own `href`/`rel`/`target` are replaced or merged, never trusted alone
   (`affiliate-action.test.tsx`).
4. **SEO-safe disclosure** — collapsibles stay mounted (`forceMount` + CSS grid
   `0fr → 1fr`).

### 5. Gestalt laws every primitive obeys

- **Continuity — keyline grids.** Lists and tables never use `justify-between`
  with variable-width children. `<MerchantOfferList />` owns
  `40px | minmax(140px,1fr) | auto | ≥110px | ≥148px` and every row is a CSS
  subgrid of it, so prices and CTAs share one axis across the list while a
  longer label widens its track for every row instead of clipping; the
  best-price row is a recessed fill with an inset ring — never an indent.
  A row carries at most one pill (Best price · Our partner · Out of stock);
  shipping and promo facts are one muted caption.
- **Proximity — a value never drifts from its label.** `<SpecList />` rows sit
  on a 180px label keyline with the value left-aligned beside it (or a dotted
  leader in narrow cells); `<ProgressiveCollapse layout="assay" />` locks
  analyte · threshold meter · status pill · toggle onto four tracks.
- **Figure-ground.** `<ScoreMeter />` separates the verdict (recessed zone,
  hero numeral in the display voice, ten-block gauge) from the evidence
  (card plane, `110px | 1fr | 36px` rows with recessed wells and ink/80 fills).
- **Common region.** `<AuthorityByline variant="dossier-box" />` is two
  full-width regions in one container — bio header, then a recessed
  verification/methodology footer. Every byline variant shares one header
  grammar: text on the left keyline, the "How we tested" trigger as an outline
  control on the right, the protocol underneath across the full width.
- **Similarity — one silhouette per meaning.** Accolades are inverse-fill tags
  (`<AwardBadge />`, `BEST OVERALL`; ranking lives in `<EditorialHeading rank />`);
  inventory and commercial state are pills with a status dot; lab credentials
  are recessed mono chips (`<StatusPill kind="status" | "technical" />`).
- **Closure.** Headings hold a 64ch measure or a 7 / 5 dossier bar with a
  key-metric block; cards are anchored by a recessed action bar; grids that
  hold cards use `items-start`.

## Primitive choreography

Every primitive is built with the same four steps, recorded in its file header:

1. **Mobbin** — real editorial/commerce patterns at 375 px → DOM slots + mobile rules.
2. **21st.dev** — interaction physics, stripped of styling → `mechanics.css`.
3. **Implement** — `src/primitives/<name>/<name>.tsx`: CVA structural variants,
   `data-slot` hooks, Radix `Slot` where polymorphism matters.
4. **Verify** — `<name>.stories.tsx`: every variant, a ★ multi-vertical
   side-by-side story with an identical payload, and a real 375 / 1280 story.

### Built so far

| Tier | Primitive | Status |
| --- | --- | --- |
| 1 | AffiliateAction · MerchantOfferRow · PromoCodeChip | ✓ Sprint 2A / 3A |
| 2 | AwardBadge · StatusPill · ScoreMeter (+ MicroMeter) · AuthorityByline | ✓ Sprint 1A / 2A / audit |
| 3 | SurfaceCard · EditorialHeading · ProductMediaFrame | ✓ Sprint 1A |
| 4 | SpecList · ProgressiveCollapse | ✓ audit / Sprint 3A |
| 5 | ResponsiveSheet | ✓ Sprint 3A |
| 6 | InlineProductMention · MediaLoupeCarousel · SplitComparisonSlider · TesterCalloutQuote | ✓ Expansion batch 4 |
| 0 | Button (the non-monetized control — same silhouettes as AffiliateAction, no compliance) | ✓ Expansion batch 8 |
| 11 | MegaMenuEditorialPanel (+ MegaMenu host) · SubCategoryRibbon · MobileDrilldownDrawer · AuthorityFooter | ✓ Expansion batch 8 |
| 7–10 | TugOfWarMeter · DecisionTreeGrid · AlternativeSwapRow · CitationPopover · PriceContextBar · UnitEconomicsChip · EditorialMasthead · SpotlightSearchModal · SchemaBreadcrumbBar · ComparisonTrayDock · PriceAlertCapture | specified, not yet built |
| 1 | DisclosureBanner | backlog |
| 2 | ProsConsGrid | backlog |
| 3 | HotspotCanvas | backlog (3B) |
| 4 | StickyMatrix · QuickJumpBar · FacetFilterBar | backlog (FacetFilterBar 3B) |
| 5 | StickyBuyDock · ParametricInput | backlog (ParametricInput 3B) |

Attribution helpers (`src/lib/affiliate.ts`) are unit tested: `bun test`.

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
directory of distinct brand + model names — never concatenated loop indices).
Photography is real studio packshots from Unsplash
(`public/fixtures/ATTRIBUTION.md`); each image carries a sampled `backdrop`
colour so contain-fit frames match their tile to the shot. Author portraits
are real photographs too. `src/fixtures/lab-assays.ts` is a 16-row certificate
of analysis (analyte · result · reference · method · verdict) for the
clinical disclosure and pill stories. `src/fixtures/gallery.ts` carries the
Tier 6 visual-proof material: four loupe angles of the Aerolite 3 with tester
inspection notes, an out-of-box / after-400-miles wear pair, and attributed
tester quotes with their logged mileage. The midsole and upper crops and the
worn derivative are generated from the same packshot (see `ATTRIBUTION.md`).
`src/fixtures/navigation.ts` is the site chrome: three verticals with silos
(and tested counts), most-read guides, a winner or tool spotlight and top-three
winners; the running ribbon; the footer's trust stats, five-column directory
and compliance copy, under the fictional masthead "Proving Ground".
