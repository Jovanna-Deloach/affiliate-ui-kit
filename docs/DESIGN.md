# Design system — page-first kit

This document is the source of truth for how pages built from this kit look
and why. It is written for people **and** for agents: an agent generating a
page should read it before composing anything, and copy a composition from
`src/kit/templates`, not assemble parts by hand. Agents read the same rules,
condensed, through Storybook’s MCP server: the guides (**Getting started**,
**Foundations**, **Guidelines**) and each component’s documentation ([`AGENTS.md`](../AGENTS.md),
[`docs/STORYBOOK.md`](STORYBOOK.md)).

## The brief

An independent product-testing publication earns money through affiliate
links. Its readers distrust affiliate pages, because most of them are spam.
A page earns trust through **restraint and evidence**: it gives the answer
in the first viewport, proves it below, and lets the reader buy without
hunting, with the commission disclosed in plain words before the first buy
link.

The kit must produce **unique** sites — a watch magazine and a supplement
lab must not look like the same template recolored — while every page
built from it meets the same quality floor. The bar is an editorial
publication with a design desk, not a dashboard: real photography of every
product, a typographic system with three distinct voices, cool white
surfaces, and boxes only where a box does a job. No beige, cream or
parchment: warm off-whites read as dated.

**Uniqueness comes from themes and composition. Quality comes from
constraints.** Components do not offer a menu of looks; a theme decides the
look, the archetype decides the composition, and `bun run check` refuses
pages that break the rules below.

## The library: four layers

Every visual decision lives in exactly one place, and each layer is built
only from the layers beneath it. The Storybook sidebar follows the same
order (Primitives → Components → Blocks → Templates).

| Layer | Folder | What it is | Knows about |
| --- | --- | --- | --- |
| **Primitives** | `src/kit/ui` | the smallest pieces: Price, Meter, Disclosure, Eyebrow and Breadcrumb, Badge (Award, BestPrice, ResultMark), Button and the buy links, ProductImage, Avatar, Monogram, Sep | plain props and theme roles only |
| **Components** | `src/kit/components` | primitives composed into the pieces of a review: OfferCard, RetailerList, BuyBlock, VerdictCard, Scorecard and Telemetry, ProsCons, PullQuote, SpecSheet, PickMedia | the product contract (`Pick`, `KitProduct`, offers) |
| **Blocks** | `src/kit/blocks` | the sections of a page: article header, verdict bento, comparison, deep dive, catalog, method, masthead, footer | a guide’s sections |
| **Templates** | `src/kit/templates` | whole pages: the roundup and its archetypes | the whole `RoundupGuide` |

A block never re-draws something a component or primitive already draws: a
price is always `Price`, a bar is always `Meter`, a show/hide is always
`Disclosure`, a micro-caps label is always `Eyebrow`. Every part has a
Storybook page with one story per use case, each saying why you would use
it, and a Docs page with its props; that is what agents read. Every
primitive and component also has a specimen sheet (**Specimen
sheets**) with every state — discounted, sold out, one retailer, a failed
result, long names, missing data — in both themes and in a narrow column.

## Foundation (shared by every theme)

| | |
| --- | --- |
| Grid | 12 columns, 75rem (1200px) content well, 1.5rem gutters (1rem on phones). Blocks lay out by **container queries** (`@container`, `@xl:` … `@4xl:`), so a block looks right in whatever column it is placed |
| Measure | Reading text at most `65ch` (`max-w-measure`), set with `text-wrap: pretty`. Headlines are balanced (`text-wrap: balance`); the H1 is capped at the theme’s title measure (`max-w-measure-title`, 22ch) |
| Spacing | Tailwind’s 4px scale, restricted to 0.5 1 1.5 2 2.5 3 3.5 4 5 6 8 10 12 16 20 24 32. Page sections use `mt-chapter`, the theme’s section gap |
| Alignment | Columns that sit side by side start on one line (`items-start`). Bottom alignment (`items-end`, `self-end`, `place-*-end`) is banned in the kit; right-align with `text-right` or an auto margin |
| Surfaces | Three layers, never more. **Ground**: the page canvas, a cool step below white so cards read on it (`bg-ground`). **Paper**: cards with a 1px `line` border and the theme’s ambient elevation (`kit-card`, `--shadow-card`); the page’s lead pick sits on the same white, lifted a step further (`kit-card-feature`, `--shadow-feature`). **Well**: a recess inside a card (`kit-recess`, the buy box’s offer card). Photographs sit on the **studio well** (`kit-studio`), a radial sweep. Elevation comes only from the two theme shadows: the audit fails any other `shadow-*` |

