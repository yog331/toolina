import React, { useState, useEffect } from 'react';
import AccompanyingText from '../components/AccompanyingText';
import ShareWidget from '../components/ShareWidget';
import SEO from '../components/SEO';
import StarRatingWidget from '../components/StarRatingWidget';

type UtilityType = 'Electricity' | 'Water' | 'Gas';

interface Slab {
  limit: number;
  rate: number;
}

interface BillResult {
  units: number;
  energyCharges: number;
  fixedCharges: number;
  taxAmount: number;
  total: number;
  dailyAvg: number;
  slabBreakdown: { slab: string, cost: number }[];
}

const UtilityBillCalculator: React.FC = () => {
  const [ratingInfo, setRatingInfo] = useState<{rating: number, count: number}>({ rating: 4.6, count: 288 });

    const [utilityType, setUtilityType] = useState<UtilityType>('Electricity');
  const [prevReading, setPrevReading] = useState<number>(0);
  const [currReading, setCurrReading] = useState<number>(0);
  const [fixedCharges, setFixedCharges] = useState<number>(250);
  const [taxPercent, setTaxPercent] = useState<number>(12);
  const [slabs, setSlabs] = useState<Slab[]>([
    { limit: 50, rate: 4.75 },
    { limit: 100, rate: 6.50 },
    { limit: 999999, rate: 7.95 }
  ]);
  const [result, setResult] = useState<BillResult | null>(null);

  useEffect(() => {
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", "Calculate your electricity, water, or gas bill with our advanced utility calculator. Supports tiered slab pricing, fixed charges, and taxes. Perfect for auditing your monthly utility expenses.");

    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute("content", "electricity bill calculator, water bill estimator, gas unit calculator, utility bill auditor, slab based billing, tiered pricing calculator, Toolina");
  }, []);

  const handleSlabChange = (index: number, field: keyof Slab, value: number) => {
    const newSlabs = [...slabs];
    newSlabs[index][field] = value;
    setSlabs(newSlabs);
  };

  const calculate = () => {
    const units = Math.max(0, currReading - prevReading);
    let remainingUnits = units;
    let energyCharges = 0;
    const slabBreakdown: { slab: string, cost: number }[] = [];

    let lastLimit = 0;
    for (const slab of slabs) {
      if (remainingUnits <= 0) break;
      const currentSlabUnits = Math.min(remainingUnits, slab.limit - lastLimit);
      const cost = currentSlabUnits * slab.rate;
      energyCharges += cost;
      
      slabBreakdown.push({
        slab: `${lastLimit + 1} - ${slab.limit === 999999 ? 'Above' : slab.limit} Units`,
        cost: cost
      });

      remainingUnits -= currentSlabUnits;
      lastLimit = slab.limit;
    }

    const taxAmount = (energyCharges + fixedCharges) * (taxPercent / 100);
    const total = energyCharges + fixedCharges + taxAmount;
    
    setResult({
      units,
      energyCharges,
      fixedCharges,
      taxAmount,
      total,
      dailyAvg: total / 30,
      slabBreakdown
    });
  };

  const getUtilityIcon = () => {
    switch (utilityType) {
      case 'Electricity': return '⚡';
      case 'Water': return '💧';
      case 'Gas': return '🔥';
    }
  };

  return (
    <article className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-12">
      <SEO title="Utility Bill Calculator | Electricity, Water & Gas Estimator - Toolina" description="Free professional calculator and internal tool by Toolina. Accurate, fast, and easy to use." 
        structuredData={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Utility Bill Calculator",
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
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-50 rounded-bl-[15rem] -mr-20 -mt-20 opacity-50 blur-3xl"></div>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-teal-600 rounded-2xl md:rounded-[1.5rem] flex items-center justify-center text-3xl md:text-4xl shadow-xl shadow-teal-100 text-white shrink-0">
              {getUtilityIcon()}
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-display font-black text-slate-900 tracking-tight leading-none">
                Utility Bill <span className="text-teal-600">Calculator</span>
              </h1>
              <p className="text-slate-500 font-medium text-xs md:text-lg mt-1 italic">Professional Billing Analysis</p>
            </div>
          </div>
          
          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 w-full lg:w-auto">
            {(['Electricity', 'Water', 'Gas'] as UtilityType[]).map(type => (
              <button
                key={type}
                onClick={() => setUtilityType(type)}
                className={`flex-1 lg:px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${utilityType === type ? 'bg-white shadow-sm text-teal-600' : 'text-slate-500'}`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Meter Readings</h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Previous Reading</label>
                  <input 
                    type="number" 
                    value={prevReading} 
                    onChange={(e) => setPrevReading(Number(e.target.value))}
                    className="w-full px-5 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 ring-teal-50 transition-all font-mono font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Current Reading</label>
                  <input 
                    type="number" 
                    value={currReading} 
                    onChange={(e) => setCurrReading(Number(e.target.value))}
                    className="w-full px-5 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 ring-teal-50 transition-all font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Fixed Costs & Taxes</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Fixed Fee (₹)</label>
                  <input 
                    type="number" 
                    value={fixedCharges} 
                    onChange={(e) => setFixedCharges(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 ring-teal-50 font-mono text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Tax (%)</label>
                  <input 
                    type="number" 
                    value={taxPercent} 
                    onChange={(e) => setTaxPercent(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 ring-teal-50 font-mono text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Slab Configuration (Tiered Pricing)</h3>
                <span className="text-[8px] font-bold bg-teal-100 text-teal-600 px-2 py-0.5 rounded-full uppercase">Standard Utility Presets</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {slabs.map((slab, i) => (
                  <div key={i} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm relative group">
                    <div className="absolute -top-2 -left-2 w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                      {i + 1}
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-[9px] font-black text-slate-400 uppercase block mb-1">Up to Units</label>
                        <input 
                          type="number" 
                          value={slab.limit === 999999 ? '' : slab.limit}
                          placeholder="No Limit"
                          onChange={(e) => handleSlabChange(i, 'limit', e.target.value === '' ? 999999 : Number(e.target.value))}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 ring-teal-100 text-xs font-bold font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-black text-slate-400 uppercase block mb-1">Rate (₹/Unit)</label>
                        <input 
                          type="number" 
                          step="0.01"
                          value={slab.rate}
                          onChange={(e) => handleSlabChange(i, 'rate', Number(e.target.value))}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 ring-teal-100 text-xs font-bold font-mono text-teal-600"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={calculate}
              className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-black uppercase text-xs tracking-widest hover:bg-black transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
              Generate Bill Audit
            </button>
          </div>
        </div>
      </header>

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in zoom-in duration-500">
          <section className="lg:col-span-8 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                 <span className="text-2xl">{getUtilityIcon()}</span>
                 <h2 className="text-xl font-display font-black text-slate-900">Audit Receipt</h2>
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">#{Math.random().toString(36).substring(7).toUpperCase()}</span>
            </div>
            
            <div className="p-8 space-y-8 flex-1">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Usage</p>
                  <p className="text-2xl font-black text-slate-900">{result.units} <span className="text-sm font-bold opacity-30">Units</span></p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Energy Charge</p>
                  <p className="text-2xl font-black text-teal-600">₹{result.energyCharges.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Fixed + Tax</p>
                  <p className="text-2xl font-black text-slate-900">₹{(result.fixedCharges + result.taxAmount).toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Daily Avg</p>
                  <p className="text-2xl font-black text-slate-900">₹{result.dailyAvg.toFixed(2)}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">Slab Breakdown</h3>
                <div className="space-y-2">
                  {result.slabBreakdown.map((item, i) => (
                    <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-teal-50 hover:border-teal-100 transition-colors">
                      <span className="text-xs font-bold text-slate-600 group-hover:text-teal-700">{item.slab}</span>
                      <span className="font-mono font-bold text-slate-800">₹{item.cost.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-slate-900 p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <p className="text-[10px] font-black text-teal-400 uppercase tracking-[0.3em] mb-1">Total Payable Amount</p>
                <div className="text-5xl font-black tracking-tighter">₹{result.total.toLocaleString()}</div>
              </div>
              <button className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest border border-white/10 transition-all flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h6z" /></svg>
                Print Invoice
              </button>
            </div>
          </section>

          <aside className="lg:col-span-4 space-y-6">
             <div className="bg-teal-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-teal-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full -mr-8 -mt-8"></div>
                <h3 className="text-xs font-black uppercase tracking-widest opacity-60 mb-6">Usage Efficiency</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-[10px] font-black uppercase mb-2">
                      <span>Consumption vs Avg</span>
                      <span>{result.units > 200 ? 'High' : 'Optimal'}</span>
                    </div>
                    <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                      <div className="h-full bg-white transition-all duration-1000" style={{ width: `${Math.min(100, (result.units / 500) * 100)}%` }}></div>
                    </div>
                  </div>
                  <p className="text-xs opacity-80 leading-relaxed font-medium">
                    {result.units > 200 
                      ? "Your consumption is significantly higher than the average household. Consider checking high-power appliances."
                      : "Great job! Your energy usage is within the optimal range for a balanced household budget."}
                  </p>
                </div>
             </div>

             <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-teal-500 rounded-full"></span> Money Saving Tips
                </h3>
                <div className="space-y-4">
                  {[
                    "Keep AC temperature at 24°C to save up to 10% on energy.",
                    "Switch to LED bulbs to reduce lighting costs by 80%.",
                    "Fix leaking taps; 1 drop per second can waste 10,000L/yr.",
                    "Use solar water heaters for a flat zero-cost morning bath."
                  ].map((tip, i) => (
                    <div key={i} className="flex gap-3 text-xs text-slate-500 leading-relaxed group">
                      <span className="text-teal-500 font-black group-hover:scale-125 transition-transform">•</span>
                      {tip}
                    </div>
                  ))}
                </div>
             </div>
          </aside>
        </div>
      )}

      {/* SEO Content Section */}
      <footer className="bg-slate-900 rounded-[2.5rem] p-8 md:p-16 text-white space-y-12 overflow-hidden relative mt-12">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.1),transparent)] pointer-events-none"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
          <div className="space-y-6">
            <h2 className="text-3xl font-display font-black tracking-tight leading-tight">
              Why use a <span className="text-teal-400">Professional Bill Auditor?</span>
            </h2>
            <p className="text-slate-400 leading-relaxed">
              Utility companies often use complex <strong>tiered pricing models</strong> where the rate per unit increases as your consumption grows. Without a professional <strong>electricity bill calculator</strong>, it's difficult to predict your monthly expense. Toolina helps you audit your bill, identify surcharge errors, and plan your energy budget with 100% precision.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
              <h4 className="text-teal-400 font-bold text-sm mb-2 uppercase tracking-widest">Global Support</h4>
              <p className="text-[10px] text-slate-500">Configurable for any city, currency, or utility provider worldwide.</p>
            </div>
            <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
              <h4 className="text-teal-400 font-bold text-sm mb-2 uppercase tracking-widest">Privacy First</h4>
              <p className="text-[10px] text-slate-500">We do not store your meter readings or location data. Total anonymity.</p>
            </div>
          </div>
        </div>
      </footer>
    
      
      
      <AccompanyingText 
        toolName="Utility Bill Calculator"
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
          toolId="utilitybillcalculator" 
          defaultRating={4.6} 
          defaultCount={288} 
          onRatingChange={(rating, count) => setRatingInfo({ rating, count })} 
        />
      </div>
      <ShareWidget title="Utility Bill Calculator" />
      </article>
  );
};

export default UtilityBillCalculator;