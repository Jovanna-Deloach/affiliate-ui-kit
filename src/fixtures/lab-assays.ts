/**
 * Independent-lab assay panel for the clinical vertical. Realistic analytes,
 * methods and acceptance criteria — each row is distinct (never a loop index).
 */
export interface LabAssay {
  id: string;
  analyte: string;
  /** Measured result, formatted. */
  result: string;
  /** Claim or limit it is judged against. */
  reference: string;
  /** Headline comparison shown in the collapsed preview, e.g. "100.4% of claim". */
  summary: string;
  status: "pass" | "fail" | "watch";
  method: string;
  detail: string;
}

export const labAssays: LabAssay[] = [
  { id: "creatine", analyte: "Creatine monohydrate per serving", result: "5.02 g", reference: "5.00 g label claim", summary: "100.4% of claim", status: "pass", method: "HPLC-UV", detail: "Mean of duplicate injections, batch 2214. Acceptance window 95–110% of the label claim per USP <2040>." },
  { id: "creatinine", analyte: "Creatinine (degradant)", result: "0.07%", reference: "≤ 0.50%", summary: "0.07% · within limit", status: "pass", method: "HPLC-UV", detail: "Creatinine forms as creatine degrades in moisture; low values indicate fresh, dry stock." },
  { id: "dcd", analyte: "Dicyandiamide (DCD)", result: "< 10 ppm", reference: "≤ 50 ppm", summary: "below quantitation", status: "pass", method: "HPLC-UV", detail: "Synthesis by-product. Reported below the method's limit of quantitation." },
  { id: "dht", analyte: "Dihydrotriazine (DHT)", result: "Not detected", reference: "Not detected", summary: "not detected", status: "pass", method: "HPLC-UV", detail: "Synthesis impurity screened at a 1 ppm limit of detection." },
  { id: "lead", analyte: "Lead (Pb)", result: "0.08 µg/serving", reference: "≤ 0.5 µg (Prop 65 MADL)", summary: "0.08 µg · 16% of limit", status: "pass", method: "ICP-MS", detail: "Inductively coupled plasma mass spectrometry after microwave digestion." },
  { id: "arsenic", analyte: "Arsenic (As, inorganic)", result: "0.21 µg/serving", reference: "≤ 10 µg (USP <232>)", summary: "0.21 µg · 2% of limit", status: "pass", method: "ICP-MS", detail: "Speciated inorganic arsenic; organic forms excluded." },
  { id: "cadmium", analyte: "Cadmium (Cd)", result: "0.12 µg/serving", reference: "≤ 4.1 µg (Prop 65 MADL)", summary: "0.12 µg · 3% of limit", status: "pass", method: "ICP-MS", detail: "Reported per 5 g serving." },
  { id: "mercury", analyte: "Mercury (Hg)", result: "< 0.02 µg/serving", reference: "≤ 0.3 µg", summary: "below detection", status: "pass", method: "ICP-MS", detail: "Below the method's limit of detection." },
  { id: "moisture", analyte: "Moisture (loss on drying)", result: "11.9%", reference: "≤ 12.5%", summary: "11.9% · near limit", status: "watch", method: "Gravimetric", detail: "Creatine monohydrate carries ~12% water of crystallisation; values above 12.5% suggest absorbed moisture and faster degradation." },
  { id: "solubility", analyte: "Solubility at 20 °C", result: "13.1 g/L", reference: "≥ 12 g/L", summary: "13.1 g/L", status: "pass", method: "Saturation test", detail: "Not micronised; grittier mouthfeel than micronised rivals despite passing." },
  { id: "aerobic", analyte: "Total aerobic microbial count", result: "< 100 CFU/g", reference: "≤ 10,000 CFU/g", summary: "< 100 CFU/g", status: "pass", method: "USP <2021>", detail: "Plate count after 72 h incubation." },
  { id: "yeast", analyte: "Yeast & mould", result: "< 10 CFU/g", reference: "≤ 1,000 CFU/g", summary: "< 10 CFU/g", status: "pass", method: "USP <2021>", detail: "Plate count after 5 days incubation." },
  { id: "ecoli", analyte: "E. coli", result: "Absent / 10 g", reference: "Absent / 10 g", summary: "absent", status: "pass", method: "USP <2022>", detail: "Enrichment culture, confirmed negative." },
  { id: "salmonella", analyte: "Salmonella spp.", result: "Absent / 25 g", reference: "Absent / 25 g", summary: "absent", status: "pass", method: "USP <2022>", detail: "Enrichment culture, confirmed negative." },
  { id: "gluten", analyte: "Gluten", result: "< 5 ppm", reference: "< 20 ppm (FDA gluten-free)", summary: "< 5 ppm", status: "pass", method: "ELISA (R5)", detail: "Qualifies for a gluten-free claim; none is made on the label." },
  { id: "caffeine", analyte: "Undeclared caffeine", result: "Not detected", reference: "Not detected", summary: "not detected", status: "pass", method: "LC-MS/MS", detail: "Screened for undeclared stimulants alongside DMAA and synephrine." },
];
