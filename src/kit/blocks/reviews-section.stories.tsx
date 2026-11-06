import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { peakAiSummary, peakReviews, peakTopics, peakTrust, REVIEWS_NOW, testerReviews } from "@/fixtures/kit/reviews";
import { WriteReview } from "@/kit/blocks";
import { TrustSignals } from "@/kit/components";
import { assertKitPage } from "@/kit/testing/page-checks";
import { Button, Dialog } from "@/kit/ui";

import { ReviewsSection } from "./reviews-section";

const meta = {
  title: "Blocks/Reviews section",
  component: ReviewsSection,
  tags: ["autodocs", "new"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "well" },
  play: assertKitPage,
  args: {
    heading: "What readers say about Peak Supply Creatine",
    reviews: peakReviews,
    now: REVIEWS_NOW,
    labelsHref: "#labels",
    reportHref: "/report",
    scoreHref: "#how-scores-work",
  },
} satisfies Meta<typeof ReviewsSection>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Reader reviews of a creatine, whole: the numbers with Write a review, the
 * AI summary and topics, how the brand handles reviews, then the list with
 * its filters and sort. Every filter changes the list at once.
 * @summary Reader reviews: numbers, AI summary, topics, filters, list.
 */
export const ReaderReviews: Story = {
  args: {
    topics: peakTopics,
    aiSummary: peakAiSummary,
    aside: <TrustSignals brand="Peak Supply" signals={peakTrust} href="#brands" />,
    writeAction: (
      <Dialog title="Write a review" description="Peak Supply Creatine Monohydrate" trigger={<Button>Write a review</Button>}>
        <WriteReview product="Peak Supply Creatine Monohydrate" guidelinesHref="#guidelines" />
      </Dialog>
    ),
  },
};

/**
 * Only the site’s testers review here, and two of them have: no Write a
 * review, and no filters, since two reviews are read at a glance. The numbers
 * sit beside the list, and their rating rows still filter it.
 * @summary Tester reviews only: no form, no filters.
 */
export const TesterReviews: Story = {
  args: { heading: "What our testers found", reviews: testerReviews, reportHref: undefined },
};

/**
 * A product nobody has reviewed yet: the way to write the first review.
 * @summary No reviews yet, with Write a review.
 */
export const NoReviewsYet: Story = {
  args: {
    reviews: [],
    writeAction: (
      <Dialog title="Write a review" description="Peak Supply Creatine Monohydrate" trigger={<Button>Write a review</Button>}>
        <WriteReview product="Peak Supply Creatine Monohydrate" guidelinesHref="#guidelines" />
      </Dialog>
    ),
  },
};

/**
 * A few reviews, shown four at a time with Show more.
 * @summary Four at a time, with Show more.
 */
export const ShowMore: Story = { args: { pageSize: 4 } };

/**
 * The AI summary links to a 1-star review that is not shown yet: four
 * reviews at a time, filtered to 5 stars. Following the link clears the
 * filter, shows enough of the list to reach the review, and moves to it.
 * @summary A link to a hidden review clears the filters and reaches it.
 */
export const LinkToAReview: Story = {
  args: { pageSize: 4, aiSummary: peakAiSummary },
  play: async (context) => {
    const canvas = within(context.canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: /^5 stars/ }));
    const link = canvas.getAllByRole("link").find((el) => el.getAttribute("href") === "#review-r-1005");
    if (!link) throw new Error("The AI summary has no link to review r-1005");
    await userEvent.click(link);
    await waitFor(() => expect(context.canvasElement.ownerDocument.activeElement?.id).toBe("review-r-1005"));
    await expect(canvas.queryByRole("list", { name: "Filters applied" })).toBeNull();
    await assertKitPage(context);
  },
};
