import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateAvoidedEmissions,
  calculateBatchAvoidedEmissions,
  resolveCanonicalCategory,
  EMISSION_FACTORS,
} from '../dist/index.js';

test('calculateAvoidedEmissions - baseline category calculations', () => {
  // Outerwear / Wool garment: ~14.2 kg CO2e
  const outerwear = calculateAvoidedEmissions({ category: 'outerwear_wool' });
  assert.equal(outerwear.avoidedCo2Kg, 14.2);
  assert.equal(outerwear.resolvedCategory, 'outerwear_wool');
  assert.ok(outerwear.formula.includes('14.2 kg CO2e'));
  assert.ok(outerwear.methodologyNotes.includes('WRAP UK'));

  // Everyday Essentials / Tangible Goods: ~2.5 kg CO2e
  const essentials = calculateAvoidedEmissions({ category: 'everyday_tangible_goods' });
  assert.equal(essentials.avoidedCo2Kg, 2.5);
  assert.equal(essentials.resolvedCategory, 'everyday_tangible_goods');

  // Consumer Electronics: ~7.5 kg CO2e
  const electronics = calculateAvoidedEmissions({ category: 'consumer_electronics' });
  assert.equal(electronics.avoidedCo2Kg, 7.5);

  // Books: ~1.5 kg CO2e
  const books = calculateAvoidedEmissions({ category: 'books_media' });
  assert.equal(books.avoidedCo2Kg, 1.5);

  // Small appliances: ~12.4 kg CO2e
  const appliances = calculateAvoidedEmissions({ category: 'small_appliances' });
  assert.equal(appliances.avoidedCo2Kg, 12.4);

  // Kitchenware: ~4.8 kg CO2e
  const kitchen = calculateAvoidedEmissions({ category: 'kitchenware_household' });
  assert.equal(kitchen.avoidedCo2Kg, 4.8);

  // Children's gear: ~3.0 kg CO2e
  const kids = calculateAvoidedEmissions({ category: 'children_gear' });
  assert.equal(kids.avoidedCo2Kg, 3.0);

  // Tools: ~5.5 kg CO2e
  const tools = calculateAvoidedEmissions({ category: 'tools_hardware' });
  assert.equal(tools.avoidedCo2Kg, 5.5);

  // Surplus food: ~1.8 kg CO2e
  const food = calculateAvoidedEmissions({ category: 'surplus_food' });
  assert.equal(food.avoidedCo2Kg, 1.8);
});

test('calculateAvoidedEmissions - resolves legacy ANG category aliases', () => {
  // 'winter_gear' -> maps to outerwear_wool -> 14.2 kg CO2e
  const winter = calculateAvoidedEmissions({ category: 'winter_gear' });
  assert.equal(winter.resolvedCategory, 'outerwear_wool');
  assert.equal(winter.avoidedCo2Kg, 14.2);

  // 'electronics' -> 7.5 kg CO2e
  const tech = calculateAvoidedEmissions({ category: 'electronics' });
  assert.equal(tech.resolvedCategory, 'consumer_electronics');
  assert.equal(tech.avoidedCo2Kg, 7.5);

  // 'kids_family' -> 3.0 kg CO2e
  const family = calculateAvoidedEmissions({ category: 'kids_family' });
  assert.equal(family.resolvedCategory, 'children_gear');
  assert.equal(family.avoidedCo2Kg, 3.0);

  // 'tangible_goods' -> 2.5 kg CO2e
  const goods = calculateAvoidedEmissions({ category: 'tangible_goods' });
  assert.equal(goods.resolvedCategory, 'everyday_tangible_goods');
  assert.equal(goods.avoidedCo2Kg, 2.5);
});

test('calculateAvoidedEmissions - computes weight-based LCA with precision', () => {
  // 1.5 kg wool blanket / coat: 1.5 * 26.5 (intensity) * 0.70 (disp) * 0.85 (good condition) = 23.65 kg CO2e
  const customWool = calculateAvoidedEmissions({
    category: 'outerwear_wool',
    weightKg: 1.5,
    condition: 'good',
  });
  // 1.5 * 26.5 * 0.70 * 0.85 = 23.65125 -> 23.65
  assert.equal(customWool.avoidedCo2Kg, 23.65);
  assert.equal(customWool.effectiveWeightKg, 1.5);
  assert.ok(customWool.formula.includes('Weight (1.5 kg)'));
});

test('calculateAvoidedEmissions - scales by item condition', () => {
  const brandNew = calculateAvoidedEmissions({
    category: 'everyday_tangible_goods',
    condition: 'brand_new',
  });
  const fair = calculateAvoidedEmissions({
    category: 'everyday_tangible_goods',
    condition: 'fair',
  });

  // brand_new multiplier (1.0) should yield more avoided carbon than fair (0.65)
  assert.ok(brandNew.avoidedCo2Kg > fair.avoidedCo2Kg);
  assert.equal(brandNew.conditionFactor, 1.0);
  assert.equal(fair.conditionFactor, 0.65);
});

test('calculateAvoidedEmissions - displacement override', () => {
  const standard = calculateAvoidedEmissions({ category: 'books_media' });
  const lowDisplacement = calculateAvoidedEmissions({
    category: 'books_media',
    displacementRateOverride: 0.40,
  });

  assert.equal(standard.displacementRate, 0.85);
  assert.equal(lowDisplacement.displacementRate, 0.40);
  assert.ok(lowDisplacement.avoidedCo2Kg < standard.avoidedCo2Kg);
});

test('calculateBatchAvoidedEmissions - calculates sum across multiple items', () => {
  const batch = calculateBatchAvoidedEmissions([
    { category: 'outerwear_wool' }, // 14.2
    { category: 'tangible_goods' },  // 2.5
    { category: 'books' },           // 1.5
  ]);

  assert.equal(batch.itemCount, 3);
  assert.equal(batch.totalAvoidedCo2Kg, 18.2); // 14.2 + 2.5 + 1.5 = 18.2
  assert.equal(batch.details.length, 3);
});
