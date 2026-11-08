import fs from 'node:fs';
import path from 'node:path';

const updates = {
  'index.astro': {
    title: 'Solar Calculator India 2026 - PM Surya Ghar Subsidy Estimator',
    description: 'Free Solar Rooftop Calculator for India. Calculate solar capacity (kW), PM Surya Ghar subsidy (up to ₹78,000), monthly savings, and 5-year SBI solar loan EMI.'
  },
  '3kw-solar-panel-cost-calculator.astro': {
    title: '3 kW Solar Panel Price with Subsidy in India (2026) | Calculator',
    description: 'Calculate 3 kW solar panel price with ₹78,000 PM Surya Ghar subsidy. See turnkey installation cost, 300 sq ft roof area, monthly units, and 3-year payback.'
  },
  '1kw-solar-panel-cost-calculator.astro': {
    title: '1 kW Solar Panel Price with Subsidy (2026) | Cost & Savings',
    description: 'Calculate 1 kW solar panel price in India with ₹30,000 PM Surya Ghar subsidy. See installation cost, 100 sq ft roof area, daily units, and savings.'
  },
  '2kw-solar-panel-cost-calculator.astro': {
    title: '2 kW Solar Panel Price with Subsidy (2026) | Cost & Savings',
    description: 'Calculate 2 kW solar panel price in India with ₹60,000 PM Surya Ghar subsidy. See installation cost, 200 sq ft roof area, daily units, and 3-year payback.'
  },
  'pm-surya-ghar-subsidy-calculator.astro': {
    title: 'PM Surya Ghar Subsidy Calculator 2026 | CFA Subsidy Slabs',
    description: 'Calculate PM Surya Ghar Muft Bijli Yojana subsidy online. Check DBT subsidy amounts (up to ₹78,000), eligibility rules, DISCOM net metering, and documents.'
  },
  'sbi-solar-loan-emi-calculator.astro': {
    title: 'SBI Solar Loan EMI Calculator (@ 7.0%) - PM Surya Ghar',
    description: 'Calculate SBI Solar Rooftop Loan EMI for PM Surya Ghar. Check 7.0% repo rate, zero collateral, 5-year repayment schedule, and bank loan eligibility.'
  },
  'about-us.astro': {
    title: 'About Us - Solar Calculator India | Clean Energy Research',
    description: 'Learn about SolarCalculatorIndia.com - an independent clean technology research group providing free, transparent rooftop solar calculation tools.'
  },
  'solar-calculator-delhi.astro': {
    title: 'Solar Calculator Delhi 2026 - BSES, TPDDL & Solar Policy GBI',
    description: 'Calculate rooftop solar cost and subsidy in Delhi NCR. ₹78,000 PM Surya Ghar subsidy plus ₹3/unit Delhi Solar Policy GBI. BSES and TPDDL net metering.'
  },
  'solar-calculator-gujarat.astro': {
    title: 'Solar Calculator Gujarat 2026 - Surya Gujarat Subsidy',
    description: 'Calculate rooftop solar cost and subsidy in Gujarat. Surya Gujarat portal guidelines, DGVCL, PGVCL, UGVCL, MGVCL net metering, and 5.2 peak sun hours savings.'
  },
  'solar-calculator-karnataka.astro': {
    title: 'Solar Calculator Karnataka 2026 - BESCOM Rooftop Subsidy',
    description: 'Calculate rooftop solar cost in Karnataka. BESCOM and MESCOM net metering guidelines, high tariff savings (₹8.10/unit), and ₹78,000 PM Surya Ghar subsidy.'
  },
  'solar-calculator-maharashtra.astro': {
    title: 'Solar Calculator Maharashtra 2026 - MSEDCL Subsidy Guide',
    description: 'Calculate rooftop solar cost and PM Surya Ghar subsidy in Maharashtra. MSEDCL, Tata Power, Adani Mumbai high slab tariffs and under 3-year payback.'
  },
  'solar-calculator-rajasthan.astro': {
    title: 'Solar Calculator Rajasthan 2026 - JVVNL & AVVNL Subsidy',
    description: 'Calculate rooftop solar cost and subsidy in Rajasthan. High solar radiation (5.5 sun hours), JVVNL and AVVNL net metering, and ₹78,000 central subsidy.'
  },
  'solar-calculator-uttar-pradesh.astro': {
    title: 'Solar Calculator Uttar Pradesh 2026 - UPPCL & UPNEDA Subsidy',
    description: 'Calculate rooftop solar cost in Uttar Pradesh. UPPCL net metering rules, Central ₹78,000 subsidy plus UP State Government ₹30,000 top-up subsidy.'
  },
  'solar-calculator-west-bengal.astro': {
    title: 'Solar Calculator West Bengal 2026 - WBSEDCL & CESC Subsidy',
    description: 'Calculate rooftop solar cost and PM Surya Ghar subsidy in West Bengal. WBSEDCL and CESC net-metering guidelines, average tariff ₹7.60/unit, and savings.'
  }
};

const pagesDir = './src/pages';
for (const [filename, meta] of Object.entries(updates)) {
  const filePath = path.join(pagesDir, filename);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    continue;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/const title = "[^"]+";/, `const title = "${meta.title}";`);
  content = content.replace(/const description = "[^"]+";/, `const description = "${meta.description}";`);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✓ Updated ${filename}`);
}
