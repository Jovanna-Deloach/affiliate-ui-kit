import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { assertKitPage } from "@/kit/testing/page-checks";

import { Skeleton } from "./skeleton";

const meta = {
  title: "Primitives/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "column" },
  play: assertKitPage,
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A review on its way: the avatar, the name line, then the body, in the
 * shape the review will take. The list’s label tells screen readers it is
 * loading.
 * @summary A review loading: avatar, name and three lines.
 */
export const ReviewLoading: Story = {
  render: () => (
    <div role="status" aria-label="Loading reviews" className="flex items-start gap-3">
      <Skeleton shape="circle" />
      <div className="grid flex-1 gap-4 pt-1">
        <Skeleton className="w-40" />
        <Skeleton lines={3} />
      </div>
    </div>
  ),
};

/**
 * A product card on its way: the photograph’s frame, then two lines.
 * @summary A product card loading: photograph and two lines.
 */
export const CardLoading: Story = {
  render: () => (
    <div role="status" aria-label="Loading products" className="grid max-w-60 gap-3">
      <Skeleton shape="block" className="aspect-[4/4.2] h-auto" />
      <Skeleton lines={2} />
    </div>
  ),
};
