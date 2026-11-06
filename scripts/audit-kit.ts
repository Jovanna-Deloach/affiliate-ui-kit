#!/usr/bin/env bun
/**
 * KIT AUDIT — enforces docs/DESIGN.md on src/kit. Part of `bun run check`.
 *
 * 1. SOURCE (every kit .ts/.tsx except stories)
 *    • type only through the t-* text styles (no arbitrary font sizes): the
 *      three voices — display serif, text sans, mono micro-caps — are
 *      utilities, so a page cannot invent a fourth
 *    • elevation only through the theme’s card shadows (no ad-hoc shadows)
 *    • colour only through theme roles (no raw hex, no legacy tokens)
 *    • spacing on the restricted 4px scale
 *    • arrows are icons, never glyphs in text; middle-dot separators are the
 *      <Sep /> part (decorative, aria-hidden), never typed into copy
 *    • no bottom alignment (items-end, self-end, place-*-end): product grids
 *      are top-aligned so columns share one baseline
 *
 * 2. CONTRACTS (the fixture guides an agent copies)
 *    • author and every quoted tester carry the page’s category in `beats`
 *    • every pick has studio photography, a composite score, measurements
 *      for its category and a quote with its proof
 *    • awards are words, never numbers; `synthesis` never restates `bestFor`
 *
 * 3. RENDERED PAGES (each archetype, server-rendered to HTML and parsed)
 *    • no text block, and no sentence, over 40 characters appears twice
 *      (product names are identifiers and exempt)
 *    • typesetting: no-break space between numbers and units, true quotes,
 *      en dashes in ranges, true minus, ×, …
 *    • merchants: in-stock offers lowest price first, sold out last, one
 *      button per buy block, and every surface leads with the lowest price
 *    • the disclosure notice comes before the first sponsored link; every
 *      buy block carries an inline disclosure under 40 characters
 *    • no numbered eyebrows (“01 — Best overall”); no copy typed in capitals
 *      (micro-caps are set by CSS, so the words stay sentence case)
 *    • deep dives: media present, slots in the documented order, one filled
 *      button, and no link or pill back to the product under review
 *    • no two SKUs share a photograph
 *
 * Layout checks that need a browser (column tops, voids, 44px targets,
 * computed tabular numerals, axe-core) run as CSF3 play() functions in the
 * kit stories; `node scripts/verify-stories.mjs` runs them at 375 and 1440.
 *
 * Comments are ignored by the source rules. Add `kit-allow` on a line to
 * exempt it, with a reason.
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { assayGuide, collectorsGuide, versusGuide } from "@/fixtures/kit/archetypes";
import { creatineGuide } from "@/fixtures/kit/creatine";
import { runningGuide } from "@/fixtures/kit/running";
import { caliberSite, provingGroundSite } from "@/fixtures/kit/sites";
import { watchesGuide } from "@/fixtures/kit/watches";
import { isRanked, leadOffer } from "@/kit/lib/offers";
import { typeset, typesettingIssues } from "@/kit/lib/typeset";
import { CollectorsGuidePage, LabAssayPage, VersusPage } from "@/kit/templates/archetypes";
import { RoundupPage } from "@/kit/templates/roundup-page";
import type { KitProduct, RoundupGuide, SiteChrome } from "@/kit/types";

const ROOT = process.cwd();
const KIT = path.join(ROOT, "src", "kit");
let violations = 0;
const fail = (where: string, why: string) => {
  violations++;
  console.log(`  ✗ ${where}  ${why}`);
};

/* ======================================================================== */
/* 1. Source rules                                                          */
/* ======================================================================== */

