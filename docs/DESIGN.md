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
| Surfaces | Three layers, never more. **Ground**: the page canvas, a tinted off-white (`bg-ground`; never `#FFFFFF`). **Paper**: cards, white with a 1px `line` border, 20–32px padding (`kit-card`). **Well**: a recess inside a card for media, the score header and the buy box (`bg-well`, `kit-recess`). Depth comes from these tones and hairlines, not shadows |

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
   When space is not enough, use the well tone. 1px rules are for cards,
   tables and lists of rows (specifications, retailers, the protocol).
6. **Containers nest twice at most: card, then well.** A card on the ground
   may hold wells (media, score header, buy box); a well never holds another
   framed box.
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
A pick carries three different lines:

| Field | Where | What it says |
| --- | --- | --- |
| `verdict` | the verdict hero, when the pick leads the page | why, in two lines: “The one watch that travels, swims and dresses up without asking you to choose.” |
| `bestFor` | compact verdict cards, pick rows | who it is for: “Best for the office, the pool and a second time zone.” |
| `synthesis` | deep-dive subhead | what we measured: “+1.6 s/day over 30 days of wrist and nightstand timing, the best of any automatic we tested.” |

The audit fails a contract whose `synthesis` restates `bestFor` or whose
`verdict` restates the `synthesis`, and a page where any long block repeats.

### The verdict bento

The answer, above the fold, as an asymmetric bento on the ground:

```
┌ 7 columns ───────────────────────────┐ ┌ 5 columns ───────────────────┐
│ ▬ 3px category rule                   │ │ well │ award, name, best for  │
│ well, media fills │ award, display    │ │      │ price  [Buy at X]      │
│                   │ name, 2-line      │ │      │ Read the full review ↓ │
│                   │ verdict … price,  │ ├──────────────────────────────┤
│                   │ Best price, the   │ │ compact card, pick 3         │
│                   │ one filled button │ │                              │
└───────────────────────────────────────┘ └──────────────────────────────┘
┌ 12 columns: also tested and recommended (picks 4+), two to a row ──────┐
```

- The hero says **why** (`verdict`); compact cards say **who** (`bestFor`);
  the deep dive says **what we measured** (`synthesis`). None repeats another.
- One filled button on the page’s first viewport, on the hero. Compact cards
  carry an outlined button; the sub-bar rows carry pills.
- The price stands alone; the merchant is named once, on the button.
  “Best price” appears only when another retailer has it in stock for more.
- **Media fills its well.** A verdict card’s well takes its height from the
  card, and the media (`detail="card"`) is laid in absolutely and
  contain-fit, so it never sets the card’s height and never floats small in
  a tall well. Watches use a portrait drafting plate whose strap runs to the
  15% margin and ends in a break line.

### Deep-dive geometry

Every `ProductDeepDiveCard` is a paper card with the same geometry, so a
page of them reads as one system:

```
┌ award · what it is ─────────────────────── Score · Specifications · Where to buy ┐
├ 5 columns, sticky ──────────┬ 7 columns ──────────────────────────────────────────┤
│ media well, 4:3 (3:2 wide)  │ H2 product name                                     │
│ composite score             │ synthesis: the measured result                      │
│   9.2 /10 · tier · standing │ buy box (well): price, Best price, provenance,      │
│   10-segment meter          │   one 46px button; other retailers as rows         │
│   five sub-scores           │ narrative, ≤ 65ch                                   │
│ measurements graphic        │ what we like │ what to know (hairline sub-grid)     │
│                             │ tester callout: italic, hanging quote, proof pill   │
├ 12 columns ─────────────────┴─────────────────────────────────────────────────────┤
│ specifications: a two-column spec sheet                                          │
└───────────────────────────────────────────────────────────────────────────────────┘
```

- Both columns start on the same line (the story checks require < 4px).
- No gap over 150px between blocks in either column, and the sticky media
  column never runs more than 150px past the story: the spec sheet sits
  full width beneath both columns so neither ends in a void.
- Every pick has media, an award in the header and a composite score under
  its media.