## Typography: three voices

Every theme sets the same three voices. Each job has one voice, and a page
cannot invent a fourth: the audit fails Tailwind font sizes, arbitrary
sizes and the legacy text styles in the kit.

| Voice | Atelier / Assay | Jobs | Utilities |
| --- | --- | --- | --- |
| **1. Display serif** | Newsreader (optical sizes) / Playfair Display | the H1, section headings, product titles (the deep dive’s H2), hero figures (the composite score, the testing counts), italic pull-quotes, product names in cards and tables | `t-display`, `t-headline`, `t-title`, `t-name`, `t-name-sm`, `t-score`, `t-stat`, `t-quote` |
| **2. Text sans** | Plus Jakarta Sans / Inter | reading copy at 17px (1.0625rem) / 1.68 in `--fg-body`, deks and syntheses, likes and caveats, buttons (11px tracked capitals, 600), prices and table figures | `t-lead`, `t-body`, `t-ui`, `t-small`, `t-caption`, `t-button`, `t-price`, `t-figure`, `t-figure-table`, `t-figure-xl` |
| **3. Mono micro-caps** | JetBrains Mono (both) | 11px (0.6875rem), uppercase, +0.08em, 600: breadcrumb eyebrows (“Running · Buying guide”), the deep dive’s descriptor, verification stamps (“Updated October 28, 2026”), table heads, proof pills (“160 miles logged”), telemetry labels, the specifications toggle. Awards and stamps on photographs use the 10px cut (+0.1em) | `t-micro`, `t-micro-sm` |

**Capitals come from CSS.** Copy stays sentence case in the source and in
the fixtures (“Our pick”, “Best price”); `t-micro`, `t-micro-sm` and
`t-button` set the capitals. The audit fails a rendered string typed in
capitals, so a writer can never shout.

**Editorial scale** (fluid, 375px → 1440px):

| Role | Atelier (√2 from 18px) | Assay (4:3 from 18px) |
| --- | --- | --- |
| `t-display` (H1) | 36 → 72px, weight 300 | 36 → 60px, weight 400 |
| `t-headline` (section H2) | 25.5 → 50.9px | 28.4 → 42.7px |
| `t-title` (product titles) | 21.4 → 36px, weight 400 | 21.3 → 32px, weight 500 |
| `t-name` / `t-name-sm` | 20px / 17px | 20px / 17px |
| `t-score` / `t-stat` | 40px / 36px, tabular | 40px / 36px, tabular |
| `t-quote` | 20px / 1.45 italic | 20px / 1.45 italic |
| `t-lead` | 17 → 19px | 17 → 19px |
| `t-body` | 17px / 1.68 | 17px / 1.68 |

**Interface scale:** 10 and 11 (micro-caps) · 12 (`t-caption`) · 14
(`t-small`) · 15 (`t-ui`) · 18.75 (`t-figure-table`) · 24 (`t-price`, bold)
· 29.3 → 36.6 (`t-figure-xl`). The figure styles (`t-figure`,
`t-figure-table`, `t-figure-xl`, `t-price`, `t-score`, `t-stat`) set
**tabular, lining numerals**, so prices, scores and lab values line up, and
so does every element marked `data-numeric`, whatever its style; the story
checks verify the computed style. Interface prose (`t-ui`, `t-small`,
`t-caption`) keeps proportional lining figures, because Inter’s tabular set
also widens the hyphen: “dairy-free” would read “dairy - free”.

