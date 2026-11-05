# Design system — page-first kit

This document is the source of truth for how pages built from this kit look
and why. It is written for people **and** for agents: an agent generating a
page should read it before composing anything, and copy a composition from
`src/kit/templates`, not assemble parts by hand.

## The brief

An independent product-testing publication earns money through affiliate
links. Its readers distrust affiliate pages, because most of them are spam.
A page earns trust through **restraint and evidence**: it gives the answer
in the first viewport, proves it below, and lets the reader buy without
hunting, with the commission disclosed in plain words before the first buy
link.

The kit must produce **unique** sites — a watch magazine and a supplement
lab must not look like the same template recoloured — while every page
built from it meets the same quality floor.

**Uniqueness comes from themes and composition. Quality comes from
constraints.** Components do not offer a menu of looks; a theme decides the
look, the archetype decides the composition, and `bun run check` refuses
pages that break the rules below.

## Foundation (shared by every theme)

| | |
| --- | --- |
| Grid | 12 columns, 75rem (1200px) content well, 1.5rem gutters (1rem on phones). Blocks lay out by **container queries** (`@container`, `@xl:` … `@4xl:`), so a block looks right in whatever column it is placed |
| Measure | Reading text at most `65ch` (`max-w-measure`), set with `text-wrap: pretty`. Headlines are balanced (`text-wrap: balance`); the H1 is capped at the theme’s title measure, 18–35ch (`max-w-measure-title`: 22ch Atelier, 20ch Assay) |
| Spacing | Tailwind’s 4px scale, restricted to 0.5 1 1.5 2 2.5 3 4 5 6 8 10 12 16 20 24 32. Page sections use `mt-chapter`, the theme’s section gap |
| Alignment | Columns that sit side by side start on one line (`items-start`). Bottom alignment (`items-end`, `self-end`, `place-*-end`) is banned in the kit |

## Typography

Two scales, because editorial display and dense interface text do different
jobs.

**Editorial scale — headlines, deks, pull-quotes.** Anchored at the theme’s
body size. Each role is fluid (`clamp()`, 375px → 1440px) between two steps
of the theme’s ratio.

| Role | Atelier (augmented fourth, √2, from 18px) | Assay (perfect fourth, 4:3, from 16px) |
| --- | --- | --- |
| `t-display` (H1) | 36 → 72px · `clamp(2.25rem, 1.4577rem + 3.3803vw, 4.5rem)` | 37.9 → 50.6px · `clamp(2.3704rem, 2.0922rem + 1.187vw, 3.1605rem)` |
| `t-headline` (section H2) | 25.5 → 50.9px | 28.4 → 37.9px |
| `t-title` (product names) | 21.4 → 36px | 21.3 → 28.4px |
| `t-quote` (pull-quotes) | 19.2 → 24px · `clamp(1.2rem, 1.05rem + 0.5vw, 1.5rem)` | 19.2 → 21.3px |
| `t-lead` (deks, deep-dive synthesis) | 19 → 21.4px | 17 → 18.5px |
| `t-body` | 18px / 1.65 | 16px / 1.6 |

**UI scale — controls, tables, specifications, prices.** Major third (×1.25)
anchored at 15px: 12 (`t-caption`) · 15 (`t-ui`, `t-small`) · 18.75
(`t-figure-table`) · 23.4 · 29.3 → 36.6 (`t-figure-xl`, fluid). Every UI
voice sets **tabular, lining numerals**, so prices, scores, dimensions and
lab values line up in columns; numeric cells carry `data-numeric` and the
story checks verify the computed style.

**Pull-quotes** sit one editorial step below the product title (`t-quote`),
and the opening mark hangs into the margin (`kit-hang`) so the text edge
stays optically true.

**Micro-typography is done by the kit, not the writer.** Templates pass
every prose string through `typeset()` (`src/kit/lib/typeset.ts`):

| Writer types | Page shows |
| --- | --- |
| `38 mm`, `100 m`, `0.08 µg`, `+1.6 s/day`, `5 g` | the same with a no-break space, so a number never wraps away from its unit |
| `"quoted"`, `don't` | “quoted”, don’t |
| `95-110%` | 95–110% (en dash) |
| `-4%` | −4% (true minus) |
| `60 x 5 g` | 60 × 5 g |
| `≤ 0.5`, `38 / 30 mm` | tied with no-break spaces |

The audit fails a rendered page that still contains any left-hand form.

### Hierarchy rules

Enforced by `scripts/audit-kit.ts` wherever a machine can check them.

1. **One voice per job.** Headlines in the headline face, reading text in the
   text face, controls and numbers in the UI face. No monospace.
2. **No all-caps labels.** No tracked uppercase eyebrows above headings. If
   a heading needs context, write it into the heading, or set a
   sentence-case caption below it.
3. **Headings say something.** “How we tested 14 watches”, “The lab results”,
   not “Methodology”, “Comparison”.
4. **One filled action per viewport.** The accent fill is reserved for the
   buy button of the pick in view. Everything else is outlined, a quiet row
   or a text link.
