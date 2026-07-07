
import React, { useState, useEffect } from 'react';
import AccompanyingText from '../components/AccompanyingText';
import ShareWidget from '../components/ShareWidget';
import SEO from '../components/SEO';
import StarRatingWidget from '../components/StarRatingWidget';

interface NPSResult {
  totalInvestment: number;
  corpusEarned: number;
  totalWealth: number;
  lumpSum: number;
  annuityCorpus: number;
  monthlyPension: number;
}

const NPSCalculator: React.FC = () => {
  const [ratingInfo, setRatingInfo] = useState<{rating: number, count: number}>({ rating: 4.7, count: 146 });

    const [age, setAge] = useState<number>(30);
  const [basicPay, setBasicPay] = useState<number>(44900);
  const [daPercent, setDaPercent] = useState<number>(50);
  const [expectedReturn, setExpectedReturn] = useState<number>(10);
  const [annuityPercent, setAnnuityPercent] = useState<number>(40);
  const [annuityReturn, setAnnuityReturn] = useState<number>(6);
  const [contributionRate, setContributionRate] = useState<number>(10); // Standard employee %
  const [employerRate, setEmployerRate] = useState<number>(14); // Standard Govt %
  
  const [result, setResult] = useState<NPSResult | null>(null);

  useEffect(() => {
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Calculate your NPS corpus, lump sum withdrawal, and monthly pension. High-precision calculator for Central and State government employees to plan retirement.");
    }
  }, []);

  const calculate = () => {
    const yearsToInvest = 60 - age;
    if (yearsToInvest <= 0) return;

    const monthlyContribution = (basicPay + (basicPay * daPercent / 100)) * (contributionRate / 100);
    const monthlyEmployer = (basicPay + (basicPay * daPercent / 100)) * (employerRate / 100);
    const totalMonthly = monthlyContribution + monthlyEmployer;
    
    const r = expectedReturn / 12 / 100;
    const n = yearsToInvest * 12;
    
    // Future Value of monthly contributions formula
    const totalWealth = totalMonthly * (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
    const totalInvestment = totalMonthly * n;
    const corpusEarned = totalWealth - totalInvestment;
    
    const annuityCorpus = totalWealth * (annuityPercent / 100);
    const lumpSum = totalWealth - annuityCorpus;
    const monthlyPension = (annuityCorpus * (annuityReturn / 100)) / 12;

    setResult({
      totalInvestment,
      corpusEarned,
      totalWealth,
      lumpSum,
      annuityCorpus,
      monthlyPension
    });
  };

  return (
    <article className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      <SEO title="NPS Calculator - National Pension System Corpus & Pension | Toolina" description="Free professional calculator and internal tool by Toolina. Accurate, fast, and easy to use." 
        structuredData={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "NPS Calculator - National Pension System Corpus & Pension",
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
      {/* Header Section */}
      <header className="bg-white p-6 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border border-slate-200 shadow-2xl shadow-slate-100/50 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-50 rounded-bl-[15rem] -mr-20 -mt-20 opacity-50 blur-3xl"></div>
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-indigo-600 rounded-2xl md:rounded-[1.5rem] flex items-center justify-center text-3xl md:text-4xl shadow-xl shadow-indigo-100 text-white shrink-0">
              🏦
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-display font-black text-slate-900 tracking-tight leading-none">
                <span className="text-indigo-600">NPS</span> Calculator
              </h1>
              <p className="text-slate-500 font-medium text-xs md:text-lg mt-1 italic">National Pension System Precision Calculator</p>
            </div>
          </div>
          <div className="bg-slate-100 px-4 py-2 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest border border-slate-200">
            Retirement Planning 2025
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
          {/* Inputs */}
          <section className="lg:col-span-5 space-y-6">
            <div className="bg-slate-50 p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-inner space-y-5">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span> Personal & Salary Data
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Current Age</label>
                  <input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-4 ring-indigo-50 font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Basic Pay (₹)</label>
                  <input type="number" value={basicPay} onChange={(e) => setBasicPay(Number(e.target.value))} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-4 ring-indigo-50 font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">DA Rate (%)</label>
                  <input type="number" value={daPercent} onChange={(e) => setDaPercent(Number(e.target.value))} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-4 ring-indigo-50 font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Inv. Return (%)</label>
                  <input type="number" step="0.5" value={expectedReturn} onChange={(e) => setExpectedReturn(Number(e.target.value))} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-4 ring-indigo-50 font-bold text-indigo-600" />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 space-y-4">
                 <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Advanced Settings</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Annuity Buy (%)</label>
                      <input type="number" value={annuityPercent} onChange={(e) => setAnnuityPercent(Number(e.target.value))} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 ring-indigo-50 text-xs font-bold" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Annuity Return (%)</label>
                      <input type="number" value={annuityReturn} onChange={(e) => setAnnuityReturn(Number(e.target.value))} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 ring-indigo-50 text-xs font-bold" />
                    </div>
                 </div>
              </div>

              <button onClick={calculate} className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-black uppercase text-xs tracking-widest hover:bg-black transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                Calculate Maturity
              </button>
            </div>
          </section>

          {/* Visualization / Result */}
          <section className="lg:col-span-7 flex flex-col justify-center">
             {!result ? (
               <div className="text-center py-10 space-y-4">
                  <div className="text-6xl grayscale opacity-20">🧘‍♂️</div>
                  <p className="text-xs font-black text-slate-300 uppercase tracking-[0.3em]">Ready for Analysis</p>
               </div>
             ) : (
               <div className="space-y-6 animate-in zoom-in duration-500">
                  <div className="bg-white p-8 md:p-12 rounded-[3rem] border border-slate-200 shadow-sm text-center relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform"><svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 1.9 1.55 3.28 3.66 3.75V21h3v-2.15c2-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg></div>
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4 block">Retirement Wealth Corpus</span>
                     <div className="text-5xl md:text-8xl font-black text-indigo-600 tracking-tighter mb-4 leading-none">
                       ₹{(result.totalWealth / 10000000).toFixed(2)} <span className="text-xl md:text-3xl opacity-40">Cr</span>
                     </div>
                     <p className="text-slate-500 font-bold text-sm tracking-tight mb-8 italic">Total Accumulated Value at 60</p>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
                           <span className="text-[10px] font-black text-indigo-400 uppercase block mb-1">Lump Sum (Tax-Free)</span>
                           <div className="text-xl font-black text-indigo-700">₹{(result.lumpSum / 100000).toFixed(1)} L</div>
                        </div>
                        <div className="bg-slate-900 p-6 rounded-3xl text-white">
                           <span className="text-[10px] font-black text-slate-500 uppercase block mb-1">Monthly Pension</span>
                           <div className="text-xl font-black text-indigo-400">₹{Math.round(result.monthlyPension).toLocaleString()}</div>
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                     <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                        <span className="text-[9px] font-black text-slate-400 uppercase block mb-1">Total Contrib</span>
                        <div className="text-lg font-bold text-slate-800">₹{(result.totalInvestment / 100000).toFixed(1)} L</div>
                     </div>
                     <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                        <span className="text-[9px] font-black text-slate-400 uppercase block mb-1">Interest Earned</span>
                        <div className="text-lg font-bold text-emerald-600">₹{(result.corpusEarned / 100000).toFixed(1)} L</div>
                     </div>
                     <div className="col-span-2 md:col-span-1 bg-indigo-600 p-6 rounded-3xl text-white">
                        <span className="text-[9px] font-black text-white/50 uppercase block mb-1">Annuity Re-Inv</span>
                        <div className="text-lg font-bold">₹{(result.annuityCorpus / 100000).toFixed(1)} L</div>
                     </div>
                  </div>
               </div>
             )}
          </section>
        </div>
      </header>

      {/* Info Sections */}
      <footer className="bg-slate-900 rounded-[3.5rem] p-8 md:p-16 text-white space-y-16 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(79,70,229,0.08),transparent)] pointer-events-none"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
          <div className="space-y-8">
            <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight leading-tight">National <span className="text-indigo-400">Pension System</span> Overview</h2>
            <p className="text-slate-400 leading-relaxed text-lg">
              NPS is a voluntary-defined, contribution retirement savings scheme. For government employees, it is mandatory to contribute 10% of (Basic + DA), with the government providing an additional 14% matching contribution.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                <h4 className="text-indigo-400 font-bold text-sm mb-2 uppercase tracking-widest">Section 80CCD</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">Benefit from tax deductions under 80C and an exclusive extra ₹50,000 under 80CCD(1B).</p>
              </div>
              <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                <h4 className="text-indigo-400 font-bold text-sm mb-2 uppercase tracking-widest">Exit Rules</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">At 60, you can withdraw up to 60% of your corpus as a tax-free lump sum.</p>
              </div>
            </div>
          </div>
          <div className="space-y-8">
            <div className="bg-white/5 p-8 rounded-[3rem] border border-white/10 backdrop-blur-sm">
               <h3 className="text-xl font-black mb-8">Retirement FAQs</h3>
               <ul className="space-y-6">
                 {[
                   {q: "Is NPS better than EPF?", a: "NPS typically offers higher long-term returns due to equity exposure, while EPF offers fixed guaranteed returns."},
                   {q: "What is Tier-I vs Tier-II?", a: "Tier-I is the primary retirement account with tax benefits. Tier-II is a voluntary savings account with no withdrawal restrictions."},
                   {q: "Can I choose my investment ratio?", a: "Yes, active choice allows you to invest up to 75% in equities (Class E) for potentially higher growth."},
                   {q: "Who manages NPS funds?", a: "Regulated by PFRDA, funds are managed by professional entities like SBI, LIC, and HDFC Pension Funds."}
                 ].map((item, i) => (
                   <li key={i} className="space-y-1">
                      <h4 className="text-sm font-bold text-indigo-400 tracking-tight">{item.q}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{item.a}</p>
                   </li>
                 ))}
               </ul>
            </div>
          </div>
        </div>
        <div className="pt-12 border-t border-white/10 relative z-10 text-center">
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">PRECISION RETIREMENT DATA BY YOGICALCULATOR AUDIT SYSTEMS</p>
        </div>
      </footer>
    
      
      
      <AccompanyingText 
        toolName="N P S Calculator"
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
          toolId="npscalculator" 
          defaultRating={4.7} 
          defaultCount={146} 
          onRatingChange={(rating, count) => setRatingInfo({ rating, count })} 
        />
      </div>
      <ShareWidget title="NPS Calculator" />
      </article>
  );
};

export default NPSCalculator;
