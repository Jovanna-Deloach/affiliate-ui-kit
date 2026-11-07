import { typesetDeep } from "@/kit/lib/typeset";
import type { CategoryResults, Dosage, ExpertReview, FaqItem, LabReport, Outcome, Person, Reference, Study } from "@/kit/types";

/**
 * Research and lab reports for creatine: what the research says about each
 * outcome, the studies and their sources, three lab reports (a pass, a
 * failed contaminant, a multivitamin off its label), the dose, the questions
 * readers ask, and how all eighteen creatine products tested. Every author,
 * journal, brand, batch and result is fictional; DOIs use the 10.5555 test
 * prefix, so none of them resolves to a real paper.
 */

/** The expert who checks the creatine pages. */
export const brandt: Person = { name: "Dr. Lena Brandt", role: "Reviewer", href: "#lena", beats: ["supplements"] };

export const creatineReview: ExpertReview = typesetDeep<ExpertReview>({
  person: brandt,
  credentials: "PhD, exercise physiology; registered dietitian",
  reviewedAt: "2026-10-29T00:00:00Z",
});

/** What the research says about creatine, outcome by outcome. */
export const creatineOutcomes: Outcome[] = typesetDeep<Outcome[]>([
  { id: "strength", name: "Muscle strength", effect: "increase", size: "moderate", consistency: "high", studies: 72, grade: "A", summary: "About 8% more strength gained over 8 to 12 weeks of training.", href: "#outcome-strength" },
  { id: "lean-mass", name: "Lean mass", effect: "increase", size: "moderate", consistency: "high", studies: 58, grade: "A", summary: "About 1 to 2 kg more muscle over a training program." },
  { id: "power", name: "Power output", effect: "increase", size: "small", consistency: "moderate", studies: 31, grade: "B", summary: "Slightly more power in repeated short efforts, like sprints." },
  { id: "memory", name: "Memory", effect: "increase", size: "small", consistency: "low", studies: 9, grade: "C", summary: "A small benefit on some tests, mostly in older adults and vegetarians." },
  { id: "depression", name: "Depression symptoms", effect: "decrease", size: "small", consistency: "low", studies: 5, grade: "C", summary: "Faster relief alongside an antidepressant, in small trials." },
  { id: "endurance", name: "Endurance performance", effect: "none", consistency: "moderate", studies: 14, grade: "D", summary: "No change in long efforts, like a 10 km run." },
  { id: "body-fat", name: "Body fat", effect: "none", consistency: "high", studies: 15, grade: "D", summary: "No change beyond what training does on its own." },
  { id: "kidney", name: "Kidney function", effect: "none", consistency: "high", studies: 22, grade: "D", summary: "No change in healthy people, though creatinine, a marker labs read, rises." },
]);

