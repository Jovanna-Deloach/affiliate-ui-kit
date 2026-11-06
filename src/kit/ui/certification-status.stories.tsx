import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { assertKitPage } from "@/kit/testing/page-checks";

import { CertificationStatus } from "./certification-status";

const meta = {
  title: "Primitives/Certification status",
  component: CertificationStatus,
  tags: ["autodocs", "new"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "narrow" },
  play: assertKitPage,
  args: { certification: { status: "certified", date: "2027-10-14" } },
} satisfies Meta<typeof CertificationStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Passed its latest test, certified for a year.
 * @summary Certified until Oct 2027.
 */
export const Certified: Story = {};

/**
 * Certified once, not retested since: amber, with the date it lapsed.
 * @summary Certification expired Mar 2026.
 */
export const Expired: Story = { args: { certification: { status: "expired", date: "2026-03-01" } } };

/**
 * Bought and in the lab, with the date results are due.
 * @summary In testing, results by Dec 2026.
 */
export const InTesting: Story = { args: { certification: { status: "upcoming", date: "2026-12-15" } } };

/**
 * Listed, but not tested yet.
 * @summary Not tested yet.
 */
export const NotTested: Story = { args: { certification: { status: "untested" } } };

/**
 * The larger size, for a product’s header.
 * @summary Certified, in a product’s header.
 */
export const InAHeader: Story = { args: { size: "md" } };
