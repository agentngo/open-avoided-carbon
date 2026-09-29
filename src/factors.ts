import { CanonicalCategory, CategoryEmissionFactor } from './types.js';

/**
 * Open Life Cycle Assessment (LCA) Emission Factor Database for Circular Reuse.
 * 
 * Sources:
 * - WRAP UK Sustainable Clothing Action Plan (SCAP) & Textile LCA
 * - ADEME Base Empreinte (France Agence de la transition écologique)
 * - European Environmental Bureau (EEB) & Öko-Institut e.V.
 * - Inventory of Carbon & Energy (ICE), University of Bath
 * - DEFRA / UK Government GHG Conversion Factors for Company Reporting
 * - FAO Food Wastage Footprint & IPCC Waste Methodology
 */
export const EMISSION_FACTORS: Record<CanonicalCategory, CategoryEmissionFactor> = {
  outerwear_wool: {
    categoryId: 'outerwear_wool',
    displayName: 'Outerwear & Wool Garments',
    defaultAvoidedCo2Kg: 14.2,
    embodiedCarbonPerKg: 26.5,
    averageWeightKg: 0.95,
    defaultDisplacementRate: 0.70,
    lcaBenchmarkSource: 'WRAP UK Sustainable Clothing Action Plan (SCAP) & ADEME Base Empreinte Textiles',
    description: 'Heavy winter coats, Icelandic Lopapeysa, pure wool sweaters, and technical insulated parkas with high enteric/textile manufacturing footprints.',
  },
  consumer_electronics: {
    categoryId: 'consumer_electronics',
    displayName: 'Consumer Electronics & Tech',
    defaultAvoidedCo2Kg: 7.5,
    embodiedCarbonPerKg: 38.0,
    averageWeightKg: 0.35,
    defaultDisplacementRate: 0.60,
    lcaBenchmarkSource: 'Öko-Institut e.V. & European Environmental Bureau (EEB) Lifecycle Studies',
    description: 'Smartphones, tablets, e-readers, wireless peripherals, chargers, audio gear, and small digital hardware.',
  },
  small_appliances: {
    categoryId: 'small_appliances',
    displayName: 'Small Household Appliances',
    defaultAvoidedCo2Kg: 12.4,
    embodiedCarbonPerKg: 14.8,
    averageWeightKg: 1.2,
    defaultDisplacementRate: 0.70,
    lcaBenchmarkSource: 'ADEME Base Carbone (Petit électroménager) & DEFRA GHG Factors',
    description: 'Kettles, toasters, blenders, espresso makers, irons, vacuum cleaners, and kitchen counter appliances.',
  },
  books_media: {
    categoryId: 'books_media',
    displayName: 'Books & Cultural Media',
    defaultAvoidedCo2Kg: 1.5,
    embodiedCarbonPerKg: 2.7,
    averageWeightKg: 0.65,
    defaultDisplacementRate: 0.85,
    lcaBenchmarkSource: 'Book Industry Environmental Council (BIEC) & Cambridge University Press Carbon Audit',
    description: 'Paperback/hardcover books, textbooks, educational manuals, sheet music, and bound print media.',
  },
  kitchenware_household: {
    categoryId: 'kitchenware_household',
    displayName: 'Kitchenware & Cookware',
    defaultAvoidedCo2Kg: 4.8,
    embodiedCarbonPerKg: 6.2,
    averageWeightKg: 0.9,
    defaultDisplacementRate: 0.85,
    lcaBenchmarkSource: 'ICE (Inventory of Carbon & Energy), University of Bath & ADEME Household Goods',
    description: 'Cast iron skillets, stainless steel pots, glassware, ceramic dinnerware, cutlery, and kitchen utensils.',
  },
  children_gear: {
    categoryId: 'children_gear',
    displayName: "Children's Gear & Toys",
    defaultAvoidedCo2Kg: 3.0,
    embodiedCarbonPerKg: 5.5,
    averageWeightKg: 0.75,
    defaultDisplacementRate: 0.75,
    lcaBenchmarkSource: 'ADEME Équipements de puériculture & PlasticsEurope LCA',
    description: 'Strollers, wooden/plastic developmental toys, baby monitors, high chairs, and children equipment.',
  },
  tools_hardware: {
    categoryId: 'tools_hardware',
    displayName: 'Tools & Hardware',
    defaultAvoidedCo2Kg: 5.5,
    embodiedCarbonPerKg: 7.0,
    averageWeightKg: 0.95,
    defaultDisplacementRate: 0.80,
    lcaBenchmarkSource: 'DEFRA Supply Chain Carbon Factors & VDI 4800 Circular Economy Engineering',
    description: 'Cordless drills, hand tools, wrenches, saws, garden tools, and home maintenance hardware.',
  },
  surplus_food: {
    categoryId: 'surplus_food',
    displayName: 'Surplus Food & Dry Goods',
    defaultAvoidedCo2Kg: 1.8,
    embodiedCarbonPerKg: 2.5,
    averageWeightKg: 0.8,
    defaultDisplacementRate: 0.90,
    lcaBenchmarkSource: 'FAO Food Wastage Footprint & IPCC Waste / Landfill Methane Avoidance Model',
    description: 'Factory-sealed dry goods, surplus artisan bakery, pantry staples, and recovered fresh produce avoiding anaerobic decomposition.',
  },
  everyday_tangible_goods: {
    categoryId: 'everyday_tangible_goods',
    displayName: 'Everyday Essentials & Household Goods',
    defaultAvoidedCo2Kg: 2.5,
    embodiedCarbonPerKg: 4.5,
    averageWeightKg: 0.7,
    defaultDisplacementRate: 0.80,
    lcaBenchmarkSource: 'European Environment Agency (EEA) Circular Economy & Reuse Emissions Baseline',
    description: 'Standard household items, storage containers, decorative wares, lamps, linens, and general community donations.',
  },
};