5. **Space first, tone second, line last.** Separate content with space.
   When space is not enough, use the well tone. 1px rules are for tables and
   lists of rows (specifications, retailers, the protocol).
6. **Containers nest once.** A section may contain one boxed element.
7. **Numbers only for sequences.** Picks are awards (“Our pick”, “Budget
   pick”), never “01 — Best overall”. The protocol steps are numbered
   because they are a sequence.
8. **Plain words.** Buttons say what happens (“Buy at Verra”). No arrows in
   text (jump links use an arrow icon), no “A · B · C” meta strings.
9. **Phone is a layout, not a squeeze.** Every archetype has a designed
   375px layout; nothing truncates names or prices to fit.
10. **Say it once.** No text block or sentence over 40 characters appears
    twice on a page. Product names are identifiers and are exempt.

## Page anatomy

### Quick verdict ≠ deep dive

The answer above the fold and the proof below it must not repeat each other.
A pick carries two different lines:

| Field | Where | What it says |
| --- | --- | --- |
| `bestFor` | quick-verdict tile, also-great rail | who it is for: “Best for the office, the pool and a second time zone.” |
| `synthesis` | deep-dive subhead | what we measured: “+1.6 s/day over 30 days of wrist and nightstand timing, the best of any automatic we tested.” |

The audit fails a contract whose `synthesis` restates `bestFor`, and a page
where any long block repeats.

### Deep-dive geometry

Every `ProductDeepDiveCard` has the same geometry, so a page of them reads
as one system:

```
┌ 5 columns, sticky ─────────┐ ┌ 7 columns ──────────────────────────────┐
│ media, 4:3, ≤ 340px tall   │ │ award                                   │
│ how it scored / lab results│ │ H2 product name                         │
│ specifications             │ │ synthesis: the measured result          │
└────────────────────────────┘ │ buy block: one button, inline disclosure│
                               │ narrative, ≤ 65ch                       │
                               │ what we like  │  what to know           │
                               │ tester’s words (pull-quote)             │
                               └─────────────────────────────────────────┘
```

- Both columns start on the same line (the story checks require < 4px).
- No gap over 150px between blocks in either column.
- Every pick has media: a photograph, or its technical specimen.
- In a narrow container the columns dissolve into one reading order: media,
  the story, then the evidence and specifications.

### Provenance

Every person on a page carries `beats`. The byline author and every quoted
tester must cover the page’s category: the watches editor never bylines a
running test.

## Commerce rules

- Every monetized link goes through `<BuyButton>`, `<BuyRow>` or `<BuyLink>`
  (built on `AffiliateAction`: `rel="sponsored nofollow noopener"`,
  attribution, click tracking).
- **Lowest price first.** In-stock offers are ordered by price, lowest
  first; sold-out offers follow. A partner relationship never moves an offer
  up: a $160 partner cannot sit above a $149 retailer
  (`src/kit/lib/offers.ts`; the Proving Ground running guide is the proof
  case). Every surface — tile, table, rail, buy block — leads with the
  lowest in-stock price.
- **One button per product.** Other retailers are quiet rows (merchant,
  price, “Buy”), each a 44px target.
- **Disclosure twice, in two lengths.** A notice in the article header’s
  byline region, before the first buy link on the page, and an inline line
  under 40 characters inside every buy block (“We may earn a commission.”).
  The footer carries the full statement in different words.
- Prices show the merchant and the date they were checked.

## Publications and themes

A theme is the whole art direction: faces, palette, radii, density, image
treatment. Themes live in `src/kit/theme/kit.css` and apply with
`data-theme` on any ancestor. To make a new site look unique, write a new
theme; do not add variants to components.

A publication with several beats is **one** theme. Its sections differ only
by `--accent-category`, set with `data-category`: the nav marker, the
breadcrumb’s first crumb, award tags, score meters and specimen highlights.
Wordmark, surfaces, type and the buy action stay the publication’s.

### Atelier — luxury goods (Caliber)

*A museum catalogue, not a newspaper.* Objects get room; prose is set like a
book; the interface stays out of the way.

| Role | Value |
| --- | --- |
| Paper | `#FFFFFF` |
| Plinth (wells) | `#EFEDE9` |
| Ink / Muted | `#1F1D1B` / `#6B6560` |
| Line | `#E4E1DC` |
| Accent (buy, links, category) | Oxblood `#6F1D2B` |

- **Type:** Newsreader with optical sizes, headlines light (300); Hanken
  Grotesk 500 for interface, prices, tables.
- **Shape:** square images, 2px controls. **Density:** generous.

### Assay — lab-tested health and performance (Proving Ground)

*A lab report you can read in ten seconds.* Numbers are the hero.

| Role | Value |
| --- | --- |
| Paper | `#FFFFFF` |
| Bench (wells) | `#F1F3F6` |
| Ink / Muted | `#0E1726` / `#556070` |
| Line | `#DDE2E9` |
| Accent (buy, links) | Cobalt `#2F45D8` |
| Category: supplements / running | Cobalt `#2F45D8` / Teal `#0B6B7D` |
| Pass / Fail / Near limit | `#0E7543` / `#C2362B` / `#9A5B00` |

