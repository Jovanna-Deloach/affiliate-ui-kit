"use client";

import { BellRing } from "lucide-react";
import { useState, type FormEvent } from "react";

import { leadOffer } from "@/kit/lib/offers";
import type { KitProduct, PriceAlertRequest } from "@/kit/types";
import { Alert, Button, TextField } from "@/kit/ui";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";

export interface PriceAlertProps {
  /** The product to watch, with its offers: the form starts from its lowest price, or offers “back in stock” when every retailer is sold out. */
  product: KitProduct;
  /** Called with the alert once it passes the checks (a Server Action); may return a promise while it saves. */
  onSubmit?: (request: PriceAlertRequest) => void | Promise<void>;
  /** Ask for an email address: for readers without an account (default true). */
  askEmail?: boolean;
  /** Where the site says what it does with email addresses. */
  privacyHref?: string;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * “Tell me when it drops below $X” while it is in stock, or “tell me when
 * it’s back” while every retailer is sold out. Starts from today’s lowest
 * price (with a target 10% under it), asks for an email address when the
 * reader has no account, checks the target is under today’s price, and
 * promises one email, then the alert ends. A thank-you takes the form’s
 * place once it is set.
 *
 * **Use it for** a product’s page, beside or under the buy box, or in a
 * `Dialog` from a card. **Not for** a reader’s list of alerts
 * (`AlertsManager`), a newsletter, or saving the product (`SaveButton`).
 *
 * @summary Set an alert: a price to drop below, or back in stock; one email.
 * @import import { PriceAlert } from "@/kit/components";
 */
export function PriceAlert({ product, onSubmit, askEmail = true, privacyHref, className }: PriceAlertProps) {
  const offer = leadOffer(product.offers);
  const currency = offer?.currency ?? product.offers[0]?.currency ?? "USD";
  const suggested = offer ? Math.max(1, Math.floor(offer.price * 0.9)) : undefined;
  const kind: PriceAlertRequest["kind"] = offer ? "below" : "in-stock";
  const [errors, setErrors] = useState<{ price?: string; email?: string }>({});
  const [sent, setSent] = useState<PriceAlertRequest>();
  const [sending, setSending] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const price = Number(String(form.get("price") ?? "").replace(/[^0-9.]/g, ""));
    const email = String(form.get("email") ?? "").trim();
    const found: typeof errors = {};
    if (kind === "below" && offer && !(price > 0 && price < offer.price)) found.price = `Pick a price under today’s ${formatPrice(offer.price, currency)}.`;
    if (askEmail && !/^\S+@\S+\.\S+$/.test(email)) found.email = "Enter an email address like name@example.com.";
    setErrors(found);
    if (Object.keys(found).length) {
      event.currentTarget.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }
    const request: PriceAlertRequest = { productId: product.id, kind, price: kind === "below" ? price : undefined, email: askEmail ? email : undefined };
    setSending(true);
    await onSubmit?.(request);
    setSending(false);
    setSent(request);
  };

  if (sent)
    return (
      <Alert live tone="success" title="Alert set" className={className}>
        <p>
          {sent.kind === "below" && sent.price ? `We’ll email you once when it drops below ${formatPrice(sent.price, currency)}` : "We’ll email you once when it’s back in stock"}
          {sent.email ? ` at ${sent.email}` : ""}. Then the alert ends.
        </p>
      </Alert>
    );

  return (
    <form noValidate onSubmit={submit} aria-label={`Price alert for ${product.brand} ${product.name}`} className={cn("grid gap-4", className)}>
      <p className="m-0 flex items-start gap-2 t-ui text-fg">
        <BellRing aria-hidden="true" size={18} strokeWidth={1.75} className="mt-0.5 shrink-0 text-fg-muted" />
        <span>
          {offer ? (
            <>
              Lowest price today: <strong data-numeric className="font-semibold">{formatPrice(offer.price, currency)}</strong> at {offer.merchantName}.
            </>
          ) : (
            "Sold out at every retailer we check."
          )}
        </span>
      </p>
      {offer ? (
        <TextField
          label="Tell me when it drops below"
          name="price"
          inputMode="decimal"
          defaultValue={suggested !== undefined ? String(suggested) : undefined}
          hint={`In dollars, under ${formatPrice(offer.price, currency)}.`}
          error={errors.price}
          className="max-w-xs"
        />
      ) : null}
      {askEmail ? <TextField label="Email" name="email" type="email" autoComplete="email" error={errors.email} /> : null}
      <div className="grid justify-items-start gap-2">
        <Button type="submit" disabled={sending}>
          {sending ? "Setting the alert…" : offer ? "Set price alert" : "Tell me when it’s back"}
        </Button>
        <p className="m-0 t-caption text-fg-muted">
          One email when it happens, then the alert ends.
          {privacyHref ? (
            <>
              {" "}
              <a href={privacyHref} className="kit-focus kit-link rounded-ctl">
                How we use your email
              </a>
            </>
          ) : null}
        </p>
      </div>
    </form>
  );
}