- In a narrow container the columns dissolve into one reading order: media,
  the story, then score, measurements and specifications.

**Composite score.** `t-score` (2.25rem, weight 600, tabular) with “/10”
muted, the tier (“Exceptional”, “Lab verified”) and an honest standing
(“1st of 14 tested”, “100.4% of claim”; never an invented percentile) on
a recessed header; a 10-segment meter whose part-filled segment is clipped,
not shrunk to a dot; then sub-scores on 6px tracks with right-aligned
tabular figures.

**Points and callout.** What we like / what to know sit in a two-column
sub-grid between hairlines, with a vertical rule between them: check badges
in the pass tone, dash badges in the warning tone. The tester’s words are a
recessed callout set in the theme’s quote voice (italic) with a hanging
opening mark, their portrait or monogram, name and role, and a proof pill
(“64 days on the wrist”, “Ran both HPLC assays”) on the right.

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
- **One button per product.** The buy box is a recessed well: the lead
  price with its struck original and a “Best price” badge (only when another
  retailer has it in stock), the merchant and the date the price was
  verified, and one button (46px tall, at least 220px wide, with an arrow
  icon). Every other retailer is a full-width row — merchant, price and a
  bordered “Buy” pill — each a 48px target; sold-out rows are not links.
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
| Ground (canvas) | Alabaster `oklch(0.978 0.007 80)` ≈ `#F8F6F1` |
| Paper (cards) | `#FFFFFF` |
| Well (recess) | `oklch(0.955 0.008 80)` ≈ `#F3F0EA` |
| Ink / Muted | `#1F1D1B` / `#6B6560` |
| Line | `oklch(0.905 0.009 80)` ≈ `#E3DFD9` |
| Accent (buy, links, category) | Oxblood `#6F1D2B` |

- **Type:** Newsreader with optical sizes, headlines light (300), quotes in
  Newsreader italic; Hanken Grotesk 500 for interface, prices, tables.
- **Shape:** 4px cards, 3px controls and media. **Density:** generous.

### Assay — lab-tested health and performance (Proving Ground)

*A lab report you can read in ten seconds.* Numbers are the hero.

| Role | Value |
| --- | --- |
| Ground (canvas) | Architectural stone `oklch(0.972 0.004 250)` ≈ `#F4F5F7` |
| Paper (cards) | `#FFFFFF` |
| Well (recess) | `oklch(0.948 0.006 250)` ≈ `#EBEEF2` |
| Ink / Muted | `#0E1726` / `#556070` |
| Line | `#DDE2E9` |
| Accent (buy, links) | Cobalt `#2F45D8` |
| Category: supplements / running | Cobalt `#2F45D8` / Teal `#0B6B7D` |
| Pass / Fail / Near limit | `#0E7543` / `#C2362B` / `#9A5B00` |

- **Type:** Archivo only; headlines and figures semi-expanded, quotes in
  Archivo italic.
- **Shape:** 12px cards, 8px controls and media. **Density:** compact. No
  shadows.

## Imagery: photographs, plates and certificates

What stands for a product is chosen by `PickMedia` (`src/kit/blocks/pick-media.tsx`):

1. **Studio photography**, when the site has it (`KitProduct.image`):
   cut-outs on the theme’s well, `object-fit: contain` inside a fixed inset
   (24px at full size, 7% of the box in verdict cards), so nothing is ever
   cropped. Wide objects (≥ 1.5:1, a shoe in profile) get a 3:2 frame in
   the deep dive instead of 4:3.
2. Otherwise a **data graphic generated from the product’s own numbers**:
   - Watches — a **drafting plate**: front elevation and side profile at one
     millimetre scale across SKUs, 0.75px drafting lines with inked dial
     furniture, dimension lines for Ø, lug to lug and thickness, and at
     least 14% clear margin inside the viewBox. Never cropped: straps end in
     a break line inside the plate.
   - Supplements — the **certificate of analysis**: every HPLC run overlaid
     on a shaded 95–110% acceptance window, the batch, the ISO 17025 lab,
     the measured dose on its window (4.75–5.50 g), heavy metals as ppb
     gauges against their limits, and the remaining checks.

