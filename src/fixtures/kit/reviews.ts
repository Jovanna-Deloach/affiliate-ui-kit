import type { AiSummary, RatingSummary, Review, ReviewTopic, TrustSignals } from "@/kit/types";

/**
 * Reader reviews of Peak Supply Creatine Monohydrate (the lead pick in
 * `creatineGuide`), for the review parts’ stories. Reviewers and their words
 * are invented; the kit never ships them to a real page.
 */

/** The “now” the review stories render at, so relative dates stay put. */
export const REVIEWS_NOW = "2026-11-06T15:00:00Z";

export const peakTopics: ReviewTopic[] = [
  { id: "mixing", label: "Mixes well", mentions: 214 },
  { id: "taste", label: "No taste", mentions: 160 },
  { id: "price", label: "Price", mentions: 97 },
  { id: "bloating", label: "Bloating", mentions: 41 },
  { id: "scoop", label: "Scoop size", mentions: 38 },
];

export const peakReviews: Review[] = [
  {
    id: "r-1001",
    rating: 5,
    title: "Dissolves in cold water if you stir for ten seconds",
    body: "I take 5 g in a glass of cold water before work. It clouds for a moment, then clears if I keep stirring, with no grit at the bottom. No taste at all, which is what I wanted from plain monohydrate.",
    author: { name: "Dana Whitfield", country: "US", reviewCount: 4 },
    postedAt: "2026-11-06T12:10:00Z",
    experiencedAt: "2026-10-01",
    labels: ["verified", "unprompted"],
    useful: 12,
    topics: ["mixing", "taste"],
  },
  {
    id: "r-1002",
    rating: 2,
    title: "The scoop holds 3.5 g, not the 5 g on the label",
    body: "I weighed it on a kitchen scale ten times: 3.4 to 3.6 g every time. The product itself seems fine, but anyone who trusts the scoop is taking a third less than they think. A bigger scoop would fix it.",
    author: { name: "Marcus Lee", country: "US", reviewCount: 11 },
    postedAt: "2026-11-04T09:30:00Z",
    experiencedAt: "2026-10-20",
    labels: ["verified", "invited"],
    useful: 48,
    topics: ["scoop"],
    reply: {
      author: "Peak Supply",
      body: "You’re right, and thank you for weighing it. The scoop is 3.5 g level; we print “1 rounded scoop” on new tubs from batch 2301 and are changing the scoop in January.",
      postedAt: "2026-11-05T14:00:00Z",
    },
  },
  {
    id: "r-1003",
    rating: 5,
    title: "Third tub, same batch number on the lab report",
    body: "I bought this because the lab report linked here matched the batch on my tub. Strength is up on my main lifts since August, though that is also three months of training, so take it with a pinch of salt.",
    author: { name: "Priya Nair", country: "CA", reviewCount: 2 },
    postedAt: "2026-10-28T18:45:00Z",
    experiencedAt: "2026-08-15",
    labels: ["verified"],
    useful: 21,
  },
  {
    id: "r-1004",
    rating: 4,
    title: "Good value, slightly gritty in a shaker",
    body: "In a shaker with milk it leaves a little grit at the bottom. In water stirred with a spoon it is fine. At about 21 cents a serving it is the cheapest tested creatine I could find.",
    author: { name: "Tom Okafor", country: "GB", reviewCount: 7 },
    postedAt: "2026-10-16T08:00:00Z",
    labels: ["invited"],
    useful: 9,
    topics: ["mixing", "price"],
  },
  {
    id: "r-1005",
    rating: 1,
    title: "Bloated for the first week",
    body: "I followed the loading phase on the tub, 20 g a day, and felt bloated the whole week. I dropped to 5 g a day and it settled. I would skip the loading phase; I gave one star because the tub still recommends it.",
    author: { name: "Lena Brandt", country: "DE", reviewCount: 1 },
    postedAt: "2026-10-02T21:15:00Z",
    experiencedAt: "2026-09-10",
    labels: ["unprompted"],
    useful: 33,
    topics: ["bloating"],
    reply: {
      author: "Peak Supply",
      body: "Sorry it started that way. Loading is optional; 3 to 5 g a day reaches the same levels in about four weeks. We’re taking the loading phase off the label.",
      postedAt: "2026-10-04T10:00:00Z",
    },
  },
  {
    id: "r-1006",
    rating: 5,
    title: "Plain, cheap and it does what the label says",
    body: "Nothing to say beyond that, which is the point of creatine. No flavors, no blends, a short label. I have used it for a year.",
    author: { name: "Rafael Gómez", country: "US", reviewCount: 3 },
    postedAt: "2026-09-12T13:00:00Z",
    labels: ["verified"],
    useful: 6,
    topics: ["taste", "price"],
  },
  {
    id: "r-1007",
    rating: 3,
    title: "Fine, but the tub lid cracked in shipping",
    body: "The powder is fine and I would buy it again, but my lid arrived cracked and the seal was the only thing keeping it closed. Customer service sent a new lid within a week.",
    author: { name: "Grace Kim", country: "US", reviewCount: 5 },
    postedAt: "2026-08-30T16:20:00Z",
    labels: ["verified", "invited"],
    useful: 4,
  },
  {
    id: "r-1008",
    rating: 4,
    title: "Got a free tub to review it, still buying it",
    body: "Peak Supply sent me a tub to review. It mixes cleanly and has no taste. I have since bought two more with my own money, which says more than any review.",
    author: { name: "Owen Price", country: "US", reviewCount: 19 },
    postedAt: "2026-07-21T10:00:00Z",
    labels: ["incentivized"],
    useful: 2,
    topics: ["mixing"],
  },
  {
    id: "r-1009",
    rating: 5,
    title: "Unflavored means unflavored",
    body: "I add it to coffee every morning and cannot taste it. That is all I needed.",
    author: { name: "Hana Sato", country: "JP", reviewCount: 1 },
    postedAt: "2026-05-03T07:45:00Z",
    labels: ["unprompted"],
    useful: 5,
    topics: ["taste"],
  },
  {
    id: "r-1010",
    rating: 4,
    title: "Price went up, still the best per serving",
    body: "It was $19 in the spring and $21 now. Still cheaper per serving than the micronized brands, and the lab results are better than some of them.",
    author: { name: "Ben Adler", country: "US", reviewCount: 8 },
    postedAt: "2025-10-30T12:00:00Z",
    labels: ["verified"],
    useful: 14,
    topics: ["price"],
  },
];

