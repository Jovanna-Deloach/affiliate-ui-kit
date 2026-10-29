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
import { Specimen } from "@/stories/specimen";
import { VerticalCompare, ViewportFrames } from "@/stories/vertical-compare";

import { AuthorityByline } from "./authority-byline";

const VARIANTS = ["inline-header", "dossier-box", "verified-strip"] as const;
const NAMES = { "inline-header": "Inline header", "dossier-box": "Dossier box", "verified-strip": "Verified strip" } as const;

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

export const Variants: Story = {
  render: (args) => (
    <div className="flex max-w-2xl flex-col gap-section">
      {VARIANTS.map((variant) => (
        <Specimen key={variant} caption={NAMES[variant]}>
          <AuthorityByline {...args} variant={variant} />
        </Specimen>
      ))}
    </div>
  ),
};

export const DossierClinical: Story = {
  name: "Dossier — two regions, methodology open",
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
  name: "Minimal data",
  render: () => (
    <div className="flex max-w-2xl flex-col gap-section">
      <Specimen caption="Name only — monogram fallback">
        <AuthorityByline author={{ name: "Jonah Whitfield" }} />
      </Specimen>
      <Specimen caption="Verified strip without methodology">
        <AuthorityByline author={{ name: "Celeste Marchetti", role: "Editor" }} verifiedAt="2026-10-01T00:00:00Z" variant="verified-strip" />
      </Specimen>
      <Specimen caption="Dossier without portrait or methodology">
        <AuthorityByline author={{ name: "Jonah Whitfield", role: "Contributing tester", credentials: ["UESCA run coach"] }} verifiedAt="2026-10-01T00:00:00Z" variant="dossier-box" />
      </Specimen>
    </div>
  ),
};

export const UnderHeading: Story = {
  name: "Under an article heading",
  render: () => (
    <div className="flex max-w-3xl flex-col gap-stack">
      <EditorialHeading as="h1" eyebrow={productWatch.eyebrow} title={`${productWatch.brand} ${productWatch.name} review`} dek={productWatch.verdictSummary} />
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
      <div className="flex flex-col gap-section">
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
        <div className="flex flex-col gap-stack">
          <AuthorityByline author={authorEditorial} reviewedBy={reviewerFactCheck} verifiedAt={productWatch.lastVerifiedAt} methodology={methodologyEditorial} variant="inline-header" />
          <AuthorityByline author={authorEditorial} reviewedBy={reviewerFactCheck} verifiedAt={productWatch.lastVerifiedAt} methodology={methodologyEditorial} variant="dossier-box" />
        </div>
      )}
    />
  ),
};
