import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { productCreatine, productShoe01, productWatch, roundupProducts } from "@/fixtures/products";
import { VerticalCompare, ViewportFrames } from "@/stories/vertical-compare";

import { EditorialHeading } from "./editorial-heading";

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
    alignment: {
      control: "select",
      options: ["left-dossier", "centered-magazine", "split-numbered"],
    },
    rankFormat: { control: "inline-radio", options: ["padded", "hash", "plain"] },
    size: { control: "inline-radio", options: ["display", "display-sm"] },
    as: { control: "inline-radio", options: ["h1", "h2", "h3", "h4"] },
  },
} satisfies Meta<typeof EditorialHeading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AllAlignments: Story = {
  name: "Variants · alignment",
  render: (args) => (
    <div className="flex flex-col gap-section-gap">
      {(["left-dossier", "centered-magazine", "split-numbered"] as const).map((alignment) => (
        <div key={alignment} className="border-t-surface-w border-border pt-row-pad">
          <code className="type-label-mono text-muted">alignment=&quot;{alignment}&quot;</code>
          <div className="mt-cluster-gap">
            <EditorialHeading {...args} alignment={alignment} />
          </div>
        </div>
      ))}
    </div>
  ),
};

export const RankFormats: Story = {
  name: "Variants · rank format",
  render: (args) => (
    <div className="grid gap-grid-gap md:grid-cols-3">
      {(["padded", "hash", "plain"] as const).map((rankFormat) => (
        <EditorialHeading
          key={rankFormat}
          {...args}
          dek={undefined}
          size="display-sm"
          alignment="split-numbered"
          rankFormat={rankFormat}
        />
      ))}
    </div>
  ),
};

export const RoundupSequence: Story = {
  name: "Pattern · ranked roundup sequence",
  render: () => (
    <ol className="flex max-w-3xl flex-col gap-section-gap">
      {roundupProducts.map((p) => (
        <li key={p.id} className="border-t-surface-w border-border pt-row-pad">
          <EditorialHeading
            as="h3"
            alignment="split-numbered"
            rank={p.rank}
            eyebrow={p.eyebrow}
            title={`${p.brand} ${p.name}`}
            dek={p.verdictSummary}
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
      <div className="flex flex-col gap-section-gap">
        <EditorialHeading
          as="h1"
          alignment="left-dossier"
          rank={1}
          eyebrow={productShoe01.eyebrow}
          title={`${productShoe01.brand} ${productShoe01.name}`}
          dek={productShoe01.verdictSummary}
        />
        <EditorialHeading
          alignment="centered-magazine"
          eyebrow={productWatch.eyebrow}
          title={`${productWatch.brand} ${productWatch.name}`}
        />
        <EditorialHeading
          alignment="split-numbered"
          rank={productCreatine.rank}
          eyebrow={productCreatine.eyebrow}
          title={productCreatine.name}
          dek={productCreatine.verdictSummary}
          size="display-sm"
        />
      </div>
    </VerticalCompare>
  ),
};

export const Viewports: Story = {
  name: "Responsive · 375 vs 1280",
  render: () => (
    <ViewportFrames
      render={() => (
        <div className="flex flex-col gap-section-gap">
          <EditorialHeading
            as="h1"
            alignment="split-numbered"
            rank={1}
            eyebrow={productShoe01.eyebrow}
            title="The best daily trainer for most runners, after 412 logged miles"
            dek={productShoe01.verdictSummary}
          />
          <EditorialHeading
            alignment="centered-magazine"
            eyebrow="The Dress Watch, Reconsidered"
            title="Lindqvist Ardent 38"
          />
        </div>
      )}
    />
  ),
};