/** The product’s full numbers, for a summary on its own: far more reviews than the stories carry. */
export const peakSummary: RatingSummary = { average: 4.4, count: 1284, recentCount: 512, distribution: [52, 31, 96, 290, 815] };

/** A summary of the ten reviews above, so its numbers agree with a section that shows them. */
export const peakAiSummary: AiSummary = {
  body: "Most reviewers say it dissolves in cold water with a stir and has no taste, and several call it the cheapest per serving they found. The complaints are the scoop, which one reviewer weighed at 3.5 g rather than 5 g, and bloating during the loading phase on the label. The brand has replied to both: it is changing the scoop and dropping the loading phase.",
  basedOn: 10,
  since: "2025-10-30",
  sources: ["r-1001", "r-1002", "r-1005"],
};

export const peakTrust: TrustSignals = { asksForReviews: "sometimes", replyRate: 0.92, replyTime: "48 hours", claimedSince: "2022-02-14" };

/** The same product reviewed by the site’s own testers only, for a tester-reviews page. */
export const testerReviews: Review[] = [
  {
    id: "t-01",
    rating: 5,
    title: "99.6% of the creatine on the label, batch 2214",
    body: "Our lab measured 4.98 g of creatine monohydrate per 5 g serving, with lead, cadmium, arsenic and mercury all below the limits we test to. It dissolved fully at 20 °C in both runs.",
    author: { name: "Dr. Priya Raman", role: "Lab director", avatar: { src: "/fixtures/portrait-raman.jpg", alt: "Dr. Priya Raman" } },
    postedAt: "2026-10-29T09:00:00Z",
    labels: ["tester"],
  },
  {
    id: "t-02",
    rating: 4,
    title: "Eight weeks of daily use: clean, but weigh your scoop",
    body: "I took 5 g a day for eight weeks. No stomach trouble at that dose, no taste in water or coffee. The scoop holds 3.5 g level, so I weighed every serving.",
    author: { name: "Jonah Whitfield", role: "Contributing tester" },
    postedAt: "2026-10-30T09:00:00Z",
    labels: ["tester"],
  },
];