/** The sources behind the creatine pages, in the order they are cited. */
export const creatineReferences: Reference[] = typesetDeep<Reference[]>([
  { id: "okafor-2024", authors: ["Okafor AN", "Lindqvist M", "Haddad R", "Petrov IS"], title: "Creatine supplementation and strength gains with resistance training: a meta-analysis of 72 trials", source: "Journal of Strength and Sport Nutrition", year: 2024, details: "18(3):201-219", doi: "10.5555/jssn.2024.0183" },
  { id: "brennan-2023", authors: ["Brennan KT", "Osei F", "Valdés C"], title: "Creatine and lean mass in adults over 60: a randomized controlled trial", source: "Clinical Nutrition and Aging", year: 2023, details: "11(2):88-97", doi: "10.5555/cna.2023.0112" },
  { id: "sato-2025", authors: ["Sato H", "Mbeki L"], title: "Creatine and repeated sprint performance in trained cyclists", source: "International Review of Exercise Science", year: 2025, details: "9(1):14-25", doi: "10.5555/ires.2025.0014" },
  { id: "lindgren-2022", authors: ["Lindgren E", "Ruiz MA", "Achebe O", "Novak P", "Chen Y"], title: "Creatine and memory in older adults: a randomized, placebo-controlled trial", source: "Journal of Cognitive Aging", year: 2022, details: "7(4):301-312", doi: "10.5555/jca.2022.0301" },
  { id: "haddad-2021", authors: ["Haddad R", "Fischer J"], title: "Kidney function in healthy adults taking creatine for 12 months", source: "Renal Physiology Reports", year: 2021, details: "33(5):410-418", doi: "10.5555/rpr.2021.0410" },
  { id: "moreau-2024", authors: ["Moreau C", "Ibsen T", "Adeyemi K"], title: "Creatine as an add-on to antidepressants: a pilot trial", source: "Mood and Metabolism", year: 2024, details: "5(2):55-63", doi: "10.5555/mm.2024.0055" },
  { id: "keller-2020", authors: ["Keller D", "Watanabe S"], title: "Creatine and endurance running: a randomized crossover trial", source: "Endurance Science Quarterly", year: 2020, details: "14(1):1-9", doi: "10.5555/esq.2020.0001" },
  { id: "ng-2023", authors: ["Ng V", "Castillo R", "Barros L"], title: "Creatine and body fat: a pooled analysis of 15 trials", source: "Obesity and Supplement Research", year: 2023, details: "4(3):120-131", doi: "10.5555/osr.2023.0120" },
  { id: "amari-2025", authors: ["Amari S", "Holt J", "Quist B"], title: "Creatine and strength in resistance-trained women: a randomized trial", source: "Journal of Strength and Sport Nutrition", year: 2025, details: "19(2):88-97", doi: "10.5555/jssn.2025.0088" },
  { id: "devries-2023", authors: ["de Vries L", "Okonkwo E"], title: "Creatine and memory in vegetarians: a randomized trial", source: "Nutrition and Brain Health", year: 2023, details: "6(1):30-39", doi: "10.5555/nbh.2023.0030" },
  { id: "kowalski-2019", authors: ["Kowalski A", "Duarte P"], title: "Creatine monohydrate and creatine hydrochloride: absorption and uptake into muscle", source: "Journal of Supplement Pharmacology", year: 2019, details: "2(2):77-86", doi: "10.5555/jsp.2019.0077" },
  { id: "meridian-2214", authors: ["Meridian Analytical"], title: "Certificate of analysis: Peak Supply Creatine Monohydrate, batch 2214", source: "Meridian Analytical", year: 2026, url: "#coa-2214", accessedAt: "2026-10-20T00:00:00Z" },
]);

const ref = (id: string) => creatineReferences.find((r) => r.id === id)!;

