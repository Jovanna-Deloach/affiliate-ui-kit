import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { assertKitPage } from "@/kit/testing/page-checks";

import { TrustPrinciples } from "./trust-principles";

const meta = {
  title: "Blocks/Trust principles",
  component: TrustPrinciples,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "well" },
  play: assertKitPage,
  args: {
    items: [
      { title: "Every review stays up", body: "We publish every review that follows our guidelines, whatever its rating. Brands can’t pay to remove or move one.", href: "#guidelines" },
      { title: "We label how reviews reach us", body: "Verified, invited, unprompted or incentivized: each review says which, so you can weigh it.", href: "#labels" },
      { title: "We buy what we test", body: "Our testers buy every product at retail, anonymously, and send it to an accredited lab.", href: "#method" },
    ],
  },
} satisfies Meta<typeof TrustPrinciples>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Three promises at the end of a review section.
 * @summary Three promises: reviews stay up, labels, bought at retail.
 */
export const ThreePromises: Story = {};

/**
 * Six promises, including how the site is paid, for an about page.
 * @summary Six promises, for an about page.
 */
export const SixPromises: Story = {
  args: {
    heading: "What you can count on",
    items: [
      { title: "Every review stays up", body: "We publish every review that follows our guidelines, whatever its rating." },
      { title: "We label how reviews reach us", body: "Verified, invited, unprompted or incentivized: each review says which." },
      { title: "We buy what we test", body: "Our testers buy every product at retail, anonymously." },
      { title: "An accredited lab runs the tests", body: "ISO 17025 labs, blinded to brand, test every batch twice." },
      { title: "We’re paid by commission", body: "When you buy through our links we may earn a commission; it never changes a ranking." },
      { title: "Brands can reply, not edit", body: "A brand can answer a review in public. It can’t change or hide it." },
    ],
  },
};
