import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { bestPrice, productCreatine, productShoe01, productWatch, roundupProducts } from "@/fixtures/products";
import { AffiliateAction } from "@/primitives/affiliate-action";
import { ScoreMeter } from "@/primitives/score-meter";
import { Specimen } from "@/stories/specimen";
import { VerticalCompare, ViewportFrames } from "@/stories/vertical-compare";

import { EditorialHeading } from "./editorial-heading";

const ALIGNMENTS = ["left-dossier", "centered-magazine", "split-numbered"] as const;
const NAMES = { "left-dossier": "Left dossier", "centered-magazine": "Centered magazine", "split-numbered": "Split numbered" } as const;
const best = productShoe01.offers[0]!;

/** Key-metric / price summary block for the 5-column side of the dossier bar. */
function SummaryAside() {
  return (
    <>
      <ScoreMeter score={productShoe01.overallScore!} visual="radial" label="Overall score" />
      <AffiliateAction
        href={best.affiliateUrl}
        width="cta"
        tracking={{ merchant: best.merchantName, offerId: best.id, productId: productShoe01.id, placement: "heading-aside" }}
      >
        Shop from {bestPrice(productShoe01)}
      </AffiliateAction>
    </>
  );
}

const meta = {
  title: "Tier 3 · Surface & Media/EditorialHeading",
  component: EditorialHeading,
  parameters: { layout: "fullscreen" },
  args: {
    eyebrow: productShoe01.eyebrow,
    title: `${productShoe01.brand} ${productShoe01.name}`,
    dek: productShoe01.verdictSummary,
    rank: 1,
    rankFormat: "padded",
    alignment: "left-dossier",
    size: "display",
    as: "h2",
  },
  argTypes: {
    alignment: { control: "select", options: ALIGNMENTS },
    rankFormat: { control: "inline-radio", options: ["padded", "hash", "plain"] },
    size: { control: "inline-radio", options: ["display", "title"] },
    as: { control: "inline-radio", options: ["h1", "h2", "h3", "h4"] },
    aside: { control: false },
  },
} satisfies Meta<typeof EditorialHeading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Alignments: Story = {
  name: "Alignment — rank as an architectural index",
  render: (args) => (
    <div className="flex flex-col gap-section">
      {ALIGNMENTS.map((alignment) => (
        <Specimen key={alignment} caption={NAMES[alignment]}>
          <EditorialHeading {...args} alignment={alignment} />
        </Specimen>
      ))}
    </div>
  ),
};

export const DossierBar: Story = {
  name: "Dossier bar — 7 / 5 columns with a key-metric block",
  render: (args) => (
    <div className="flex flex-col gap-section">
      {(["left-dossier", "split-numbered"] as const).map((alignment) => (
        <Specimen key={alignment} caption={NAMES[alignment]}>
          <EditorialHeading {...args} alignment={alignment} aside={<SummaryAside />} />
        </Specimen>
      ))}
    </div>
  ),
};

export const RankFormats: Story = {
  name: "Rank formats",
  render: (args) => (
    <div className="grid items-start gap-grid md:grid-cols-3">
      {(["padded", "hash", "plain"] as const).map((rankFormat) => (
        <Specimen key={rankFormat} caption={rankFormat === "padded" ? "Padded · 01" : rankFormat === "hash" ? "Hash · #1" : "Plain · 1"}>
          <EditorialHeading {...args} dek={undefined} size="title" alignment="split-numbered" rankFormat={rankFormat} />
        </Specimen>
      ))}
    </div>
  ),
};

export const RoundupSequence: Story = {
  name: "Ranked roundup sequence",
  render: () => (
    <ol className="m-0 flex max-w-3xl list-none flex-col gap-section p-0">
      {roundupProducts.map((p) => (
        <li key={p.id} className="border-t border-hairline pt-stack">
          <EditorialHeading
            as="h3"
            alignment="split-numbered"
            rank={p.rank}
            eyebrow={p.eyebrow}
            title={`${p.brand} ${p.name}`}
            dek={p.verdictSummary}
            size="title"
            aside={<ScoreMeter score={p.overallScore!} visual="inline-bar" label="Overall" />}
          />
        </li>
      ))}
    </ol>
  ),
};

export const SideBySideVerticals: Story = {
  name: "★ Multi-vertical side-by-side",
  render: () => (
    <VerticalCompare>
      <div className="flex flex-col gap-section">
        <EditorialHeading as="h1" alignment="left-dossier" rank={1} eyebrow={productShoe01.eyebrow} title={`${productShoe01.brand} ${productShoe01.name}`} dek={productShoe01.verdictSummary} aside={<SummaryAside />} />
        <EditorialHeading alignment="centered-magazine" eyebrow={productWatch.eyebrow} title={`${productWatch.brand} ${productWatch.name}`} />
        <EditorialHeading alignment="split-numbered" rank={productCreatine.rank} eyebrow={productCreatine.eyebrow} title={productCreatine.name} dek={productCreatine.verdictSummary} size="title" />
      </div>
    </VerticalCompare>
  ),
};

export const Viewports: Story = {
  name: "Responsive · 375 (summary stacks) vs 1280",
  render: () => (
    <ViewportFrames
      render={() => (
        <div className="flex flex-col gap-section">
          <EditorialHeading
            as="h1"
            alignment="split-numbered"
            rank={1}
            eyebrow={productShoe01.eyebrow}
            title="The best daily trainer for most runners, after 412 logged miles"
            dek={productShoe01.verdictSummary}
            aside={<SummaryAside />}
          />
          <EditorialHeading alignment="centered-magazine" eyebrow="The Dress Watch, Reconsidered" title="Lindqvist Ardent 38" />
        </div>
      )}
    />
  ),
};