**Pull-quotes** hang their opening mark into the margin (`kit-hang`) so the
text edge stays optically true.

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

1. **Three voices, one job each.** Display serif for what reads as a title
   or a hero figure; text sans for reading and acting; mono micro-caps for
   labels, stamps and column heads. No fourth voice, no ad-hoc sizes.
2. **Micro-caps label; they never speak.** One short phrase at a time —
   an eyebrow, an award, a stamp, a column head, a proof — never a sentence,
   and never typed in capitals.
3. **Headings say something.** “How we tested 14 watches”, “The lab results”,
   not “Methodology”, “Comparison”.
4. **One filled action per viewport.** The action color is reserved for
   the buy button of the pick in view (and the comparison’s pill for our
   pick). Everything else is outlined, a quiet row or a text link.
5. **Space first, tone second, line last.** Separate content with space.
   When space is not enough, use a tone. Hairlines are for cards, tables and
   lists of rows. Elevation is the theme’s, never a component’s.
6. **Box only what is a thing you act on.** Containers nest twice at most —
   card, then one recess — and inside a deep dive the only box is the buy
   box’s offer card. Scores, quotes, likes and caveats and specifications
   are not boxed.
7. **Numbers only for sequences.** Picks are awards (“Our pick”, “Budget
   pick”), never “01 — Best overall”. The protocol steps are numbered
   because they are a sequence.
8. **Plain words.** Buttons say what happens (“Buy at Verra”, “View deal at
   Northlane”). Arrows are icons, never glyphs; the dot between items in a
   micro-caps row is the `<Sep />` part (decorative, hidden from screen
   readers), never a typed “·”.
9. **Phone is a layout, not a squeeze.** Every archetype has a designed
   375px layout. When width runs out a part drops a word it can spare (the
   retailer row’s “View” pill becomes its arrow), never a name or a price.
10. **Say it once.** No text block or sentence over 40 characters appears
    twice on a page. Product names are identifiers and are exempt.

## Page anatomy

### Quick verdict ≠ deep dive

The answer above the fold and the proof below it must not repeat each other.
A pick carries three different lines:

| Field | Where | What it says |
| --- | --- | --- |
| `verdict` | the verdict hero, when the pick leads the page | why, in two lines: “The one watch that travels, swims and dresses up without asking you to choose.” |
| `bestFor` | compact verdict cards, the comparison’s “Best for” column, catalog cards | who it is for: “Best for the office, the pool and a second time zone.” |
| `synthesis` | deep-dive subhead | what we measured: “+1.6 s/day over 30 days of wrist and nightstand timing, the best of any automatic we tested.” |

The audit fails a contract whose `synthesis` restates `bestFor` or whose
`verdict` restates the `synthesis`, and a page where any long block repeats.

### The verdict bento

The answer, above the fold, as an asymmetric bento on the ground:

```
┌ 7 columns ──────────────────────────┐ ┌ 5 columns ─────────────────────┐
│ our pick: white, lifted further      │ │ studio │ [UPGRADE PICK]         │
│ studio well │ [OUR PICK]             │ │ well   │ name, best for         │
│             │ display name           │ │        │ price  [BUY AT X ↗]    │
│             │ two-line verdict …     │ ├────────────────────────────────┤
│             │ price, Best price,     │ │ compact card, pick 3           │
│             │ the one filled button  │ │                                │
└──────────────────────────────────────┘ └────────────────────────────────┘
```

- **Three cards at most.** Picks 4 and on appear in the comparison table,
  not in a box of leftovers.
- Every card has a full 1px border. Our pick is marked by its surface
  (`kit-card-feature`) and its solid award pill, never by a rule on one
  edge.
- The hero says **why** (`verdict`); compact cards say **who** (`bestFor`);
  the deep dive says **what we measured** (`synthesis`).
