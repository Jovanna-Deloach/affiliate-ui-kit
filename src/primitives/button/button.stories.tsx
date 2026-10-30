import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ArrowRight, SlidersHorizontal } from "lucide-react";

import { AffiliateAction } from "@/primitives/affiliate-action";
import { Specimen } from "@/stories/specimen";
import { VerticalCompare } from "@/stories/vertical-compare";

import { Button } from "./button";

const INTENTS = ["primary", "outline", "ghost", "price", "inline"] as const;
const SIZES = ["sm", "md", "lg"] as const;

const meta = {
  title: "Tier 0 · Shared Controls/Button",
  component: Button,
  parameters: { layout: "fullscreen" },
  args: { children: "Subscribe", intent: "primary", size: "md", width: "auto", motion: "flat" },
  argTypes: {
    intent: { control: "inline-radio", options: INTENTS },
    size: { control: "inline-radio", options: SIZES },
    width: { control: "inline-radio", options: ["auto", "cta", "full"] },
    motion: { control: "inline-radio", options: ["flat", "arrow-nudge", "shimmer"] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Intents: Story = {
  render: () => (
    <div className="flex flex-col gap-section">
      <Specimen caption="Five intents — the same silhouettes AffiliateAction wears">
        <div className="flex flex-wrap items-center gap-cluster">
          {INTENTS.map((intent) => (
            <Button key={intent} intent={intent}>
              {intent === "price" ? "$189" : intent === "inline" ? "Read the charter" : "Reset all"}
            </Button>
          ))}
        </div>
      </Specimen>
      <Specimen caption="Sizes">
        <div className="flex flex-wrap items-center gap-cluster">
          {SIZES.map((size) => (
            <Button key={size} intent="outline" size={size}>
              <SlidersHorizontal size="1.1em" strokeWidth={1.5} aria-hidden="true" />
              Filters
            </Button>
          ))}
        </div>
      </Specimen>
      <Specimen caption="As a link with the arrow nudge — internal destinations only">
        <Button asChild motion="arrow-nudge">
          <a href="#tools/protein-calculator">
            Open the calculator
            <ArrowRight data-slot="action-arrow" size="1.1em" strokeWidth={1.5} aria-hidden="true" />
          </a>
        </Button>
      </Specimen>
      <Specimen caption="Beside a merchant CTA: one silhouette, two contracts">
        <div className="flex flex-wrap items-center gap-cluster">
          <AffiliateAction href="https://example-merchant.test/northlane/aerolite-3">View deal</AffiliateAction>
          <Button intent="outline">Compare</Button>
          <Button intent="ghost" disabled>
            Notify me
          </Button>
        </div>
      </Specimen>
    </div>
  ),
};

export const SideBySideVerticals: Story = {
  name: "★ Multi-vertical side-by-side",
  render: () => (
    <VerticalCompare>
      <div className="flex flex-wrap items-center gap-cluster">
        {INTENTS.map((intent) => (
          <Button key={intent} intent={intent}>
            {intent === "price" ? "$189" : intent === "inline" ? "Read the charter" : "Reset all"}
          </Button>
        ))}
      </div>
    </VerticalCompare>
  ),
};
