/**
 * Open Avoided-Carbon Calculator — TypeScript Type Definitions
 * Version: 1.0.0
 * Deterministic Life Cycle Assessment (LCA) avoided carbon modeling for reuse.
 */

export type CanonicalCategory =
  | 'outerwear_wool'
  | 'consumer_electronics'
  | 'small_appliances'
  | 'books_media'
  | 'kitchenware_household'
  | 'children_gear'
  | 'tools_hardware'
  | 'surplus_food'
  | 'everyday_tangible_goods';

export type ItemCondition =
  | 'brand_new'
  | 'like_new'
  | 'good'
  | 'fair'
  | 'salvage_parts'
  | 'same_day_fresh';

/**
 * Benchmark Life Cycle Assessment (LCA) factor for a product category.
 */
export interface CategoryEmissionFactor {
  categoryId: CanonicalCategory;
  displayName: string;
  /** Default avoided CO2e in kilograms for an average representative item in this category */
  defaultAvoidedCo2Kg: number;
  /** Embodied manufacturing carbon intensity in kg CO2e per kg of finished product */
  embodiedCarbonPerKg: number;
  /** Representative average weight in kilograms */
  averageWeightKg: number;
  /** Default displacement factor alpha (substitution rate: 0.0 to 1.0) */
  defaultDisplacementRate: number;
  /** Primary LCA reference benchmark */
  lcaBenchmarkSource: string;
  description: string;
}

/**
 * Input parameters for calculating avoided greenhouse gas emissions.
 */
export interface CalculationInput {
  /** Item category (canonical ID, display name, or legacy alias) */
  category: string;
  /** Physical condition of the secondhand item */
  condition?: ItemCondition | string;
  /** Measured or estimated item weight in kilograms */
  weightKg?: number;
  /** Optional custom displacement rate (0.0 to 1.0) overriding category default */
  displacementRateOverride?: number;
}

/**
 * Result of the avoided emissions calculation.
 */
export interface CalculationResult {
  /** Avoided greenhouse gas emissions in kilograms of CO2 equivalent (kg CO2e) */
  avoidedCo2Kg: number;
  /** Mathematical formula used to derive the calculation */
  formula: string;
  /** Transparent scientific methodology notes and assumptions */
  methodologyNotes: string;
  /** Canonical category resolved by the calculator */
  resolvedCategory: CanonicalCategory;
  /** Effective weight used (measured weight or category representative default) */
  effectiveWeightKg: number;
  /** Applied displacement / substitution rate (alpha) */
  displacementRate: number;
  /** Applied condition degradation factor (beta) */
  conditionFactor: number;
  /** Cited scientific LCA benchmark source */
  lcaBenchmarkSource: string;
}

/**
 * Batch calculation summary.
 */
export interface BatchCalculationResult {
  totalAvoidedCo2Kg: number;
  itemCount: number;
  details: CalculationResult[];
}
