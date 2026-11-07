"use client";

import { FlaskConical } from "lucide-react";
import { useState, type FormEvent } from "react";

import type { ProductSuggestion } from "@/kit/types";
import { Alert, Button, TextField } from "@/kit/ui";
import { cn } from "@/lib/cn";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface SuggestAProductProps {
  /** Sends the suggestion (a Server Action): the product as typed, a link, and an email address when the reader gives one. */
  onSubmit?: (suggestion: ProductSuggestion) => void | Promise<void>;
  /** What the page covers, singular and lowercase, for the heading: “creatine” makes “Don’t see your creatine?” (default “product”). */
  category?: string;
  /** Ask for an email address to say when it is tested (default true); leave it off for a signed-in reader. */
  askEmail?: boolean;
  /** The privacy page, linked under the button. */
  privacyHref?: string;
  /** The heading (default “Don’t see your {category}?”). */
  heading?: string;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * “Don’t see your product?”: a short form to suggest one for testing. The
 * product and its brand, where the reader buys it, and, optionally, an email
 * address to hear when it’s tested. It says how products are bought, checks
 * the fields with reasons, and thanks the reader in place when it’s sent.
 *
 * **Use it for** the end of a ranking or a category report. **Not for** a
 * review of a product (`WriteReview`), a price alert (`PriceAlert`), or a
 * report of a problem with a product (a contact form).
 *
 * @summary Don’t see your product? A short form to suggest it for testing.
 * @import import { SuggestAProduct } from "@/kit/blocks";
 */
export function SuggestAProduct({ onSubmit, category = "product", askEmail = true, privacyHref, heading, className }: SuggestAProductProps) {
  const [errors, setErrors] = useState<{ product?: string; url?: string; email?: string }>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<ProductSuggestion | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const product = String(data.get("product") ?? "").trim();
    const url = String(data.get("url") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const next: typeof errors = {};
    if (product.length < 3) next.product = "Name the product and its brand, as on the label.";
    if (url && !/^https?:\/\/\S+\.\S+/.test(url)) next.url = "Paste the whole link, starting with https://.";
    if (askEmail && email && !EMAIL.test(email)) next.email = "Check the email address: it needs an @ and a domain.";
    setErrors(next);
    if (Object.keys(next).length) return;
    const suggestion: ProductSuggestion = { product, url: url || undefined, email: askEmail && email ? email : undefined };
    setSending(true);
    await onSubmit?.(suggestion);
    setSending(false);
    setSent(suggestion);
  };

  return (
    <section aria-labelledby="suggest-heading" className={cn("kit-card grid gap-5 p-5 sm:p-6", className)}>
      <div className="grid gap-2">
        <h2 id="suggest-heading" className="m-0 flex items-start gap-3 t-title text-fg">
          <FlaskConical aria-hidden="true" size={22} strokeWidth={1.75} className="mt-1 shrink-0 text-fg-muted" />
          {heading ?? `Don’t see your ${category}?`}
        </h2>
        <p className="m-0 max-w-measure t-body text-fg-body">Suggest it for testing. We buy every product we test at retail, like any shopper, and the brand doesn’t pay or get a say.</p>
      </div>
      {sent ? (
        <Alert live tone="success" title="Thanks, it’s on our list">
          <p>
            We read every suggestion and test the ones readers ask for most.
            {sent.email ? ` We’ll email ${sent.email} if we test it.` : ""}
          </p>
        </Alert>
      ) : (
        <form noValidate onSubmit={submit} aria-label="Suggest a product for testing" className="grid gap-4">
          <TextField label="Product and brand" name="product" autoComplete="off" error={errors.product} className="max-w-md" />
          <TextField label="Where you buy it" name="url" type="url" inputMode="url" optional hint="A link to the product." error={errors.url} className="max-w-md" />
          {askEmail ? <TextField label="Email" name="email" type="email" autoComplete="email" optional hint="To hear if we test it." error={errors.email} className="max-w-md" /> : null}
          <div className="grid justify-items-start gap-2">
            <Button type="submit" disabled={sending}>
              {sending ? "Sending…" : "Suggest it"}
            </Button>
            {privacyHref ? (
              <a href={privacyHref} className="kit-focus kit-link rounded-ctl t-caption text-fg-muted">
                How we use your email
              </a>
            ) : null}
          </div>
        </form>
      )}
    </section>
  );
}
