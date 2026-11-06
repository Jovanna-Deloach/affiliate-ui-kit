"use client";

import { useId, useState, type FormEvent } from "react";

import { Alert, Button, Checkbox, ChoiceGroup, describedBy, Field, inputStyles, Radio, RatingInput, TextArea, TextField } from "@/kit/ui";
import { cn } from "@/lib/cn";

/** What a reader sends: the review, how they got the product, and the proof they chose to add. */
export interface WrittenReview {
  rating: number;
  title: string;
  body: string;
  /** When they used it (ISO date), if they said. */
  experiencedAt?: string;
  /** `bought` it themselves · `free` sent by the brand · `paid` paid to review it: the last two are labeled Incentivized. */
  source: "bought" | "free" | "paid";
  /** For a reader without an account: where to confirm the review. */
  email?: string;
  /** A receipt or order email: earns the Verified label once checked. */
  receipt?: File;
}

export interface WriteReviewProps {
  /** The product reviewed, for the form's name (“Review of Peak Supply Creatine Monohydrate”); show it in the `Dialog`'s description or the page's heading. */
  product: string;
  /** Called with the review once it passes the checks; may return a promise while it sends. */
  onSubmit?: (review: WrittenReview) => void | Promise<void>;
  /** Ask for an email address to confirm the review: for readers without an account (default true). */
  askEmail?: boolean;
  /** The site's review guidelines, linked above the button. */
  guidelinesHref: string;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

const MIN_BODY = 50;

/**
 * The review form: stars, a title, the review (with a count against its
 * limit), when they used the product, how they got it (a free or paid
 * product is labeled Incentivized), an optional receipt for the Verified
 * label, an email address when the reader has no account, and a promise that
 * it is their own experience. Errors appear on their fields when sent; once
 * sent, a thank-you takes the form's place.
 *
 * **Use it for** a reader writing a review, on its own page or in a
 * `Dialog`. **Not for** tester reviews (they are written by the site), or a
 * question about the product.
 *
 * @summary The review form: stars, title, text, date, source, receipt, email.
 * @import import { WriteReview } from "@/kit/blocks";
 */
export function WriteReview({ product, onSubmit, askEmail = true, guidelinesHref, className }: WriteReviewProps) {
  const id = useId();
  const [errors, setErrors] = useState<Partial<Record<"rating" | "title" | "body" | "promise" | "email", string>>>({});
  const [state, setState] = useState<"editing" | "sending" | "sent">("editing");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const text = (name: string) => String(form.get(name) ?? "").trim();
    const found: typeof errors = {};
    if (!form.get("rating")) found.rating = "Pick a rating from 1 to 5 stars.";
    if (!text("title")) found.title = "Give your review a title.";
    if (text("body").length < MIN_BODY) found.body = `Tell readers a little more: at least ${MIN_BODY} characters.`;
    if (askEmail && !/^\S+@\S+\.\S+$/.test(text("email"))) found.email = "Enter an email address like name@example.com.";
    if (!form.get("promise")) found.promise = "Confirm the review is your own experience.";
    setErrors(found);
    if (Object.keys(found).length) {
      const first = event.currentTarget.querySelector<HTMLElement>("[aria-invalid='true'], input[name='rating']");
      first?.focus();
      return;
    }
    const receipt = form.get("receipt");
    setState("sending");
    await onSubmit?.({
      rating: Number(form.get("rating")),
      title: text("title"),
      body: text("body"),
      experiencedAt: text("experienced") || undefined,
      source: (text("source") || "bought") as WrittenReview["source"],
      email: askEmail ? text("email") : undefined,
      receipt: receipt instanceof File && receipt.size > 0 ? receipt : undefined,
    });
    setState("sent");
  };

  if (state === "sent")
    return (
      <Alert live tone="success" title="Thanks, your review is in" className={className}>
        <p>We publish reviews within two days, after a check for spam{askEmail ? " and a click on the link we just emailed you" : ""}.</p>
      </Alert>
    );

  return (
    <form noValidate onSubmit={submit} aria-label={`Review of ${product}`} className={cn("grid gap-6", className)}>
      <RatingInput error={errors.rating} />
      <TextField label="Title" name="title" maxLength={100} placeholder="Mixes clear in cold water" error={errors.title} />
      <TextArea label="Your review" name="body" hint="What you used it for, for how long, and what changed." maxLength={2000} showCount error={errors.body} />
      <Field id={`${id}-experienced`} label="Date of experience" hint="When you used it, not when you bought it." optional>
        <input id={`${id}-experienced`} name="experienced" type="date" aria-describedby={describedBy(`${id}-experienced`, true)} className={cn(inputStyles, "h-11 px-3")} />
      </Field>
      <ChoiceGroup legend="How did you get it?">
        <Radio name="source" value="bought" label="I bought it" defaultChecked />
        <Radio name="source" value="free" label="The brand sent it free" hint="Your review is labeled Incentivized." />
        <Radio name="source" value="paid" label="I was paid to review it" hint="Your review is labeled Incentivized." />
      </ChoiceGroup>
      <Field id={`${id}-receipt`} label="Proof of purchase" hint="A receipt or order email earns the Verified label. We delete it once checked." optional>
        <input
          id={`${id}-receipt`}
          name="receipt"
          type="file"
          accept="image/*,application/pdf"
          aria-describedby={describedBy(`${id}-receipt`, true)}
          className="kit-focus w-full rounded-ctl t-small text-fg-muted file:mr-3 file:cursor-pointer file:rounded-ctl file:border file:border-line-strong file:bg-paper file:px-3 file:py-2.5 file:t-small file:text-fg"
        />
      </Field>
      {askEmail ? <TextField label="Email" name="email" type="email" autoComplete="email" hint="To confirm your review. Never shown or shared." error={errors.email} /> : null}
      <div className="grid gap-1">
        <Checkbox name="promise" label="This review is my own experience of the product." aria-invalid={errors.promise ? true : undefined} />
        {errors.promise ? <p className="m-0 t-small text-fail">{errors.promise}</p> : null}
      </div>
      <div className="grid justify-items-start gap-3 border-t border-line pt-6">
        <p className="m-0 t-small text-fg-muted">
          Reviews follow our{" "}
          <a href={guidelinesHref} className="kit-focus kit-link rounded-ctl text-fg">
            guidelines
          </a>
          : no personal details, and nothing written for or against a brand in exchange for something.
        </p>
        <Button emphasis="primary" type="submit" disabled={state === "sending"}>
          {state === "sending" ? "Sending…" : "Submit review"}
        </Button>
      </div>
    </form>
  );
}
