import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Bookmark, Share2 } from "lucide-react";

import { assertKitPage } from "@/kit/testing/page-checks";

import { Tooltip } from "./tooltip";

const meta = {
  title: "Primitives/Tooltip",
  component: Tooltip,
  tags: ["autodocs", "new"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "narrow" },
  play: assertKitPage,
  args: { content: "Save this product", children: <span /> },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Names an icon-only button on hover and focus. The button’s `aria-label`
 * says the same, so touch and screen-reader users lose nothing.
 * @summary Names an icon-only save button on hover and focus.
 */
export const IconButton: Story = {
  render: () => (
    <div className="flex justify-center pt-12">
      <Tooltip content="Save this product" defaultOpen>
        <button type="button" aria-label="Save this product" className="kit-focus grid size-11 cursor-pointer place-items-center rounded-full border border-line-strong bg-paper text-fg hover:border-fg">
          <Bookmark aria-hidden="true" size={18} strokeWidth={1.75} />
        </button>
      </Tooltip>
    </div>
  ),
};

/**
 * Below the control when there is no room above it, as in a header row.
 * @summary A tooltip that opens below its control.
 */
export const Below: Story = {
  render: () => (
    <div className="flex justify-center pb-12">
      <Tooltip content="Share this guide" side="bottom" defaultOpen>
        <button type="button" aria-label="Share this guide" className="kit-focus grid size-11 cursor-pointer place-items-center rounded-full border border-line-strong bg-paper text-fg hover:border-fg">
          <Share2 aria-hidden="true" size={18} strokeWidth={1.75} />
        </button>
      </Tooltip>
    </div>
  ),
};