- **Type:** Archivo only; headlines and figures semi-expanded.
- **Shape:** 10px boxes, 8px controls. **Density:** compact. No shadows.

## Imagery: technical specimens

Without photography, each product is drawn from its own measurements by
`<TechnicalSpecimen>` (`src/kit/ui/specimen`) — never shared artwork.

| Kind | Parameters | Drawing |
| --- | --- | --- |
| Watch | `caseDiameterMm`, `lugToLugMm`, `thicknessMm`, `lugWidthMm`, `complicationType` (gmt, dress-subdial, diver-bezel, field-arabic), `strapType` (bracelet, leather, nato), `dialTone`, `date` | front and side profile at **one millimetre scale** across SKUs, with 1px architectural dimension lines (Ø, lug to lug, thickness) |
| Supplement | `formFactor` (wide-tub, micronised-pouch, capsule-bottle, gummy-jar), `netWeight`, `assayScore`, `impurities` | container in elevation, sized by net weight, beside its HPLC trace: peak height against a dashed 100% line, with the minor peaks found |
| Running shoe | `heelStackMm`, `forefootStackMm`, `weightOz`, `plate`, `rocker`, `upper` | lateral elevation at true proportion, heel and forefoot stack, drop, plate, toe spring |

Detail levels: `full` (dimensioned, 4:3, deep dives), `card` (studio crop,
verdict tiles), `thumb` (square, tables and rails). Lines are
`vector-effect: non-scaling-stroke` (always 1px); labels are HTML laid over
the drawing, so they stay at caption size on a phone. Each drawing carries
`data-specimen-hash`; the audit and the story checks fail a page where two
SKUs draw the same picture. Real photography replaces specimens per site
through `KitProduct.image`.

## Macro-primitives and archetypes

Eight container-driven blocks, each documented in Storybook
(`Kit/Blocks/*`) in both themes and in a narrow container:

| Block | Job |
| --- | --- |
| `EditorialArticleHeader` | breadcrumb; title, dek, byline and disclosure notice on 7 columns; the testing summary card on 5 |
| `TestingTelemetryBadge` | what was tested, how much, against what reference; links to the method |
| `QuickVerdictBento` | 1–3 tiles: award, name, who it is for, lowest price, one button, jump to the review. Rows align across tiles through subgrid |
| `AlsoGreatRail` | the remaining picks as quiet thumbnails with text links |
| `ComparisonMatrix` | every pick on the same columns; rows become labelled blocks in a narrow container |
| `DisqualifiedSubTable` | what failed, on the comparison’s own columns (shared colgroup), never linked |
| `ProductDeepDiveCard` | one pick in full, the geometry above |
| `MethodologyAccordion` | the protocol as native disclosures on a full-width well band |

Archetypes (`src/kit/templates`) compose them; each takes the same
`RoundupGuide` contract:

| Archetype | Composition |
| --- | --- |
| Roundup | header → verdict tiles → rail → comparison (+ disqualified) → deep dives → method |
| Head-to-head versus | header → two verdict tiles → two-row comparison → two deep dives → method |
| Single-product lab assay | header → one verdict tile → one deep dive → method |
| Collector’s guide | header → catalogue rail of every piece → deep dives → method |

## Verification

| Gate | What it proves |
| --- | --- |
| `bun run audit:kit` (in `bun run check`) | source rules; contracts (provenance, media, awards, synthesis); every archetype server-rendered and checked for repeated text, typesetting, merchant order, disclosure placement, numbered eyebrows, deep-dive structure, self-reference and unique specimens; then a self-test that feeds each rule a page that breaks it and fails if the rule does not fire |
| Story `play()` (`src/kit/testing/page-checks.ts`) | in the browser, at every width: deep-dive columns start within 4px, no gap over 150px, primary/secondary/row CTAs ≥ 44px, tabular numerals computed on every numeric cell, merchant order, unique drawings, no repeated text, and axe-core WCAG 2.0/2.1/2.2 A + AA with zero violations |
| `node scripts/verify-stories.mjs --build --widths 375,1440` | runs every story at both widths and fails on play() errors, console errors, failed requests, layout shift and horizontal overflow |

## What exists today

| Layer | Contents |
| --- | --- |
| Theme | `src/kit/theme/kit.css` — foundation, dual type scales, Atelier, Assay, categories, Tailwind bridge, text styles |
| Library | `src/kit/lib` — `typeset`, `rankOffers` / `leadOffer` |
| Parts | `src/kit/ui` — Button, BuyButton / BuyRow / BuyLink, JumpLink, ProductImage, TechnicalSpecimen, Award, ResultMark, ScoreBars |
| Blocks | `src/kit/blocks` — SiteHeader, SiteFooter, the eight macro-primitives, BuyBlock |
| Templates | `src/kit/templates` — RoundupPage, VersusPage, LabAssayPage, CollectorsGuidePage |

The older `src/primitives` library is frozen; its running guide now lives in
the kit as Proving Ground’s running section.
