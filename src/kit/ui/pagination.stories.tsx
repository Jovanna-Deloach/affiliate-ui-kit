import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { assertKitPage } from "@/kit/testing/page-checks";

import { Pagination } from "./pagination";

const meta = {
  title: "Primitives/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "column" },
  play: assertKitPage,
  args: { page: 3, pageCount: 20, href: (page: number) => `?page=${page}`, label: "Review pages" },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Page 3 of 20 reviews: the first and last pages, one either side of the
 * current, and gaps. On a phone, “Page 3 of 20” between Previous and Next.
 * @summary Review pages, page 3 of 20.
 */
export const ReviewPages: Story = {};

/**
 * On the first page Previous is shown but unavailable, so the row keeps its
 * shape.
 * @summary The first page: Previous unavailable.
 */
export const FirstPage: Story = { args: { page: 1 } };

/**
 * A short list: every page fits, with no gaps.
 * @summary Four pages, all shown.
 */
export const FewPages: Story = { args: { page: 2, pageCount: 4, label: "Ranking pages" } };
