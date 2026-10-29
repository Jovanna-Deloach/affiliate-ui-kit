#!/usr/bin/env node
/**
 * GUARDRAIL AUDIT — "Structural Tokens Over Color Swaps"
 * ---------------------------------------------------------------------------
 * Scans src/primitives/**\/*.tsx (stories excluded) for hardcoded structural
 * Tailwind utilities that would bypass the token contract:
 *
 *   rounded-*, p-*/px-*/py-*/gap-*/space-*, shadow-*, aspect-*, duration-*,
 *   ease-*, tracking-*, border-<n>, bg-zinc-*/white/* "SaaS slop" colours,
 *   framer-motion / motion imports.
 *
 * Allowed: token-bridged utilities (rounded-surface, p-card-pad, …),
 * arbitrary values that reference a token (`gap-[calc(var(--space-…)/2)]`),
 * icon sizing (size-*, h-*, w-*), and zero/px resets (p-0, gap-0, rounded-none
 * only when paired with a token elsewhere is still flagged — use the token).
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const PRIMITIVES = path.join(ROOT, "src", "primitives");

const STRUCTURAL = [
  /(?<![\w-])rounded(?:-(?:[trbl]|tl|tr|bl|br|s|e|ss|se|es|ee))?(?:-(?:none|xs|sm|md|lg|xl|2xl|3xl|4xl|full))?(?![\w-\[])/,
  /(?<![\w-])-?(?:p|px|py|pt|pr|pb|pl|ps|pe|gap|gap-x|gap-y|space-x|space-y|m|mx|my|mt|mr|mb|ml)-(?:\d+(?:\.\d+)?|px)(?![\w-])/,
  /(?<![\w-])shadow(?:-(?:2xs|xs|sm|md|lg|xl|2xl|none))?(?![\w-\[\/])/,
  /(?<![\w-])aspect-(?:square|video|auto|\d+\/\d+)(?![\w-])/,
  /(?<![\w-])duration-\d+(?![\w-])/,
  /(?<![\w-])ease-(?:linear|in|out|in-out|initial)(?![\w-])/,
  /(?<![\w-])tracking-(?:tighter|tight|normal|wide|wider|widest)(?![\w-])/,
  /(?<![\w-])border-(?:\d+)(?![\w-])/,
  /(?<![\w-])(?:bg|text|border|ring)-(?:zinc|neutral|slate|gray|stone|white|black)(?:-\d+)?(?:\/\d+)?(?![\w-])/,
];
const IMPORTS = [/from\s+["'](?:framer-motion|motion\/react|motion)["']/];

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(p)));
    else if (/\.tsx?$/.test(entry.name) && !/\.stories\.tsx?$/.test(entry.name)) out.push(p);
  }
  return out;
}

const files = await walk(PRIMITIVES).catch(() => []);
let violations = 0;

for (const file of files) {
  const src = await readFile(file, "utf8");
  const lines = src.split("\n");
  lines.forEach((line, i) => {
    if (/audit-allow/.test(line)) return;
    for (const re of IMPORTS) {
      if (re.test(line)) {
        violations++;
        console.log(`${path.relative(ROOT, file)}:${i + 1}  runtime animation import\n    ${line.trim()}`);
      }
    }
    // Only inspect string literals likely to be class lists.
    const classStrings = line.match(/["'`][^"'`]*["'`]/g) ?? [];
    for (const s of classStrings) {
      for (const re of STRUCTURAL) {
        const m = s.match(re);
        if (m) {
          violations++;
          console.log(`${path.relative(ROOT, file)}:${i + 1}  hardcoded structural utility "${m[0]}"\n    ${line.trim().slice(0, 160)}`);
        }
      }
    }
  });
}

if (files.length === 0) {
  console.log("audit: no primitives found yet");
} else if (violations === 0) {
  console.log(`✓ audit: ${files.length} primitive files, 0 structural violations`);
} else {
  console.log(`✗ audit: ${violations} violation(s) across ${files.length} files`);
  process.exit(1);
}
