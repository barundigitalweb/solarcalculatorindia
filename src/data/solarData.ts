export interface StateDiscom {
  id: string;
  name: string;
  discom: string;
  avgTariff: number; // ₹ per unit (kWh)
  sunHours: number; // avg peak sun hours per day
  stateSubsidyNote?: string;
  stateSubsidyAmount?: number; // additional state top-up if any
}

export const INDIAN_STATES: StateDiscom[] = [
  {
    id: 'national',
    name: 'All India (National Average)',
    discom: 'Average DISCOM Tariff',
    avgTariff: 7.5,
    sunHours: 4.5,
  },
  {
    id: 'tg-ap',
    name: 'Andhra Pradesh & Telangana',
    discom: 'TSSPDCL / TSNPDCL / APEPDCL / APSPDCL',
    avgTariff: 7.3,
    sunHours: 4.8,
    stateSubsidyNote: 'Net metering available with seamless online portal applications.'
  },
  {
    id: 'as',
    name: 'Assam',
    discom: 'APDCL',
    avgTariff: 7.2,
    sunHours: 4.2,
    stateSubsidyNote: 'APDCL streamlined rooftop solar and net metering portal.'
  },
  {
    id: 'br',
    name: 'Bihar (Urban DS-II)',
    discom: 'NBPDCL / SBPDCL',
    avgTariff: 7.2,
    sunHours: 4.5,
    stateSubsidyNote: 'Bihar Urban (Patna, Gaya, Muzaffarpur) domestic higher slabs average ~₹6.50–₹7.50/unit.'
  },
  {
    id: 'br-rural',
    name: 'Bihar (Rural DS-I)',
    discom: 'NBPDCL / SBPDCL',
    avgTariff: 4.8,
    sunHours: 4.5,
    stateSubsidyNote: 'Bihar Rural subsidized domestic slabs average ~₹4.00–₹5.50/unit.'
  },
  {
    id: 'cg',
    name: 'Chhattisgarh',
    discom: 'CSPDCL',
    avgTariff: 6.8,
    sunHours: 4.7,
    stateSubsidyNote: 'CREDA fast-track rooftop solar facilitation.'
  },
  {
    id: 'dl',
    name: 'Delhi NCR',
    discom: 'BSES Rajdhani / BSES Yamuna / TPDDL',
    avgTariff: 7.2,
    sunHours: 4.6,
    stateSubsidyNote: 'Generation Based Incentive (GBI) of ₹3/unit for 3 years under Delhi Solar Policy 2024.'
  },
  {
    id: 'ga',
    name: 'Goa',
    discom: 'Electricity Dept Goa',
    avgTariff: 5.8,
    sunHours: 4.8,
    stateSubsidyNote: 'Joint Electricity Regulatory Commission (JERC) net metering framework.'
  },
  {
    id: 'gj',
    name: 'Gujarat',
    discom: 'UGVCL / DGVCL / PGVCL / MGVCL / Torrent',
    avgTariff: 6.8,
    sunHours: 5.2,
    stateSubsidyNote: 'Fast-track net-metering approval under Surya Gujarat portal.'
  },
  {
    id: 'hr',
    name: 'Haryana',
    discom: 'DHBVN / UHBVN',
    avgTariff: 7.0,
    sunHours: 4.7,
    stateSubsidyNote: 'Haryana offers simple bi-directional net-metering protocol.'
  },
  {
    id: 'jh',
    name: 'Jharkhand',
    discom: 'JBVNL / JUSCO',
    avgTariff: 6.9,
    sunHours: 4.6,
    stateSubsidyNote: 'JREDA rooftop solar net-metering facilitation.'
  },
  {
    id: 'ka',
    name: 'Karnataka',
    discom: 'BESCOM / MESCOM / HESCOM / GESCOM',
    avgTariff: 8.1,
    sunHours: 4.7,
    stateSubsidyNote: 'Net metering permitted up to 100% of sanctioned load.'
  },
  {
    id: 'kl',
    name: 'Kerala',
    discom: 'KSEB',
    avgTariff: 7.0,
    sunHours: 4.3,
    stateSubsidyNote: 'KSEB Soura scheme integration with PM Surya Ghar.'
  },
  {
    id: 'mp',
    name: 'Madhya Pradesh',
    discom: 'MPPKVVCL (East / West / Central)',
    avgTariff: 7.5,
    sunHours: 4.9,
    stateSubsidyNote: 'MP Urja Vikas Nigam offers streamlined subsidy processing.'
  },
  {
    id: 'mh',
    name: 'Maharashtra (MSEDCL State/Districts)',
    discom: 'MSEDCL (Mahavitaran)',
    avgTariff: 8.8,
    sunHours: 4.8,
    stateSubsidyNote: 'MSEDCL (Pune, Nagpur, Nashik & districts) domestic higher slabs average ~₹8.00–₹9.80/unit.'
  },
  {
    id: 'mh-mumbai',
    name: 'Maharashtra (Mumbai - Tata/Adani)',
    discom: 'Tata Power / Adani Mumbai',
    avgTariff: 11.2,
    sunHours: 4.8,
    stateSubsidyNote: 'Mumbai island high-slab power rates average ~₹10.50–₹14.00/unit. Fastest solar payback in India (< 2.5 yrs).'
  },
  {
    id: 'od',
    name: 'Odisha',
    discom: 'TPCODL / TPNODL / TPSODL / TPWODL',
    avgTariff: 6.7,
    sunHours: 4.6,
    stateSubsidyNote: 'OREDA digital rooftop net-metering processing.'
  },
  {
    id: 'pb',
    name: 'Punjab',
    discom: 'PSPCL',
    avgTariff: 6.9,
    sunHours: 4.7,
    stateSubsidyNote: 'Net-metering available for domestic connections.'
  },
  {
    id: 'rj',
    name: 'Rajasthan',
    discom: 'JVVNL / AVVNL / JdVVNL',
    avgTariff: 7.8,
    sunHours: 5.5,
    stateSubsidyNote: 'Highest solar radiation state in India with up to 5.5 peak sun hours.'
  },
  {
    id: 'tn',
    name: 'Tamil Nadu',
    discom: 'TANGEDCO',
    avgTariff: 6.8,
    sunHours: 4.9,
    stateSubsidyNote: 'Feed-in tariff available for surplus energy exported to grid.'
  },
  {
    id: 'up',
    name: 'Uttar Pradesh (UPPCL Urban)',
    discom: 'UPPCL (PVVNL / DVVNL / MVVNL / PuVVNL)',
    avgTariff: 7.2,
    sunHours: 4.6,
    stateSubsidyAmount: 30000,
    stateSubsidyNote: 'UP Urban (Noida, Lucknow, Kanpur, Agra) domestic slabs + up to ₹30,000 UPNEDA state subsidy!'
  },
  {
    id: 'up-rural',
    name: 'Uttar Pradesh (UPPCL Rural)',
    discom: 'UPPCL (LMV-1 Rural)',
    avgTariff: 5.2,
    sunHours: 4.6,
    stateSubsidyAmount: 30000,
    stateSubsidyNote: 'UP Rural subsidized LMV-1 domestic slabs average ~₹4.50–₹5.50/unit + up to ₹30,000 UPNEDA state subsidy!'
  },
  {
    id: 'uk',
    name: 'Uttarakhand',
    discom: 'UPCL',
    avgTariff: 6.2,
    sunHours: 4.5,
    stateSubsidyNote: 'UREDA online portal for hill and plain solar rooftop installations.'
  },
  {
    id: 'wb',
    name: 'West Bengal (WBSEDCL Rural/Districts)',
    discom: 'WBSEDCL',
    avgTariff: 6.4,
    sunHours: 4.4,
    stateSubsidyNote: 'WBSEDCL district and rural domestic slabs average ~₹5.50–₹6.80/unit. Net metering available for 1kW+.'
  },
  {
    id: 'wb-cesc',
    name: 'West Bengal (CESC Kolkata/Urban)',
    discom: 'CESC',
    avgTariff: 8.2,
    sunHours: 4.4,
    stateSubsidyNote: 'CESC Kolkata higher domestic slabs average ~₹7.80–₹9.20/unit.'
  }
];