- One filled button on the first viewport, on the hero; compact cards carry
  an outlined button. The price stands alone; the merchant is named once,
  on the button. “Best price” appears only when another retailer has it in
  stock for more.
- **Photographs fill their well.** A verdict card’s studio well takes its
  height from the card, and the photograph (`detail="card"`) is laid in
  absolutely and contain-fit, so it never sets the card’s height. On a
  phone a compact card puts its price and button on the full width beneath
  the photograph and copy.

### Deep-dive geometry

Every `ProductDeepDiveCard` is a paper card with the same geometry, so a
page of them reads as one system:

```
┌ 5 columns, sticky ──────────┬ 7 columns ─────────────────────────────────┐
│ PickMedia, 4 : 4.2          │ Eyebrow: AUTOMATIC GMT, 40 MM STEEL        │
│ Award pinned top-left       │ Product name (H2, display serif)           │
│ AssayBadge, bottom-left     │ synthesis: the measured result             │
│ (supplements)               │ BuyBlock: OfferCard + RetailerList         │
│                             │ narrative, ≤ 65ch                          │
│ Scorecard                   │ ProsCons                                   │
│ 9.2 / 10     tier, standing │ ✓ …                   – …                  │
│ Meter, ten segments         │ PullQuote                                  │
│ five sub-scores on Meters   │ ┃ “display serif italic”, tester, proof    │
│ Telemetry (by category)     │                                            │
├ footer ─────────────────────┴────────────────────────────────────────────┤
│ SpecSheet drawer: FULL SPECIFICATIONS · 5 DETAILS                     [+] │
└───────────────────────────────────────────────────────────────────────────┘
```

- **Two things in the left rail**: the studio frame, then the scorecard
  with its telemetry. No navigation strip inside the card, no third box.
- Both columns start on the same line (the story checks require < 4px); no
  gap over 150px between blocks; the sticky rail runs at most 150px past
  the story.
- In a narrow container the columns dissolve into one reading order:
  photograph, story, scorecard, specifications.

**Studio frame.** 4 : 4.2 (3 : 2 when a narrow container stacks a wide
frame), the media radius (6px), `radial-gradient(circle at 50% 45%,
#FFFFFF, #E7ECF2)`. The cut-out is contain-fit inside a 9% inset with
`drop-shadow(0 16px 24px rgb(0 0 0 / 0.12))`. The award is a solid pill
pinned top-left (`Award`: the award color, 10px tracked mono). Supplements
add the lab’s verdict in the bottom-left corner, frosted (`AssayBadge`):
“ISO 17025 · 100.4% label claim · Pass”; under a 24rem frame the
accreditation is left to screen readers so the stamp stays on one line.

**Scorecard and telemetry** (`Scorecard`, `Telemetry`). No frame of its own:
“Overall score” in micro-caps, `t-score` (2.5rem display serif, tabular)
with “/ 10”, the tier and an honest standing (“1st of 14 tested”, “100.4%
of claim”; never an invented percentile), a 10-segment meter whose
part-filled segment is clipped, five sub-scores on 6px tracks, then the
category’s telemetry on a hairline:

| Category | Telemetry | Shows |
| --- | --- | --- |
| Watches | `ChronometerStrip` | one line: the six positions as ticks over the tolerance band (blued steel in Atelier), the mean rate (“Mean +1.6 s/day”), the tolerance, and how many positions fall outside (warning tone) |
| Supplements | `MetalRows` | lead, arsenic, cadmium and mercury in ppb against each limit (“16 / 100”); the bar is the share of the limit, in the warning tone from 50% and the fail tone above 100% |
| Running | `BenchRows` | energy return, loss at 300 miles and weight against the test average (the tick on each bar), then stack and drop |

**Pros and cons** (`ProsCons`). What we like and what to know in two
columns under micro-caps headings, with check and dash icons in the pass
and warning tones. No boxes, no rules. They stack under 36rem.

