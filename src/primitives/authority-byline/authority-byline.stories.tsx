import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import {
  authorClinical,
  authorEditorial,
  methodologyClinical,
  methodologyEditorial,
  reviewerFactCheck,
} from "@/fixtures/authors";
import { productCreatine, productWatch } from "@/fixtures/products";
import { EditorialHeading } from "@/primitives/editorial-heading";
import { Labeled } from "@/stories/story-label";
import { VerticalCompare, ViewportFrames } from "@/stories/vertical-compare";

import { AuthorityByline } from "./authority-byline";

const VARIANTS = ["inline-header", "dossier-box", "verified-strip"] as const;

const meta = {
  title: "Tier 2 · Evaluation & E-E-A-T/AuthorityByline",
  component: AuthorityByline,
  parameters: { layout: "fullscreen" },
  args: {
    author: authorEditorial,
    reviewedBy: reviewerFactCheck,
    verifiedAt: productWatch.lastVerifiedAt,
    updatedAt: "2026-10-29T09:00:00Z",
    methodology: methodologyEditorial,
    variant: "inline-header",
  },
  argTypes: {
    variant: { control: "inline-radio", options: VARIANTS },
    author: { control: false },
    reviewedBy: { control: false },
    methodology: { control: false },
  },
} satisfies Meta<typeof AuthorityByline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="max-w-2xl">
      <AuthorityByline {...args} />
    </div>
  ),
};

export const AllVariants: Story = {
  name: "Variants · variant",
  render: (args) => (
    <div className="flex max-w-2xl flex-col gap-section-gap">
      {VARIANTS.map((variant) => (
        <Labeled key={variant} label={`variant="${variant}"`}>
          <AuthorityByline {...args} variant={variant} />
        </Labeled>
      ))}
    </div>
  ),
};

export const DossierClinical: Story = {
  name: "Dossier · portrait, credential pills, methodology well (open by default)",
  render: () => (
    <div className="max-w-2xl">
      <AuthorityByline
        author={authorClinical}
        reviewedBy={reviewerFactCheck}
        verifiedAt={productCreatine.lastVerifiedAt}
        methodology={{ ...methodologyClinical, defaultOpen: true }}
        variant="dossier-box"
      />
    </div>
  ),
};

export const MinimalData: Story = {
  name: "Data · name only · no methodology · no dates",
  render: () => (
    <div className="flex max-w-2xl flex-col gap-section-gap">
      <Labeled label="author={{ name }} only → monogram fallback">
        <AuthorityByline author={{ name: "Jonah Whitfield" }} />
      </Labeled>
      <Labeled label="verified-strip without methodology">
        <AuthorityByline author={{ name: "Celeste Marchetti", role: "Editor" }} verifiedAt="2026-10-01T00:00:00Z" variant="verified-strip" />
      </Labeled>
    </div>
  ),
};

export const UnderHeading: Story = {
  name: "Composition · article header lockup",
  render: () => (
    <div className="flex max-w-3xl flex-col gap-row-pad">
      <EditorialHeading
        as="h1"
        eyebrow={productWatch.eyebrow}
        title={`${productWatch.brand} ${productWatch.name} review`}
        dek={productWatch.verdictSummary}
      />
      <AuthorityByline
        author={authorEditorial}
        reviewedBy={reviewerFactCheck}
        verifiedAt={productWatch.lastVerifiedAt}
        methodology={methodologyEditorial}
        variant="verified-strip"
      />
    </div>
  ),
};

export const SideBySideVerticals: Story = {
  name: "★ Multi-vertical side-by-side",
  render: () => (
    <VerticalCompare>
      <div className="flex flex-col gap-section-gap">
        <AuthorityByline author={authorClinical} verifiedAt={productCreatine.lastVerifiedAt} methodology={methodologyClinical} variant="inline-header" />
        <AuthorityByline author={authorClinical} reviewedBy={reviewerFactCheck} verifiedAt={productCreatine.lastVerifiedAt} methodology={methodologyClinical} variant="dossier-box" />
        <AuthorityByline author={authorClinical} verifiedAt={productCreatine.lastVerifiedAt} methodology={methodologyClinical} variant="verified-strip" />
      </div>
    </VerticalCompare>
  ),
};

export const Viewports: Story = {
  name: "Responsive · 375 vs 1280",
  render: () => (
    <ViewportFrames
      render={() => (
        <div className="flex flex-col gap-row-pad">
          <AuthorityByline author={authorEditorial} reviewedBy={reviewerFactCheck} verifiedAt={productWatch.lastVerifiedAt} methodology={methodologyEditorial} variant="inline-header" />
          <AuthorityByline author={authorEditorial} verifiedAt={productWatch.lastVerifiedAt} methodology={methodologyEditorial} variant="dossier-box" />
        </div>
      )}
    />
  ),
};
