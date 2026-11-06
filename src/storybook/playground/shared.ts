/**
 * The Playground's contract between its panel (the editor, in the Storybook
 * manager: .storybook/addons/playground.tsx) and its story (the live render,
 * in the preview: live-playground.tsx). Plain data only: the manager bundle
 * imports this file, so it must not import the kit.
 */

export const PLAYGROUND = {
  /** The story the panel belongs to (Getting started / Playground). */
  storyId: "getting-started-playground--playground",
  panelId: "kit/playground/panel",
  /** Panel → story: render this code, in this frame. */
  update: "kit/playground/update",
  /** Story → panel: mounted, send the current code. */
  ready: "kit/playground/ready",
  /** Story → panel: the render succeeded, or failed with this message. */
  status: "kit/playground/status",
} as const;

export type PlaygroundFrame = "well" | "column" | "card" | "narrow" | "narrow-card" | "none";
export type PlaygroundCategory = "watches" | "supplements" | "running";

/** What the story renders. */
export interface PlaygroundState {
  code: string;
  frame: PlaygroundFrame;
  category?: PlaygroundCategory;
}

export interface PlaygroundStatus {
  error?: string;
}

export interface PlaygroundExample extends PlaygroundState {
  id: string;
  title: string;
  theme: "atelier" | "assay";
}

export const FRAMES: { value: PlaygroundFrame; title: string }[] = [
  { value: "well", title: "Page well" },
  { value: "column", title: "Column · 42rem" },
  { value: "card", title: "Card" },
  { value: "narrow", title: "Narrow · 24rem" },
  { value: "narrow-card", title: "Narrow card" },
  { value: "none", title: "No frame (pages)" },
];

export const CATEGORIES: { value: PlaygroundCategory; title: string }[] = [
  { value: "watches", title: "Watches" },
  { value: "supplements", title: "Supplements" },
  { value: "running", title: "Running" },
];

/** In scope in the editor, besides React and every part of the kit. */
export const SAMPLE_DATA = [
  "watchesGuide",
  "creatineGuide",
  "runningGuide",
  "versusGuide",
  "assayGuide",
  "collectorsGuide",
  "caliberSite",
  "provingGroundSite",
  "soldOutProduct",
  "soldOutPick",
  "singleRetailerProduct",
  "peakAssay",
  "ironhouseAssay",
] as const;

/** Starting points, from one part to a whole page. Every prop here is documented. */
export const EXAMPLES: PlaygroundExample[] = [
  {
    id: "buy-box",
    title: "Buy box",
    theme: "atelier",
    frame: "card",
    code: `<BuyBlock
  product={watchesGuide.picks[0].product}
  placement="deep-dive"
  disclosureHref="#disclosure"
/>`,
  },
  {
    id: "quick-verdict",
    title: "Quick verdict",
    theme: "atelier",
    frame: "well",
    code: `<QuickVerdictBento
  picks={watchesGuide.picks}
  jumpLabel={watchesGuide.jumpLabel}
/>`,
  },
  {
    id: "lab-review",
    title: "Lab review",
    theme: "assay",
    category: "supplements",
    frame: "well",
    code: `<ProductDeepDiveCard
  pick={creatineGuide.picks[0]}
  disclosureHref="#disclosure"
/>`,
  },
  {
    id: "comparison",
    title: "Comparison",
    theme: "assay",
    category: "running",
    frame: "well",
    code: `<ComparisonMatrix
  heading={runningGuide.compare.heading}
  intro={runningGuide.compare.intro}
  metrics={runningGuide.metrics}
  picks={runningGuide.picks}
/>`,
  },
  {
    id: "compose",
    title: "Compose a page",
    theme: "atelier",
    frame: "none",
    code: `() => {
  const site = caliberSite;
  const guide = watchesGuide;

  return (
    <div data-category={guide.category} className="min-h-dvh bg-ground text-fg">
      <SiteHeader site={site} category={guide.category} />
      <main>
        <EditorialArticleHeader
          guide={guide}
          notice={{ text: site.disclosureNotice, href: site.disclosureHref }}
        />
        <div className="kit-well mt-12 md:mt-16">
          <QuickVerdictBento picks={guide.picks} jumpLabel={guide.jumpLabel} />
        </div>
        <div className="kit-well mt-chapter flex flex-col gap-10">
          {guide.picks.slice(0, 2).map((pick) => (
            <ProductDeepDiveCard
              key={pick.product.id}
              pick={pick}
              disclosureHref={site.disclosureHref}
            />
          ))}
        </div>
      </main>
      <SiteFooter site={site} />
    </div>
  );
}`,
  },
  {
    id: "roundup-page",
    title: "Roundup page",
    theme: "atelier",
    frame: "none",
    code: `<RoundupPage site={caliberSite} guide={watchesGuide} />`,
  },
  {
    id: "lab-assay-page",
    title: "Lab assay page",
    theme: "assay",
    frame: "none",
    code: `<LabAssayPage site={provingGroundSite} guide={assayGuide} />`,
  },
];

/** Code in a share link: base64url of its UTF-8. */
export function encodeCode(code: string): string {
  let binary = "";
  for (const byte of new TextEncoder().encode(code)) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeCode(value: string): string | undefined {
  try {
    const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
    const binary = atob(base64 + "===".slice((base64.length + 3) % 4));
    return new TextDecoder().decode(Uint8Array.from(binary, (c) => c.charCodeAt(0)));
  } catch {
    return undefined;
  }
}
