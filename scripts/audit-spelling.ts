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
  [/(model|travel|cancel|level|signal|total|fuel|counsel|channel|tunnel|funnel|panel|pencil|stencil|quarrel|dial|shovel|snorkel|rival|equal|initial|jewel|enamel|bevel|chisel|swivel|towel|trowel|ravel|barrel|gravel|kennel|pedal|spiral|imperil|marshal|libel|grovel|duel|cudgel|yodel|tassel|portal|medal)l(ed|ing|er|ers|ist|ists)\b/i, "one l: modeled, traveled, canceled, medalist"],
  [/(marvellous|woollen)/i, "marvelous, woolen"],
  [/jewellery/i, "jewelry"],
  [/enrolment/i, "enrollment"],
  [/\bfulfil(ment)?\b/i, "fulfill"],
  [/\b(enrol|instil|distil|appal)s?\b/i, "enroll, instill, distill, appall"],
  [/(skilful|wilful)/i, "skillful, willful"],
  [/instalment/i, "installment"],
  [/\b(licence|defence|offence|pretence)/i, "license, defense, offense, pretense"],
  [/\b(analys|paralys|catalys|hydrolys|electrolys|dialys)(e|ed|ing)\b/i, "-yze"],
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
  [/sulph/i, "sulf- (sulfur, sulfate)"],
  [/(anaesthe|paediatr|oestrogen|haem|anaem|leukaem|encyclopaed|orthopaed|oesophag|diarrhoea|caesium|\bfoet|\bfaec)/i, "anesthe-, pediatr-, estrogen, hem-, anem-, fet-"],
  [/\borientated\b/i, "oriented"],
  [/\byoghurts?\b/i, "yogurt"],
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

/**
 * Every -ise, -ised, -ising, -isation, -isable or -iser word is British unless
 * American English spells its base with -ise too (advertise, exercise,
 * surprise, otherwise…). Words are split at camelCase first, so an
 * identifier such as `isAdvertised` is read as two words.
 */
const ISE = /\b([A-Za-z]+?)is(e|es|ed|ing|ation|ations|able|er|ers)\b/g;
const AMERICAN_ISE = new Set(
  (
    "advertise advise apprise arise chastise circumcise comprise compromise demise despise devise disguise enfranchise disenfranchise " +
    "enterprise excise exercise expertise franchise improvise incise merchandise premise promise revise supervise surmise surprise " +
    "televise raise praise appraise braise upraise fundraise rise sunrise moonrise uprise noise poise counterpoise equipoise turquoise " +
    "guise precise imprecise concise paradise treatise reprise mortise tortoise porpoise anise valise cerise chemise cruise bruise " +
    "mayonnaise marquise malaise chaise liaise crise mise kaise vise louise denise elise eloise"
  ).split(" "),
);
const isAmerican = (base: string) => AMERICAN_ISE.has(base) || /(wise|cise|vise|guise)$/.test(base);

function britishIse(line: string): { word: string; american: string }[] {
  const out: { word: string; american: string }[] = [];
  for (const m of line.replace(/([a-z])([A-Z])/g, "$1 $2").matchAll(ISE)) {
    const base = `${m[1]!.toLowerCase()}ise`;
    // "disable" is dis + able, not an -ise word.
    if (isAmerican(base) || m[0].toLowerCase() === "disable") continue;
    const american = base === "practise" ? "practice" : `${m[1]}iz${m[2]}`;
    out.push({ word: m[0], american });
  }
  return out;
}

// Self-test: the -ise rule must catch these and pass the American words.
for (const [text, want] of [
  ["Micronised creatine, rubberised, crystallisation, prioritising, optimiser", 5],
  ["advertised, otherwise, surprising, isAdvertised, Promise.all, exercises, precisely, crises, fundraiser, disable", 0],
] as const) {
  const got = britishIse(text).length;
  if (got !== want) {
    console.log(`✗ spelling audit self-test: ${got} of ${want} flagged in “${text}”`);
    process.exit(1);
  }
}

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
    for (const { word, american } of britishIse(line)) {
      problems++;
      console.log(`  ✗ ${file}:${i + 1}  “${word}” → ${american}`);
    }
  });
}

if (problems) {
  console.log(`\n✗ ${problems} British spelling${problems === 1 ? "" : "s"}: the kit is written in American English (AGENTS.md)`);
  process.exit(1);
}
console.log(`✓ American English in ${files.length} files`);