**Pull-quote** (`PullQuote`). A 2px rule in the action color, 20px of air, the tester’s
words in the display serif italic (1.25rem) with a hanging opening mark,
then their portrait or monogram, name and role, and a proof badge in
micro-caps (“64 days on the wrist”, “Ran both HPLC assays”).

**Specifications** (`SpecSheet`). A `Disclosure` footer across the card,
closed by default and in the DOM for search engines: “Full specifications
· 5 details” in micro-caps with a framed plus/minus, a two-column sheet
inside. The `sheet` variant sets the list on its own, always open.

### Provenance

Every person on a page carries `beats`. The byline author and every quoted
tester must cover the page’s category: the watches editor never bylines a
running test.

## Commerce rules

- Every monetized link goes through `<BuyButton>`, `<BuyRow>`, `<BuyPill>`
  or `<BuyLink>` (built on `AffiliateAction`: `rel="sponsored nofollow
  noopener"`, attribution, click tracking).
- **Lowest price first.** In-stock offers are ordered by price, lowest
  first; sold-out offers follow. A partner relationship never moves an offer
  up: a $160 partner cannot sit above a $149 retailer
  (`src/kit/lib/offers.ts`; the Proving Ground running guide is the proof
  case). Every surface — card, table, catalog, buy box — leads with the
  lowest in-stock price.
- **The buy box** (`BuyBlock`). The lead offer is a recessed offer card
  (`kit-recess`, 16px × 20px): on the left a 28px bordered monogram, the
  merchant and its terms (“Free 2-day shipping · Verified Oct 28”); on the
  right the price (`t-price`, 1.5rem bold tabular), the struck list price
  and “Best price” (only when another retailer has it in stock); beneath,
  one full-width 44px button, “View deal at Northlane”, in 11px tracked
  capitals with an arrow icon. Every other retailer is a compact 44px row
  on a hairline — monogram and name; the price, how far it sits above the
  best price (“+$10 vs. best”) and a bordered “View” pill — and the whole
  row is the link. Sold-out rows are not links.
- **One button per product.** The audit and the story checks fail a buy box
  with a second button.
- **The comparison’s last column** is the best price, “at {merchant}” and a
  “Buy” pill: filled in the action color for our pick, bordered for every
  other row.
- **Disclosure twice, in two lengths.** A notice in the article header’s
  byline region, before the first buy link on the page, and an inline line
  under 40 characters under every buy box (“We may earn a commission.”).
  The footer carries the full statement in different words.

## Publications and themes

A theme is the whole art direction: faces, palette, radii, elevation,
density. Themes live in `src/kit/theme/kit.css` and apply with `data-theme`
on any ancestor. To make a new site look unique, write a new theme; do not
add variants to components.

A publication with several beats is **one** theme. Its sections differ only
by `--accent-category`, set with `data-category`: the nav marker, award
text in tables, telemetry bars and verification badges. Wordmark, surfaces,
type and the buy action stay the publication’s.

### Atelier — a watch magazine (Caliber)

*A museum catalog, not a newspaper.* Objects get room; prose is set like a
book; the interface stays out of the way.

| Role | Value |
| --- | --- |
| Canvas | gallery white `#F5F7FA` |
| Card | `#FFFFFF`, 1px `#E0E6ED`, `0 1px 2px rgb(16 24 40 / 4%), 0 10px 28px −10px rgb(16 24 40 / 8%)` |
| Card, our pick | `#FFFFFF`, a deeper shadow |
| Well | `#EDF1F6` (strong line `#C8D1DC`) |
| Text | ink `#121820`; reading copy `#2B333E`; secondary `#576273` |
| Primary action | deep oxblood `#5E1914`, text `#FFFFFF` |
| Accent | blued steel `#2D5DA1`, as on a watch’s hands: tolerance band, award borders, the nav marker (text-safe `#24508F`) |

- **Type:** Newsreader with optical sizes (headlines 300, titles 400,
  quotes italic), Plus Jakarta Sans, JetBrains Mono.
- **Shape:** 6px cards and media, 4px controls. **Density:** generous.

