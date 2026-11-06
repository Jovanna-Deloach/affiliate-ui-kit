import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { creatineGuide } from "@/fixtures/kit/creatine";
import { AssayBadge, PickMedia } from "@/kit/components";
import { assertKitPage } from "@/kit/testing/page-checks";
import { Specimen, State } from "@/kit/testing/specimen";

import { Award, Badge, BestPrice, ResultMark } from "./badge";
import { Monogram } from "./marks";

/**
 * Every state on one sheet, in both themes, for people reviewing the
 * system. Not in the agent manifest: agents read the use-case stories.
 */
const meta = {
  title: "Specimen sheets/Primitives/Badges",
  tags: ["!manifest"],
  parameters: { layout: "fullscreen", kit: true, frame: "none" },
  play: assertKitPage,
} satisfies Meta;

export default meta;
/** Specimen pages render every state themselves, so stories take no args. */
type Story = StoryObj;

const DESCRIPTION = "Short labels in pills, in the micro-caps voice: awards, proofs, stamps on photographs and results. A tone always comes with a word or an icon.";

function Variants() {
  return (
    <>
      <State label="Award (solid)">
        <div className="flex flex-wrap gap-3">
          <Award>Our pick</Award>
          <Award>Budget pick</Award>
          <Award>Best for fast days</Award>
        </div>
      </State>
      <State label="Proof (outline)">
        <div className="flex flex-wrap gap-3">
          <Badge variant="outline" size="md">
            64 days on the wrist
          </Badge>
          <Badge variant="outline" size="md">
            Ran both HPLC assays
          </Badge>
        </div>
      </State>
      <State label="Results (soft, with an icon)">
        <div className="flex flex-wrap gap-3">
          <ResultMark status="pass">Pass</ResultMark>
          <ResultMark status="caution">Near limit</ResultMark>
          <ResultMark status="fail">Fail</ResultMark>
          <BestPrice />
          <Badge variant="soft">Discontinued</Badge>
        </div>
      </State>
      <State label="Merchant monograms">
        <div className="flex flex-wrap items-center gap-3">
          <Monogram name="Haus & Field" />
          <Monogram name="Northlane" />
          <Monogram name="Peak Supply" />
          <Monogram name="Verra" />
        </div>
      </State>
    </>
  );
}

export const Atelier: Story = {
  parameters: { theme: "atelier" },
  render: () => (
    <Specimen kind="Primitive" title="Badges" description={DESCRIPTION}>
      <Variants />
    </Specimen>
  ),
};

export const Assay: Story = {
  name: "Assay, supplements (with a frosted stamp)",
  parameters: { theme: "assay" },
  render: () => {
    const pick = creatineGuide.picks[0]!;
    const m = pick.measurements;
    return (
      <Specimen kind="Primitive" title="Badges" description={DESCRIPTION} category="supplements">
        <Variants />
        <State label="Frosted, on a photograph">
          <figure className="@container m-0 max-w-sm">
            <PickMedia pick={pick} detail="full" sizes="24rem">
              <Award className="absolute top-4 left-4">{pick.award}</Award>
              {m.kind === "assay" && <AssayBadge measurements={m} className="absolute bottom-4 left-4" />}
            </PickMedia>
          </figure>
        </State>
      </Specimen>
    );
  },
};
