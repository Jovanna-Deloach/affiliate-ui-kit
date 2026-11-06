import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { ReactNode } from "react";

import { creatineGuide } from "@/fixtures/kit/creatine";
import { runningGuide } from "@/fixtures/kit/running";
import { watchesGuide } from "@/fixtures/kit/watches";
import { assertKitPage } from "@/kit/testing/page-checks";
import { Specimen, State } from "@/kit/testing/specimen";

import { SpecSheet } from "./spec-sheet";

/**
 * Every state on one sheet, in both themes, for people reviewing the
 * system. Not in the agent manifest: agents read the use-case stories.
 */
const meta = {
  title: "Specimen sheets/Components/Spec sheet",
  tags: ["!manifest"],
  parameters: { layout: "fullscreen", kit: true, frame: "none" },
  play: assertKitPage,
} satisfies Meta;

export default meta;
/** Specimen pages render every state themselves, so stories take no args. */
type Story = StoryObj;

const DESCRIPTION = "Specifications in two columns between hairlines: folded into a card footer (drawer) or set open on their own (sheet).";

/** A card above the drawer, as in a review. */
function Card({ children }: { children: ReactNode }) {
  return (
    <div className="@container kit-card">
      <p className="m-0 p-5 t-body text-fg-body @2xl:p-8">The review sits above the drawer.</p>
      {children}
    </div>
  );
}

export const Atelier: Story = {
  parameters: { theme: "atelier" },
  render: () => {
    const [meridian, ardent, sato] = watchesGuide.picks;
    return (
      <Specimen kind="Component" title="Spec sheet" description={DESCRIPTION} columns={1}>
        <State label="Drawer, closed (a card footer)">
          <Card>
            <SpecSheet facts={meridian!.facts} id="ss-1" />
          </Card>
        </State>
        <State label="Drawer, open">
          <Card>
            <SpecSheet facts={ardent!.facts} id="ss-2" defaultOpen />
          </Card>
        </State>
        <State label="Sheet, always open">
          <SpecSheet facts={sato!.facts} variant="sheet" id="ss-3" />
        </State>
        <State label="Drawer in a narrow card: one column" className="max-w-sm">
          <Card>
            <SpecSheet facts={watchesGuide.picks[3]!.facts} id="ss-4" defaultOpen />
          </Card>
        </State>
      </Specimen>
    );
  },
};

export const Assay: Story = {
  parameters: { theme: "assay" },
  render: () => (
    <Specimen kind="Component" title="Spec sheet" description={DESCRIPTION} columns={1} category="supplements">
      <State label="Supplements, open">
        <Card>
          <SpecSheet facts={creatineGuide.picks[0]!.facts} id="ss-5" defaultOpen />
        </Card>
      </State>
      <State label="Running, many details">
        <Card>
          <SpecSheet
            facts={[
              ...runningGuide.picks[0]!.facts,
              { label: "Upper", value: "Engineered knit, gusseted tongue" },
              { label: "Outsole", value: "Rubber, 4 mm lugs" },
              { label: "Widths", value: "Standard and wide" },
            ]}
            id="ss-6"
            defaultOpen
          />
        </Card>
      </State>
    </Specimen>
  ),
};
