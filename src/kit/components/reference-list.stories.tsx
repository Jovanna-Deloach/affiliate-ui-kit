import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { creatineReferences } from "@/fixtures/kit/evidence";
import { assertKitPage } from "@/kit/testing/page-checks";

import { ReferenceList } from "./reference-list";

const meta = {
  title: "Components/Reference list",
  component: ReferenceList,
  tags: ["autodocs", "new"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "column" },
  play: assertKitPage,
  args: { references: creatineReferences },
} satisfies Meta<typeof ReferenceList>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Twelve sources: journal papers with their DOIs, and a lab’s certificate with the date it was opened.
 * @summary Twelve numbered sources, with DOIs.
 */
export const Creatine: Story = {};