### Assay — lab-tested health and performance (Proving Ground)

*A lab report you can read in ten seconds, printed on good paper.*

| Role | Value |
| --- | --- |
| Canvas | cool lab white `#F3F5F8` |
| Card | `#FFFFFF`, 1px `#E1E5EA`, `0 1px 3px rgb(16 24 40 / 3%), 0 8px 24px -4px rgb(16 24 40 / 5%)` |
| Card, our pick | `#FFFFFF`, a deeper shadow |
| Well | `#ECEFF3` (strong line `#CCD3DB`) |
| Text | obsidian `#111418`; reading copy `#2A2F37`; secondary graphite `#545C68` |
| Primary action | obsidian `#111418`, white tracked capitals |
| Category: supplements | botanical emerald `#1B4D3E`: lab badges, metal bars |
| Category: running | international vermilion `#C84B31`: athletic telemetry (text-safe `#A63B25`) |
| Pass / Fail / Near limit | `#0E7543` / `#C2362B` / `#9A5B00` |

- **Type:** Playfair Display (headlines 400, titles 500, quotes italic),
  Inter, JetBrains Mono.
- **Shape:** 8px cards, 6px controls and media. **Density:** compact.

## Imagery: studio photography

**Every product is photographed.** `KitProduct.image` is required, and the
contract audit fails a pick without one. A photograph is a background-free
cut-out (transparent WebP) set by `ProductImage` on the studio well:
`object-fit: contain` inside an inset that scales with the box, with the
contact shadow, so nothing is cropped and every product on a page sits on
the same light. The audit and the story checks fail a page where two
products share a photograph.

**Never a drawing of the object, never a chart in its place.** Data sits
beside the photograph (the scorecard’s telemetry) or on it (the lab badge).

Detail levels, through `PickMedia`: `full` (the deep dive’s frame),
`card` (fills a verdict card’s well), `thumb` (a square for tables, rows
and catalog cards).

The fixture photographs are cut-outs from Unsplash and Pexels
(`public/fixtures/ATTRIBUTION.md`). They are real products — several carry
their makers’ marks — standing in for fictional ones; a publication
replaces them with its own packshots.

## Primitives, components, blocks and archetypes

The tables below cover the editorial core. Every part, including controls, reviews and discovery, is listed in “What exists today” and documented in the Storybook.

**Primitives** (`src/kit/ui`, Storybook Primitives):

| Primitive | Job |
| --- | --- |
| `Price` | every price: four sizes (lg 1.5rem bold, md, sm, xs), the list price struck before the amount, a sold-out state, a note line (“at Verra”, “+$10 vs. best”, “$0.21 a serving”); alignment follows the surrounding text |
| `Meter` | a 6px meter beside a printed figure: continuous (with a reference tick) or segmented; tones meter, telemetry, warn, fail, muted; any value above zero shows a sliver |
| `Disclosure`, `DisclosureSummary`, `DisclosureIcon` | show and hide with a native `<details>`: no script, 44px summary, plus/minus (framed for card footers); a shared `name` makes an accordion |
| `Eyebrow`, `Breadcrumb` | the micro-caps voice: labels, descriptors, stamps (with an icon), parts joined by `<Sep />`; the article’s breadcrumb |
| `Badge` (`Award`, `BestPrice`, `ResultMark`) | pills in micro-caps: solid (awards), outline (proofs), frosted (on photographs), soft in a tone (results) |
| `Button`, `BuyButton`, `BuyPill`, `BuyRow`, `BuyLink`, `JumpLink` | actions and every monetized link (built on AffiliateAction) |
| `ProductImage`, `Avatar`, `Monogram`, `Sep` | studio photography on the radial well; portraits or initials; merchant initials; the decorative dot |

**Components** (`src/kit/components`, Storybook Components):

