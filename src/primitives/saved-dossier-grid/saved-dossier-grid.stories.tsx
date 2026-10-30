import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { savedGuides, savedProducts } from "@/fixtures/account";
import { VerticalCompare, ViewportFrames } from "@/stories/vertical-compare";

import { SavedDossierGrid } from "./saved-dossier-grid";

const attribution = { source: "kit", medium: "affiliate", campaign: "member-dossier" };

const meta = {
  title: "Tier 15 · Account & Personalization/SavedDossierGrid",
  component: SavedDossierGrid,
  parameters: { layout: "fullscreen" },
  args: { savedProducts, savedGuides, defaultTab: "products", defaultSort: "biggest-drop", attribution, onCompare: () => {} },
  argTypes: {
    savedProducts: { control: false },
    savedGuides: { control: false },
    defaultTab: { control: "inline-radio", options: ["products", "guides"] },
    defaultSort: { control: "inline-radio", options: ["biggest-drop", "recent", "name"] },
  },
} satisfies Meta<typeof SavedDossierGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const OnlyRises: Story = {
  name: "No drops — strip and ledger without movers",
  args: { savedProducts: savedProducts.filter((s) => s.product.id === "prod-cumulus-max" || s.product.id === "prod-tempo-pro") },
};

export const SavedGuidesTab: Story = {
  name: "Saved guides tab",
  args: { defaultTab: "guides" },
};

export const Empty: Story = {
  name: "Empty states",
  args: { savedProducts: [], savedGuides: [] },
};

export const SideBySideVerticals: Story = {
  name: "★ Multi-vertical side-by-side",
  render: (args) => <VerticalCompare render={() => <SavedDossierGrid {...args} savedProducts={savedProducts.slice(0, 2)} />} />,
};

export const Viewports: Story = {
  name: "Responsive · 375 vs 1280",
  render: (args) => <ViewportFrames render={() => <SavedDossierGrid {...args} savedProducts={savedProducts.slice(0, 4)} />} />,
};