/** Studies of creatine, summed up, newest first. */
export const creatineStudies: Study[] = typesetDeep<Study[]>([
  { id: "s-amari", title: "Creatine and strength in women who lift", design: "randomized-trial", population: "Women aged 20 to 40 who train with weights", participants: 46, duration: "10 weeks", result: "Squat and bench press rose about 6% more with creatine than with placebo.", effect: "increase", outcome: "strength", publishedAt: "2025-09-03", reference: ref("amari-2025") },
  { id: "s-sato", title: "Creatine and repeated sprints in trained cyclists", design: "randomized-trial", population: "Trained men and women who race bikes", participants: 36, duration: "6 weeks", result: "Power in the last of six sprints fell less with creatine: about 4% more than with placebo.", effect: "increase", outcome: "power", publishedAt: "2025-02-20", funding: "Funded by a sports nutrition company", reference: ref("sato-2025") },
  { id: "s-okafor", title: "Creatine and strength gains with training", design: "meta-analysis", population: "Adults in resistance training programs, 72 trials", participants: 2816, result: "Adding creatine to training raised strength gains by about 8% over training alone, in men and in women.", effect: "increase", outcome: "strength", publishedAt: "2024-09-12", reference: ref("okafor-2024") },
  { id: "s-moreau", title: "Creatine alongside antidepressants", design: "randomized-trial", population: "Women with major depression taking an SSRI", participants: 52, duration: "8 weeks", result: "Symptoms eased sooner with creatine than with placebo: a small effect, in a small trial.", effect: "decrease", outcome: "depression", publishedAt: "2024-03-15", reference: ref("moreau-2024") },
  { id: "s-ng", title: "Creatine and body fat", design: "meta-analysis", population: "Adults in training programs, 15 trials", participants: 1012, result: "No change in body fat beyond what training did on its own.", effect: "none", outcome: "body-fat", publishedAt: "2023-11-20", reference: ref("ng-2023") },
  { id: "s-brennan", title: "Creatine and lean mass in adults over 60", design: "randomized-trial", population: "Adults aged 60 to 78, new to strength training", participants: 112, duration: "24 weeks", result: "People taking 5 g a day gained 1.4 kg more lean mass than people taking a placebo.", effect: "increase", outcome: "lean-mass", publishedAt: "2023-05-02", reference: ref("brennan-2023") },
  { id: "s-devries", title: "Creatine and memory in vegetarians", design: "randomized-trial", population: "Vegetarian adults aged 18 to 40", participants: 58, duration: "6 weeks", result: "Memory scores rose a little with creatine; reaction time did not change.", effect: "increase", outcome: "memory", publishedAt: "2023-02-14", reference: ref("devries-2023") },
  { id: "s-lindgren", title: "Creatine and memory in older adults", design: "randomized-trial", population: "Adults aged 65 to 80 with no memory complaints", participants: 64, duration: "12 weeks", result: "Recall improved slightly on one of three memory tests; the other two showed no difference.", effect: "mixed", outcome: "memory", publishedAt: "2022-10-11", reference: ref("lindgren-2022") },
  { id: "s-haddad", title: "Kidney function over a year of creatine", design: "observational", population: "Healthy adults taking 5 g a day", participants: 240, duration: "12 months", result: "Creatinine rose, as expected; two direct measures of kidney function did not change.", effect: "none", outcome: "kidney", publishedAt: "2021-06-30", reference: ref("haddad-2021") },
  { id: "s-keller", title: "Creatine and 10 km running times", design: "randomized-trial", population: "Recreational runners", participants: 28, duration: "8 weeks", result: "No difference in 10 km time between creatine and placebo.", effect: "none", outcome: "endurance", publishedAt: "2020-08-01", reference: ref("keller-2020") },
]);

/** Peak Supply Creatine Monohydrate, batch 2214: a clean pass. */
export const peakLabReport: LabReport = typesetDeep<LabReport>({
  finding: "Contains what the label says, and nothing it shouldn’t.",
  tests: 16,
  batch: "2214",
  testedAt: "2026-10-14T00:00:00Z",
  lab: "Meridian Analytical, ISO 17025",
  serving: "1 scoop (5 g)",
  perServing: { amount: 0.21, currency: "USD" },
  tolerance: 5,
  ingredients: [{ name: "Creatine monohydrate", claimed: 5000, found: 5020, unit: "mg" }],
  contaminants: [
    { name: "Lead", found: 0.21, limit: 0.5, unit: "mcg", standard: "Prop 65" },
    { name: "Arsenic", found: null, limit: 15, unit: "mcg", standard: "USP" },
    { name: "Cadmium", found: 0.05, limit: 4.1, unit: "mcg", standard: "Prop 65" },
    { name: "Mercury", found: null, limit: 15, unit: "mcg", standard: "USP" },
    { name: "Dicyandiamide", found: 0.04, limit: 0.25, unit: "mg", standard: "Ph. Eur." },
  ],
  watchlist: [],
});

