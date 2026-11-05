#!/usr/bin/env node
/**
 * KIT AUDIT — enforces the hierarchy rules in docs/DESIGN.md on src/kit.
 *
 *   • no all-caps labels, wide tracking, monospace or legacy eyebrow voices
 *   • no shadows (separation is space, then tone, then line)
 *   • type only through the t-* text styles (no arbitrary font sizes)
 *   • colour only through theme roles (no raw hex, no legacy tokens)
 *   • spacing on the restricted 4px scale
 *   • no arrows appended to text, no "A · B · C" meta strings
 *
 * Comments are ignored. Add `kit-allow` on a line to exempt it, with a reason.
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const KIT = path.join(ROOT, "src", "kit");
const SPACING = new Set(["0", "0.5", "1", "1.5", "2", "2.5", "3", "4", "5", "6", "8", "10", "12", "16", "20", "24", "32"]);

const RULES = [
  [/(?<![\w-])(?<!first-letter:)uppercase(?![\w-])/, "all-caps label (rule 2) — first-letter:uppercase (sentence case) is allowed"],
  [/(?<![\w-])tracking-(?:wide|wider|widest)(?![\w-])/, "wide tracking (rule 2)"],
  [/(?<![\w-])(?:font-mono|type-mono|type-eyebrow)(?![\w-])/, "monospace / eyebrow voice (rule 1)"],
  [/(?<![\w-])shadow(?:-[\w[\]()-]+)?(?![\w-])/, "shadow (rule 5)"],
  [/(?<![\w-])text-\[\d/, "arbitrary font size — use a t-* style"],
  [/(?<![\w-])text-(?:xs|sm|base|lg|xl|[2-9]xl)(?![\w-])/, "Tailwind font size — use a t-* style"],
  [/#[0-9a-fA-F]{3,8}\b/, "raw colour — use a theme role"],
  [/(?<![\w-])(?:bg|text|border|ring)-(?:surface|recessed|canvas|inverse|ink|ink-secondary|ink-tertiary|hairline|strong)(?![\w-])/, "legacy token in the kit"],
  [/(?<![\w-])rounded-(?:container|inner|control|tag|sm|md|lg|xl|2xl|3xl)(?![\w-])/, "radius outside the theme roles (box / ctl / media / full)"],
  [/→|⟶/, "arrow in text (rule 8)"],
  [/\s·\s/, "middle-dot meta string (rule 8)"],
];
const SPACING_RE = /(?<![\w-])-?(?:p|px|py|pt|pr|pb|pl|m|mx|my|mt|mr|mb|ml|gap|gap-x|gap-y|space-x|space-y)-(\d+(?:\.\d+)?)(?![\w.-])/g;

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(p)));
    else if (/\.tsx?$/.test(entry.name) && !/\.stories\.tsx$/.test(entry.name)) out.push(p);
  }
  return out;
}

const files = await walk(KIT).catch(() => []);
let violations = 0;
for (const file of files) {
  const lines = (await readFile(file, "utf8")).split("\n");
  lines.forEach((raw, i) => {
    const line = raw.trim();
    if (!line || line.startsWith("*") || line.startsWith("/*") || line.startsWith("//") || /kit-allow/.test(line)) return;
    const code = line.replace(/\{\/\*.*?\*\/\}/g, "");
    for (const [re, why] of RULES) {
      if (re.test(code)) {
        violations++;
        console.log(`${path.relative(ROOT, file)}:${i + 1}  ${why}\n    ${line.slice(0, 160)}`);
      }
    }
    for (const m of code.matchAll(SPACING_RE)) {
      if (!SPACING.has(m[1])) {
        violations++;
        console.log(`${path.relative(ROOT, file)}:${i + 1}  spacing step ${m[0]} is off the scale\n    ${line.slice(0, 160)}`);
      }
    }
  });
}
if (violations === 0) console.log(`✓ kit audit: ${files.length} files, 0 violations`);
else {
  console.log(`✗ kit audit: ${violations} violation(s) across ${files.length} files`);
  process.exit(1);
}