const SPACING = new Set(["0", "0.5", "1", "1.5", "2", "2.5", "3", "3.5", "4", "5", "6", "8", "10", "12", "16", "20", "24", "32"]);
const RULES: [RegExp, string][] = [
  [/(?<![\w-])(?:shadow-(?:sm|md|lg|xl|2xl|inner)|shadow-\[)(?![\w-])/, "ad-hoc shadow — use the theme’s card elevation (kit-card, kit-card-feature)"],
  [/(?<![\w-])(?:type-mono|type-eyebrow)(?![\w-])/, "legacy voice in the kit — use t-micro"],
  [/(?<![\w-])text-\[\d/, "arbitrary font size — use a t-* style"],
  [/(?<![\w-])text-(?:xs|sm|base|lg|xl|[2-9]xl)(?![\w-])/, "Tailwind font size — use a t-* style"],
  [/#[0-9a-fA-F]{3,8}\b/, "raw colour — use a theme role"],
  [/(?<![\w-])(?:bg|text|border|ring)-(?:surface|recessed|canvas|inverse|ink|ink-secondary|ink-tertiary|hairline|strong)(?![\w-])/, "legacy token in the kit"],
  [/(?<![\w-])rounded-(?:container|inner|control|tag|sm|md|lg|xl|2xl|3xl)(?![\w-])/, "radius outside the theme roles (box / ctl / media / full)"],
  [/(?<![\w-])(?:@?[\w-]*:)?(?:items-end|self-end|place-items-end|place-self-end)(?![\w-])/, "bottom alignment — product grids are top-aligned (items-start)"],
  [/→|⟶|↗|↓/, "arrow glyph in text — use an icon"],
  [/\s·\s/, "middle-dot typed into copy — use <Sep />"],
];
const SPACING_RE = /(?<![\w-])-?(?:p|px|py|pt|pr|pb|pl|m|mx|my|mt|mr|mb|ml|gap|gap-x|gap-y|space-x|space-y)-(\d+(?:\.\d+)?)(?![\w.-])/g;

async function walk(dir: string): Promise<string[]> {
  const out: string[] = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(p)));
    else if (/\.tsx?$/.test(entry.name) && !/\.stories\.tsx$/.test(entry.name)) out.push(p);
  }
  return out;
}

const files = await walk(KIT);
console.log(`▶ source: ${files.length} files`);
for (const file of files) {
  const lines = (await readFile(file, "utf8")).split("\n");
  lines.forEach((raw, i) => {
    const line = raw.trim();
    if (!line || line.startsWith("*") || line.startsWith("/*") || line.startsWith("//") || /kit-allow/.test(line)) return;
    const code = line.replace(/\{\/\*.*?\*\/\}/g, "");
    const where = `${path.relative(ROOT, file)}:${i + 1}`;
    for (const [re, why] of RULES) if (re.test(code)) fail(where, `${why}\n      ${line.slice(0, 150)}`);
    for (const m of code.matchAll(SPACING_RE)) if (!SPACING.has(m[1]!)) fail(where, `spacing step ${m[0]} is off the scale`);
  });
}

/* ======================================================================== */
/* 2. Contracts                                                             */
/* ======================================================================== */

