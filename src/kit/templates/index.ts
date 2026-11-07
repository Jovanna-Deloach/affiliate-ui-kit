/**
 * TEMPLATES — whole pages composed from the blocks. The roundup and the other
 * guide archetypes take the publication (`SiteChrome`) and the same
 * `RoundupGuide` contract, so a guide can move between archetypes unchanged.
 * The supplement pages take their own contracts: `ProductReport`,
 * `BrandProfile`, `CategoryGuide` and `IngredientGuide`; search and account
 * pages take their lists.
 */
export * from "./account-page";
export * from "./archetypes";
export * from "./brand-page";
export * from "./category-page";
export * from "./ingredient-page";
export * from "./product-page";
export * from "./roundup-page";
export * from "./search-page";
