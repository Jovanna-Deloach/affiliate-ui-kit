import axe from "axe-core";
import { expect } from "storybook/test";

import { isRanked } from "@/kit/lib/offers";

/**
 * BROWSER CHECKS for kit stories (CSF3 `play`). The harness runs every
 * story at 375px and 1440px; a failing check logs `[kit-check]` lines and
 * fails the story. Text and markup rules that do not need layout live in
 * scripts/audit-kit.ts (server-rendered, part of `bun run check`).
 *
 *   • deep dives: both columns start within 4px; no gap over 150px between
 *     blocks; media present
 *   • primary, secondary and row CTAs at least 44px tall
 *   • every [data-numeric] cell set in tabular numerals
 *   • merchant order: in-stock lowest first, one button per buy block
 *   • every SKU draws a different specimen
 *   • no text block over 40 characters rendered twice
 *   • axe-core, WCAG 2.0/2.1/2.2 A and AA: zero violations
 */

const VOID = 150;
const ALIGN = 4;
const TARGET = 44;
const BLOCKS = "p, li, h1, h2, h3, h4, dd, dt, td, th, blockquote, figcaption, summary";

function boxChildren(el: Element): HTMLElement[] {
  const out: HTMLElement[] = [];
  for (const child of Array.from(el.children) as HTMLElement[]) {
    const display = getComputedStyle(child).display;
    if (display === "contents") out.push(...boxChildren(child));
    else if (display !== "none") out.push(child);
  }
  return out;
}

const rect = (el: Element) => el.getBoundingClientRect();
/** Visible text: aria-hidden decoration (monograms, icons) is not part of the copy. */
function text(el: Element): string {
  const clone = el.cloneNode(true) as Element;
  clone.querySelectorAll('[aria-hidden="true"]').forEach((n) => n.remove());
  return (clone.textContent ?? "").replace(/\s+/g, " ").trim();
}

export async function collectPageProblems(root: HTMLElement, { runAxe = true } = {}): Promise<string[]> {
  await document.fonts.ready;
  const problems: string[] = [];

  /* deep-dive geometry */
  for (const card of Array.from(root.querySelectorAll<HTMLElement>('[data-slot="deep-dive"]'))) {
    const id = card.dataset.productId ?? "deep dive";
    const media = card.querySelector<HTMLElement>('[data-col="media"]');
    const story = card.querySelector<HTMLElement>('[data-col="story"]');
    if (!media || !story) {
      problems.push(`${id}: deep dive is missing a column`);
      continue;
    }
    if (!card.querySelector('[data-slot="media"] [data-slot="specimen"], [data-slot="media"] img')) problems.push(`${id}: deep dive has no media`);
    if (getComputedStyle(media).display !== "contents") {
      const delta = Math.abs(rect(media).top - rect(story).top);
      if (delta >= ALIGN) problems.push(`${id}: columns start ${delta.toFixed(1)}px apart (limit ${ALIGN}px)`);
      for (const [label, col] of [
        ["media", media],
        ["story", story],
      ] as const) {
        const kids = boxChildren(col);
        const lead = kids[0] ? rect(kids[0]).top - rect(col).top : 0;
        if (lead >= ALIGN) problems.push(`${id}: ${label} column content starts ${lead.toFixed(0)}px below the column top`);
        for (let i = 1; i < kids.length; i++) {
          const gap = rect(kids[i]!).top - rect(kids[i - 1]!).bottom;
          if (gap > VOID) problems.push(`${id}: ${gap.toFixed(0)}px void in the ${label} column`);
        }
      }
    } else {
      const kids = boxChildren(media.parentElement!).sort((a, b) => rect(a).top - rect(b).top);
      for (let i = 1; i < kids.length; i++) {
        const gap = rect(kids[i]!).top - rect(kids[i - 1]!).bottom;
        if (gap > VOID) problems.push(`${id}: ${gap.toFixed(0)}px void in the stacked layout`);
      }
    }
  }

  /* touch targets */
  for (const el of Array.from(root.querySelectorAll<HTMLElement>('[data-cta="primary"], [data-cta="secondary"], [data-cta="row"]'))) {
    const h = rect(el).height;
    if (h > 0 && h < TARGET) problems.push(`CTA “${text(el)}” is ${h.toFixed(1)}px tall (minimum ${TARGET}px)`);
  }

  /* numerals */
  for (const el of Array.from(root.querySelectorAll<HTMLElement>("[data-numeric]"))) {
    if (!getComputedStyle(el).fontVariantNumeric.includes("tabular-nums")) problems.push(`“${text(el)}” is not set in tabular numerals`);
  }

  /* merchant order */
  for (const block of Array.from(root.querySelectorAll<HTMLElement>('[data-slot="buy-block"]'))) {
    const id = block.dataset.productId ?? "buy block";
    const offers = Array.from(block.querySelectorAll<HTMLElement>("[data-offer-price]")).map((el) => ({
      price: Number(el.dataset.offerPrice),
      inStock: el.dataset.inStock === "true",
      merchant: el.dataset.merchant ?? "",
    }));
    if (!isRanked(offers)) problems.push(`${id}: retailers out of order (${offers.map((o) => `${o.merchant} ${o.price}${o.inStock ? "" : " sold out"}`).join(", ")})`);
    const buttons = block.querySelectorAll('[data-cta="primary"], [data-cta="secondary"]').length;
    if (buttons > 1) problems.push(`${id}: ${buttons} buttons in one buy block (one allowed)`);
  }

  /* specimens: one drawing per SKU */
  const owners = new Map<string, string>();
  for (const el of Array.from(root.querySelectorAll<HTMLElement>('[data-slot="specimen"]'))) {
    const id = el.dataset.productId ?? "";
    const key = `${el.dataset.detail}|${el.querySelector("svg")?.innerHTML ?? ""}`;
    const owner = owners.get(key);
    if (owner && owner !== id) problems.push(`${id} and ${owner} render the same drawing`);
    owners.set(key, id);
  }

  /* repeated text (product names are identifiers, marked [data-name], and exempt) */
  const names = new Set(Array.from(root.querySelectorAll("[data-name]")).map(text));
  const seen = new Map<string, number>();
  for (const el of Array.from(root.querySelectorAll(BLOCKS))) {
    if (el.querySelector(BLOCKS)) continue;
    const t = text(el);
    if (t.length > 40 && !names.has(t)) seen.set(t, (seen.get(t) ?? 0) + 1);
  }
  for (const [t, n] of seen) if (n > 1) problems.push(`text rendered ${n} times: “${t.slice(0, 90)}”`);

  /* accessibility */
  if (runAxe) {
    const results = await axe.run(root, {
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] },
      resultTypes: ["violations"],
    });
    for (const v of results.violations)
      problems.push(`axe ${v.id}: ${v.help} (${v.nodes.length}) ${v.nodes
        .slice(0, 3)
        .map((n) => n.target.join(" "))
        .join(" | ")}`);
  }
  return problems;
}

/** CSF3 play function for kit pages and blocks. */
export async function assertKitPage({ canvasElement }: { canvasElement: HTMLElement }) {
  const problems = await collectPageProblems(canvasElement);
  if (problems.length) console.error(`[kit-check] ${window.innerWidth}px\n${problems.join("\n")}`);
  await expect(problems).toEqual([]);
}