export interface SolarCalculationResult {
  systemSizeKw: number;
  roofAreaSqFt: number;
  totalCostBeforeSubsidy: number;
  centralSubsidy: number;
  stateSubsidy: number;
  totalSubsidy: number;
  netCostToUser: number;
  dailyGenerationUnits: number;
  monthlyGenerationUnits: number;
  annualGenerationUnits: number;
  monthlySavingsRs: number;
  annualSavingsRs: number;
  paybackPeriodYears: number;
  lifetimeSavings25Years: number;
  monthlyLoanEmi5Yr: number;
  co2SavedTonnesPerYear: number;
  treesEquivalent: number;
}

// MNRE PM Surya Ghar Official Subsidy Slab Function
export function calculateCentralSubsidy(kw: number): number {
  if (kw <= 0) return 0;
  if (kw <= 1) {
    return 30000;
  }
  if (kw <= 2) {
    return 30000 + (kw - 1) * 30000; // e.g. 2kW = 60000
  }
  if (kw <= 3) {
    return 60000 + (kw - 2) * 18000; // e.g. 3kW = 78000
  }
  // For capacity above 3 kW (up to 10 kW), the subsidy is capped at ₹78,000 as per MNRE guidelines
  return 78000;
}

// Estimated Turnkey Cost per kW (Market benchmark for Tier-1 Mono PERC/Bifacial panels + on-grid inverter + structure + net meter)
export function calculateBenchmarkCost(kw: number): number {
  if (kw <= 1) return 55000;
  if (kw <= 2) return 110000;
  if (kw <= 3) return 165000;
  if (kw <= 4) return 215000;
  if (kw <= 5) return 260000;
  if (kw <= 6) return 310000;
  if (kw <= 7) return 355000;
  if (kw <= 8) return 400000;
  if (kw <= 9) return 445000;
  return kw * 49000; // 10kW ~ 4,90,000
}

