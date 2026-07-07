
import React, { useState, useEffect, useMemo } from 'react';
import AccompanyingText from '../components/AccompanyingText';
import ShareWidget from '../components/ShareWidget';
import SEO from '../components/SEO';
import StarRatingWidget from '../components/StarRatingWidget';

interface TaxResult {
  grossIncome: number;
  stdDeduction: number;
  exemptions: number;
  taxableIncome: number;
  taxBeforeRebate: number;
  rebate87A: number;
  taxAfterRebate: number;
  surcharge: number;
  cess: number;
  totalTax: number;
  takeHome: number;
  effectiveRate: number;
}

type FinancialYear = '2024-25' | '2025-26';

const IncomeTaxCalculator: React.FC = () => {
  const [ratingInfo, setRatingInfo] = useState<{rating: number, count: number}>({ rating: 4.6, count: 287 });

    const [financialYear, setFinancialYear] = useState<FinancialYear>('2024-25');
  const [grossSalary, setGrossSalary] = useState<number>(1200000);
  const [otherIncome, setOtherIncome] = useState<number>(0);
  const [investment80C, setInvestment80C] = useState<number>(150000);
  const [hraExemption, setHraExemption] = useState<number>(50000);
  const [otherExemptions, setOtherExemptions] = useState<number>(0);

  useEffect(() => {
  }, [financialYear]);

  const calculateSurcharge = (tax: number, totalIncome: number, isNewRegime: boolean) => {
    if (totalIncome <= 5000000) return 0;
    if (totalIncome <= 10000000) return tax * 0.10;
    if (totalIncome <= 20000000) return tax * 0.15;
    // New regime caps surcharge at 15% even above 2Cr
    if (isNewRegime) return tax * 0.15;
    if (totalIncome <= 50000000) return tax * 0.25;
    return tax * 0.37;
  };

  const calculateOldRegime = (): TaxResult => {
    const totalGross = grossSalary + otherIncome;
    const stdDeduction = 50000;
    const exemptions = Math.min(investment80C, 150000) + hraExemption + otherExemptions;
    const taxableIncome = Math.max(0, totalGross - stdDeduction - exemptions);

    let tax = 0;
    if (taxableIncome <= 250000) tax = 0;
    else if (taxableIncome <= 500000) tax = (taxableIncome - 250000) * 0.05;
    else if (taxableIncome <= 1000000) tax = 12500 + (taxableIncome - 500000) * 0.20;
    else tax = 112500 + (taxableIncome - 1000000) * 0.30;

    const rebate87A = taxableIncome <= 500000 ? tax : 0;
    const taxAfterRebate = tax - rebate87A;
    const surcharge = calculateSurcharge(taxAfterRebate, taxableIncome, false);
    const cess = (taxAfterRebate + surcharge) * 0.04;
    const totalTax = taxAfterRebate + surcharge + cess;

    return {
      grossIncome: totalGross,
      stdDeduction,
      exemptions,
      taxableIncome,
      taxBeforeRebate: tax,
      rebate87A,
      taxAfterRebate,
      surcharge,
      cess,
      totalTax,
      takeHome: totalGross - totalTax,
      effectiveRate: totalGross > 0 ? (totalTax / totalGross) * 100 : 0
    };
  };

  const calculateNewRegime = (): TaxResult => {
    const totalGross = grossSalary + otherIncome;
    const stdDeduction = 75000;
    const taxableIncome = Math.max(0, totalGross - stdDeduction);

    let tax = 0;
    let rebateLimit = 700000;

    if (financialYear === '2024-25') {
      // FY 24-25 Slabs
      if (taxableIncome <= 300000) tax = 0;
      else if (taxableIncome <= 600000) tax = (taxableIncome - 300000) * 0.05;
      else if (taxableIncome <= 900000) tax = 15000 + (taxableIncome - 600000) * 0.10;
      else if (taxableIncome <= 1200000) tax = 45000 + (taxableIncome - 900000) * 0.15;
      else if (taxableIncome <= 1500000) tax = 90000 + (taxableIncome - 1200000) * 0.20;
      else tax = 150000 + (taxableIncome - 1500000) * 0.30;
      rebateLimit = 700000;
    } else {
      // FY 25-26 Slabs (Proposed)
      if (taxableIncome <= 400000) tax = 0;
      else if (taxableIncome <= 800000) tax = (taxableIncome - 400000) * 0.05;
      else if (taxableIncome <= 1200000) tax = 20000 + (taxableIncome - 800000) * 0.10;
      else if (taxableIncome <= 1500000) tax = 60000 + (taxableIncome - 1200000) * 0.15;
      else if (taxableIncome <= 2000000) tax = 105000 + (taxableIncome - 1500000) * 0.20;
      else tax = 205000 + (taxableIncome - 2000000) * 0.30;
      rebateLimit = 1200000;
    }

    const rebate87A = taxableIncome <= rebateLimit ? tax : 0;
    const taxAfterRebate = tax - rebate87A;
    const surcharge = calculateSurcharge(taxAfterRebate, taxableIncome, true);
    const cess = (taxAfterRebate + surcharge) * 0.04;
    const totalTax = taxAfterRebate + surcharge + cess;

    return {
      grossIncome: totalGross,
      stdDeduction,
      exemptions: 0,
      taxableIncome,
      taxBeforeRebate: tax,
      rebate87A,
      taxAfterRebate,
      surcharge,
      cess,
      totalTax,
      takeHome: totalGross - totalTax,
      effectiveRate: totalGross > 0 ? (totalTax / totalGross) * 100 : 0
    };
  };

  const oldRes = useMemo(calculateOldRegime, [grossSalary, otherIncome, investment80C, hraExemption, otherExemptions]);
  const newRes = useMemo(calculateNewRegime, [financialYear, grossSalary, otherIncome]);

  const bestRegime = oldRes.totalTax < newRes.totalTax ? 'Old' : 'New';
  const taxDifference = Math.abs(oldRes.totalTax - newRes.totalTax);

  return (
    <article className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      <SEO title={`Income Tax Calculator FY ${financialYear} - Toolina`} description="Free professional calculator and internal tool by Toolina. Accurate, fast, and easy to use." 
        structuredData={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Toolina App",
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
      <header className="bg-white p-6 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border border-slate-200 shadow-2xl shadow-slate-100/50 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-50 rounded-bl-[20rem] -mr-24 -mt-24 opacity-50 blur-3xl"></div>
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-teal-600 rounded-2xl md:rounded-[1.5rem] flex items-center justify-center text-3xl md:text-4xl shadow-xl shadow-teal-100 text-white shrink-0">
              🧾
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-display font-black text-slate-900 tracking-tight leading-none">
                <span className="text-teal-600">Income Tax</span> Calculator
              </h1>
              <p className="text-slate-500 font-medium text-xs md:text-lg mt-1 italic">Official Slabs & 87A Rebate Audit</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row bg-slate-100 p-1.5 rounded-2xl border border-slate-200 w-full lg:w-auto">
            {(['2024-25', '2025-26'] as FinancialYear[]).map(year => (
              <button
                key={year}
                onClick={() => setFinancialYear(year)}
                className={`flex-1 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                  financialYear === year 
                    ? 'bg-slate-900 text-white shadow-xl' 
                    : 'text-slate-500 hover:text-teal-600'
                }`}
              >
                FY {year}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
          {/* Inputs */}
          <section className="lg:col-span-4 space-y-6">
            <div className="bg-slate-50 p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-inner space-y-8">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-teal-500 rounded-full"></span> Income Parameters
              </h2>

              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Gross Annual Income</label>
                    <span className="text-lg font-black text-slate-900 font-mono">₹{grossSalary.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" min="0" max="10000000" step="50000"
                    value={grossSalary} onChange={(e) => setGrossSalary(Number(e.target.value))}
                    className="w-full h-2 bg-teal-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                  />
                  <input type="number" value={grossSalary} onChange={(e) => setGrossSalary(Number(e.target.value))} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 ring-teal-50 font-mono font-bold text-xs" />
                </div>

                <div className="space-y-3">
                   <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Section 80C Investments (Max 1.5L)</label>
                   <input type="number" value={investment80C} onChange={(e) => setInvestment80C(Number(e.target.value))} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 ring-teal-50 font-mono text-xs font-bold" />
                </div>

                <div className="space-y-3">
                   <label className="text-[10px] font-black text-slate-500 uppercase ml-1">HRA / Other Exemptions (Old Regime)</label>
                   <input type="number" value={hraExemption + otherExemptions} onChange={(e) => setHraExemption(Number(e.target.value))} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 ring-teal-50 font-mono text-xs font-bold" />
                </div>
              </div>
            </div>

            <div className={`p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden transition-all duration-500 ${bestRegime === 'New' ? 'bg-teal-600' : 'bg-slate-800'}`}>
               <h3 className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-4">Recommended Regime</h3>
               <div className="flex items-end gap-2 mb-4">
                 <span className="text-5xl font-black">{bestRegime}</span>
                 <span className="text-xs font-bold opacity-60 mb-2">saves you</span>
               </div>
               <div className="text-3xl font-black tracking-tight">₹{Math.round(taxDifference).toLocaleString()}</div>
               <span className="text-[9px] font-bold opacity-50 uppercase mt-2 block">Annually vs {bestRegime === 'New' ? 'Old' : 'New'} Regime</span>
            </div>
          </section>

          {/* Detailed Breakdown */}
          <section className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {[oldRes, newRes].map((res, i) => (
              <div key={i} className={`p-8 rounded-[3rem] border bg-white transition-all flex flex-col ${res === (bestRegime === 'Old' ? oldRes : newRes) ? 'border-teal-500 ring-4 ring-teal-50 shadow-2xl' : 'border-slate-100 grayscale opacity-60'}`}>
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{i === 0 ? 'Old' : 'New'} Regime</h3>
                  {res.totalTax === 0 && <span className="bg-emerald-100 text-emerald-600 text-[9px] font-black px-3 py-1 rounded-full uppercase">Zero Tax</span>}
                </div>

                <div className="space-y-6 flex-1">
                   <div className="grid grid-cols-2 gap-4 border-b border-slate-50 pb-6">
                      <div className="space-y-1">
                        <span className="text-[9px] font-black text-slate-400 uppercase">Gross Income</span>
                        <p className="text-sm font-bold text-slate-700">₹{res.grossIncome.toLocaleString()}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] font-black text-slate-400 uppercase">Standard Ded.</span>
                        <p className="text-sm font-bold text-slate-700">₹{res.stdDeduction.toLocaleString()}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] font-black text-slate-400 uppercase">Exemptions</span>
                        <p className="text-sm font-bold text-slate-700">₹{res.exemptions.toLocaleString()}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] font-black text-slate-400 uppercase">Taxable Income</span>
                        <p className="text-sm font-black text-teal-600">₹{res.taxableIncome.toLocaleString()}</p>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Base Income Tax</span>
                        <span className="font-mono text-sm font-bold">₹{Math.round(res.taxBeforeRebate).toLocaleString()}</span>
                      </div>
                      {res.rebate87A > 0 && (
                        <div className="flex justify-between items-center text-emerald-600">
                          <span className="text-[10px] font-black uppercase">Rebate u/s 87A</span>
                          <span className="font-mono text-sm font-bold">- ₹{Math.round(res.rebate87A).toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Cess (4%)</span>
                        <span className="font-mono text-sm font-bold">₹{Math.round(res.cess).toLocaleString()}</span>
                      </div>
                      {res.surcharge > 0 && (
                        <div className="flex justify-between items-center text-orange-600">
                          <span className="text-[10px] font-black uppercase">Surcharge</span>
                          <span className="font-mono text-sm font-bold">₹{Math.round(res.surcharge).toLocaleString()}</span>
                        </div>
                      )}
                   </div>
                </div>

                <div className="mt-8 pt-8 border-t-2 border-dashed border-slate-100">
                   <div className="flex justify-between items-end mb-4">
                     <div>
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Total Tax Liability</span>
                       <div className="text-3xl font-black text-slate-900 tracking-tighter">₹{Math.round(res.totalTax).toLocaleString()}</div>
                     </div>
                     <div className="text-right">
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Effective Rate</span>
                       <div className="text-lg font-black text-teal-600">{res.effectiveRate.toFixed(1)}%</div>
                     </div>
                   </div>
                   <div className="bg-slate-50 p-4 rounded-2xl flex justify-between items-center">
                      <span className="text-[10px] font-black text-slate-500 uppercase">Monthly Net</span>
                      <span className="text-lg font-black text-slate-800">₹{Math.round(res.takeHome / 12).toLocaleString()}</span>
                   </div>
                </div>
              </div>
            ))}
          </section>
        </div>
      </header>

      {/* Comparison Legend */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-3">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center text-xl">🛡️</div>
          <h4 className="text-sm font-black text-slate-900 uppercase">87A Rebate Threshold</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            {financialYear === '2025-26' 
              ? "New Regime (Proposed): Effectively zero tax for income up to ₹12.75 Lakhs (12L + 75k SD)."
              : "New Regime (FY 24-25): Effective zero tax for income up to ₹7.75 Lakhs (7L + 75k SD)."}
          </p>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-3">
          <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center text-xl">📈</div>
          <h4 className="text-sm font-black text-slate-900 uppercase">Revised Slabs (FY 25-26)</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Standard 5% slab now starts from ₹4 Lakhs (up from 3L) and ends at ₹8 Lakhs, significantly broadening the lower tax brackets.
          </p>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-3">
          <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center text-xl">⚖️</div>
          <h4 className="text-sm font-black text-slate-900 uppercase">Old Regime Utility</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            The Old Regime remains superior only if your total deductions (80C, HRA, Home Loan) exceed ~₹3.75 - ₹4.5 Lakhs annually.
          </p>
        </div>
      </section>

      <footer className="bg-slate-900 rounded-[3.5rem] p-8 md:p-16 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.05),transparent)] pointer-events-none"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
          <div className="space-y-6">
            <h2 className="text-3xl font-display font-black tracking-tight leading-tight">Tax Planning <span className="text-teal-400">Simplified</span></h2>
            <p className="text-slate-400 leading-relaxed">
              Our <strong>Income Tax Auditor</strong> uses high-precision formulas to map your gross income to the correct slabs. It automatically handles the <strong>Section 87A rebate</strong>, which makes the effective tax zero for millions of Indians. Note: FY 2025-26 data is based on the <strong>Budget 2025 proposals</strong> and remains subject to final gazette notification.
            </p>
          </div>
          <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-sm h-fit">
              <h3 className="text-lg font-black uppercase tracking-widest text-slate-300 mb-6 flex items-center gap-3">
                <span className="text-xl">📊</span> Taxation Knowledge
              </h3>
              <ul className="space-y-6">
                {[
                  { q: "What is Standard Deduction?", a: "A flat deduction from salary income. It is ₹75,000 for the New Regime and ₹50,000 for the Old Regime." },
                  { q: "How is Surcharge calculated?", a: "Surcharge is a tax on tax for high earners (>50L). In the New Regime, it is capped at 15%." },
                  { q: "Can I switch to Old Regime?", a: "Yes, salaried employees can choose their preferred regime every year at the time of filing ITR." }
                ].map((item, i) => (
                  <li key={i} className="space-y-1">
                    <h4 className="text-sm font-bold text-teal-400">{item.q}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.a}</p>
                  </li>
                ))}
              </ul>
            </div>
        </div>
      </footer>
    
      
      
      <AccompanyingText 
        toolName="Income Tax Calculator"
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
          toolId="incometaxcalculator" 
          defaultRating={4.6} 
          defaultCount={287} 
          onRatingChange={(rating, count) => setRatingInfo({ rating, count })} 
        />
      </div>
      <ShareWidget title="Income Tax Calculator" />
      </article>
  );
};

export default IncomeTaxCalculator;
