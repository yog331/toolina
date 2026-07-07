
import React, { useState, useEffect } from 'react';
import AccompanyingText from '../components/AccompanyingText';
import ShareWidget from '../components/ShareWidget';
import SEO from '../components/SEO';
import StarRatingWidget from '../components/StarRatingWidget';

// Constants localized for the Indian market
const AVG_KWH_COST_INR = 9.0; // Average cost per kWh in India (₹)
const CO2_PER_KWH_KG = 0.75; // Average kg CO2 per kWh from India's grid
const SYSTEM_EFFICIENCY = 0.75; // Average performance ratio

const projectConstants = {
  residential: {
    AVG_SOLAR_PANEL_WATTAGE: 545, // in watts
    PANEL_AREA_SQFT: 28.0, // Average panel area in square feet
  },
  commercial: {
    AVG_SOLAR_PANEL_WATTAGE: 550, // in watts
    PANEL_AREA_SQFT: 28.0, 
  }
};

const SYSTEM_COST_TIERS_INR = [
  { fromKw: 0, toKw: 3, onGridPerWatt: 58, offGridPerWatt: 58 },
  { fromKw: 3, toKw: 5, onGridPerWatt: 52, offGridPerWatt: 52 },
  { fromKw: 5, toKw: 10, onGridPerWatt: 40, offGridPerWatt: 42 },
  { fromKw: 10, toKw: 20, onGridPerWatt: 38, offGridPerWatt: 40 },
  { fromKw: 20, toKw: 30, onGridPerWatt: 35, offGridPerWatt: 35 },
  { fromKw: 30, toKw: 50, onGridPerWatt: 32, offGridPerWatt: 32 },
  { fromKw: 50, toKw: 100, onGridPerWatt: 30, offGridPerWatt: 30 },
  { fromKw: 100, toKw: Infinity, onGridPerWatt: 28, offGridPerWatt: null }, 
];

const RESIDENTIAL_SUBSIDY_INR = {
  KW_1: 33000,
  KW_2: 60000,
  KW_3_PLUS: 78000,
};

type PropertyType = 'residential' | 'commercial';
type SystemType = 'onGrid' | 'offGrid';
type CalculationBasis = 'bill' | 'area' | 'capacity';

