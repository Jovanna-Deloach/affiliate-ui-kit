# Instructions for AI agents

This repository is a component library for affiliate review pages (the **kit**, in `src/kit`) and the Storybook that documents it. Pages are built from the kit, and the Storybook is how an agent learns it: every component says when to use it and what to use instead, shows its intended usage as stories, and documents its props.

## Before you build or change any UI

1. **Start Storybook**: `bun run storybook` (http://localhost:6006). Its MCP server is at `http://localhost:6006/mcp`; `.mcp.json` registers it for Claude Code. For another agent: `npx mcp-add --type http --url "http://localhost:6006/mcp" --scope project`.
2. **Call `docs-list` once.** Read the guides first, in order: Getting started/Start here; the Foundations pages (Themes, Color, Typography, Layout, Surfaces); the Guidelines (Data model, Composing pages, Making pages distinct). Then call `docs-show` for every component you use.
3. **Never hallucinate component properties.** A prop that is not in the docs does not exist. Check every prop with `docs-show` (and `docs-show-story` for a variant it does not show), not by reading source. If the page needs a part the kit does not document, say so instead of hand-building it.
4. **Copy the imports the docs show**: `@/kit/ui`, `@/kit/components`, `@/kit/blocks`, `@/kit/templates`, `@/kit/types`, `@/kit/lib/offers`, `@/kit/lib/typeset`, `@/kit/lib/reviews`, `@/kit/lib/discovery`, `@/kit/lib/reader`.
5. **Before writing or changing stories**, call `get-storybook-story-instructions`, then follow Contributing/Writing stories where the two differ (titles by layer, framing by parameters, the kit checks as `play`, specimen sheets out of the manifest).

## Rules

- **American English, always**: page copy, docs, comments, names and IDs (color, gray, catalog, center, labeled, license, favorite). `bun run audit:spelling` fails on a British spelling.
- **Bun only**: `bun install`, `bun run …`, `bunx …`.
- **The kit only.** The older library in `src/primitives` (the Storybook’s Legacy section, the “Tier 0–15” stories) is kept for reference and hidden from agents; do not build kit pages from it.
- **React 19 and the Next.js App Router**: Server Components by default; `"use client"` only on interactive leaves.
- **Styling**: Tailwind v4 with the kit’s roles and `t-*` type styles; CVA, `clsx` and `tailwind-merge` (`cn` from `@/lib/cn`); Radix and vaul for behavior. No raw colors, no Tailwind font sizes, no ad-hoc shadows, no bottom alignment, no runtime JavaScript animation.
- **No beige**: every surface, tint and photo backdrop is white or a cool gray, in every theme and in the Storybook itself; never beige, cream, sand, peach or parchment. `bun run audit:kit` fails on a warm off-white.
- **Every monetized link** is a `BuyButton`, `BuyRow`, `BuyPill` or `BuyLink` (built on `AffiliateAction`: `rel="sponsored nofollow noopener"`, attribution, click tracking). Never a plain `<a>` to a retailer.
- **Disclosure** must stay search-safe and come first: the notice in the article header’s byline before the first buy link, “We may earn a commission.” under every buy box, the full statement in the footer.
- **Lowest price first**, sold out last; one filled action per viewport; one button per product; every product photographed; no sentence over 40 characters said twice.

## Check your work

- `bun run check`: types, lint, the token, kit and spelling audits, and the Data model guide in sync with `src/kit/types.ts`.
- `node scripts/verify-stories.mjs --build --widths 375,1440 --concurrency 4 --no-screens --filter src/kit/`: every kit story’s page checks (column alignment, voids, 44px targets, tabular numerals, merchant order, one photograph per product, repeated text, axe-core WCAG 2.2 AA) at phone and desktop widths.
- `bun run build-storybook && bun run audit:manifest`: what agents read through the MCP server is complete.
- After a visual change, call `stories-preview` for the stories you touched and include the links in your reply.

More: `docs/STORYBOOK.md` (how the Storybook is wired for agents and how to keep it accurate) and `docs/DESIGN.md` (the design system and the reasons behind its rules).
