import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { assertKitPage } from "@/kit/testing/page-checks";
import { Button } from "@/kit/ui";

import { Alert } from "./alert";

const meta = {
  title: "Primitives/Alert",
  component: Alert,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "column" },
  play: assertKitPage,
  args: {
    title: "We don’t fact-check reviews",
    // On one line, without wrapping parentheses: the manifest prints args as written, and `(<p>…</p>)` would reach agents as a literal “(” and “)”.
    children: <p>We check that a reviewer exists and label how the review reached us. <a href="#labels">How we label reviews</a></p>,
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Context a reader should have before trusting reviews: what the site does
 * and does not check.
 * @summary Info: what the site checks about reviews, and what it doesn’t.
 */
export const NotFactChecked: Story = {};

/**
 * A fact that changes how far the reviews can be trusted: the brand has not
 * asked its customers for reviews lately, so they may lean negative.
 * @summary Warning: the brand hasn’t asked for reviews recently.
 */
export const NoRecentInvites: Story = {
  args: {
    tone: "warning",
    title: "No recent history of asking for reviews",
    children: <p>Brands that ask every customer get a fuller picture. These reviews may lean toward problems.</p>,
  },
};

/**
 * A product’s lab certification has lapsed: the results shown are from an
 * older batch.
 * @summary Warning: certification expired, with past results.
 */
export const CertificationExpired: Story = {
  args: {
    tone: "warning",
    title: "Certification expired on March 4, 2026",
    children: <p>The results below are from batch 1987. We have bought a new batch to test.</p>,
    action: (
      <a href="#history" className="kit-focus kit-link rounded-ctl t-small text-fg">
        See past certifications
      </a>
    ),
  },
};

/**
 * A form went through: announced to screen readers as it appears (`live`).
 * @summary Success: a review was sent, announced as it appears.
 */
export const ReviewSent: Story = {
  args: {
    tone: "success",
    live: true,
    title: "Thanks, your review is in",
    children: <p>We publish reviews within two days, after a check for spam.</p>,
  },
};

/**
 * A form could not go through, with the way to try again.
 * @summary Danger: the review could not be sent, with a retry.
 */
export const CouldNotSend: Story = {
  args: {
    tone: "danger",
    live: true,
    title: "Your review wasn’t sent",
    children: <p>We couldn’t reach the server. Your text is still in the form.</p>,
    action: <Button>Try again</Button>,
  },
};
