#!/usr/bin/env bun
/**
 * SPELLING AUDIT — American English everywhere: copy, docs, comments, names
 * and IDs (AGENTS.md). Part of `bun run check`.
 *
 *   bun run audit:spelling
 *
 * Scans every text file in the repository (tracked or new, not ignored) for
 * British spellings and names the American one. A line that must keep a
 * British spelling (a proper name, a quoted title) carries `spelling-ok`.
 */
import path from "node:path";

const ROOT = process.cwd();
const SELF = "scripts/audit-spelling.ts";
const TEXT = new Set([".ts", ".tsx", ".js", ".mjs", ".cjs", ".css", ".md", ".mdx", ".html", ".json", ".yml", ".yaml", ".txt"]);
const SKIP = new Set(["bun.lock", "package-lock.json", SELF]);

/** British spelling → the American one. */
const RULES: [RegExp, string][] = [
  [/colour/i, "color"],
  [/flavour/i, "flavor"],
  [/behaviour/i, "behavior"],
  [/neighbour/i, "neighbor"],
  [/favour/i, "favor"],
  [/honour/i, "honor"],
  [/\blabour/i, "labor"],
  [/humour/i, "humor"],
  [/rumour/i, "rumor"],
  [/harbour/i, "harbor"],
  [/endeavour/i, "endeavor"],
  [/(vigour|rigour|odour|armour|parlour|savour|vapour|tumour|candour|clamour|splendour|valour|ardour|fervour|saviour)/i, "-or"],
  [/catalogue/i, "catalog"],
  [/analogue/i, "analog"],
  [/\bcentr(e|es|ed|ing)\b/i, "center"],
  [/(milli|centi|kilo)?metres?\b/i, "meter"],
  [/\blitres?\b/i, "liter"],
  [/\bfibres?\b/i, "fiber"],
  [/\btheatres?\b/i, "theater"],
  [/calibre/i, "caliber"],
  [/\b(lustre|sombre|meagre|spectre|sabre)/i, "-er"],
  [/manoeuvre/i, "maneuver"],
  [/\bgrey/i, "gray"],
  [/(?<!aria-)labell(ed|ing)(?!by)/i, "labeled, labeling"],
  [/(model|travel|cancel|level|signal|total|fuel|counsel)l(ed|ing|er)\b/i, "one l: modeled, traveled, canceled"],
  [/(marvellous|woollen)/i, "marvelous, woolen"],
  [/jewellery/i, "jewelry"],
  [/enrolment/i, "enrollment"],
  [/\bfulfil(ment)?\b/i, "fulfill"],
  [/(skilful|wilful)/i, "skillful, willful"],
  [/instalment/i, "installment"],
  [/\b(licence|defence|offence|pretence)/i, "license, defense, offense, pretense"],
  [/\bpractis(e|ed|es|ing)\b/i, "practice (verb)"],
  [/\b(organ|recogn|real|summar|optim|priorit|minim|maxim|categor|custom|normal|standard|visual|apolog|author|capital|central|character|critic|final|initial|memor|personal|random|serial|special|stabil|synchron|util|familiar|general|local|modern|neutral|rational|sanit|symbol|token|emphas)is(e|ed|es|ing|ation|ations)\b/i, "-ize, -ization"],
  [/\b(analys|paralys|catalys)(e|ed|ing)\b/i, "-yze"],
  [/aluminium/i, "aluminum"],
  [/\bprogrammes?\b/i, "program"],
  [/\bcheques?\b/i, "check"],
  [/\btyres?\b/i, "tire"],
  [/\bkerbs?\b/i, "curb"],
  [/\bplough/i, "plow"],
  [/\bsceptic/i, "skeptic"],
  [/judgement/i, "judgment"],
  [/acknowledgement/i, "acknowledgment"],
  [/\bageing\b/i, "aging"],
  [/\b(whilst|amongst)\b/i, "while, among"],
  [/\b(learnt|spelt)\b/i, "learned, spelled"],
  [/\bstoreys?\b/i, "story"],
  [/\bmould/i, "mold"],
  [/smoulder/i, "smolder"],
  [/sulphur/i, "sulfur"],
  [/(anaesthe|paediatr|oestrogen|haemo)/i, "anesthe-, pediatr-, estrogen, hemo-"],
  [/artefact/i, "artifact"],
  [/focuss(ed|ing)/i, "focused"],
  [/benefitt(ed|ing)/i, "benefited"],
  [/speciality/i, "specialty"],
  [/\benquir/i, "inquire"],
  [/\bcosy\b/i, "cozy"],
  [/\bmaths\b/i, "math"],
  [/\bpostcodes?\b/i, "ZIP code"],
  [/\bfortnight/i, "two weeks"],
  [/\btonnes?\b/i, "ton"],
  [/\bpyjama/i, "pajama"],
  [/\btowards\b/i, "toward"],
  [/\bper cent\b/i, "percent"],
  [/\bdifferent to\b/i, "different from"],
];

const proc = Bun.spawnSync(["git", "ls-files", "-co", "--exclude-standard"], { cwd: ROOT });
const files = proc.stdout
  .toString()
  .split("\n")
  .filter((f) => f && TEXT.has(path.extname(f)) && !SKIP.has(f) && !SKIP.has(path.basename(f)));

let problems = 0;
for (const file of files) {
  const handle = Bun.file(path.join(ROOT, file));
  if (!(await handle.exists())) continue;
  const lines = (await handle.text()).split("\n");
  lines.forEach((line, i) => {
    if (line.includes("spelling-ok")) return;
    for (const [rule, american] of RULES) {
      const match = line.match(rule);
      if (match) {
        problems++;
        console.log(`  ✗ ${file}:${i + 1}  “${match[0]}” → ${american}`);
      }
    }
  });
}

if (problems) {
  console.log(`\n✗ ${problems} British spelling${problems === 1 ? "" : "s"}: the kit is written in American English (AGENTS.md)`);
  process.exit(1);
}
console.log(`✓ American English in ${files.length} files`);