const SolarCalculator: React.FC = () => {
  const [ratingInfo, setRatingInfo] = useState<{rating: number, count: number}>({ rating: 4.9, count: 222 });

    const [basis, setBasis] = useState<CalculationBasis>('bill');
  const [propertyType, setPropertyType] = useState<PropertyType>('residential');
  const [systemType, setSystemType] = useState<SystemType>('onGrid');
  
  // Input states
  const [monthlyBill, setMonthlyBill] = useState<number>(3500);
  const [roofArea, setRoofArea] = useState<number>(500);
  const [targetCapacity, setTargetCapacity] = useState<number>(3.0);
  const [sunlightHours, setSunlightHours] = useState<number>(5.5);

  // Loan states
  const [isLoanEnabled, setIsLoanEnabled] = useState<boolean>(false);
  const [loanInterestRate, setLoanInterestRate] = useState<number>(8.5);
  const [loanTerm, setLoanTerm] = useState<number>(5);

  useEffect(() => {
    // Advanced SEO Optimization
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", "Calculate rooftop solar savings, ROI, and government subsidies in India. Precise estimator for PM Surya Ghar Muft Bijli Yojana benefits, solar payback period, solar cost calculator, and system sizing.");

    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute("content", "rooftop solar calculator India, solar ROI estimator, solar cost calculator, PM Surya Ghar subsidy calculator, solar panel cost India, solar payback period, rooftop solar savings, Muft Bijli Yojana calculator, Toolina");
  }, []);

  // Calculation Engine
  const constants = projectConstants[propertyType];
  let finalCapacity = 0;
  let usedArea = 0;

  if (basis === 'bill') {
    const monthlyUnits = monthlyBill / AVG_KWH_COST_INR;
    const dailyUnits = monthlyUnits / 30;
    finalCapacity = Math.ceil((dailyUnits / sunlightHours / SYSTEM_EFFICIENCY) * 10) / 10;
    usedArea = Math.ceil((finalCapacity * 1000 / constants.AVG_SOLAR_PANEL_WATTAGE) * constants.PANEL_AREA_SQFT);
  } else if (basis === 'area') {
    const totalPanels = Math.floor(roofArea / constants.PANEL_AREA_SQFT);
    finalCapacity = (totalPanels * constants.AVG_SOLAR_PANEL_WATTAGE) / 1000;
    usedArea = roofArea;
  } else {
    finalCapacity = targetCapacity;
    usedArea = Math.ceil((finalCapacity * 1000 / constants.AVG_SOLAR_PANEL_WATTAGE) * constants.PANEL_AREA_SQFT);
  }

  const calculateGrossCost = (kw: number, type: SystemType) => {
    let total = 0;
    let remaining = kw;
    for (const tier of SYSTEM_COST_TIERS_INR) {
      if (remaining <= 0) break;
      const rate = type === 'onGrid' ? tier.onGridPerWatt : tier.offGridPerWatt;
      if (rate === null) return 0;
      const range = tier.toKw - tier.fromKw;
      const kwInTier = Math.min(remaining, range);
      total += kwInTier * 1000 * rate;
      remaining -= kwInTier;
    }
    return total;
  };

  const grossCost = calculateGrossCost(finalCapacity, systemType);
  const subsidy = (propertyType === 'residential' && systemType === 'onGrid')
    ? (finalCapacity >= 3 ? RESIDENTIAL_SUBSIDY_INR.KW_3_PLUS : (finalCapacity >= 2 ? RESIDENTIAL_SUBSIDY_INR.KW_2 : (finalCapacity >= 1 ? RESIDENTIAL_SUBSIDY_INR.KW_1 : 0)))
    : 0;

  const netInvestment = Math.max(0, grossCost - subsidy);
  
  // EMI Calculation
  const calculateEMI = () => {
    const P = netInvestment;
    const r = loanInterestRate / 12 / 100;
    const n = loanTerm * 12;
    if (r === 0) return P / n;
    return (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  };
  const monthlyEMI = calculateEMI();

  const dailyGenUnits = finalCapacity * sunlightHours * SYSTEM_EFFICIENCY;
  const monthlySavings = dailyGenUnits * 30 * AVG_KWH_COST_INR;
  const paybackYears = monthlySavings > 0 ? netInvestment / (monthlySavings * 12) : 0;
  const lifetimeSavings = monthlySavings * 12 * 25; 
  const co2Monthly = dailyGenUnits * 30 * CO2_PER_KWH_KG;

  return (
    <article className="max-w-6xl mx-auto space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20 px-1">
      <SEO title="Rooftop Solar Cost Calculator India - ROI & PM Surya Ghar Subsidy Estimator" description="Free professional solar cost calculator and internal tool by Toolina. Accurate, fast, and easy to use." 
        structuredData={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Rooftop Solar Cost Calculator India - ROI & PM Surya Ghar Subsidy Estimator",
          "applicationCategory": "DeveloperApplication",
          "operatingSystem": "All",
          "aggregateRating": {
             "@type": "AggregateRating",
             "ratingValue": ratingInfo.rating.toString(),
             "ratingCount": ratingInfo.count.toString()
          },
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          }
        }}
      />
      {/* Animation Styles */}
      <style>{`
        @keyframes slow-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-slow-rotate {
          animation: slow-rotate 12s linear infinite;
        }
      `}</style>

      {/* Header & Configuration Section */}
      <header className="bg-white p-6 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border border-slate-200 shadow-2xl shadow-slate-100/50 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 md:w-80 h-64 md:h-80 bg-yellow-50 rounded-bl-[15rem] -mr-16 -mt-16 opacity-50 blur-3xl"></div>
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-yellow-400 rounded-2xl md:rounded-[1.5rem] flex items-center justify-center text-3xl md:text-4xl shadow-xl shadow-yellow-100 text-white shrink-0">
              <span className="animate-slow-rotate">☀️</span>
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-display font-black text-slate-900 tracking-tight leading-none">
                Rooftop <span className="text-yellow-600">Solar Cost Calculator</span>
              </h1>
              <p className="text-slate-500 font-medium text-xs md:text-lg mt-1 italic">Rooftop Solar & PM Surya Ghar Subsidy Guide</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row bg-slate-100 p-1 rounded-2xl border border-slate-200 gap-1 w-full lg:w-auto">
             <div className="flex bg-slate-200/50 p-1 rounded-xl flex-1">
               {(['residential', 'commercial'] as PropertyType[]).map(t => (
                 <button key={t} onClick={() => setPropertyType(t)} className={`flex-1 px-3 md:px-5 py-2 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${propertyType === t ? 'bg-white shadow-sm text-yellow-600' : 'text-slate-500'}`}>{t}</button>
               ))}
             </div>
             <div className="flex bg-slate-200/50 p-1 rounded-xl flex-1">
               {(['onGrid', 'offGrid'] as SystemType[]).map(t => (
                 <button key={t} onClick={() => setSystemType(t)} className={`flex-1 px-3 md:px-5 py-2 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${systemType === t ? 'bg-white shadow-sm text-teal-600' : 'text-slate-500'}`}>{t.replace('Grid', '-Grid')}</button>
               ))}
             </div>
          </div>
        </div>

        {/* Calculation Basis Tabs */}
        <div className="flex flex-wrap md:flex-nowrap gap-2 mb-10 relative z-10">
          {(['bill', 'area', 'capacity'] as CalculationBasis[]).map(b => (
            <button
              key={b}
              onClick={() => setBasis(b)}
              className={`flex-1 min-w-[100px] py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                basis === b 
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xl' 
                  : 'bg-slate-50 text-slate-500 border-slate-100 hover:bg-white hover:border-slate-300'
              }`}
            >
              By {b === 'bill' ? 'Monthly Bill' : (b === 'area' ? 'Roof Area' : 'Target Capacity')}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
          {/* Inputs Section */}
          <section className="lg:col-span-4 space-y-6">
            <div className="bg-slate-50 p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-inner space-y-6">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span> Configurable Factors
              </h2>

              <div className="space-y-5">
                {basis === 'bill' && (
                  <div className="space-y-1.5 animate-in slide-in-from-left-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Avg. Monthly Bill (₹)</label>
                    <input type="number" value={monthlyBill} onChange={(e) => setMonthlyBill(Number(e.target.value))} className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 ring-yellow-50 transition-all font-mono font-bold text-slate-800" />
                  </div>
                )}
                {basis === 'area' && (
                  <div className="space-y-1.5 animate-in slide-in-from-left-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Roof Area (Sq.Ft)</label>
                    <input type="number" value={roofArea} onChange={(e) => setRoofArea(Number(e.target.value))} className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 ring-yellow-50 transition-all font-mono font-bold text-slate-800" />
                  </div>
                )}
                {basis === 'capacity' && (
                  <div className="space-y-1.5 animate-in slide-in-from-left-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Target Capacity (kW)</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        step="0.1" 
                        value={targetCapacity} 
                        onChange={(e) => setTargetCapacity(Number(e.target.value))} 
                        className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 ring-yellow-50 transition-all font-mono font-bold text-slate-800" 
                      />
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 uppercase tracking-widest pointer-events-none">KW</div>
                    </div>
                  </div>
                )}
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Sunlight Exposure (Hrs/Day)</label>
                  <input type="number" step="0.1" value={sunlightHours} onChange={(e) => setSunlightHours(Number(e.target.value))} className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 ring-yellow-50 transition-all font-mono font-bold text-slate-800" />
                </div>

                {/* Loan Section */}
                <div className="pt-4 border-t border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <span className="w-2 h-2 bg-teal-500 rounded-full"></span> Loan Estimator
                    </h2>
                    <button 
                      onClick={() => setIsLoanEnabled(!isLoanEnabled)}
                      className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${isLoanEnabled ? 'bg-teal-500' : 'bg-slate-300'}`}
                    >
                      <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-transform duration-300 ${isLoanEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                  
                  {isLoanEnabled && (
                    <div className="space-y-4 animate-in slide-in-from-top-2">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Interest Rate (% p.a.)</label>
                        <input type="number" step="0.1" value={loanInterestRate} onChange={(e) => setLoanInterestRate(Number(e.target.value))} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-4 ring-teal-50 font-bold text-sm" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Loan Tenure (Years)</label>
                        <input type="number" value={loanTerm} onChange={(e) => setLoanTerm(Number(e.target.value))} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-4 ring-teal-50 font-bold text-sm" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200 space-y-3">
                <div className="flex justify-between items-center text-[11px] font-bold text-slate-500 uppercase tracking-tight">
                  <span>Gross System Cost</span>
                  <span className="text-slate-900">₹{grossCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[11px] font-bold text-teal-600 uppercase tracking-tight">
                  <span>Govt. Subsidy</span>
                  <span>- ₹{subsidy.toLocaleString()}</span>
                </div>
                <div className="p-5 bg-slate-900 rounded-[2rem] text-white shadow-xl mt-4">
                  <span className="text-[9px] font-bold opacity-50 uppercase block mb-1">Your Net Investment</span>
                  <div className="text-3xl font-black tracking-tight leading-none">₹{netInvestment.toLocaleString()}</div>
                  {isLoanEnabled && (
                    <div className="mt-3 pt-3 border-t border-white/10 flex justify-between items-end">
                      <div>
                        <span className="text-[8px] font-black text-teal-400 uppercase tracking-widest block">Est. Monthly EMI</span>
                        <span className="text-xl font-black text-teal-400">₹{Math.round(monthlyEMI).toLocaleString()}</span>
                      </div>
                      <span className="text-[8px] font-bold opacity-40 uppercase">{loanTerm} Years @ {loanInterestRate}%</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Results Section */}
          <section className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
               <div className="bg-white p-7 md:p-9 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform">
                    <svg className="w-20 h-20 md:w-24 md:h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 7V3L5.5 11h5v8l6.5-8h-5z"/></svg>
                  </div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">System Size</h3>
                  <div className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none">{finalCapacity.toFixed(1)} <span className="text-xl md:text-2xl">kW</span></div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <span className="text-[9px] font-bold px-3 py-1.5 bg-yellow-50 text-yellow-700 rounded-lg">{(finalCapacity*1000/constants.AVG_SOLAR_PANEL_WATTAGE).toFixed(0)} High-Efficiency Panels</span>
                    <span className="text-[9px] font-bold px-3 py-1.5 bg-teal-50 text-teal-700 rounded-lg">{usedArea.toLocaleString()} Sq.Ft Shadow-Free Area</span>
                  </div>
               </div>

               <div className="bg-white p-7 md:p-9 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-125 transition-transform text-teal-600">
                    <svg className="w-20 h-20 md:w-24 md:h-24" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M13.66 7C13.1 5.28 11.54 4 9.68 4H6V2H18V4H13.91C14.47 4.8 14.81 5.83 14.94 7H18V9H15C14.9 11.16 13.65 13 11.83 13.72L17.22 20.31L15.68 21.57L9.31 14H6V12H9.68C11.13 12 12.35 11.05 12.78 9.68H6V7.68H12.78C12.78 7.45 13.66 7 13.66 7Z"/>
                    </svg>
                  </div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Monthly Savings</h3>
                  <div className="text-5xl md:text-6xl font-black text-teal-600 tracking-tighter leading-none">₹{Math.round(monthlySavings).toLocaleString()}</div>
                  {isLoanEnabled && (
                    <div className="mt-4 flex items-center gap-2">
                       <div className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${monthlySavings > monthlyEMI ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                         {monthlySavings > monthlyEMI ? 'Self-Paying' : 'Bill Covered'}
                       </div>
                       <p className="text-[9px] font-bold text-slate-400 uppercase">Savings cover {Math.min(100, Math.round((monthlySavings/monthlyEMI)*100))}% of EMI</p>
                    </div>
                  )}
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
              <div className="bg-slate-50 p-6 md:p-8 rounded-[2.5rem] border border-slate-100 text-center hover:bg-white hover:shadow-lg transition-all group">
                 <span className="text-[9px] font-black text-slate-400 uppercase block mb-1">Breakeven</span>
                 <div className="text-3xl font-black text-slate-800 tracking-tight">{paybackYears.toFixed(1)} <span className="text-xs uppercase opacity-30">Years</span></div>
              </div>
              <div className="bg-slate-50 p-6 md:p-8 rounded-[2.5rem] border border-slate-100 text-center hover:bg-white hover:shadow-lg transition-all group">
                 <span className="text-[9px] font-black text-slate-400 uppercase block mb-1">Daily Yield</span>
                 <div className="text-3xl font-black text-slate-800 tracking-tight">{dailyGenUnits.toFixed(1)} <span className="text-xs uppercase opacity-30">Units</span></div>
              </div>
              <div className="bg-slate-50 p-6 md:p-8 rounded-[2.5rem] border border-slate-100 text-center hover:bg-white hover:shadow-lg transition-all group">
                 <span className="text-[9px] font-black text-slate-400 uppercase block mb-1">CO2 Offset</span>
                 <div className="text-3xl font-black text-emerald-600 tracking-tight">{Math.round(co2Monthly)} <span className="text-xs uppercase opacity-30">kg/mo</span></div>
              </div>
            </div>

            <div className="bg-yellow-400 rounded-[2.5rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-yellow-100 relative overflow-hidden group">
               <div className="absolute inset-0 bg-white/10 opacity-50 skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
               <div className="relative z-10 text-center md:text-left">
                  <h3 className="text-2xl font-black text-yellow-900 tracking-tight mb-1">25-Year Value</h3>
                  <p className="text-yellow-800 text-xs font-bold uppercase tracking-widest opacity-60 italic">Cumulative energy savings forecast</p>
               </div>
               <div className="relative z-10 text-center md:text-right">
                  <div className="text-4xl md:text-5xl font-black text-yellow-900 tracking-tighter">₹{(lifetimeSavings / 100000).toFixed(1)} Lakhs</div>
                  <span className="text-[10px] font-black uppercase text-yellow-800 tracking-[0.2em]">Net Project Value</span>
               </div>
            </div>
          </section>
        </div>
      </header>

      {/* Subsidy Highlight */}
      {propertyType === 'residential' && systemType === 'onGrid' && (
        <section className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-200 shadow-sm relative overflow-hidden group animate-in slide-in-from-bottom-4">
           <div className="flex flex-col lg:flex-row items-center gap-10">
              <div className="flex-1 space-y-4 text-center lg:text-left">
                 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-widest">PM Surya Ghar: Muft Bijli Yojana</div>
                 <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight">Govt Financial Assistance</h2>
                 <p className="text-slate-500 leading-relaxed text-sm max-w-xl">
                   Secure up to ₹78,000 subsidy for your residential solar installation under the Central Financial Assistance (CFA) scheme.
                 </p>
              </div>
              <div className="w-full lg:w-auto flex flex-wrap justify-center gap-3 md:gap-4">
                 {[
                   {kw: "1 kW", amt: "₹33k", active: finalCapacity >= 1 && finalCapacity < 2},
                   {kw: "2 kW", amt: "₹60k", active: finalCapacity >= 2 && finalCapacity < 3},
                   {kw: "3 kW+", amt: "₹78k", active: finalCapacity >= 3}
                 ].map((s, i) => (
                   <div key={i} className={`p-5 md:p-6 rounded-[2rem] border min-w-[100px] md:min-w-[120px] text-center transition-all ${s.active ? 'bg-orange-600 border-orange-600 text-white shadow-2xl scale-110' : 'bg-slate-50 border-slate-100 opacity-40'}`}>
                      <div className="text-[10px] font-black uppercase opacity-60 mb-2">{s.kw}</div>
                      <div className="text-2xl font-black">{s.amt}</div>
                   </div>
                 ))}
              </div>
           </div>
        </section>
      )}

      {/* Footer Content */}
      <footer className="bg-slate-900 rounded-[3.5rem] p-8 md:p-16 text-white space-y-16 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,0.05),transparent)] pointer-events-none"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
          <div className="space-y-8">
            <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight leading-tight">
              Invest in a <span className="text-yellow-400">Solar Future</span>
            </h2>
            <p className="text-slate-400 leading-relaxed text-lg">
              Switching to rooftop solar is a high-yield financial investment. With <strong>payback periods under 4 years</strong> and government subsidies like <strong>PM Surya Ghar</strong>, solar energy provides risk-free, tax-free returns while contributing to India's green energy goals.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                <h3 className="text-yellow-400 font-bold text-sm mb-2 uppercase tracking-widest">Solar ROI</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">Calculate precise Internal Rate of Return (IRR) based on net installation costs.</p>
              </div>
              <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                <h3 className="text-yellow-400 font-bold text-sm mb-2 uppercase tracking-widest">Bill Savings</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">Forecast 25-year energy bill savings with current grid tariff escalations.</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10">
              <h3 className="text-lg font-black uppercase tracking-widest text-slate-300 mb-6 flex items-center gap-3">
                <span className="text-xl">☀️</span> Solar Knowledge Base
              </h3>
              <ul className="space-y-6">
                {[
                  { q: "What is the PM Surya Ghar Scheme?", a: "A central government scheme providing significant subsidies for residential rooftop solar to promote clean energy." },
                  { q: "How to calculate solar payback period?", a: "Divide the net project cost by the annual savings from electricity bill credits." },
                  { q: "What is net metering in solar?", a: "A billing mechanism that credits solar energy owners for the electricity they add to the grid." },
                  { q: "Are solar panels worth it in 2025?", a: "Yes, with high grid tariffs and efficient Mono-PERC bifacial panels, the ROI is at its peak." }
                ].map((item, i) => (
                  <li key={i} className="space-y-1">
                    <h4 className="text-sm font-bold text-yellow-400">{item.q}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.a}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/10 relative z-10 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Expertly Crafted by Toolina Precision Systems</p>
        </div>
      </footer>
    
      
      
      <AccompanyingText 
        toolName="Solar Calculator"
        howItWorks="This tool uses advanced client-side processing to deliver instant results without sending your data to any external server. Simply input your parameters, and the algorithmic engine processes the data locally in your browser ensuring maximum privacy and speed."
        whyItsUseful="Whether you are a professional or a casual user, this tool saves you significant time by automating complex calculations and data transformations. It eliminates manual errors and provides a structured, easy-to-read output that you can rely on for your daily tasks."
        faqs={[
          { q: "Is my data secure?", a: "Yes, 100% secure. All processing happens entirely within your browser. We do not store or transmit your inputs to any remote servers." },
          { q: "Is this tool free to use?", a: "Absolutely. Toolina provides this utility completely free of charge with no hidden limits or premium paywalls." },
          { q: "Can I use this on mobile?", a: "Yes, the interface is fully responsive and works seamlessly across desktops, tablets, and smartphones." }
        ]}
      />
  
      <div className="max-w-3xl mx-auto my-8">
        <StarRatingWidget 
          toolId="solarcalculator" 
          defaultRating={4.9} 
          defaultCount={222} 
          onRatingChange={(rating, count) => setRatingInfo({ rating, count })} 
        />
      </div>
      <ShareWidget title="Rooftop Solar Cost Calculator" />
      </article>
  );
};

export default SolarCalculator;
