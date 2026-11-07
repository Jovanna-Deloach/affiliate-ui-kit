# Instructions for AI agents

This repository is a component library for affiliate review pages (the **kit**, in `src/kit`) and the Storybook that documents it. Pages are built from the kit, and the Storybook is how an agent learns it: every component says when to use it and what to use instead, shows its intended usage as stories, and documents its props.

## Before you build or change any UI

1. **Start Storybook**: `bun run storybook` (http://localhost:6006). Its MCP server is at `http://localhost:6006/mcp`; `.mcp.json` registers it for Claude Code. For another agent: `npx mcp-add --type http --url "http://localhost:6006/mcp" --scope project`.
2. **Call `docs-list` once.** Read the guides first, in order: Getting started/Start here; the Foundations pages (Themes, Color, Typography, Layout, Surfaces); the Guidelines (Data model, Composing pages, Making pages distinct). Then call `docs-show` for every component you use.
3. **Never hallucinate component properties.** A prop that is not in the docs does not exist. Check every prop with `docs-show` (and `docs-show-story` for a variant it does not show), not by reading source. If the page needs a part the kit does not document, say so instead of hand-building it.
4. **Copy the imports the docs show**: `@/kit/ui`, `@/kit/components`, `@/kit/blocks`, `@/kit/templates`, `@/kit/types`, `@/kit/lib/offers`, `@/kit/lib/typeset`, `@/kit/lib/reviews`, `@/kit/lib/discovery`, `@/kit/lib/reader`, `@/kit/lib/warnings`, `@/kit/lib/evidence`.
5. **Before writing or changing stories**, call `get-storybook-story-instructions`, then follow Contributing/Writing stories where the two differ (titles by layer, framing by parameters, the kit checks as `play`, specimen sheets out of the manifest).

## Rules

- **American English, always**: page copy, docs, comments, names and IDs (color, gray, catalog, center, labeled, license, favorite). `bun run audit:spelling` fails on a British spelling.
- **Bun only**: `bun install`, `bun run …`, `bunx …`.
- **The kit only.** The older library in `src/primitives` (the Storybook’s Legacy section, the “Tier 0–15” stories) is kept for reference and hidden from agents; do not build kit pages from it.
- **React 19, rendered to static HTML** (the sites publish with Astro). A static part has no state, effects or event handlers and ships no JavaScript. An interactive part is an island (`"use client"`): Base UI (`@base-ui/react`) for dialogs, drawers, popovers, tooltips, menus, tabs, toasts and search; native HTML for form controls and disclosure. A block takes its islands as props or children, so a page hydrates the island, never the whole block. No `next/*` imports in the kit (`bun run audit:kit` lists the parts still on `next/image`); Radix and vaul remain only in parts that have not moved to Base UI yet.
- **Styling**: Tailwind v4 with the semantic tokens in `src/kit/theme/tokens.css` (`bg-surface-primary`, `bg-surface-raised`, `bg-surface-sunken`, `text-primary`, `text-prose`, `text-muted`, `border-subtle`, `border-bold`, `bg-action`, `text-category`, `text-success`…) and the `t-*` type styles; CVA, `clsx` and `tailwind-merge` (`cn` from `@/lib/cn`). A page’s identity is `data-theme` plus the presets `data-typography`, `data-shape` and `data-density` on its root element (Foundations / Themes). Tailwind’s palette is removed: no raw colors, no `dark:` overrides, no Tailwind font sizes, no ad-hoc shadows, no bottom alignment, no `space-x-*`/`space-y-*` (use `flex` or `grid` with `gap-*`), no runtime JavaScript animation. A part’s `className` places it (margin, grid position, width); it never changes its colors or type.
- **A white page, no beige**: the page background is white, in every theme (`ground`) and in the Storybook itself; every other surface, tint and photo backdrop is white or a cool gray; never beige, cream, sand, peach or parchment. `bun run audit:kit` fails on a warm off-white or a tinted page.
- **Every monetized link** is a `BuyButton`, `BuyRow`, `BuyPill` or `BuyLink` (built on `AffiliateAction`: `rel="sponsored nofollow noopener"`, attribution, click tracking). Never a plain `<a>` to a retailer.
- **Disclosure** must stay search-safe and come first: the notice in the article header’s byline before the first buy link, “We may earn a commission.” under every buy box, the full statement in the footer.
- **Lowest price first**, sold out last; one filled action per viewport; one button per product; every product photographed; no sentence over 40 characters said twice.

## Check your work

- `bun run check`: types, lint, the token, kit and spelling audits, and the Data model guide in sync with `src/kit/types.ts`.
- `node scripts/verify-stories.mjs --build --widths 375,1440 --concurrency 4 --no-screens --filter src/kit/`: every kit story’s page checks (column alignment, voids, 44px targets, tabular numerals, merchant order, one photograph per product, repeated text, axe-core WCAG 2.2 AA) at phone and desktop widths.
- `bun run build-storybook && bun run audit:manifest`: what agents read through the MCP server is complete.
- After a visual change, call `stories-preview` for the stories you touched and include the links in your reply.
- GitHub runs all of these on every push and pull request (`.github/workflows/checks.yml`). Run them yourself first: a red run there means something here was skipped.

More: `docs/STORYBOOK.md` (how the Storybook is wired for agents and how to keep it accurate) and `docs/DESIGN.md` (the design system and the reasons behind its rules).
