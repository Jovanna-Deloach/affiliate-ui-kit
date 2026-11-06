import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { assertKitPage } from "@/kit/testing/page-checks";

import { SpecSheet } from "./spec-sheet";

const meta = {
  title: "Kit/Components/Spec sheet",
  component: SpecSheet,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true, frame: "card" },
  play: assertKitPage,
  args: {
    id: "meridian-specs",
    facts: [
      { label: "Case", value: "40 mm steel, 11.9 mm thick" },
      { label: "Movement", value: "Automatic GMT, 72-hour reserve" },
      { label: "Water resistance", value: "200 m" },
      { label: "Crystal", value: "Sapphire, anti-reflective inside" },
      { label: "Bracelet", value: "Steel, micro-adjust clasp" },
    ],
  },
} satisfies Meta<typeof SpecSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The foot of a review card: every specification, closed by default so the
 * argument above it stays short, still in the page for search engines.
 * @summary Full specifications as a closed card-footer drawer.
 */
export const Drawer: Story = {};

/**
 * The drawer open on load, for a page whose reader came for the details.
 * @summary The drawer open on load.
 */
export const DrawerOpen: Story = {
  args: { defaultOpen: true },
};

/**
 * The list on its own, always open: for a product page’s specification
 * section.
 * @summary The specifications as an always-open sheet.
 */
export const Sheet: Story = {
  parameters: { theme: "assay", category: "running" },
  args: {
    id: "aerolite-specs",
    variant: "sheet",
    facts: [
      { label: "Weight", value: "8.6 oz (men’s 9)" },
      { label: "Stack", value: "38 / 30 mm" },
      { label: "Drop", value: "8 mm" },
      { label: "Foam", value: "PEBA core in an EVA carrier" },
    ],
  },
};
