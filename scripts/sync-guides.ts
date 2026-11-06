#!/usr/bin/env bun
/**
 * GUIDE SYNC — keeps the agent-facing Data model guide true to the code.
 *
 * Storybook’s docs manifest gives agents an MDX guide’s raw source, so the
 * contract cannot be imported or computed at runtime: it has to be written
 * into the guide. This script writes it, verbatim, from the source files:
 *
 *   src/kit/types.ts         the kit’s page contract (everything after the imports)
 *   src/types/affiliate.ts   the shared types the contract uses
 *
 * into src/kit/docs/data-model.mdx, between the `contract:start` and
 * `contract:end` markers.
 *
 *   bun run docs:sync           rewrite the guide
 *   bun run docs:sync --check   fail if the guide has drifted (part of `bun run check`)
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const GUIDE = path.join(ROOT, "src/kit/docs/data-model.mdx");
const SHARED = ["MerchantOffer", "ProductImage", "SubScoreItem", "AffiliateAttribution"];

/** The source of an exported interface or type alias, with the doc comment directly above it. */
function declaration(source: string, name: string): string {
  const start = new RegExp(`^export (?:interface|type) ${name}\\b`, "m").exec(source);
  if (!start) throw new Error(`src/types/affiliate.ts has no export named ${name}`);
  let from = start.index;
  const before = source.slice(0, from);
  const doc = /\/\*\*(?:(?!\*\/)[\s\S])*\*\/\n$/.exec(before);
  if (doc) from = doc.index;
  // The declaration ends at the first line that closes it at column 0.
  const rest = source.slice(start.index);
  const end = /^\}\n|^[^\n]*;\n(?=\n|$)/m.exec(rest);
  if (!end) throw new Error(`Could not find the end of ${name}`);
  return source.slice(from, start.index + end.index + end[0].length).trimEnd();
}

async function contract(): Promise<string> {
  const kit = await readFile(path.join(ROOT, "src/kit/types.ts"), "utf8");
  const shared = await readFile(path.join(ROOT, "src/types/affiliate.ts"), "utf8");
  const body = kit.replace(/^import[^;]+;\n+/gm, "").trim();
  const sharedTypes = SHARED.map((name) => declaration(shared, name)).join("\n\n");
  return [
    "```ts",
    "// src/kit/types.ts: import from \"@/kit/types\"",
    body,
    "",
    "// src/types/affiliate.ts: import from \"@/types/affiliate\"",
    sharedTypes,
    "```",
  ].join("\n");
}

const START = /\{\/\* contract:start[^}]*\*\/\}\n/;
const END = "{/* contract:end */}";

const guide = await readFile(GUIDE, "utf8");
const start = START.exec(guide);
const end = guide.indexOf(END);
if (!start || end < 0) throw new Error("data-model.mdx is missing its contract markers");
const next = guide.slice(0, start.index + start[0].length) + (await contract()) + "\n" + guide.slice(end);

if (process.argv.includes("--check")) {
  if (next !== guide) {
    console.log("✗ src/kit/docs/data-model.mdx is out of date with src/kit/types.ts. Run `bun run docs:sync`.");
    process.exit(1);
  }
  console.log("✓ Data model guide matches the contract");
} else {
  await writeFile(GUIDE, next);
  console.log(next === guide ? "Data model guide already up to date" : "Updated src/kit/docs/data-model.mdx");
}
