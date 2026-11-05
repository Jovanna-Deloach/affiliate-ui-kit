import type { SiteChrome } from "@/kit/types";

/**
 * Two fictional publications, one per theme. Proving Ground is one
 * publication with two beats (supplements, running): same wordmark, surface
 * and type; only --accent-category changes between its sections.
 */

export const caliberSite: SiteChrome = {
  publication: { name: "Caliber", href: "#home", tagline: "Watches and the things worth keeping, reviewed slowly." },
  nav: [
    { label: "Watches", href: "#watches", category: "watches" },
    { label: "Leather goods", href: "#leather" },
    { label: "Jewellery", href: "#jewellery" },
    { label: "Buying guides", href: "#guides" },
    { label: "How we review", href: "#how-we-review" },
  ],
  footer: [
    { heading: "Reviews", links: [{ label: "Watches", href: "#watches" }, { label: "Leather goods", href: "#leather" }, { label: "Jewellery", href: "#jewellery" }] },
    { heading: "Caliber", links: [{ label: "How we review", href: "#how-we-review" }, { label: "Our reviewers", href: "#reviewers" }, { label: "Corrections", href: "#corrections" }] },
    { heading: "Legal", links: [{ label: "How we make money", href: "#disclosure" }, { label: "Privacy", href: "#privacy" }, { label: "Terms", href: "#terms" }] },
  ],
  disclosure: "We buy every watch we review. When you buy through our links we may earn a commission; it never decides what we recommend.",
  disclosureNotice: "Caliber is reader-supported. If you buy through links on this page, we may earn a commission.",
  disclosureHref: "#disclosure",
  copyright: "© 2026 Caliber",
};

export const provingGroundSite: SiteChrome = {
  publication: { name: "Proving Ground", href: "#home", tagline: "Supplements and running gear, measured before we recommend them." },
  nav: [
    { label: "Supplements", href: "#supplements", category: "supplements" },
    { label: "Running", href: "#running", category: "running" },
    { label: "Recovery", href: "#recovery" },
    { label: "Lab reports", href: "#lab" },
    { label: "How we test", href: "#how-we-test" },
  ],
  footer: [
    { heading: "Tested", links: [{ label: "Supplements", href: "#supplements" }, { label: "Running", href: "#running" }, { label: "Recovery", href: "#recovery" }] },
    { heading: "Proving Ground", links: [{ label: "How we test", href: "#how-we-test" }, { label: "Our lab", href: "#lab" }, { label: "Corrections", href: "#corrections" }] },
    { heading: "Legal", links: [{ label: "How we make money", href: "#disclosure" }, { label: "Privacy", href: "#privacy" }, { label: "Terms", href: "#terms" }] },
  ],
  disclosure: "We buy every product at retail and measure it before we recommend it. If you buy through our links we may earn a commission; it never changes a result.",
  disclosureNotice: "Proving Ground is reader-supported. When you buy through links on this page, we may earn a commission.",
  disclosureHref: "#disclosure",
  copyright: "© 2026 Proving Ground",
};
