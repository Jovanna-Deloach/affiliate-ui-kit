import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { currentCertification, expiredCertification, upcomingCertification } from "@/fixtures/kit/safety";
import { assertKitPage } from "@/kit/testing/page-checks";

import { CertificationNotice } from "./certification-notice";

const meta = {
  title: "Components/Certification notice",
  component: CertificationNotice,
  tags: ["autodocs", "new"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "column" },
  play: assertKitPage,
  args: { certification: expiredCertification },
} satisfies Meta<typeof CertificationNotice>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Lapsed: what that means for the jar on sale now, and every batch tested, one of them a failure.
 * @summary Certification expired, with every batch tested.
 */
export const Expired: Story = {};

/**
 * A new batch in the lab, with the date results are due.
 * @summary In testing: results by December.
 */
export const InTesting: Story = { args: { certification: upcomingCertification } };

/**
 * Current, with its record of batches.
 * @summary Certified, with its record.
 */
export const Certified: Story = { args: { certification: currentCertification } };

/**
 * Never tested.
 * @summary Not tested.
 */
export const NotTested: Story = { args: { certification: { status: "untested" } } };
