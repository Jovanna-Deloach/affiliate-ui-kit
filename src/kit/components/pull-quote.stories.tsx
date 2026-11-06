import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { assertKitPage } from "@/kit/testing/page-checks";

import { PullQuote } from "./pull-quote";

const meta = {
  title: "Components/Pull-quote",
  component: PullQuote,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true, frame: "card" },
  play: assertKitPage,
  args: {
    text: "It went from a board meeting to the pool without my noticing it was there. That is the job.",
    person: { name: "Celeste Marchetti", role: "Watches editor", avatar: { src: "/fixtures/portrait-marchetti.jpg", alt: "Celeste Marchetti" } },
    proof: "64 days on the wrist",
    className: "max-w-measure",
  },
} satisfies Meta<typeof PullQuote>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * One tester’s words in a review, with their portrait and the proof that
 * they used it long enough to say so.
 * @summary A tester’s quote with portrait, role and proof.
 */
export const WithPortrait: Story = {};

/**
 * A tester without a portrait gets initials; the quote and the proof carry
 * the weight.
 * @summary A quote whose tester has no portrait: initials instead.
 */
export const Initials: Story = {
  args: {
    text: "The strap was the first thing I wanted to change and the last thing I would now.",
    person: { name: "Henrik Aalto", role: "Watchmaker" },
    proof: "Serviced 40 of these",
  },
};

/**
 * The lab theme’s quote: a chemist, and the work that earned the line.
 * @summary A chemist’s quote in the Assay theme.
 */
export const Chemist: Story = {
  parameters: { theme: "assay", category: "supplements" },
  args: {
    text: "Three runs, three results within half a percent of each other. That is a clean product.",
    person: { name: "Dr. Priya Raman", role: "Analytical chemist", avatar: { src: "/fixtures/portrait-raman.jpg", alt: "Dr. Priya Raman" } },
    proof: "Ran the HPLC assay",
  },
};

/**
 * In a narrow column a long quote wraps under its hanging mark; the rule
 * runs its full height.
 * @summary A long quote in a narrow column.
 */
export const NarrowColumn: Story = {
  parameters: { frame: "narrow-card" },
  args: {
    text: "Thirty days in, it had gained less than five minutes, survived a week of sea swims and still looked right with a jacket. At this price that is the whole argument.",
    person: { name: "Mara Lindgren", role: "Reviewer" },
    proof: "30 days, 6 swims",
  },
};