| Component | Job |
| --- | --- |
| `BuyBlock` | the buy box: `OfferCard` for the lowest in-stock offer, `RetailerList` for the rest, the inline disclosure; a notice when sold out everywhere |
| `OfferCard` | the lead offer: monogram, merchant and terms; price, list price and Best price; one full-width 44px button |
| `RetailerList` | every other retailer as a 44px row: price, “+$x vs. best”, a View pill (its arrow only under 24rem); sold out muted and unlinked |
| `VerdictCard` | a pick above the fold: `feature` (lifted surface, verdict, the one filled button; `wide` for a single-pick page) or `compact` (best for, outlined button; `stacked` puts the photograph on top) |
| `Scorecard`, `Telemetry`, `AssayBadge` | the composite score and sub-scores; the category’s measurements; the lab’s badge on the photograph |
| `ProsCons`, `PullQuote`, `SpecSheet` | the review’s points, the tester’s words, the specifications |
| `PickMedia` | a pick’s photograph at three detail levels: full, card, thumb |

**Blocks** (`src/kit/blocks`): eight container-driven sections, each
documented in Storybook (`Blocks/*`) in both themes and in a narrow
container:

| Block | Job |
| --- | --- |
| `EditorialArticleHeader` | micro-caps breadcrumb; title, dek, byline with the verification stamp, and the disclosure notice on 7 columns; the testing summary card on 5 |
| `TestingTelemetryBadge` | what was tested, how much (display-serif figures), against what reference; links to the method |
| `QuickVerdictBento` | the bento above: our pick on 7 columns, at most two compact cards on 5 matching its height |
| `AlsoGreatRail` | picks as catalog cards (`PickRow`: studio thumbnail, award, name, best for, price, Buy pill, jump link): the collector’s index |
| `ComparisonMatrix` | a decision tool in a card: micro-caps column heads on a rule (Product, Best for, the metrics, Best price), our pick on the category tint, a Buy pill per row. In a narrow container each contender is a small card: header, three key measurements as pills, a price line |
| `DisqualifiedSubTable` | what failed, on the comparison’s own columns (shared colgroup), never linked |
| `ProductDeepDiveCard` | one pick in full, the geometry above |
| `MethodologyAccordion` | the protocol as native disclosures |

Archetypes (`src/kit/templates`) compose them; each takes the same
`RoundupGuide` contract:

| Archetype | Composition |
| --- | --- |
| Roundup | header → verdict bento → comparison (+ disqualified) → deep dives → method |
| Head-to-head versus | header → two verdict cards → two-row comparison → two deep dives → method |
| Single-product lab assay | header → one verdict card → one deep dive → method |
| Collector’s guide | header → catalog of every piece → deep dives → method |

## Verification

| Gate | What it proves |
| --- | --- |
| `bun run audit:kit` (in `bun run check`) | **source:** type only through the voice utilities, elevation only through the theme shadows, color only through roles, spacing on the scale, icons not arrow glyphs, `<Sep />` not typed dots, no bottom alignment; **contracts:** provenance, a photograph for every pick, awards in words, sub-scores, a proof for every quote, measurements that match the category, a verdict that does not restate the synthesis; **rendered pages:** every archetype server-rendered and checked for repeated text, typesetting, copy typed in capitals, numbered eyebrows, merchant order, disclosure placement, deep-dive structure and story order, an award, a photograph and a composite score in every deep dive, self-reference and shared photographs; then a self-test that feeds each rule a page that breaks it |
| Story `play()` (`src/kit/testing/page-checks.ts`) | on every kit story — each primitive and component page as well as the blocks and templates — in the browser, at every width: deep-dive columns start within 4px, no gap over 150px, the sticky rail at most 150px longer than the story, primary/secondary/row CTAs ≥ 44px, tabular numerals computed on every numeric cell, merchant order, one photograph per product, no repeated text, and axe-core WCAG 2.0/2.1/2.2 A + AA with zero violations |
| `node scripts/verify-stories.mjs --build --widths 375,1440` | runs every story at both widths and fails on play() errors, console errors, failed requests, layout shift and horizontal overflow |
| `bun run test:stories` (Vitest, `@storybook/addon-vitest`) | runs every story’s play() in Chromium; the Storybook MCP server runs the same tests for agents (`test-run`), and a failure lists every problem |
| `bun run audit:spelling` (in `bun run check`) | American English in every file: copy, docs, comments, names and IDs |
| `bun run docs:check` (in `bun run check`) | the Data model guide matches `src/kit/types.ts` |
| `bun run build-storybook && bun run audit:manifest` | what agents read is complete: only kit components, each with a summary, a “Not for”, a resolving import line, documented props and summarized stories; only kit guides, each with a summary |

