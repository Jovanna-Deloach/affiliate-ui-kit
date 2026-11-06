import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { assertKitPage } from "@/kit/testing/page-checks";

import { ProsCons } from "./pros-cons";

const meta = {
  title: "Components/Pros and cons",
  component: ProsCons,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true, frame: "card" },
  play: assertKitPage,
  args: {
    id: "meridian",
    pros: ["Kept time within +1.6 s/day over 30 days", "The GMT hand jumps independently, so a second time zone takes a second", "Micro-adjust clasp, no tools"],
    cons: ["The bezel scratches more easily than ceramic", "Lume fades after about four hours"],
  },
} satisfies Meta<typeof ProsCons>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A review’s verdict in points: what we like and what to know side by side,
 * each a fact the reader can check rather than an adjective.
 * @summary Two lists side by side: what we like, what to know.
 */
export const BothLists: Story = {};

/**
 * A pick with nothing worth warning about gets one list; an empty list is
 * left out rather than padded.
 * @summary Only what we like: the empty list is left out.
 */
export const OnlyWhatWeLike: Story = {
  args: { cons: [] },
};

/**
 * Headings can say more than the defaults when the page’s voice calls for
 * it.
 * @summary Custom headings for the two lists.
 */
export const CustomHeadings: Story = {
  parameters: { theme: "assay", category: "supplements" },
  args: {
    id: "peak",
    prosLabel: "Why it earned a place",
    consLabel: "Before you buy",
    pros: ["Assayed at 100.4% of its label claim, the closest of any tub", "Lead and arsenic below a tenth of their limits"],
    cons: ["The scoop is 5 g, so a 3 g serving needs a scale"],
  },
};

/**
 * In a container under 36rem the two lists stack, what we like first.
 * @summary The lists stacked in a narrow container.
 */
export const Stacked: Story = {
  parameters: { frame: "narrow-card" },
};
