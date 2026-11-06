# Storybook for people and agents

The Storybook is the kit’s interface. People browse it; AI agents read it through Storybook’s MCP server, and build pages from what it tells them. This document explains how it is organised for people, how it is wired for agents, what an agent receives, and how to keep that accurate. The conventions for writing stories are in the Storybook itself, under **Contributing / Writing stories**; the rules for agents are in [AGENTS.md](../AGENTS.md).

## The Storybook UI

The shell is modelled on the Wix Design System’s Storybook, with Grafana’s do and don’t guidance and Fluent’s “copy page” for AI.

**Sections.** The sidebar’s roots are its sections, in reading order:

| Section | What is in it | Source |
| --- | --- | --- |
| Getting started | Start here, the Playground, AI agents | `src/kit/docs/start-here.mdx`, `src/storybook/` |
| Foundations | Themes, Colour, Typography, Layout, Surfaces | `src/kit/docs/foundations/` |
| Guidelines | Data model, Composing pages, Making pages distinct | `src/kit/docs/` |
| Primitives, Components, Blocks, Templates | The kit, one entry per part | `src/kit/{ui,components,blocks,templates}` |
| Specimen sheets | Every state of a part, in both themes, for review | `src/kit/**/*.specimen.stories.tsx` |
| Contributing | Writing stories | `src/kit/docs/writing-stories.mdx` |
| Legacy | The older library, collapsed | `src/primitives`, `src/stories` |

A story’s title is its section and name (`Primitives/Price`); its ID follows (`primitives-price--discounted`). Tags `new`, `beta` and `deprecated` put a pill beside a name in the sidebar.

**The shell** (`.storybook/manager.tsx`, `theme.ts`, `manager-head.html`): the kit’s name and version, Inter for the interface and Newsreader for the brand (served from `node_modules` by `staticDirs`), no type icons in the sidebar, and the selected page in the Atelier oxblood. The toolbar shows only what changes the page in view: the theme on kit pages (locked, with the reason, on a story set in one theme) and the viewport; the legacy library’s four switches only on its own stories (`.storybook/addons/toolbar.tsx`). Zoom, measure, outline, backgrounds and remount are hidden. The add-on panel starts closed (the toolbar’s panel button opens it) except on the Playground. Storybook’s release notes, onboarding checklist and “create story” button are hidden.

**Component pages** (`src/storybook/docs/docs-page.tsx`): the layer, the name, its `@summary`, the import line to copy, **Copy for AI** (the component as `docs-show` would give it, as Markdown, from `/manifests/components.json`) and a link to its source; then **Use it for** and **Not for** as a pair of cards, split from the component’s JSDoc; then one example per story, with why you would use it; then the props. Every page has an “On this page” list. Templates have no docs page: they are whole pages, read as stories.

**The Playground** (Getting started / Playground): a code editor in the panel (`.storybook/addons/playground.tsx`) whose code renders in the canvas (`src/storybook/playground/`), with React, every kit part and the sample data in scope, in a frame and category the panel picks and the theme from the toolbar. Examples run from one part to a whole page. **Share** copies a link that carries the code; a link’s code is shown but runs only after the reader presses Run, because a link must never execute code unasked (the dev server can write files).

**Foundations** show the real theme CSS in both themes (`src/storybook/docs/blocks.tsx`: theme cards, the type scale measured at the page’s width, the spacing steps, the surfaces), and every hex value written in a guide gets a swatch beside it. The values agents need stay written out in the guides’ tables; agents read the MDX source, where a specimen is one tag.

## What an agent connects to

`bun run storybook` starts Storybook on port 6006 with three add-ons that matter here:

| Add-on | What it gives agents |
| --- | --- |
| `@storybook/addon-mcp` | An MCP server at `http://localhost:6006/mcp`. Open that URL in a browser for a status page listing the enabled toolsets. |
| `@storybook/addon-vitest` | Story tests in Chromium (`vitest.config.ts`), which the MCP server runs as `test-run`. |
| `@storybook/addon-a11y` | Accessibility results in those test runs. |

The MCP server exposes three toolsets:

| Toolset | Tools | Use |
| --- | --- | --- |
| docs | `docs-list`, `docs-show`, `docs-show-story` | Discover components and guides; read a component’s description, story code and props |
| dev | `get-storybook-story-instructions`, `stories-preview`, `stories-find-by-component`, `stories-changed` | Story-writing instructions; preview links for the stories an agent changed |
| test | `test-run` | Run stories’ play functions (the kit checks) and accessibility checks, and report what failed |

**Connecting an agent.** `.mcp.json` registers the server for Claude Code in this project. For other agents: `npx mcp-add --type http --url "http://localhost:6006/mcp" --scope project`. Start a new agent session after adding it; agents read MCP configuration at startup. To reach the server from another host, add the host name to `core.allowedHosts` in `.storybook/main.ts`.

**Sharing.** A Storybook published to Chromatic serves the docs toolset (not dev or test) at its `/mcp` route; a self-hosted one can use `@storybook/mcp`. Both read the manifests built by `bun run build-storybook`.

## What an agent receives

The docs tools read two manifests that Storybook builds by static analysis of the stories files, component JSDoc and prop types: `/manifests/components.json` and `/manifests/docs.json`. `/manifests/components.html` shows both with their errors and warnings. What reaches the agent, and therefore what each convention protects:

- **`docs-list`** prints one line per component: its name, id and `@summary` (or the first 90 characters of its description), then one line per guide with its `<Meta summary>`.
- **`docs-show`** prints the component’s description, then the **code of its first three stories** (with each story’s description), one-line summaries of the rest, then its props with their JSDoc and defaults. For a guide, it prints the raw MDX source.
- **Story code is generated statically.** `args` become JSX props; a `render` function is printed as written. Every component that appears in a stories file’s JSX, decorators included, goes into the import line printed above every snippet.
- **The import line** comes from the component’s `@import` JSDoc tag. Without it, Storybook prints the package name (`import { Price } from 'affiliate-ui-kit'`), which does not resolve. Parts used inside args are imported from their layer’s entry point (`@/kit/components`) so their import line resolves too.
- **JSDoc on a stories file’s `meta` replaces the component’s own JSDoc.** Document the component, not the meta.
- **Guides arrive as raw MDX.** Nothing computed at runtime or imported reaches the agent, so every value in a guide is written out. The contract in the Data model guide is generated from `src/kit/types.ts` by `bun run docs:sync`, and `bun run check` fails when it drifts.

## Configuration

In `.storybook/main.ts`:

- `features.componentsManifest: true` builds the manifests.
- `features.experimentalReactComponentMeta: true` extracts the manifest’s props with the TypeScript language service. With `react-docgen-typescript`, Storybook 10.6 drops a component’s JSDoc tags from the manifest, so `@summary` and `@import` never reach the agent. The autodocs props tables still use `react-docgen-typescript`.
- MDX guides (`src/**/*.mdx`) load before stories, with `remark-gfm` so their tables render.

In `vitest.config.ts`, story files run in one page (`isolate: false`): with a fresh iframe per file, a long run can lose its browser connection. Run them with `bun run test:stories`. They render at 1280px: `preview.tsx` sets the viewport global only in Vitest’s `test` mode, so people get the whole canvas.

## Curating the manifest

Too little context and an agent guesses; too much and it drowns. The manifest holds the kit and its guides, nothing else:

| In the manifest | Out of the manifest (`!manifest`) |
| --- | --- |
| Every kit primitive, component, block and template, one stories file each | The legacy library in `src/primitives` and `src/stories` (tagged `legacy`, under **Legacy**) |
| One story per use case, each with an `@summary` | Specimen sheets: every state of a part in both themes, in `*.specimen.stories.tsx` under **Specimen sheets** |
| The guides in `src/kit/docs`: Start here, the Foundations pages, the Guidelines, Writing stories | The Playground and the AI agents page, in `src/storybook` (also `!test`, the Playground) |

Specimen sheets and legacy stories still render in the sidebar and still run in every test. An MDX page leaves the manifest with `<Meta tags={["!manifest"]} />`.

## Adding a component

1. Write the component with a JSDoc above its function: what it is, **Use it for**, **Not for** (naming the alternative), `@summary`, `@import` from its layer’s entry point. Give every prop a JSDoc line.
2. Export it from its layer’s `index.ts`.
3. Write its stories file (Contributing / Writing stories), titled by its layer (`Components/Buy box`): one use case per story, the most common first, each with a JSDoc comment and an `@summary`.
4. Optionally add its specimen sheet in `*.specimen.stories.tsx`.
5. Verify, as below.

## Verifying

| Command | What it proves |
| --- | --- |
| `bun run check` | Types, lint, the token and kit audits, the Data model guide in sync |
| `bun run test:stories` | Every story renders and passes its play function in Chromium |
| `node scripts/verify-stories.mjs --build --widths 375,1440 --concurrency 4 --no-screens` | Every story at phone and desktop widths: console errors, layout shift, overflow, the kit checks |
| `bun run build-storybook && bun run audit:manifest` | Every component in the manifest is a kit component with a summary, a “Use it for” and a “Not for”, a resolving import line, documented props and summarised stories; every guide comes from `src/kit/docs` and has a summary |

`bun run audit:manifest --url http://127.0.0.1:6006` audits a running Storybook instead of the build.

**Troubleshooting.** Open `/mcp` in a browser, not with a bare `curl`: without `Accept: text/html` the request opens an event stream and never ends. A component with a docgen error in `/manifests/components.html` usually has a stories file whose `meta.component` is missing or points at a re-export.

## Sources

Storybook’s documentation for [AI](https://storybook.js.org/docs/ai), the [MCP server](https://storybook.js.org/docs/ai/mcp/overview), its [API](https://storybook.js.org/docs/ai/mcp/api) and [sharing](https://storybook.js.org/docs/ai/mcp/sharing), [manifests](https://storybook.js.org/docs/ai/manifests), [best practices](https://storybook.js.org/docs/ai/best-practices), the [Vitest add-on](https://storybook.js.org/docs/writing-tests/integrations/vitest-addon) and [tags](https://storybook.js.org/docs/writing-stories/tags); Chromatic’s [MCP](https://www.chromatic.com/docs/mcp). Where the documentation is silent (the 90-character list line, the three stories with code, the import line, meta JSDoc precedence, the toolbar and layout options in `addons.setConfig`), the behaviour above was read from the Storybook 10.6.5 source. The UI follows three showcase Storybooks: the [Wix Design System](https://www.wix-pages.com/wix-design-system-employees/), [Grafana UI](https://developers.grafana.com/ui/latest/index.html) and [Fluent UI](https://storybooks.fluentui.dev/react/).