## What exists today

| Layer | Contents |
| --- | --- |
| Theme | `src/kit/theme/kit.css` — foundation, the three voices, Atelier, Assay, categories, Tailwind bridge, surface and studio utilities |
| Library | `src/kit/lib` — `typeset`, `rankOffers` / `leadOffer`, `lowerFirst` / `upperFirst`; `reviews` (a review list’s query, order and numbers); `discovery` (grades from scores, a ranking’s four orders, `toReaderItem`, search over a small index); `reader` (the reader’s device memory: viewed, saved, compare, recent searches, and `RememberVisit`); `warnings` (whether a warning stands, its id and labels); `theme-root` (overlays portaled inside the theme) |
| Story kit | `src/kit/testing` — the story frame (`theme`, `category` and `frame` parameters), `Specimen` and `State` for the specimen sheets, the page checks, `seedDevice` / `seedSearches` for parts that read the device; `src/fixtures/kit/cases.ts` for edge cases |
| Guides | `src/kit/docs` — Start here; Foundations (Themes, Color, Typography, Layout, Surfaces); Data model (generated contract), Composing pages, Making pages distinct; Writing stories |
| Primitives | `src/kit/ui` — Price, Meter, Disclosure, Eyebrow, Breadcrumb, Badge, Award, BestPrice, ResultMark, Button, BuyButton / BuyPill / BuyRow / BuyLink, JumpLink, ProductImage, Avatar, Monogram, Sep. Controls and overlays: Tabs, TabLinks, Tooltip, Explainer, Dialog, Drawer, Toast, Field, TextField, TextArea, Checkbox, Radio, ChoiceGroup, Switch, Select, SegmentedControl, SearchField, Chip, Pagination, Alert, Skeleton, EmptyState. Reviews: StarRating, RatingInput, RatingBar, ReviewLabel, RelativeTime, HelpfulButton, ReadMore. Discovery and returning readers: GradeBadge, CertificationStatus, SaveButton, CompareButton, ReadingProgress. Safety: Banner |
| Components | `src/kit/components` — BuyBlock, OfferCard, RetailerList, VerdictCard, Scorecard, Telemetry (ChronometerStrip, MetalRows, BenchRows), AssayBadge, ProsCons, PullQuote, SpecSheet, PickMedia, Gallery, StickyBuyBar, TableOfContents, HelpfulPrompt. Reviews: RatingSummary, ReviewCard, ReviewTopics, AiReviewSummary, ReviewFilters, ReviewSort, TrustSignals. Discovery: ProductCard, BrandCard, CategoryCard, SearchResult, ContinueCard, AccountMenu. Safety and alerts: WarningNote, CertificationNotice, SafetyPanel, PriceHistory, PriceAlert |
| Blocks | `src/kit/blocks` — SiteHeader, SiteFooter and the eight sections (with PickRow for the catalog). Reviews: ReviewsSection, WriteReview, TrustPrinciples. Discovery and returning readers: QuickLinks, SiteSearch, CategoryIndex, RankingList, PeopleAlsoLookedAt, PickUpWhereYouLeftOff, SavedItems, CompareTray. Safety and alerts: ConsumerWarning, AlertsManager |
| Templates | `src/kit/templates` — RoundupPage, VersusPage, LabAssayPage, CollectorsGuidePage |

The older `src/primitives` library is frozen; its running guide now lives in
the kit as Proving Ground’s running section.
