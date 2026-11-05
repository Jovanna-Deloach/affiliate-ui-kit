# Design system — page-first reset

This document is the source of truth for how pages built from this kit look
and why. It is written for people **and** for agents: an agent generating a
page should read it before composing anything, and copy patterns from the
page templates in `src/kit/templates`, not from individual parts.

## The brief

An independent product-testing publication earns money through affiliate
links. Its readers distrust affiliate pages, because most of them are spam.
A page earns trust through **restraint and evidence**: it gives the answer
in the first viewport, proves it below, and lets the reader buy without
hunting, with the commission disclosed in plain words next to the first
buy button.

The kit must produce **unique** sites — a watch magazine and a supplement
lab must not look like the same template recoloured — while every page
built from it meets the same quality floor.

**Uniqueness comes from themes and composition. Quality comes from
constraints.** Components do not offer a menu of looks; a theme decides the
look, and the page template decides the composition.

## Foundation (shared by every theme)

| | |
| --- | --- |
| Grid | 12 columns, 75rem (1200px) content well, 1.5rem gutters (1rem on phones) |
| Measure | Body copy at most ~70 characters (`--measure`, 40rem by default) |
| Type scale | Major third (×1.25) from 16px: 13 · 14 · 16 · 18 · 20 · 25 · 31 · 39 · 49 · 61. Display sizes are fluid (`clamp`) between phone and desktop |
| Spacing | Tailwind's 4px scale, restricted to 0.5 1 1.5 2 2.5 3 4 5 6 8 10 12 16 20 24 32 (half steps only inside small controls). Page sections use `mt-chapter`, the theme's section gap |
| Text styles | `t-display` (H1) · `t-headline` (section H2) · `t-title` (product names, H3) · `t-lead` (deks) · `t-body` · `t-ui` (nav, buttons) · `t-small` · `t-caption` · `t-figure` (prices, numbers) |

### Hierarchy rules

These rules are enforced by `scripts/audit-kit.mjs` (part of `bun run check`)
where a machine can check them: all-caps, wide tracking, monospace, shadows,
arbitrary font sizes, raw colours, legacy tokens, off-scale spacing, arrows
and middle-dot meta strings all fail the build.

1. **One voice per job.** Headlines in the headline face, reading text in the
   text face, controls and numbers in the UI face. No monospace.
