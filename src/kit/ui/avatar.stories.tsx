import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { assertKitPage } from "@/kit/testing/page-checks";

import { Avatar } from "./avatar";

const meta = {
  title: "Kit/Primitives/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true },
  play: assertKitPage,
  args: {
    person: { name: "Celeste Marchetti", avatar: { src: "/fixtures/portrait-marchetti.jpg", alt: "Celeste Marchetti" } },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The byline portrait at 44px: a real person signs the review.
 * @summary A byline portrait (44px).
 */
export const Portrait: Story = {};

/**
 * Without a photograph, the initials on a paper disc: legible on paper,
 * well and ground, never a stock silhouette.
 * @summary Initials when there is no portrait.
 */
export const Initials: Story = {
  args: { person: { name: "Henrik Aalto" } },
};

/**
 * The 36px size, for the tester under a pull-quote inside a card.
 * @summary The small size, for quotes inside cards.
 */
export const Small: Story = {
  parameters: { theme: "assay", category: "supplements" },
  args: { person: { name: "Dr. Priya Raman", avatar: { src: "/fixtures/portrait-raman.jpg", alt: "Dr. Priya Raman" } }, size: "sm" },
};
