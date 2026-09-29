# Open Avoided-Carbon Calculator

[![NPM Version](https://img.shields.io/npm/v/@agentngo/open-avoided-carbon.svg)](https://www.npmjs.com/package/@agentngo/open-avoided-carbon)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-brightgreen.svg)](#)

> **Deterministic, transparent Life Cycle Assessment (LCA) avoided greenhouse gas emissions (kg CO₂e) calculator for reuse, secondhand markets, and circular community exchange.**

Decoupled from the [ANG](https://github.com/agentngo/ang) decentralized civic sharing network in Iceland, this library replaces opaque AI estimations and arbitrary numbers with a deterministic, scientifically grounded model for measuring environmental impact in the circular economy.

---

## 🔬 Scientific Rationale: Avoided Emissions Through Reuse

When a pre-owned item is exchanged and reused rather than discarded, it prevents the greenhouse gas emissions associated with manufacturing, packaging, and transporting a new replacement product. In environmental accounting under the **GHG Protocol (Scope 3 Category 1 & Category 11)**, this is categorized as **Avoided Emissions through Product Life Extension**.

However, accurate circular accounting requires addressing two common pitfalls:
1. **The 1:1 Replacement Fallacy**: Not every secondhand exchange prevents a brand-new purchase. Some items are acquired opportunistically. We incorporate a **Displacement Rate ($\alpha$)** based on peer-reviewed consumer substitution research (WRAP, ADEME, Thomas 2011).
2. **Wear & Tear Degradation**: A used item in fair condition does not offer the same remaining lifespan as a pristine item. We apply a **Condition Multiplier ($\beta$)** that scales the avoided carbon to reflect realistic functional lifespan remaining.

---

## 📐 Mathematical Formulation

### 1. Specific Weight-Based Model (When Weight is Known)

$$\text{Avoided CO}_2\text{e (kg)} = \text{Weight (kg)} \times \text{Carbon Intensity}\left(\frac{\text{kg CO}_2\text{e}}{\text{kg}}\right) \times \alpha \times \beta$$

Where:
- $\text{Weight (kg)}$: Measured or estimated item weight.
- $\text{Carbon Intensity}$: Cradle-to-gate embodied carbon per kilogram of finished product.
- $\alpha$ (Displacement Rate): Consumer substitution factor ($0.0 \le \alpha \le 1.0$), reflecting the probability that this reuse displaced a virgin product purchase.
- $\beta$ (Condition Factor): Functional longevity ratio based on item wear:
  - `brand_new` / `same_day_fresh`: $1.00$
  - `like_new`: $0.95$
  - `good`: $0.85$ (standard default)
  - `fair`: $0.65$
  - `salvage_parts`: $0.35$

### 2. Category Baseline Model (When Weight is Unknown)

$$\text{Avoided CO}_2\text{e (kg)} = \text{Baseline Default (kg CO}_2\text{e}) \times \left(\frac{\beta}{0.85}\right) \times \left(\frac{\alpha}{\alpha_{\text{default}}}\right)$$

---

## 📊 Benchmark Emission Factor Database

All category factors are drawn from open, verified Life Cycle Assessment (LCA) databases:

| Category | Default Avoided | Embodied Intensity | Average Weight | Displacement ($\alpha$) | Primary LCA Benchmark Source |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Outerwear & Wool** | **14.2 kg CO₂e** | 26.5 kg CO₂e/kg | 0.95 kg | 0.70 | WRAP UK SCAP & ADEME Base Empreinte (Heavy Wool / Lopapeysa LCA) |
| **Consumer Electronics** | **7.5 kg CO₂e** | 38.0 kg CO₂e/kg | 0.35 kg | 0.60 | Öko-Institut e.V. & European Environmental Bureau (EEB) |
| **Small Appliances** | **12.4 kg CO₂e** | 14.8 kg CO₂e/kg | 1.20 kg | 0.70 | ADEME Base Carbone (Petit électroménager) & DEFRA |
| **Books & Cultural Media** | **1.5 kg CO₂e** | 2.7 kg CO₂e/kg | 0.65 kg | 0.85 | Book Industry Environmental Council (BIEC) & Cambridge Univ. |
| **Kitchenware & Cookware** | **4.8 kg CO₂e** | 6.2 kg CO₂e/kg | 0.90 kg | 0.85 | ICE (Inventory of Carbon & Energy, Bath) & ADEME Household |
| **Children's Gear & Toys** | **3.0 kg CO₂e** | 5.5 kg CO₂e/kg | 0.75 kg | 0.75 | ADEME Équipements de puériculture & PlasticsEurope LCA |
| **Tools & Hardware** | **5.5 kg CO₂e** | 7.0 kg CO₂e/kg | 0.95 kg | 0.80 | DEFRA Supply Chain Factors & VDI 4800 Circular Economy |
| **Surplus Food & Produce** | **1.8 kg CO₂e** | 2.5 kg CO₂e/kg | 0.80 kg | 0.90 | FAO Food Wastage Footprint & IPCC Landfill Methane Model |
| **Everyday Essentials** | **2.5 kg CO₂e** | 4.5 kg CO₂e/kg | 0.70 kg | 0.80 | European Environment Agency (EEA) Circular Reuse Baseline |

---

## 📦 Installation

```bash
npm install @agentngo/open-avoided-carbon
```

---

## 🚀 Usage & Integration Examples

### Simple Category Calculation

```typescript
import { calculateAvoidedEmissions } from '@agentngo/open-avoided-carbon';

// Default category estimation
const result = calculateAvoidedEmissions({
  category: 'outerwear_wool',
});

console.log(result.avoidedCo2Kg); // 14.2
console.log(result.formula);
// "Avoided CO2e = Category Baseline (14.2 kg CO2e) × Condition Ratio (0.85 / 0.85) × Displacement Ratio (0.7 / 0.7) = 14.2 kg CO2e"
```

### Weight-Specific & Condition Calculation

```typescript
import { calculateAvoidedEmissions } from '@agentngo/open-avoided-carbon';

const result = calculateAvoidedEmissions({
  category: 'outerwear_wool',
  weightKg: 1.2, // 1.2 kg heavy Icelandic Lopapeysa
  condition: 'like_new',
});

console.log(result.avoidedCo2Kg); // 21.15 kg CO2e
console.log(result.lcaBenchmarkSource);
```

### Batch Calculation for Community Ledgers & Impact Dashboards

```typescript
import { calculateBatchAvoidedEmissions } from '@agentngo/open-avoided-carbon';

const transactions = [
  { category: 'winter_gear', condition: 'good' }, // resolves to outerwear_wool -> 14.2 kg
  { category: 'books', condition: 'like_new' },    // resolves to books_media -> 1.68 kg
  { category: 'tangible_goods', weightKg: 0.5 },   // weight-based -> 1.53 kg
];

const batchSummary = calculateBatchAvoidedEmissions(transactions);

console.log(`Total CO2 Diverted: ${batchSummary.totalAvoidedCo2Kg} kg CO2e`);
console.log(`Transactions Processed: ${batchSummary.itemCount}`);
```

---

## 🏷️ Category Aliases & Compatibility

The calculator transparently resolves standard and domain-specific terminology:
- `'winter_gear'`, `'jacket'`, `'wool'`, `'lopapeysa'`, `'coat'` $\rightarrow$ `outerwear_wool`
- `'electronics'`, `'tech'`, `'gadgets'`, `'phone'` $\rightarrow$ `consumer_electronics`
- `'kids_family'`, `'toys'`, `'baby'` $\rightarrow$ `children_gear`
- `'tangible_goods'`, `'essentials'`, `'household'` $\rightarrow$ `everyday_tangible_goods`
- `'appliances'`, `'blender'`, `'toaster'` $\rightarrow$ `small_appliances`
- `'books'`, `'reading'`, `'media'` $\rightarrow$ `books_media`
- `'food'`, `'groceries'`, `'bakery'` $\rightarrow$ `surplus_food`

---

## 🧪 Testing

```bash
npm test
```

---

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.
