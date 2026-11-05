import type { ReactNode } from "react";

import { cn } from "@/lib/cn";
import { AffiliateAction } from "@/primitives/affiliate-action";
import type { AffiliateAttribution, MerchantOffer } from "@/types/affiliate";

import { buttonStyles } from "./button";

/**
 * Every monetized link in the kit. Built on AffiliateAction, so rel,
 * attribution and click tracking are enforced; the kit only owns the look.
 */
interface BuyProps {
  offer: MerchantOffer;
  productId: string;
  placement: string;
  attribution?: AffiliateAttribution;
  children?: ReactNode;
  className?: string;
}

export function BuyButton({ offer, productId, placement, attribution, children, className, size = "lg" }: BuyProps & { size?: "md" | "lg" }) {
  return (
    <AffiliateAction
      unstyled
      arrow={false}
      href={offer.affiliateUrl}
      attribution={attribution}
      tracking={{ merchant: offer.merchantName, offerId: offer.id, productId, placement }}
      className={cn(buttonStyles({ emphasis: "primary", size, fullWidth: true }), className)}
    >
      {children ?? `Buy at ${offer.merchantName}`}
    </AffiliateAction>
  );
}

export function BuyLink({ offer, productId, placement, attribution, children, className }: BuyProps) {
  return (
    <AffiliateAction
      unstyled
      arrow={false}
      href={offer.affiliateUrl}
      attribution={attribution}
      tracking={{ merchant: offer.merchantName, offerId: offer.id, productId, placement }}
      className={cn("kit-focus kit-link t-ui text-accent", className)}
    >
      {children ?? "View"}
    </AffiliateAction>
  );
}
