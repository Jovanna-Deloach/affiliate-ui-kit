import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { assertKitPage } from "@/kit/testing/page-checks";
import { Badge } from "@/kit/ui";

import { Explainer } from "./explainer";

const meta = {
  title: "Primitives/Explainer",
  component: Explainer,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "narrow" },
  play: assertKitPage,
  args: { label: "What does Verified mean?", children: null },
} satisfies Meta<typeof Explainer>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The label on a review explains itself: a tap on “Verified” says what was
 * checked. Opened here for the preview (`defaultOpen`); on a page it opens
 * on tap.
 * @summary What a review label means, opened from the label itself.
 */
export const ReviewLabel: Story = {
  render: () => (
    <div className="pb-48">
      <Explainer
        label="What does Verified mean?"
        title="Verified review"
        defaultOpen
        trigger={
          <button type="button" className="kit-focus cursor-pointer rounded-full">
            <Badge variant="soft" tone="pass">
              Verified
            </Badge>
          </button>
        }
      >
        <p>
          We matched this review to an order confirmation from a retailer. <a href="#labels">How we label reviews</a>
        </p>
      </Explainer>
    </div>
  ),
};

/**
 * The default trigger, an info icon after the term: how a grade is worked
 * out, where a limit comes from.
 * @summary An info icon after a grade, explaining how it is worked out.
 */
export const AfterAGrade: Story = {
  render: () => (
    <p className="m-0 flex items-center gap-1 t-ui text-fg">
      Evidence grade A
      <Explainer label="How evidence grades work" title="Evidence grade">
        <p>A means several studies, mostly in agreement, found at least a moderate effect. F means the evidence points to harm.</p>
      </Explainer>
    </p>
  ),
};