**Never a drawing of the object.** No hand-drawn outlines of shoes, jars or
bottles: photography shows the object, graphics show the numbers.

Each review adds a **measurements module** beside its media:

| Category | Module | Shows |
| --- | --- | --- |
| Watches | `TimingStrip` | rate in six positions, diverging from zero over the tolerance band; positions outside tolerance in the warning tone; swatch legend |
| Running | `BiomechMatrix` | stack and drop drawn to scale; energy return, rebound lost at 300 miles and weight against the test average (2 × 2, one column in a narrow module) |
| Supplements | the certificate | (it is the media; it moves beside a photograph when a site has one) |

Detail levels: `full` (deep dives), `card` (fills a verdict card’s well),
`thumb` (square, tables and rows). Lines are `vector-effect:
non-scaling-stroke`; labels are HTML laid over the drawing, so they stay at
caption size on a phone. Each graphic carries `data-specimen-hash`; the
audit and the story checks fail a page where two SKUs draw the same
picture, or two products share a photograph.

## Macro-primitives and archetypes

Eight container-driven blocks, each documented in Storybook
(`Kit/Blocks/*`) in both themes and in a narrow container:

| Block | Job |
| --- | --- |
| `EditorialArticleHeader` | breadcrumb; title, dek, byline and disclosure notice on 7 columns; the testing summary card on 5 |
| `TestingTelemetryBadge` | what was tested, how much, against what reference; links to the method |
| `QuickVerdictBento` | the asymmetric bento above: hero on 7 columns, two compact cards on 5 matching its height, picks 4+ in a two-up sub-bar inside the same frame |
| `AlsoGreatRail` | picks as `PickRow`s (thumbnail, award, name, best for, price, retailer pill, jump link) in a card grid: the collector’s catalogue |
| `ComparisonMatrix` | a decision tool in a card: toned header row, our pick tinted with a 3px accent bar, price and a retailer pill in the last column. In a narrow container each contender is a small card: header, three key measurements as pills, a price line |
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
| `bun run audit:kit` (in `bun run check`) | source rules; contracts (provenance, media, awards, at least three sub-scores, scores within 0–10, a proof for every quote, measurements that match the category, a verdict that does not restate the synthesis); every archetype server-rendered and checked for repeated text, typesetting, merchant order, disclosure placement, numbered eyebrows, deep-dive structure and story order, an award and a composite score in every deep dive, self-reference, unique drawings and unique photographs; then a self-test that feeds each rule a page that breaks it and fails if the rule does not fire |
| Story `play()` (`src/kit/testing/page-checks.ts`) | in the browser, at every width: deep-dive columns start within 4px, no gap over 150px, the sticky media column at most 150px longer than the story, primary/secondary/row CTAs ≥ 44px, tabular numerals computed on every numeric cell, merchant order, unique drawings, no repeated text, and axe-core WCAG 2.0/2.1/2.2 A + AA with zero violations |
| `node scripts/verify-stories.mjs --build --widths 375,1440` | runs every story at both widths and fails on play() errors, console errors, failed requests, layout shift and horizontal overflow |

## What exists today

| Layer | Contents |
| --- | --- |
| Theme | `src/kit/theme/kit.css` — foundation, dual type scales, Atelier, Assay, categories, Tailwind bridge, text styles |
| Library | `src/kit/lib` — `typeset`, `rankOffers` / `leadOffer` |
| Parts | `src/kit/ui` — Button, BuyButton / BuyRow / BuyPill / BuyLink, JumpLink, ProductImage, TechnicalSpecimen, AssayGraphic, Scorecard, TimingStrip, BiomechMatrix, Award, ResultMark, BestPrice |
| Blocks | `src/kit/blocks` — SiteHeader, SiteFooter, the eight macro-primitives, BuyBlock, PickMedia, PickRow |
| Templates | `src/kit/templates` — RoundupPage, VersusPage, LabAssayPage, CollectorsGuidePage |

The older `src/primitives` library is frozen; its running guide now lives in
the kit as Proving Ground’s running section.
