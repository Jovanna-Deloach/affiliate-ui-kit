# Storybook for people and agents

The Storybook is the kit’s interface. People browse it; AI agents read it through Storybook’s MCP server, and build pages from what it tells them. This document explains how it is wired, what an agent receives, and how to keep that accurate. The conventions for writing stories are in the Storybook itself, under **Kit / Guides / Writing stories**; the rules for agents are in [AGENTS.md](../AGENTS.md).

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

In `vitest.config.ts`, story files run in one page (`isolate: false`): with a fresh iframe per file, a long run can lose its browser connection. Run them with `bun run test:stories`.

## Curating the manifest

Too little context and an agent guesses; too much and it drowns. The manifest holds the kit and its guides, nothing else:

| In the manifest | Out of the manifest (`!manifest`) |
| --- | --- |
| Every kit primitive, component, block and template, one stories file each | The legacy library in `src/primitives` and `src/stories` (tagged `legacy`) |
| One story per use case, each with an `@summary` | Specimen sheets: every state of a part in both themes, in `*.specimen.stories.tsx` under **Kit / Specimen sheets** |
| The guides under **Kit / Guides** | |

Specimen sheets and legacy stories still render in the sidebar and still run in every test.

## Adding a component

1. Write the component with a JSDoc above its function: what it is, **Use it for**, **Not for** (naming the alternative), `@summary`, `@import` from its layer’s entry point. Give every prop a JSDoc line.
2. Export it from its layer’s `index.ts`.
3. Write its stories file (Kit / Guides / Writing stories): one use case per story, the most common first, each with a JSDoc comment and an `@summary`.
4. Optionally add its specimen sheet in `*.specimen.stories.tsx`.
5. Verify, as below.

## Verifying

| Command | What it proves |
| --- | --- |
| `bun run check` | Types, lint, the token and kit audits, the Data model guide in sync |
| `bun run test:stories` | Every story renders and passes its play function in Chromium |
| `node scripts/verify-stories.mjs --build --widths 375,1440 --concurrency 4 --no-screens` | Every story at phone and desktop widths: console errors, layout shift, overflow, the kit checks |
| `bun run build-storybook && bun run audit:manifest` | Every component in the manifest is a kit component with a summary, a “Not for”, a resolving import line, documented props and summarised stories; every guide has a summary |

`bun run audit:manifest --url http://127.0.0.1:6006` audits a running Storybook instead of the build.

**Troubleshooting.** Open `/mcp` in a browser, not with a bare `curl`: without `Accept: text/html` the request opens an event stream and never ends. A component with a docgen error in `/manifests/components.html` usually has a stories file whose `meta.component` is missing or points at a re-export.

## Sources

Storybook’s documentation for [AI](https://storybook.js.org/docs/ai), the [MCP server](https://storybook.js.org/docs/ai/mcp/overview), its [API](https://storybook.js.org/docs/ai/mcp/api) and [sharing](https://storybook.js.org/docs/ai/mcp/sharing), [manifests](https://storybook.js.org/docs/ai/manifests), [best practices](https://storybook.js.org/docs/ai/best-practices), the [Vitest add-on](https://storybook.js.org/docs/writing-tests/integrations/vitest-addon) and [tags](https://storybook.js.org/docs/writing-stories/tags); Chromatic’s [MCP](https://www.chromatic.com/docs/mcp). Where the documentation is silent (the 90-character list line, the three stories with code, the import line, meta JSDoc precedence), the behaviour above was read from the Storybook 10.6.5 source.
