import React, { useState, useMemo, useRef } from 'react';
import { 
  Sun, 
  Zap, 
  IndianRupee, 
  ShieldCheck, 
  TrendingUp, 
  Home, 
  FileDown, 
  Share2, 
  CheckCircle2, 
  TreePine, 
  Clock, 
  Building2,
  BadgePercent,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { INDIAN_STATES, computeSolarMetrics, type SolarCalculationResult } from '../data/solarData';

interface Props {
  initialCapacity?: number;
  initialStateId?: string;
  pageTitle?: string;
  pageSubtitle?: string;
}

export default function SolarCalculator({
  initialCapacity,
  initialStateId = 'national',
  pageTitle = "PM Surya Ghar & Rooftop Solar Subsidy Calculator 2026",
  pageSubtitle = "Calculate exact solar system size (kW), Central Government Subsidy (up to ₹78,000), monthly bill savings, and payback period."
}: Props) {
  // Input mode
  const [inputMode, setInputMode] = useState<'bill' | 'capacity' | 'units' | 'area'>(
    initialCapacity ? 'capacity' : 'bill'
  );
  const [monthlyBill, setMonthlyBill] = useState<number>(2500);
  const [capacity, setCapacity] = useState<number>(initialCapacity || 3);
  const [monthlyUnits, setMonthlyUnits] = useState<number>(300);
  const [roofArea, setRoofArea] = useState<number>(300);
  const [selectedStateId, setSelectedStateId] = useState<string>(initialStateId);
  const [customTariff, setCustomTariff] = useState<number | null>(null);
  const [isEditingTariff, setIsEditingTariff] = useState<boolean>(false);

  // Lead modal state
  const [showLeadModal, setShowLeadModal] = useState<boolean>(false);
  const [leadForm, setLeadForm] = useState({ name: '', phone: '', city: '', pincode: '' });
  const [leadSubmitted, setLeadSubmitted] = useState<boolean>(false);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [isSubmittingLead, setIsSubmittingLead] = useState<boolean>(false);

  const reportRef = useRef<HTMLDivElement>(null);

  // Confetti celebratory burst (Dynamically loaded to minimize initial JS bundle)
  const triggerCelebration = async () => {
    try {
      const confetti = (await import('canvas-confetti')).default;
      confetti({
        particleCount: 75,
        spread: 65,
        origin: { y: 0.6 }
      });
    } catch {}
  };

  const currentState = INDIAN_STATES.find(s => s.id === selectedStateId) || INDIAN_STATES[0];
  const effectiveTariff = (customTariff !== null && customTariff > 0) ? customTariff : currentState.avgTariff;

  // Compute metrics dynamically
  const metrics: SolarCalculationResult = useMemo(() => {
    let value = monthlyBill;
    if (inputMode === 'capacity') value = capacity;
    else if (inputMode === 'units') value = monthlyUnits;
    else if (inputMode === 'area') value = roofArea;
    return computeSolarMetrics(inputMode, value, selectedStateId, effectiveTariff);
  }, [inputMode, monthlyBill, capacity, monthlyUnits, roofArea, selectedStateId, effectiveTariff]);

  // WhatsApp share generator
  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `☀️ My Rooftop Solar Calculation (PM Surya Ghar 2026):\n\n` +
      `⚡ Recommended Size: ${metrics.systemSizeKw} kW\n` +
      `🏛️ Govt Subsidy: ₹${metrics.totalSubsidy.toLocaleString('en-IN')}\n` +
      `💰 Net Cost: ₹${metrics.netCostToUser.toLocaleString('en-IN')}\n` +
      `📉 Monthly Bill Savings: ₹${metrics.monthlySavingsRs.toLocaleString('en-IN')}\n` +
      `⏳ Payback Period: ${metrics.paybackPeriodYears} Years\n` +
      `🏦 5-Yr Solar Loan EMI: ~₹${metrics.monthlyLoanEmi5Yr.toLocaleString('en-IN')}/mo\n\n` +
      `Calculate your solar subsidy for free on: https://solarcalculatorindia.com`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  // PDF Export
  const handleDownloadPdf = async () => {
    try {
      setIsExportingPdf(true);
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF('p', 'mm', 'a4');
      
      doc.setFillColor(16, 185, 129); // Emerald primary
      doc.rect(0, 0, 210, 24, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('SolarCalculatorIndia.com - Feasibility & Subsidy Report', 14, 15);
      
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generated on: ${new Date().toLocaleDateString('en-IN')} | Location: ${currentState.name}`, 14, 32);
      
      // Summary Box
      doc.setDrawColor(226, 232, 240);
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(14, 38, 182, 45, 3, 3, 'FD');
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(16, 185, 129);
      doc.text(`Recommended Solar Capacity: ${metrics.systemSizeKw} kW System`, 20, 48);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text(`Shadow-Free Roof Area Required: ${metrics.roofAreaSqFt} sq. ft.`, 20, 56);
      doc.text(`Daily Estimated Generation: ~${metrics.dailyGenerationUnits} Units (kWh)`, 20, 64);
      doc.text(`Monthly Estimated Generation: ~${metrics.monthlyGenerationUnits} Units (kWh)`, 20, 72);
      
      // Financial Table
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('Cost & Government Subsidy Breakdown (PM Surya Ghar)', 14, 95);
      
      const rows = [
        ['Total Estimated Benchmark Cost', `Rs. ${metrics.totalCostBeforeSubsidy.toLocaleString('en-IN')}`],
        ['Central Govt. PM Surya Ghar Subsidy (DBT)', `- Rs. ${metrics.centralSubsidy.toLocaleString('en-IN')}`],
        ['State Govt. Additional Subsidy (if applicable)', `- Rs. ${metrics.stateSubsidy.toLocaleString('en-IN')}`],
        ['Net Out-of-Pocket Investment Required', `Rs. ${metrics.netCostToUser.toLocaleString('en-IN')}`],
        ['Estimated Monthly Electricity Savings', `Rs. ${metrics.monthlySavingsRs.toLocaleString('en-IN')}`],
        ['Estimated Annual Electricity Savings', `Rs. ${metrics.annualSavingsRs.toLocaleString('en-IN')}`],
        ['Capital Payback / Break-even Period', `${metrics.paybackPeriodYears} Years`],
        ['25-Year Net Cumulative Lifetime Savings', `Rs. ${metrics.lifetimeSavings25Years.toLocaleString('en-IN')}`],
        ['Estimated 5-Year Solar Loan EMI (@ 7.0% p.a.)', `Rs. ${metrics.monthlyLoanEmi5Yr.toLocaleString('en-IN')} / month`]
      ];
      
      let y = 105;
      rows.forEach(([label, value], idx) => {
        doc.setFillColor(idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 252);
        doc.rect(14, y - 6, 182, 9, 'F');
        doc.setFont('helvetica', idx === 3 || idx === 7 ? 'bold' : 'normal');
        doc.setTextColor(idx === 3 ? 16 : 51, idx === 3 ? 185 : 65, idx === 3 ? 129 : 85);
        doc.text(label, 18, y);
        doc.text(value, 190, y, { align: 'right' });
        y += 9;
      });

      // Environmental Benefit
      doc.roundedRect(14, y + 8, 182, 28, 3, 3, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(22, 101, 52);
      doc.text('Environmental Impact (Carbon Neutrality):', 20, y + 18);
      doc.setFont('helvetica', 'normal');
      doc.text(`Avoids ${metrics.co2SavedTonnesPerYear} Tonnes of CO2 emissions annually. Equivalent to planting ~${metrics.treesEquivalent} mature trees!`, 20, y + 26);
      
      // Footer Disclaimer
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text('Disclaimer: This report is an independent calculation for estimation purposes. Final subsidy approval is subject to MNRE portal verification (pmsuryaghar.gov.in).', 14, 280);
      doc.text('Generated via SolarCalculatorIndia.com - India\'s #1 Free Rooftop Solar & Subsidy Estimation Engine.', 14, 285);
      
      doc.save(`Solar-Feasibility-Report-${metrics.systemSizeKw}kW.pdf`);
      triggerCelebration();
    } catch (e) {
      console.error('Error generating PDF:', e);
      alert('Unable to generate PDF directly. Please print screen or save as PDF via your browser print dialog.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = leadForm.phone.trim();
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      alert('Please enter a valid 10-digit Indian mobile number (starting with 6, 7, 8, or 9).');
      return;
    }
    const cleanPincode = leadForm.pincode.trim();
    if (cleanPincode && !/^[1-9][0-9]{5}$/.test(cleanPincode)) {
      alert('Please enter a valid 6-digit Indian postal pincode.');
      return;
    }

    setIsSubmittingLead(true);
    const leadPayload = {
      name: leadForm.name.trim(),
      phone: cleanPhone,
      city: leadForm.city.trim(),
      pincode: cleanPincode,
      systemSizeKw: metrics.systemSizeKw,
      state: currentState.name,
      discom: currentState.discom,
      totalSubsidy: metrics.totalSubsidy,
      netCost: metrics.netCostToUser,
      monthlySavings: metrics.monthlySavingsRs,
      timestamp: new Date().toISOString()
    };

    // Save to local storage for privacy / persistence
    try {
      const existing = JSON.parse(localStorage.getItem('solar_leads') || '[]');
      existing.push(leadPayload);
      localStorage.setItem('solar_leads', JSON.stringify(existing));
    } catch {}

    // Dispatch to Webhook if configured (via window or environment variable)
    try {
      const webhookUrl = (typeof window !== 'undefined' && (window as any).SOLAR_LEAD_WEBHOOK_URL) ||
        (import.meta as any).env?.PUBLIC_LEAD_WEBHOOK_URL;
      if (webhookUrl) {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(leadPayload)
        });
      }
    } catch (err) {
      console.warn('Webhook dispatch failed or not configured, stored in localStorage:', err);
    } finally {
      setIsSubmittingLead(false);
      setLeadSubmitted(true);
      triggerCelebration();
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Header Badge */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm font-semibold mb-3">
          <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
          <span>Updated for PM Surya Ghar: Muft Bijli Yojana (2026 Guidelines)</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight font-display">
          {pageTitle}
        </h1>
        <p className="mt-3 text-base sm:text-lg text-slate-600 max-w-3xl mx-auto">
          {pageSubtitle}
        </p>
      </div>

      {/* Main Calculator Card */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden" ref={reportRef}>
        
        {/* State Selection Bar */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 p-4 sm:p-6 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <label htmlFor="state-discom-select" className="text-xs font-semibold uppercase tracking-wider text-emerald-200 block mb-1">
                Select Your State / Electricity DISCOM
              </label>
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-300 shrink-0" aria-hidden="true" />
                <select
                  id="state-discom-select"
                  aria-label="Select Your State or Electricity DISCOM"
                  value={selectedStateId}
                  onChange={(e) => {
                    setSelectedStateId(e.target.value);
                    setCustomTariff(null);
                    setIsEditingTariff(false);
                  }}
                  className="bg-emerald-950/60 border border-emerald-400/40 rounded-xl px-3 py-2 text-sm sm:text-base text-white font-medium focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all cursor-pointer w-full sm:w-80"
                >
                  {INDIAN_STATES.map((st) => (
                    <option key={st.id} value={st.id} className="text-slate-900">
                      {st.name} ({st.discom.split('/')[0].trim()})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs sm:text-sm text-emerald-100 bg-emerald-900/40 px-4 py-2.5 rounded-xl border border-emerald-500/20">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-300 font-medium">Electricity Rate:</span>
                  <button
                    type="button"
                    aria-label="Edit electricity rate per unit"
                    onClick={() => setIsEditingTariff(!isEditingTariff)}
                    className="text-[11px] text-amber-300 hover:text-amber-200 underline font-semibold cursor-pointer"
                  >
                    {isEditingTariff ? 'Done' : '✎ Edit'}
                  </button>
                </div>
                {isEditingTariff ? (
                  <div className="mt-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-white font-bold">₹</span>
                      <input
                        id="custom-tariff-input"
                        aria-label="Custom electricity rate in rupees per unit"
                        type="number"
                        step="0.1"
                        min="2"
                        max="25"
                        value={effectiveTariff}
                        onChange={(e) => setCustomTariff(Number(e.target.value))}
                        className="w-16 bg-emerald-950 text-white font-bold px-1.5 py-0.5 rounded border border-emerald-400 text-base sm:text-xs focus:outline-none"
                      />
                      <span className="text-emerald-300 text-xs">/unit</span>
                      <button
                        type="button"
                        onClick={() => setIsEditingTariff(false)}
                        className="text-[11px] bg-emerald-600 hover:bg-emerald-500 text-white px-2 py-0.5 rounded font-semibold ml-1 cursor-pointer"
                      >
                        Apply
                      </button>
                      {customTariff !== null && (
                        <button
                          type="button"
                          onClick={() => {
                            setCustomTariff(null);
                            setIsEditingTariff(false);
                          }}
                          className="text-[11px] text-emerald-300 hover:text-white underline ml-1 cursor-pointer"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                    {/* Quick Category Presets */}
                    <div className="flex items-center gap-1 mt-1.5">
                      <button
                        type="button"
                        onClick={() => setCustomTariff(5.2)}
                        className="text-[10px] bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 px-1.5 py-0.5 rounded border border-emerald-600/40 cursor-pointer font-medium"
                      >
                        Rural (~₹5.2)
                      </button>
                      <button
                        type="button"
                        onClick={() => setCustomTariff(currentState.avgTariff)}
                        className="text-[10px] bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 px-1.5 py-0.5 rounded border border-emerald-600/40 cursor-pointer font-medium"
                      >
                        State (~₹{currentState.avgTariff})
                      </button>
                      <button
                        type="button"
                        onClick={() => setCustomTariff(8.5)}
                        className="text-[10px] bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 px-1.5 py-0.5 rounded border border-emerald-600/40 cursor-pointer font-medium"
                      >
                        Urban (~₹8.5)
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white text-base">₹{effectiveTariff}/unit</span>
                    {customTariff !== null && (
                      <span className="text-[10px] bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-400/30 font-semibold">
                        Custom
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="h-8 w-px bg-emerald-600/40"></div>
              <div>
                <span className="text-emerald-300 block">Daily Sunshine:</span>
                <span className="font-bold text-white text-base">~{currentState.sunHours} Peak Hours</span>
              </div>
            </div>
          </div>

          {currentState.stateSubsidyNote && (
            <div className="mt-3 text-xs bg-emerald-900/60 text-emerald-200 px-3 py-1.5 rounded-lg border border-emerald-500/30">
              💡 <span className="font-medium text-emerald-100">{currentState.stateSubsidyNote}</span>
            </div>
          )}
        </div>

        {/* Input Method Selector Tabs */}
        <div className="p-4 sm:p-8 bg-slate-50/70 border-b border-slate-200">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-3">
            Choose Calculation Method:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setInputMode('bill')}
              className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-semibold text-xs sm:text-sm transition-all ${
                inputMode === 'bill'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <IndianRupee className="w-4 h-4" />
              <span>Monthly Bill (₹)</span>
            </button>

            <button
              type="button"
              onClick={() => setInputMode('capacity')}
              className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-semibold text-xs sm:text-sm transition-all ${
                inputMode === 'capacity'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Sun className="w-4 h-4" />
              <span>System Size (kW)</span>
            </button>

            <button
              type="button"
              onClick={() => setInputMode('units')}
              className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-semibold text-xs sm:text-sm transition-all ${
                inputMode === 'units'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>Units Consumed</span>
            </button>

            <button
              type="button"
              onClick={() => setInputMode('area')}
              className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-semibold text-xs sm:text-sm transition-all ${
                inputMode === 'area'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Roof Area (sq ft)</span>
            </button>
          </div>

          {/* Slider Inputs based on selected mode */}
          <div className="mt-6 pt-6 border-t border-slate-200/60">
            {inputMode === 'bill' && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="monthly-bill-slider" className="text-sm font-medium text-slate-700">Average Monthly Electricity Bill:</label>
                  <span className="text-2xl font-bold text-emerald-700">₹{monthlyBill.toLocaleString('en-IN')}</span>
                </div>
                <input
                  id="monthly-bill-slider"
                  aria-label="Average Monthly Electricity Bill in Rupees"
                  type="range"
                  min="500"
                  max="15000"
                  step="250"
                  value={monthlyBill}
                  onChange={(e) => setMonthlyBill(Number(e.target.value))}
                  className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 touch-pan-y"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1.5 font-medium">
                  <span>₹500 / month</span>
                  <span>₹5,000 / month</span>
                  <span>₹10,000 / month</span>
                  <span>₹15,000+ / month</span>
                </div>
                {/* Quick select buttons */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {[1200, 2000, 3000, 4500, 6000, 8500].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setMonthlyBill(val)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                        monthlyBill === val ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-semibold' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      ₹{val}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {inputMode === 'capacity' && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="capacity-slider" className="text-sm font-medium text-slate-700">Desired Solar Plant Capacity:</label>
                  <span className="text-2xl font-bold text-emerald-700">{capacity} kW</span>
                </div>
                <input
                  id="capacity-slider"
                  aria-label="Desired Solar Plant Capacity in Kilowatts"
                  type="range"
                  min="1"
                  max="10"
                  step="0.5"
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 touch-pan-y"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1.5 font-medium">
                  <span>1 kW (Small Home)</span>
                  <span>3 kW (Most Popular)</span>
                  <span>5 kW (ACs / 3BHK)</span>
                  <span>10 kW (Commercial)</span>
                </div>
                {/* Quick preset buttons */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {[1, 2, 3, 4, 5, 6, 8, 10].map(kw => (
                    <button
                      key={kw}
                      type="button"
                      onClick={() => {
                        setCapacity(kw);
                        if (kw >= 3) triggerCelebration();
                      }}
                      className={`text-xs px-3 py-1 rounded-lg border transition-all cursor-pointer ${
                        capacity === kw ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-semibold' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {kw} kW {kw === 3 && '🔥 (₹78k Subsidy)'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {inputMode === 'units' && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="monthly-units-slider" className="text-sm font-medium text-slate-700">Monthly Power Consumption:</label>
                  <span className="text-2xl font-bold text-emerald-700">{monthlyUnits} Units (kWh)</span>
                </div>
                <input
                  id="monthly-units-slider"
                  aria-label="Monthly Electricity Units Consumed in Kilowatt Hours"
                  type="range"
                  min="50"
                  max="1500"
                  step="25"
                  value={monthlyUnits}
                  onChange={(e) => setMonthlyUnits(Number(e.target.value))}
                  className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 touch-pan-y"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1.5 font-medium">
                  <span>50 units</span>
                  <span>300 units (PM Free Cap)</span>
                  <span>700 units</span>
                  <span>1500+ units</span>
                </div>
              </div>
            )}

            {inputMode === 'area' && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="roof-area-slider" className="text-sm font-medium text-slate-700">Available Shadow-Free Rooftop Area:</label>
                  <span className="text-2xl font-bold text-emerald-700">{roofArea} sq. ft.</span>
                </div>
                <input
                  id="roof-area-slider"
                  aria-label="Available Shadow Free Rooftop Area in Square Feet"
                  type="range"
                  min="100"
                  max="1500"
                  step="50"
                  value={roofArea}
                  onChange={(e) => setRoofArea(Number(e.target.value))}
                  className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 touch-pan-y"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1.5 font-medium">
                  <span>100 sq ft (~1kW)</span>
                  <span>300 sq ft (~3kW)</span>
                  <span>600 sq ft (~6kW)</span>
                  <span>1000+ sq ft</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Dashboard Grid */}
        <div className="p-4 sm:p-8">
          
          {/* Top 3 High-Impact Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
            
            {/* Card 1: System Size */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/80 rounded-2xl p-5 relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Recommended Plant</span>
                <span className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                  <Sun className="w-5 h-5" />
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-1">
                {metrics.systemSizeKw} kW
              </div>
              <p className="text-xs text-slate-600">
                Requires <strong className="text-slate-800 font-semibold">{metrics.roofAreaSqFt} sq. ft.</strong> of shadow-free roof. Generates ~{metrics.monthlyGenerationUnits} units/month.
              </p>
            </div>

            {/* Card 2: Subsidy Amount */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl p-5 relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">Govt. Cash Subsidy</span>
                <span className="p-2 bg-amber-100 text-amber-700 rounded-xl">
                  <BadgePercent className="w-5 h-5" />
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-600 mb-1">
                ₹{metrics.totalSubsidy.toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-slate-600">
                Direct Bank Transfer (DBT) credited straight to your bank account via PM Surya Ghar portal.
              </p>
            </div>

            {/* Card 3: Net Cost & Savings */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl p-5 relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">Net Out-of-Pocket</span>
                <span className="p-2 bg-blue-100 text-blue-700 rounded-xl">
                  <IndianRupee className="w-5 h-5" />
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-blue-800 mb-1">
                ₹{metrics.netCostToUser.toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-slate-600">
                Original Cost: ₹{metrics.totalCostBeforeSubsidy.toLocaleString('en-IN')}. Recovers cost in <strong className="text-blue-900 font-semibold">{metrics.paybackPeriodYears} Years</strong>!
              </p>
            </div>

          </div>

          {/* Detailed Financial Breakdown Table */}
          <div className="bg-slate-50 rounded-2xl p-4 sm:p-6 border border-slate-200 mb-8">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <span>Full Financial & Energy Feasibility Breakdown</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-white p-4 rounded-xl border border-slate-200/70 shadow-sm">
                <span className="text-xs text-slate-500 block mb-1">Monthly Bill Savings</span>
                <span className="text-xl font-bold text-emerald-600">
                  ₹{metrics.monthlySavingsRs.toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">~₹{metrics.annualSavingsRs.toLocaleString('en-IN')} / year</span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200/70 shadow-sm">
                <span className="text-xs text-slate-500 block mb-1">Payback Period</span>
                <span className="text-xl font-bold text-indigo-700">
                  {metrics.paybackPeriodYears} Years
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">Then 21+ yrs 100% free power</span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200/70 shadow-sm">
                <span className="text-xs text-slate-500 block mb-1">25-Yr Net Savings</span>
                <span className="text-xl font-bold text-amber-700">
                  ₹{metrics.lifetimeSavings25Years.toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">With 3% annual tariff inflation</span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200/70 shadow-sm">
                <span className="text-xs text-slate-500 block mb-1">5-Yr Solar Loan EMI</span>
                <span className="text-xl font-bold text-slate-900">
                  ₹{metrics.monthlyLoanEmi5Yr.toLocaleString('en-IN')}<span className="text-xs text-slate-500 font-normal">/mo</span>
                </span>
                <span className="text-[11px] text-emerald-600 font-medium block mt-0.5">Less than your current bill!</span>
              </div>

            </div>

            {/* Environmental Impact Banner */}
            <div className="mt-4 p-3.5 bg-emerald-100/60 rounded-xl border border-emerald-300/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-emerald-950">
              <div className="flex items-center gap-2">
                <TreePine className="w-5 h-5 text-emerald-700 shrink-0" />
                <span>
                  <strong>Green Impact:</strong> Avoids <strong>{metrics.co2SavedTonnesPerYear} Tonnes</strong> of $CO_2$ every year — equivalent to planting <strong>~{metrics.treesEquivalent} trees</strong>!
                </span>
              </div>
              <span className="font-semibold text-emerald-800 bg-white/80 px-2.5 py-1 rounded-lg shrink-0">
                🌱 100% Eco-Friendly
              </span>
            </div>

          </div>

          {/* Action Buttons: PDF, WhatsApp, and Quote */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 border-t border-slate-200">
            
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isExportingPdf}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 px-6 rounded-xl shadow-md shadow-emerald-600/20 transition-all text-sm cursor-pointer disabled:opacity-50"
            >
              <FileDown className="w-4 h-4" />
              <span>{isExportingPdf ? 'Generating PDF...' : 'Download Free Solar Report (PDF)'}</span>
            </button>

            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold py-3.5 px-6 rounded-xl shadow-md transition-all text-sm cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Share on WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={() => setShowLeadModal(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3.5 px-6 rounded-xl shadow-md shadow-amber-500/20 transition-all text-sm cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 text-slate-950" />
              <span>Get 3 Free Installer Quotes</span>
            </button>

          </div>

        </div>

      </div>

      {/* Quote / Lead Modal */}
      {showLeadModal && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lead-modal-title"
        >
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              type="button"
              aria-label="Close quote modal"
              onClick={() => setShowLeadModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              ✕
            </button>

            {!leadSubmitted ? (
              <div>
                <div className="text-center mb-5">
                  <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
                    <Sun className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <h3 id="lead-modal-title" className="text-xl font-bold text-slate-900 font-display">Get 3 Free Solar Quotes</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Connect with MNRE registered, verified rooftop solar installers in {currentState.name}.
                  </p>
                </div>

                {/* Calculation Summary Pill in Quote Modal */}
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200/80 mb-4 text-xs text-emerald-950 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">{metrics.systemSizeKw} kW Rooftop System</span>
                    <span className="text-emerald-700">₹{metrics.totalSubsidy.toLocaleString('en-IN')} Govt Subsidy ({currentState.name})</span>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-emerald-800 text-sm block">~₹{metrics.monthlySavingsRs.toLocaleString('en-IN')}</span>
                    <span className="text-[10px] text-slate-500">monthly save</span>
                  </div>
                </div>

                <form onSubmit={handleLeadSubmit} className="space-y-3.5">
                  <div>
                    <label htmlFor="lead-name-input" className="text-xs font-semibold text-slate-700 block mb-1">Your Full Name</label>
                    <input
                      id="lead-name-input"
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={leadForm.name}
                      onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="lead-phone-input" className="text-xs font-semibold text-slate-700 block mb-1">10-Digit Mobile Number (For Quotes)</label>
                    <input
                      id="lead-phone-input"
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="e.g. 9876543210"
                      value={leadForm.phone}
                      onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value.replace(/\D/g, '') })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="lead-city-input" className="text-xs font-semibold text-slate-700 block mb-1">City / Town</label>
                      <input
                        id="lead-city-input"
                        type="text"
                        required
                        placeholder="e.g. Kolkata / Pune"
                        value={leadForm.city}
                        onChange={(e) => setLeadForm({ ...leadForm, city: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="lead-pincode-input" className="text-xs font-semibold text-slate-700 block mb-1">Pincode</label>
                      <input
                        id="lead-pincode-input"
                        type="text"
                        required
                        maxLength={6}
                        placeholder="e.g. 700001"
                        value={leadForm.pincode}
                        onChange={(e) => setLeadForm({ ...leadForm, pincode: e.target.value.replace(/\D/g, '') })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500 border border-slate-200">
                    🔒 <strong>100% Spam-Free:</strong> Your information is only shared with verified local installers to provide competitive quotes. Zero unwanted telemarketing.
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingLead}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isSubmittingLead ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        <span>Connecting Verified Installers...</span>
                      </>
                    ) : (
                      <span>Submit & Compare Quotes Free</span>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              <div className="text-center py-6">
                <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-slate-900 mb-1">Thank You, {leadForm.name}!</h3>
                <p className="text-xs text-slate-600 mb-4 max-w-xs mx-auto">
                  Your feasibility details for a <strong>{metrics.systemSizeKw} kW setup</strong> in {leadForm.city || currentState.name} have been noted. Verified local solar partners will contact you shortly with transparent quotes.
                </p>
                <button
                  type="button"
                  aria-label="Close modal"
                  onClick={() => { setShowLeadModal(false); setLeadSubmitted(false); }}
                  className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs"
                >
                  Close
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Trust & Guarantee Pill Strip */}
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="text-xs font-semibold text-slate-700">Official Subsidy Slabs</span>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-center gap-2">
          <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="text-xs font-semibold text-slate-700">25-Year Performance</span>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-center gap-2">
          <BadgePercent className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="text-xs font-semibold text-slate-700">7.0% Collateral-Free Loan</span>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-center gap-2">
          <FileDown className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="text-xs font-semibold text-slate-700">Instant PDF Download</span>
        </div>
      </div>

    </div>
  );
}