/**
 * Category alias dictionary to normalize user inputs, legacy tags, and domain terms.
 */
export const CATEGORY_ALIASES: Record<string, CanonicalCategory> = {
  // Outerwear / Wool
  outerwear_wool: 'outerwear_wool',
  outerwear: 'outerwear_wool',
  wool: 'outerwear_wool',
  winter_gear: 'outerwear_wool',
  clothing: 'outerwear_wool',
  jacket: 'outerwear_wool',
  coat: 'outerwear_wool',
  sweater: 'outerwear_wool',
  lopapeysa: 'outerwear_wool',

  // Consumer Electronics
  consumer_electronics: 'consumer_electronics',
  electronics: 'consumer_electronics',
  tech: 'consumer_electronics',
  gadgets: 'consumer_electronics',
  phone: 'consumer_electronics',
  laptop: 'consumer_electronics',

  // Small Appliances
  small_appliances: 'small_appliances',
  appliances: 'small_appliances',
  appliance: 'small_appliances',
  blender: 'small_appliances',
  toaster: 'small_appliances',
  coffee_maker: 'small_appliances',

  // Books & Media
  books_media: 'books_media',
  books: 'books_media',
  book: 'books_media',
  media: 'books_media',
  reading: 'books_media',

  // Kitchenware
  kitchenware_household: 'kitchenware_household',
  kitchenware: 'kitchenware_household',
  kitchen: 'kitchenware_household',
  cookware: 'kitchenware_household',
  dishes: 'kitchenware_household',

  // Children's gear
  children_gear: 'children_gear',
  kids_gear: 'children_gear',
  kids_family: 'children_gear',
  toys: 'children_gear',
  baby: 'children_gear',
  children: 'children_gear',

  // Tools & Hardware
  tools_hardware: 'tools_hardware',
  tools: 'tools_hardware',
  hardware: 'tools_hardware',
  diy: 'tools_hardware',

  // Surplus food
  surplus_food: 'surplus_food',
  food: 'surplus_food',
  groceries: 'surplus_food',
  bakery: 'surplus_food',

  // Everyday goods
  everyday_tangible_goods: 'everyday_tangible_goods',
  tangible_goods: 'everyday_tangible_goods',
  essentials: 'everyday_tangible_goods',
  household: 'everyday_tangible_goods',
  general: 'everyday_tangible_goods',
};

/**
 * Resolves any category string into a CanonicalCategory. Defaults to 'everyday_tangible_goods'.
 */
export function resolveCanonicalCategory(inputCategory: string): CanonicalCategory {
  const normalized = String(inputCategory || '')
    .trim()
    .toLowerCase()
    .replace(/[\s\-_]+/g, '_');

  return CATEGORY_ALIASES[normalized] || 'everyday_tangible_goods';
}

/**
 * Condition degradation multipliers.
 * Secondhand items in lower condition have reduced remaining functional lifespans,
 * so the displacement value of a new manufacture is discounted accordingly.
 */
export const CONDITION_FACTORS: Record<string, number> = {
  brand_new: 1.0,
  same_day_fresh: 1.0,
  like_new: 0.95,
  good: 0.85,
  fair: 0.65,
  salvage_parts: 0.35,
};

export function resolveConditionFactor(condition?: string): number {
  if (!condition) return CONDITION_FACTORS.good; // Default to 'good' (0.85)
  const norm = condition.trim().toLowerCase().replace(/[\s\-]+/g, '_');
  return CONDITION_FACTORS[norm] ?? CONDITION_FACTORS.good;
}
