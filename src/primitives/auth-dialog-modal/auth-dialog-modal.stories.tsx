import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { memberBenefits } from "@/fixtures/account";
import { publication } from "@/fixtures/navigation";
import { Button } from "@/primitives/button";

import { AuthDialogModal } from "./auth-dialog-modal";

const providers = [
  { id: "google", label: "Continue with Google", action: "#auth/google" },
  { id: "apple", label: "Continue with Apple", action: "#auth/apple" },
];

const terms = (
  <>
    By continuing you agree to the{" "}
    <a href="#terms" className="underline decoration-strong underline-offset-[0.3em] hover:text-ink">
      terms
    </a>{" "}
    and{" "}
    <a href="#privacy" className="underline decoration-strong underline-offset-[0.3em] hover:text-ink">
      privacy policy
    </a>
    .
  </>
);

const meta = {
  title: "Tier 15 · Account & Personalization/AuthDialogModal",
  component: AuthDialogModal,
  parameters: { layout: "fullscreen" },
  args: {
    publication: { name: publication.name, tagline: publication.tagline },
    benefits: memberBenefits,
    magicLink: { action: "#auth/magic-link" },
    providers,
    terms,
    defaultOpen: false,
    trigger: <Button intent="outline">Sign in</Button>,
  },
  argTypes: { benefits: { control: false }, providers: { control: false }, trigger: { control: false }, terms: { control: false } },
} satisfies Meta<typeof AuthDialogModal>;

export default meta;
type Story = StoryObj<typeof meta>;

function Page({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[40rem] flex-col gap-grid bg-canvas">
      <div className="border-b border-hairline bg-surface">
        <div className="page-well grid h-masthead grid-cols-[minmax(0,1fr)_auto] items-center">
          <span className="type-title text-ink">{publication.name}</span>
          {children}
        </div>
      </div>
    </div>
  );
}

export const Playground: Story = {
  render: (args) => (
    <Page>
      <AuthDialogModal {...args} />
    </Page>
  ),
};

export const Open: Story = {
  name: "Open — split dialog",
  args: { defaultOpen: true },
  render: (args) => (
    <Page>
      <AuthDialogModal {...args} />
    </Page>
  ),
};

export const MagicLinkOnly: Story = {
  name: "Open — magic link only, no providers",
  args: { defaultOpen: true, providers: [] },
  render: (args) => (
    <Page>
      <AuthDialogModal {...args} />
    </Page>
  ),
};