/** Apex Stack Creatine Monohydrate, batch 7731: lead over its limit in both runs. */
export const apexLabReport: LabReport = typesetDeep<LabReport>({
  finding: "Lead at 140% of its limit, in both runs. We don’t recommend it.",
  tests: 16,
  batch: "7731",
  testedAt: "2026-10-12T00:00:00Z",
  lab: "Meridian Analytical, ISO 17025",
  serving: "1 scoop (5 g)",
  perServing: { amount: 0.18, currency: "USD" },
  tolerance: 5,
  ingredients: [{ name: "Creatine monohydrate", claimed: 5000, found: 4710, unit: "mg" }],
  contaminants: [
    { name: "Lead", found: 0.7, limit: 0.5, unit: "mcg", standard: "Prop 65" },
    { name: "Arsenic", found: 1.2, limit: 15, unit: "mcg", standard: "USP" },
    { name: "Cadmium", found: 0.3, limit: 4.1, unit: "mcg", standard: "Prop 65" },
    { name: "Mercury", found: null, limit: 15, unit: "mcg", standard: "USP" },
  ],
  watchlist: [],
});

/** A women’s multivitamin: two nutrients off the label, two dyes on the watchlist. */
export const multiLabReport: LabReport = typesetDeep<LabReport>({
  finding: "Two of twelve nutrients missed the label by more than 10%, and the coating uses two additives on our watchlist.",
  tests: 24,
  batch: "N-4471",
  testedAt: "2026-09-30T00:00:00Z",
  lab: "Meridian Analytical, ISO 17025",
  serving: "1 tablet",
  perServing: { amount: 0.12, currency: "USD" },
  ingredients: [
    { name: "Vitamin A (as beta-carotene)", claimed: 900, found: 742, unit: "mcg" },
    { name: "Vitamin C", claimed: 90, found: 96, unit: "mg" },
    { name: "Vitamin D3", claimed: 25, found: 27.1, unit: "mcg" },
    { name: "Vitamin E", claimed: 15, found: 14.2, unit: "mg" },
    { name: "Vitamin B6", claimed: 1.7, found: 1.8, unit: "mg" },
    { name: "Folate (as methylfolate)", claimed: 680, found: 902, unit: "mcg" },
    { name: "Vitamin B12", claimed: 6, found: 6.4, unit: "mcg" },
    { name: "Calcium", claimed: 200, found: 191, unit: "mg" },
    { name: "Iron", claimed: 18, found: 18.6, unit: "mg" },
    { name: "Magnesium", claimed: 100, found: 97, unit: "mg" },
    { name: "Zinc", claimed: 11, found: 10.8, unit: "mg" },
    { name: "Iodine", claimed: 150, found: 139, unit: "mcg" },
  ],
  contaminants: [
    { name: "Lead", found: 0.31, limit: 0.5, unit: "mcg", standard: "Prop 65" },
    { name: "Arsenic", found: 0.9, limit: 15, unit: "mcg", standard: "USP" },
    { name: "Cadmium", found: null, limit: 4.1, unit: "mcg", standard: "Prop 65" },
    { name: "Mercury", found: null, limit: 15, unit: "mcg", standard: "USP" },
  ],
  watchlist: [
    { name: "Red 40", reason: "A synthetic dye that adds color and nothing else. In the European Union, foods made with it must warn that it may affect activity and attention in children.", href: "#watchlist-red-40" },
    { name: "Titanium dioxide", reason: "A whitener the European Union stopped allowing in food in 2022, because its safety could no longer be confirmed.", href: "#watchlist-titanium-dioxide" },
  ],
});

/** How to take creatine. */
export const creatineDosage: Dosage = typesetDeep<Dosage>({
  dose: "3 to 5 g a day, every day.",
  timing: "Any time of day; timing makes little difference. Take it with a meal if it upsets your stomach.",
  form: "Creatine monohydrate: the form nearly every study used, and the cheapest.",
  loading: "Optional. 20 g a day for 5 to 7 days, in four doses, fills your muscles in a week instead of a month.",
  byWeight: [{ label: "Loading phase, 5 to 7 days", perKg: 0.3, unit: "g" }],
});

