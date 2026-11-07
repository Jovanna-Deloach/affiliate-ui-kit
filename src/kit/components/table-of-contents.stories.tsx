import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { assertKitPage } from "@/kit/testing/page-checks";

import { TableOfContents } from "./table-of-contents";

const meta = {
  title: "Components/Table of contents",
  component: TableOfContents,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "narrow" },
  play: assertKitPage,
  args: {
    items: [
      { id: "what-it-is", label: "What creatine is" },
      { id: "benefits", label: "What it does, by outcome" },
      { id: "dosage", label: "How much to take" },
      { id: "loading", label: "Do you need to load?", level: 3 },
      { id: "safety", label: "Side effects and safety" },
      { id: "products", label: "Products we tested" },
      { id: "faq", label: "Questions" },
      { id: "references", label: "References" },
    ],
  },
} satisfies Meta<typeof TableOfContents>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * An ingredient page’s sections, with one subsection indented. Beside the
 * content on a wide screen, folded under “On this page” on a phone; the
 * section being read is marked as the reader scrolls.
 * @summary The sections of an ingredient page, with a subsection.
 */
export const IngredientPage: Story = {};

/**
 * A lab report’s sections under its own heading.
 * @summary A lab report’s sections, under “In this report”.
 */
export const LabReport: Story = {
  args: {
    label: "In this report",
    items: [
      { id: "summary", label: "Summary" },
      { id: "label-claim", label: "Label claim" },
      { id: "heavy-metals", label: "Heavy metals" },
      { id: "microbes", label: "Microbes" },
      { id: "method", label: "How we tested" },
    ],
  },
};