2. **No all-caps labels.** No tracked uppercase eyebrows above headings. If
   a heading needs context, write it into the heading ("The best dive
   watches under $5,000"), or set a sentence-case caption below it.
3. **Headings say something.** Section headings are statements a skimmer can
   act on ("Our pick: Lindqvist Ardent 38"), not category labels.
4. **One filled action per viewport.** The accent fill is reserved for the
   buy button of the pick in view. Other retailers are quiet rows with a
   price and a text link.
5. **Space first, tone second, line last.** Separate content with space.
   When space is not enough, use the well tone. Rules (1px lines) are for
   tables only.
6. **Containers nest once.** A section may contain one boxed element (a
   table, a well). Never a box inside a box inside a card.
7. **Numbers only for sequences.** Picks are awards ("Our pick", "Runner-up",
   "Budget pick"), not a ranked 01 / 02 / 03.
8. **Plain words.** Buttons say what happens ("Buy at Haus & Field"). No
   arrows appended to button text, no "A · B · C" meta strings, no marketing
   adjectives.
9. **Phone is a layout, not a squeeze.** Every page template has a designed
   375px layout; components never truncate names or prices to fit.

### Commerce rules

- Every monetized link goes through `<BuyButton>` / `<BuyLink>` (built on
  `AffiliateAction`: `rel="sponsored nofollow noopener"`, attribution, click
  tracking).
- One primary buy button per product. Additional merchants are listed as
  rows: merchant, price, a text link.
- The disclosure sentence sits next to the first buy button on the page.
- Prices show the merchant and the date they were checked.

## Themes

A theme is the whole art direction: faces, palette, radii, spacing density,
image treatment and the default layout of the hero. Themes live in
`src/kit/theme/*.css` and are applied with `data-theme` on any ancestor.
To make a new site look unique, write a new theme; do not add variants to
components.

### Atelier — luxury goods (watches, leather, jewellery)

*A museum catalogue, not a newspaper.* Objects get room; prose is set like a
book; the interface stays out of the way.

| Role | Value |
| --- | --- |
| Paper | `#FFFFFF` |
| Plinth (image wells) | `#EFEDE9` |
| Ink | `#1F1D1B` |
| Muted | `#6B6560` |
| Line | `#E4E1DC` |
| Accent (buy, links) | Oxblood `#6F1D2B` |

- **Type:** Newsreader with optical sizes for headlines and reading text —
  headlines light (300) at display optical size; body 18/1.65. Hanken
  Grotesk 500 for interface: navigation, buttons, prices, tables, captions.
- **Shape:** images square-cornered (objects are photographed, not carded);
  controls 2px.
- **Density:** generous — 8rem between sections.
- **Boldness is spent on** the plinth imagery and the light serif at display
  scale. Everything else is quiet.

### Assay — lab-tested health and performance (supplements, running)

*A lab report you can read in ten seconds.* Numbers are the hero.

| Role | Value |
| --- | --- |
| Paper | `#FFFFFF` |
| Bench (wells) | `#F1F3F6` |
| Ink | `#0E1726` |
| Muted | `#556070` |
| Line | `#DDE2E9` |
| Accent (buy, links) | Cobalt `#2F45D8` |
| Pass / Fail | `#13804A` / `#C2362B` |

- **Type:** Archivo only. Headlines and large figures semi-expanded (width
  112–118, weight 650); body at normal width 16/1.6; tabular figures
  everywhere numbers line up.
- **Shape:** 10px boxes, 8px controls, round pills only for pass/fail.
- **Density:** compact — 5rem between sections.
- **Boldness is spent on** the expanded numerals in the results table. No
  shadows anywhere.

## Review of the plan against generic defaults

Before building, each choice was checked against what an AI produces by
default for a similar brief:

- *Luxury → warm cream canvas + high-contrast Didone serif.* That is the most
  common generated look, and it is what the previous version of this kit
  was. Changed to white paper, with the warm neutral used only as the plinth
  behind objects, and a low-contrast bookish serif at light weights.
- *Hairline rules and zero radius everywhere* (broadsheet). Removed:
  separation by space and tone; rules only inside tables.
- *Tracked uppercase eyebrows, monospace data labels, middle-dot meta
  strings, arrows appended to links.* All banned by rule 2 and rule 8, and
  checked by the audit.
- *Lab theme → white rounded cards with soft shadows.* Changed: no shadows,
  boxes only for the results table and the verdict panel, tone elsewhere.
- *Numbered 01 / 02 picks.* The picks are awards, not a sequence. Named
  instead.

## Imagery

Fixture products use neutral placeholder renders
(`public/fixtures/kit/*.svg`, generated by `scripts/generate-placeholders.py`).
Every shape is black or white at partial opacity on a transparent ground, so a
placeholder takes the tone of the well it sits in and a grid of them reads as
one family. Real photography replaces them per site; `<ProductImage>` keeps
any image on the theme's well, contain-fit with consistent air around it.

## What exists today

| Layer | Contents |
| --- | --- |
| Theme | `src/kit/theme/kit.css` — foundation, Atelier, Assay, Tailwind bridge, text styles |
| Parts | `src/kit/ui` — Button, BuyButton / BuyLink, ProductImage, Award, ResultMark, ScoreBars |
| Blocks | `src/kit/blocks` — SiteHeader, ArticleHeader, PickHero (feature · strip), PicksTable, ReviewEntry (object · evidence), BuyPanel, Methodology, SiteFooter |
| Templates | `src/kit/templates/roundup-page.tsx` — the buying guide, lead `pick` or `results` |

The older `src/primitives` library is frozen. Its useful parts will be
folded into the kit as the category hub and directory templates are built;
the rest will be removed.