const GUIDES: [string, RoundupGuide][] = [
  ["watches", watchesGuide],
  ["creatine", creatineGuide],
  ["running", runningGuide],
  ["versus", versusGuide],
  ["assay", assayGuide],
  ["collector", collectorsGuide],
];
console.log(`▶ contracts: ${GUIDES.length} guides`);
for (const [name, guide] of GUIDES) {
  if (!guide.author.beats.includes(guide.category)) fail(name, `author ${guide.author.name} does not cover “${guide.category}” (beats: ${guide.author.beats.join(", ")})`);
  for (const pick of guide.picks) {
    const id = `${name}/${pick.product.id}`;
    if (!pick.quote.person.beats.includes(guide.category)) fail(id, `quoted tester ${pick.quote.person.name} does not cover “${guide.category}”`);
    if (!pick.product.image) fail(id, "no photograph: every pick shows the product in studio photography");
    if (pick.scores.length < 3) fail(id, "fewer than three sub-scores under the composite");
    if (pick.rating.score < 0 || pick.rating.score > 10) fail(id, `composite score ${pick.rating.score} is outside 0–10`);
    if (!pick.quote.proof.trim()) fail(id, "tester quote without its proof");
    const expected = { watches: "timing", supplements: "assay", running: "biomech" }[guide.category];
    if (pick.measurements.kind !== expected) fail(id, `measurements are “${pick.measurements.kind}”, the ${guide.category} category draws “${expected}”`);
    const v = pick.verdict.toLowerCase();
    if (v.includes(pick.synthesis.toLowerCase()) || pick.synthesis.toLowerCase().includes(v)) fail(id, "verdict restates synthesis");
    if (/^\s*(?:\d|#|No\.)/.test(pick.award)) fail(id, `numbered award “${pick.award}”`);
    const a = pick.synthesis.toLowerCase();
    const b = pick.bestFor.toLowerCase();
    if (a.includes(b) || b.includes(a)) fail(id, "synthesis restates bestFor");
  }
}

/* ======================================================================== */
/* 3. Rendered pages                                                        */
/* ======================================================================== */

interface El {
  tag: string;
  attrs: Record<string, string>;
  children: (El | string)[];
  parent?: El;
  order: number;
}

const VOID_TAGS = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"]);
const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
const decode = (s: string) =>
  s.replace(/&(#x[0-9a-f]+|#\d+|\w+);/gi, (m, e: string) =>
    e[0] === "#" ? String.fromCodePoint(e[1]?.toLowerCase() === "x" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10)) : (ENTITIES[e] ?? m),
  );

function parse(html: string): El {
  const root: El = { tag: "#root", attrs: {}, children: [], order: 0 };
  let cur = root;
  let order = 1;
  const re = /<!--[\s\S]*?-->|<\/([a-zA-Z][\w:-]*)\s*>|<([a-zA-Z][\w:-]*)((?:\s+[^\s=>/]+(?:="[^"]*")?)*)\s*(\/?)>|([^<]+)/g;
  for (const m of html.matchAll(re)) {
    if (m[0].startsWith("<!--")) continue;
    if (m[5] !== undefined) {
      cur.children.push(decode(m[5]));
      continue;
    }
    if (m[1]) {
      const tag = m[1].toLowerCase();
      let n: El | undefined = cur;
      while (n && n.tag !== tag) n = n.parent;
      if (n?.parent) cur = n.parent;
      continue;
    }
    const tag = m[2]!.toLowerCase();
    const attrs: Record<string, string> = {};
    for (const a of (m[3] ?? "").matchAll(/([^\s=]+)(?:="([^"]*)")?/g)) attrs[a[1]!] = decode(a[2] ?? "");
    const el: El = { tag, attrs, children: [], parent: cur, order: order++ };
    cur.children.push(el);
    if (!VOID_TAGS.has(tag) && !m[4]) cur = el;
  }
  return root;
}

function* walkEls(el: El): Generator<El> {
  for (const c of el.children)
    if (typeof c !== "string") {
      yield c;
      yield* walkEls(c);
    }
}
const all = (el: El, pred: (e: El) => boolean) => [...walkEls(el)].filter(pred);
const bySlot = (el: El, slot: string) => all(el, (e) => e.attrs["data-slot"] === slot);
/** Reading text: skips aria-hidden decoration and drawings (svg is an image). */
function text(el: El): string {
  if (el.attrs["aria-hidden"] === "true" || el.tag === "svg") return "";
  return el.children.map((c) => (typeof c === "string" ? c : text(c))).join("");
}
const norm = (s: string) => s.replace(/\s+/g, " ").trim();
function textNodes(el: El, out: string[] = []): string[] {
  if (el.attrs["aria-hidden"] === "true" || el.tag === "svg") return out;
  for (const c of el.children) {
    if (typeof c === "string") out.push(c);
    else textNodes(c, out);
  }
  return out;
}
const BLOCKS = new Set(["p", "li", "h1", "h2", "h3", "h4", "h5", "h6", "dd", "dt", "td", "th", "blockquote", "figcaption", "summary", "caption"]);
const STORY_ORDER = ["descriptor", "title", "synthesis", "buy-block", "narrative", "points", "pull-quote"];

interface Page {
  name: string;
  site: SiteChrome;
  guide: RoundupGuide;
  render: (props: { site: SiteChrome; guide: RoundupGuide }) => ReactElement | null;
}
const PAGES: Page[] = [
  { name: "Caliber roundup", site: caliberSite, guide: watchesGuide, render: RoundupPage },
  { name: "Proving Ground supplements", site: provingGroundSite, guide: creatineGuide, render: RoundupPage },
  { name: "Proving Ground running", site: provingGroundSite, guide: runningGuide, render: RoundupPage },
  { name: "Head-to-head versus", site: caliberSite, guide: versusGuide, render: VersusPage },
  { name: "Single-product lab assay", site: provingGroundSite, guide: assayGuide, render: LabAssayPage },
  { name: "Collector’s guide", site: caliberSite, guide: collectorsGuide, render: CollectorsGuidePage },
];

/** Every rendered-page rule, on one HTML document. Returns one line per problem. */
function checkHtml(html: string, { names: extraNames = [], products = new Map<string, KitProduct>() }: { names?: string[]; products?: Map<string, KitProduct> } = {}): string[] {
  const problems: string[] = [];
  const doc = parse(html);

  /* repeated text (product names are identifiers, exempt) */
  const names = new Set([...extraNames.map(norm), ...all(doc, (e) => "data-name" in e.attrs).map((e) => norm(text(e)))]);
  const blocks = new Map<string, number>();
  const sentences = new Map<string, number>();
  for (const el of all(doc, (e) => BLOCKS.has(e.tag))) {
    if (all(el, (e) => BLOCKS.has(e.tag)).length) continue;
    const t = norm(text(el));
    if (t.length <= 40 || names.has(t)) continue;
    blocks.set(t, (blocks.get(t) ?? 0) + 1);
    for (const sentence of new Set(t.split(/(?<=[.!?])\s+/).map(norm)))
      if (sentence.length > 40 && !names.has(sentence)) sentences.set(sentence, (sentences.get(sentence) ?? 0) + 1);
  }
  for (const [t, n] of blocks) if (n > 1) problems.push(`repeated text: block rendered ${n}×: “${t.slice(0, 90)}”`);
  for (const [t, n] of sentences) if (n > 1 && !blocks.has(t)) problems.push(`repeated text: sentence rendered ${n}×: “${t.slice(0, 90)}”`);

  /* typesetting */
  for (const t of textNodes(doc)) for (const issue of typesettingIssues(t)) problems.push(`typesetting: ${issue}`);
  for (const el of all(doc, (e) => !!e.attrs["aria-label"])) for (const issue of typesettingIssues(el.attrs["aria-label"]!)) problems.push(`typesetting: aria-label ${issue}`);

  /* numbered eyebrows and all-caps runs */
  for (const el of all(doc, (e) => BLOCKS.has(e.tag) || e.attrs["data-slot"] === "award")) {
    if (all(el, (e) => BLOCKS.has(e.tag)).length) continue;
    const t = norm(text(el));
    if (/^(?:\d{1,2}\s*[—–-]\s*\p{L}|\d{1,2}[.:)]\s+\p{L}|(?:No\.|#)\s*\d)/u.test(t)) problems.push(`numbered eyebrow: “${t.slice(0, 40)}”`);
    const letters = t.replace(/[^A-Za-z]/g, "");
    if (letters.length >= 8 && letters.replace(/[^A-Z]/g, "").length / letters.length > 0.7) problems.push(`all caps: “${t.slice(0, 40)}”`);
  }

  /* merchants */
  for (const block of bySlot(doc, "buy-block")) {
    const id = block.attrs["data-product-id"] ?? "?";
    const offers = all(block, (e) => "data-offer-price" in e.attrs).map((e) => ({ price: Number(e.attrs["data-offer-price"]), inStock: e.attrs["data-in-stock"] === "true", merchant: e.attrs["data-merchant"] }));
    if (!isRanked(offers)) problems.push(`merchant order: ${id} lists ${offers.map((o) => `${o.merchant} ${o.price}${o.inStock ? "" : " (sold out)"}`).join(", ")} (lowest in-stock first)`);
    const buttons = all(block, (e) => e.attrs["data-cta"] === "primary" || e.attrs["data-cta"] === "secondary");
    if (buttons.length > 1) problems.push(`merchant clutter: ${id} has ${buttons.length} buttons in one buy block`);
    const disclosure = bySlot(block, "inline-disclosure")[0];
    if (!disclosure) problems.push(`disclosure: ${id} buy block has no inline disclosure`);
    else if (norm(text(disclosure)).length >= 40) problems.push(`disclosure: ${id} inline disclosure is ${norm(text(disclosure)).length} characters (under 40)`);
  }
  for (const link of all(doc, (e) => e.tag === "a" && "data-offer-price" in e.attrs)) {
    let owner: string | undefined;
    for (let n: El | undefined = link; n && !owner; n = n.parent) owner = n.attrs["data-product-id"];
    const product = owner ? products.get(owner) : undefined;
    const lead = product ? leadOffer(product.offers) : undefined;
    const cta = link.attrs["data-cta"];
    if (lead && (cta === "primary" || cta === "secondary" || cta === "link") && Number(link.attrs["data-offer-price"]) !== lead.price)
      problems.push(`merchant order: ${owner} ${cta} leads with $${link.attrs["data-offer-price"]}; the lowest in-stock price is $${lead.price}`);
  }

  /* disclosure before the first buy link */
  const notice = bySlot(doc, "disclosure-notice")[0];
  const firstSponsored = all(doc, (e) => e.tag === "a" && /\bsponsored\b/.test(e.attrs.rel ?? ""))[0];
  if (firstSponsored && !notice) problems.push("disclosure: sponsored links without a disclosure notice in the header");
  else if (firstSponsored && notice && firstSponsored.order < notice.order) problems.push("disclosure: a sponsored link comes before the disclosure notice");

  /* deep dives */
  for (const card of bySlot(doc, "deep-dive")) {
    const id = card.attrs["data-product-id"] ?? "?";
    const product = products.get(id);
    const media = all(card, (e) => e.attrs["data-col"] === "media")[0];
    const story = all(card, (e) => e.attrs["data-col"] === "story")[0];
    if (!media || !story) {
      problems.push(`deep dive: ${id} is missing a column`);
      continue;
    }
    if (!bySlot(media, "media").some((m) => all(m, (e) => e.tag === "img").length)) problems.push(`deep dive: ${id} has no photograph`);
    const order = story.children.filter((c): c is El => typeof c !== "string").map((c) => c.attrs["data-slot"]);
    if (order.join(",") !== STORY_ORDER.join(",")) problems.push(`deep dive: ${id} story order is ${order.join(" → ")} (expected ${STORY_ORDER.join(" → ")})`);
    const primaries = all(card, (e) => e.attrs["data-cta"] === "primary").length;
    if (primaries !== 1) problems.push(`deep dive: ${id} has ${primaries} filled buttons (one)`);
    if (!bySlot(card, "award").length) problems.push(`deep dive: ${id} has no award in its header`);
    if (!bySlot(media, "scorecard").length) problems.push(`deep dive: ${id} has no composite score under its media`);
    const self = `#review-${product?.slug ?? card.attrs.id?.replace(/^review-/, "") ?? ""}`;
    if (all(card, (e) => e.attrs["data-product-ref"] === id || e.attrs.href === self).length) problems.push(`self reference: ${id} links or pills back to the product under review`);
  }
  for (const verdict of bySlot(doc, "quick-verdict")) {
    const primaries = all(verdict, (e) => e.attrs["data-cta"] === "primary").length;
    if (primaries !== 1) problems.push(`quick verdict: ${primaries} filled buttons (one)`);
  }
  const photos = new Map<string, string>();
  for (const well of bySlot(doc, "media-well")) {
    const id = well.attrs["data-product-id"] ?? "?";
    const src = all(well, (e) => e.tag === "img")[0]?.attrs.src ?? "";
    const owner = photos.get(src);
    if (src && owner && owner !== id) problems.push(`same photograph: ${id} and ${owner} use ${src}`);
    if (src) photos.set(src, id);
  }
  return problems;
}

console.log(`▶ rendered pages: ${PAGES.length}`);
for (const page of PAGES) {
  const html = renderToStaticMarkup(page.render({ site: page.site, guide: page.guide })!);
  const problems = checkHtml(html, {
    names: page.guide.picks.map((p) => `${p.product.brand} ${p.product.name}`),
    products: new Map(page.guide.picks.map((p) => [p.product.id, p.product])),
  });
  for (const problem of problems) fail(page.name, problem);
  const doc = parse(html);
  console.log(`  ${problems.length === 0 ? "✓" : "✗"} ${page.name}: ${problems.length} violation(s), ${bySlot(doc, "deep-dive").length} deep dives, ${bySlot(doc, "buy-block").length} buy blocks, ${bySlot(doc, "media-well").length} photographs`);
}

/* ======================================================================== */
/* 4. Self-test: every rendered rule must fire on a page that breaks it     */
/* ======================================================================== */

const LONG = "The Meridian is the watch we kept reaching for after testing ended.";
const notice = `<p data-slot="disclosure-notice">Reader-supported.</p>`;
const offerLink = (cta: string, price: number, merchant: string) => `<a rel="sponsored nofollow noopener" data-cta="${cta}" data-offer-price="${price}" data-in-stock="true" data-merchant="${merchant}" href="#">${merchant}</a>`;
const BROKEN: [rule: string, html: string][] = [
  ["repeated text", `<p>${LONG}</p><div><p>${LONG}</p></div>`],
  ["typesetting", `<p>A 38 mm case with “quotes” and 95-110%.</p>`],
  ["numbered eyebrow", `<p>01 — Best overall</p>`],
  ["merchant order", `${notice}<div data-slot="buy-block" data-product-id="tempo">${offerLink("primary", 160, "Northlane")}${offerLink("row", 149, "Verra")}<p data-slot="inline-disclosure">We may earn a commission.</p></div>`],
  ["merchant clutter", `${notice}<div data-slot="buy-block" data-product-id="tempo">${offerLink("primary", 149, "Verra")}<a rel="sponsored" data-cta="secondary" data-offer-price="160" data-in-stock="true" data-merchant="Northlane" href="#">Northlane</a><p data-slot="inline-disclosure">We may earn a commission.</p></div>`],
  ["disclosure", `${offerLink("link", 149, "Verra")}${notice}`],
  ["self reference", `<article data-slot="deep-dive" data-product-id="w" id="review-w"><div data-col="media"><figure data-slot="media"><img src="x.jpg" alt=""></figure></div><div data-col="story"><a href="#review-w">Halden Meridian</a></div></article>`],
  ["same photograph", `<div data-slot="media-well" data-product-id="a"><img src="/x.webp" alt=""></div><div data-slot="media-well" data-product-id="b"><img src="/x.webp" alt=""></div>`],
];
console.log(`▶ self-test: ${BROKEN.length} broken pages`);
for (const [rule, html] of BROKEN) {
  const caught = checkHtml(html).some((p) => p.startsWith(rule));
  if (!caught) fail("self-test", `the “${rule}” rule did not fire on a page that breaks it`);
}
for (const [input, want] of [
  ["A 38 mm case, +1.6 s/day", "A 38\u00A0mm case, +1.6\u00A0s/day"],
  ['"Quoted" and don\'t', "“Quoted” and don’t"],
  ["95-110% and -4%", "95–110% and −4%"],
] as const) {
  const got = typeset(input);
  if (got !== want || typeset(got) !== got) fail("self-test", `typeset(${JSON.stringify(input)}) gave ${JSON.stringify(got)}`);
}
const misattributed: RoundupGuide = { ...runningGuide, author: watchesGuide.author };
if (misattributed.author.beats.includes(misattributed.category)) fail("self-test", "the provenance rule did not fire for a watches editor on a running test");
if (violations === 0) console.log("  ✓ every rule fired on its broken page");

if (violations === 0) console.log("✓ kit audit: 0 violations");
else {
  console.log(`✗ kit audit: ${violations} violation(s)`);
  process.exit(1);
}
