import {
  CalculationInput,
  CalculationResult,
  BatchCalculationResult,
  CanonicalCategory,
} from './types.js';
import {
  EMISSION_FACTORS,
  resolveCanonicalCategory,
  resolveConditionFactor,
} from './factors.js';

function roundToDecimals(value: number, decimals: number = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Pure functional calculator for avoided greenhouse gas emissions through reuse.
 * 
 * Complies with the GHG Protocol Scope 3 Category 1/11 avoided emissions methodology
 * and WRAP/ADEME substitution rate guidelines.
 * 
 * @param item { category: string; condition?: string; weightKg?: number; displacementRateOverride?: number }
 * @returns CalculationResult containing avoidedCo2Kg, formula string, and methodology notes.
 */
export function calculateAvoidedEmissions(item: CalculationInput): CalculationResult {
  const resolvedCategory: CanonicalCategory = resolveCanonicalCategory(item.category);
  const factor = EMISSION_FACTORS[resolvedCategory];

  const conditionFactor = resolveConditionFactor(item.condition);
  const displacementRate =
    typeof item.displacementRateOverride === 'number' &&
    item.displacementRateOverride >= 0 &&
    item.displacementRateOverride <= 1
      ? item.displacementRateOverride
      : factor.defaultDisplacementRate;

  let avoidedCo2Kg: number;
  let formula: string;
  let effectiveWeightKg: number;
  let methodologyNotes: string;

  if (typeof item.weightKg === 'number' && item.weightKg > 0) {
    // Weight-based specific LCA calculation
    effectiveWeightKg = item.weightKg;
    const rawAvoided =
      effectiveWeightKg * factor.embodiedCarbonPerKg * displacementRate * conditionFactor;
    avoidedCo2Kg = roundToDecimals(rawAvoided, 2);

    formula = `Avoided CO2e = Weight (${effectiveWeightKg} kg) × Carbon Intensity (${factor.embodiedCarbonPerKg} kg CO2e/kg) × Displacement Rate (${displacementRate}) × Condition Multiplier (${conditionFactor}) = ${avoidedCo2Kg} kg CO2e`;
    methodologyNotes = `Computed using specific item weight (${effectiveWeightKg} kg) against benchmark cradle-to-gate embodied carbon for ${factor.displayName}. Displacement factor (${displacementRate}) accounts for consumer substitution rate. Condition factor (${conditionFactor}) accounts for remaining functional lifespan. Benchmark: ${factor.lcaBenchmarkSource}.`;
  } else {
    // Category representative baseline calculation
    effectiveWeightKg = factor.averageWeightKg;
    const conditionRatio = conditionFactor / 0.85; // Calibrated relative to standard 'good' (0.85) condition
    const displacementRatio = displacementRate / factor.defaultDisplacementRate;
    const rawAvoided = factor.defaultAvoidedCo2Kg * conditionRatio * displacementRatio;
    avoidedCo2Kg = roundToDecimals(rawAvoided, 2);

    formula = `Avoided CO2e = Category Baseline (${factor.defaultAvoidedCo2Kg} kg CO2e) × Condition Ratio (${conditionFactor} / 0.85) × Displacement Ratio (${displacementRate} / ${factor.defaultDisplacementRate}) = ${avoidedCo2Kg} kg CO2e`;
    methodologyNotes = `Computed using representative unit baseline (${factor.defaultAvoidedCo2Kg} kg CO2e) for ${factor.displayName} (average weight ~${effectiveWeightKg} kg). Condition factor: ${conditionFactor}. Displacement factor: ${displacementRate}. Benchmark: ${factor.lcaBenchmarkSource}.`;
  }

  return {
    avoidedCo2Kg,
    formula,
    methodologyNotes,
    resolvedCategory,
    effectiveWeightKg,
    displacementRate,
    conditionFactor,
    lcaBenchmarkSource: factor.lcaBenchmarkSource,
  };
}

/**
 * Batch calculates aggregate avoided emissions for a collection of items.
 */
export function calculateBatchAvoidedEmissions(items: CalculationInput[]): BatchCalculationResult {
  const details = items.map(calculateAvoidedEmissions);
  const total = details.reduce((sum, item) => sum + item.avoidedCo2Kg, 0);

  return {
    totalAvoidedCo2Kg: roundToDecimals(total, 2),
    itemCount: items.length,
    details,
  };
}