/** Creatine’s other names, and what it isn’t. */
export const creatineNames = {
  names: ["Creatine monohydrate", "Methylguanidinoacetic acid", "N-amidinosarcosine"],
  notConfusedWith: [
    { name: "Creatinine", note: "the waste product kidney tests measure", href: "#creatinine" },
    { name: "Creatine kinase", note: "an enzyme in muscle", href: "#creatine-kinase" },
  ],
};

/** What readers ask about creatine. */
export const creatineFaq: FaqItem[] = typesetDeep<FaqItem[]>([
  {
    question: "Is it safe to take creatine every day?",
    answer: ["For healthy adults, the research says yes: trials lasting months to years have found no harm at 3 to 5 g a day.", "If you have kidney disease, ask your doctor first. Creatine raises creatinine, the marker kidney tests read, which can confuse the result."],
  },
  { question: "Do I need a loading phase?", answer: ["No. Loading fills your muscles in about a week; 3 to 5 g a day gets there in three to four weeks. After a month, the two end up the same."] },
  {
    question: "Does creatine cause hair loss?",
    answer: ["No study has found hair loss. One small trial found a rise in DHT, a hormone linked to hair loss, and later trials didn’t repeat that result."],
  },
  { question: "Will creatine make me gain weight?", answer: ["Usually 1 to 2 kg in the first weeks, mostly water drawn into muscle. It isn’t fat, and it levels off."] },
  { question: "Is creatine HCl better than monohydrate?", answer: ["There’s no good evidence it is. Monohydrate is the form the research used, and it costs less per serving."] },
]);

/** How all eighteen creatine products tested, within 5% of the claim. */
export const creatineResults: CategoryResults = {
  name: "creatine",
  testedAt: "2026-10-14T00:00:00Z",
  tolerance: 5,
  products: [
    { brand: "Peak Supply", name: "Creatine Monohydrate", href: "#peak-supply", accuracy: 100.4, purity: true },
    { brand: "Ironhouse", name: "Creapure Micronized", href: "#ironhouse", accuracy: 99.1, purity: true },
    { brand: "Northlane Basics", name: "Creatine Monohydrate 1 kg", href: "#northlane", accuracy: 98.2, purity: true },
    { brand: "Fieldwork", name: "Creatine Capsules", href: "#fieldwork", accuracy: 96.5, purity: true },
    { brand: "Basecamp", name: "Creatine Monohydrate", accuracy: 99.8, purity: false },
    { brand: "Orbit", name: "Micronized Creatine", accuracy: 100.9, purity: false },
    { brand: "Granite", name: "Creatine Powder", accuracy: 95.3, purity: false },
    { brand: "Apex Stack", name: "Creatine Monohydrate", accuracy: 94.2, purity: false },
    { brand: "Verra", name: "Creatine Monohydrate", accuracy: 107.2, purity: true },
    { brand: "Kinetic", name: "Creatine Powder", accuracy: 105.9, purity: true },
    { brand: "Cobalt Wellness", name: "Creatine", accuracy: 106.3, purity: true },
    { brand: "Lumen", name: "Creatine Monohydrate", accuracy: 108.4, purity: true },
    { brand: "Summit Labs", name: "Creatine HCl", accuracy: 112, purity: true },
    { brand: "Harbor Nutrition", name: "Pure Creatine", accuracy: 93.1, purity: true },
    { brand: "Ridge Sports", name: "Creatine", accuracy: 91.2, purity: true },
    { brand: "Meadow", name: "Plant Creatine", accuracy: 89.6, purity: true },
    { brand: "Volt Labs", name: "Creatine Blast", accuracy: 82.4, purity: true },
    { brand: "Tidal", name: "Creatine Gummies", accuracy: 76.9, purity: true },
  ],
};