// 5-Year Collateral-Free Solar Loan EMI @ 7.0% Repo-rate per annum
export function calculateSolarLoanEmi(principal: number, annualRatePercent: number = 7.0, tenureYears: number = 5): number {
  if (principal <= 0) return 0;
  const monthlyRate = annualRatePercent / 12 / 100;
  const totalMonths = tenureYears * 12;
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
  return Math.round(emi);
}

// Main Calculation Engine
export function computeSolarMetrics(
  inputMode: 'bill' | 'units' | 'area' | 'capacity',
  inputValue: number,
  stateId: string = 'national',
  customTariff?: number
): SolarCalculationResult {
  const state = INDIAN_STATES.find(s => s.id === stateId) || INDIAN_STATES[0];
  const tariff = (customTariff && customTariff > 0) ? customTariff : state.avgTariff;
  const sunHours = state.sunHours;

  let capacityKw = 3; // Default baseline

  if (inputMode === 'capacity') {
    capacityKw = Math.max(1, Math.min(10, Math.round(inputValue * 2) / 2));
  } else if (inputMode === 'bill') {
    const monthlyUnits = Math.max(50, inputValue / tariff);
    // 1 kW generates approx (sunHours * 30 * 0.85 derating factor) units/month
    const unitsPerKwMonth = Math.round(sunHours * 30 * 0.88);
    capacityKw = Math.max(1, Math.min(10, Math.round((monthlyUnits / unitsPerKwMonth) * 2) / 2));
  } else if (inputMode === 'units') {
    const unitsPerKwMonth = Math.round(sunHours * 30 * 0.88);
    capacityKw = Math.max(1, Math.min(10, Math.round((inputValue / unitsPerKwMonth) * 2) / 2));
  } else if (inputMode === 'area') {
    // 1 kW requires ~95 sq ft of shadow-free area
    capacityKw = Math.max(1, Math.min(10, Math.floor(inputValue / 95)));
  }

  if (capacityKw < 1) capacityKw = 1;

  const roofAreaSqFt = Math.round(capacityKw * 95);
  const totalCostBeforeSubsidy = calculateBenchmarkCost(capacityKw);
  const centralSubsidy = calculateCentralSubsidy(capacityKw);
  const stateSubsidy = (state.stateSubsidyAmount && capacityKw >= 2) ? Math.min(state.stateSubsidyAmount, capacityKw * 10000) : 0;
  const totalSubsidy = centralSubsidy + stateSubsidy;
  const netCostToUser = Math.max(0, totalCostBeforeSubsidy - totalSubsidy);

  // Generation metrics
  const dailyGenUnits = Math.round((capacityKw * sunHours * 0.88) * 10) / 10;
  const monthlyGenUnits = Math.round(dailyGenUnits * 30);
  const annualGenUnits = Math.round(monthlyGenUnits * 12);

  const monthlySavingsRs = Math.round(monthlyGenUnits * tariff);
  const annualSavingsRs = monthlySavingsRs * 12;

  // Payback period
  const paybackPeriodYears = annualSavingsRs > 0 
    ? Math.round((netCostToUser / annualSavingsRs) * 10) / 10 
    : 0;

  // 25-Year Lifetime Savings (factoring 3% annual tariff inflation & 0.7% annual solar degradation)
  let lifetimeSavings = 0;
  let currentYearGen = annualGenUnits;
  let currentTariff = tariff;
  for (let year = 1; year <= 25; year++) {
    lifetimeSavings += currentYearGen * currentTariff;
    currentYearGen *= 0.993; // 0.7% annual degradation
    currentTariff *= 1.03; // 3% inflation
  }
  const lifetimeNetSavings = Math.round(lifetimeSavings - netCostToUser);

  // Solar Loan EMI (5 years @ 7%)
  const monthlyLoanEmi5Yr = calculateSolarLoanEmi(netCostToUser, 7.0, 5);

  // Environmental Impact
  // 1 unit of coal power = ~0.82 kg CO2 in India
  const co2SavedTonnesPerYear = Math.round((annualGenUnits * 0.82 / 1000) * 10) / 10;
  const treesEquivalent = Math.round(co2SavedTonnesPerYear * 45);

  return {
    systemSizeKw: capacityKw,
    roofAreaSqFt,
    totalCostBeforeSubsidy,
    centralSubsidy,
    stateSubsidy,
    totalSubsidy,
    netCostToUser,
    dailyGenerationUnits: dailyGenUnits,
    monthlyGenerationUnits: monthlyGenUnits,
    annualGenerationUnits: annualGenUnits,
    monthlySavingsRs,
    annualSavingsRs,
    paybackPeriodYears,
    lifetimeSavings25Years: lifetimeNetSavings,
    monthlyLoanEmi5Yr,
    co2SavedTonnesPerYear,
    treesEquivalent,
  };
}
