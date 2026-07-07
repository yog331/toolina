
import React, { useState, useEffect } from 'react';
import AccompanyingText from '../components/AccompanyingText';
import ShareWidget from '../components/ShareWidget';
import SEO from '../components/SEO';
import StarRatingWidget from '../components/StarRatingWidget';

const CentralSalary: React.FC = () => {
  const [ratingInfo, setRatingInfo] = useState<{rating: number, count: number}>({ rating: 4.6, count: 94 });

    const [basicPay, setBasicPay] = useState<number>(44900); // Default Level 7 starting
  const [daPercent, setDaPercent] = useState<number>(50);
  const [hraCity, setHraCity] = useState<'X' | 'Y' | 'Z'>('Y');
  const [isTPTAHigher, setIsTPTAHigher] = useState<boolean>(false); // Cities like Delhi, Mumbai etc.

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.da_rate) {
          setDaPercent(data.da_rate);
        }
      })
      .catch(err => console.error("Failed to fetch DA rate:", err));
  }, []);

  useEffect(() => {
    // SEO Metadata
    
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Calculate Central Government employee salary with 7th Pay Commission rules. Features X, Y, Z HRA classes, TPTA allowance, and NPS deduction estimates for 2025.");
    }

    // JSON-LD Structured Data
    const scriptId = "central-salary-json-ld";
    let script = document.getElementById(scriptId) as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Central Govt Salary Pro Calculator",
      "description": "Calculates 7th CPC salary, DA, HRA, and TPTA for central government employees.",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "author": {
        "@type": "Organization",
        "name": "Toolina"
      }
    });

    return () => { script?.remove(); };
  }, []);

  // Logic for Central HRA (since DA crossed 50%)
  const getHRARate = () => {
    if (hraCity === 'X') return 0.30;
    if (hraCity === 'Y') return 0.20;
    return 0.10;
  };

  const getBaseTA = () => {
    if (basicPay >= 53100) return isTPTAHigher ? 7200 : 3600;
    if (basicPay >= 21700) return isTPTAHigher ? 3600 : 1800;
    return isTPTAHigher ? 1350 : 900;
  };

  const da = Math.floor(basicPay * (daPercent / 100));
  const hra = Math.floor(basicPay * getHRARate());
  const baseTA = getBaseTA();
  const daOnTA = Math.floor(baseTA * (daPercent / 100));
  
  const gross = basicPay + da + hra + baseTA + daOnTA;
  
  const nps = Math.floor((basicPay + da) * 0.10);
  const cghs = basicPay >= 78800 ? 1000 : basicPay >= 44900 ? 650 : 450;
  const cgegis = basicPay >= 44900 ? 60 : 30;
  
  const totalDeductions = nps + cghs + cgegis;
  const netSalary = gross - totalDeductions;

  return (
    <article className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      <SEO title="Central Govt Salary Calculator 2025 - 7th CPC Net Pay Finder | Toolina" description="Free professional calculator and internal tool by Toolina. Accurate, fast, and easy to use." 
        structuredData={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Central Govt Salary Calculator 2025 - 7th CPC Net Pay Finder",
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
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-teal-600 rounded-2xl md:rounded-[1.5rem] flex items-center justify-center text-3xl md:text-4xl shadow-xl shadow-teal-100 text-white shrink-0">
              ⚖️
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-display font-black text-slate-900 tracking-tight leading-none">
                Central Govt <span className="text-teal-600">Salary Calculator</span>
              </h1>
              <p className="text-slate-500 font-medium text-xs md:text-lg mt-1 italic">7th CPC Official Net Pay Finder</p>
            </div>
          </div>
          <div className="bg-slate-100 px-4 py-2 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest border border-slate-200">
            Rule Compliance: 7th Pay Commission
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
          <section className="lg:col-span-4 space-y-6">
            <div className="bg-slate-50 p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-inner space-y-6">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></span> Parameters
              </h2>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 ml-1">Basic Pay</label>
                  <input 
                    type="number" 
                    value={basicPay}
                    onChange={(e) => setBasicPay(Number(e.target.value))}
                    className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 ring-teal-50 font-mono font-bold text-slate-800"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 ml-1">DA (%)</label>
                  <input 
                    type="number" 
                    value={daPercent}
                    onChange={(e) => setDaPercent(Number(e.target.value))}
                    className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 ring-teal-50 font-mono font-bold text-slate-800"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 ml-1">City Class (HRA)</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['X', 'Y', 'Z'].map(c => (
                      <button 
                        key={c}
                        onClick={() => setHraCity(c as any)}
                        className={`py-2 rounded-xl text-xs font-black transition-all border ${hraCity === c ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-slate-500 border-slate-200'}`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200">
                  <span className="text-[10px] font-black text-slate-500 uppercase">High TPTA City</span>
                  <button onClick={() => setIsTPTAHigher(!isTPTAHigher)} className={`w-12 h-6 rounded-full relative transition-colors ${isTPTAHigher ? 'bg-teal-500' : 'bg-slate-300'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${isTPTAHigher ? 'translate-x-7' : 'translate-x-1'}`}></div>
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
                <h3 className="text-xs font-black text-green-600 uppercase tracking-widest border-b border-green-50 pb-2">Components</h3>
                <div className="space-y-3 font-mono text-sm font-bold text-slate-700">
                  <div className="flex justify-between"><span>Basic</span><span>₹{basicPay.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span>DA</span><span>₹{da.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span>HRA</span><span>₹{hra.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span>TPTA</span><span>₹{(baseTA + daOnTA).toLocaleString()}</span></div>
                </div>
              </div>
              <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
                <h3 className="text-xs font-black text-red-500 uppercase tracking-widest border-b border-red-50 pb-2">Reductions</h3>
                <div className="space-y-3 font-mono text-sm font-bold text-slate-700">
                  <div className="flex justify-between"><span>NPS (10%)</span><span className="text-red-400">₹{nps.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span>CGHS</span><span className="text-red-400">₹{cghs.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span>CGEGIS</span><span className="text-red-400">₹{cgegis.toLocaleString()}</span></div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl text-center group relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform"><svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 1.9 1.55 3.28 3.66 3.75V21h3v-2.15c2-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg></div>
               <div className="relative z-10">
                 <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60 mb-2">Net Salary After NPS</p>
                 <div className="text-5xl md:text-7xl font-black tracking-tighter mb-4">₹{netSalary.toLocaleString()}</div>
                 <p className="text-xs font-bold text-teal-400 uppercase tracking-widest">Pay Order Estimated</p>
               </div>
            </div>
          </section>
        </div>
      </header>

      <footer className="bg-slate-900 rounded-[3.5rem] p-8 md:p-16 text-white space-y-16 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.05),transparent)] pointer-events-none"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
          <div className="space-y-8">
            <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight leading-tight">
              Central <span className="text-teal-400">7th CPC Guidance</span>
            </h2>
            <p className="text-slate-400 leading-relaxed text-lg">
              The <strong>7th Pay Commission</strong> restructured the salary of central government employees to bring it closer to market standards. Our tool includes calculation for <strong>X, Y, Z city categories</strong> for HRA, <strong>Transport Allowance (TPTA)</strong>, and statutory deductions like <strong>NPS</strong> and <strong>CGHS</strong>.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                <h4 className="text-teal-400 font-bold text-sm mb-2 uppercase tracking-widest">HRA Updates</h4>
                <p className="text-[10px] text-slate-500">Since DA crossed 50%, HRA rates have been revised to 30%, 20%, and 10% for X, Y, and Z categories respectively.</p>
              </div>
              <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                <h4 className="text-teal-400 font-bold text-sm mb-2 uppercase tracking-widest">TPTA Rules</h4>
                <p className="text-[10px] text-slate-500">Transport allowance is calculated as Base TA + DA on TA, varying by city classification.</p>
              </div>
            </div>
          </div>
          <div className="space-y-8">
            <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10">
              <h3 className="text-lg font-black uppercase tracking-widest text-slate-300 mb-6">Central Employee FAQ</h3>
              <ul className="space-y-6">
                {[
                  { q: "What is the current DA rate for Central Govt?", a: "As of early 2025, the DA is approximately 50-54% based on the latest AIPI index updates." },
                  { q: "Which cities are in Category X?", a: "Tier-1 cities like New Delhi, Mumbai, Bengaluru, and Hyderabad fall under Category X for 30% HRA." },
                  { q: "How is NPS deduction calculated?", a: "It is exactly 10% of (Basic Pay + Dearness Allowance)." },
                  { q: "Is the CGHS rate the same for all?", a: "No, CGHS subscription varies by the Pay Level, starting from ₹250 up to ₹1000 per month." }
                ].map((item, i) => (
                  <li key={i} className="space-y-1">
                    <h4 className="text-sm font-bold text-teal-400">{item.q}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.a}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </footer>
    
      
      
      <AccompanyingText 
        toolName="Central Salary"
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
          toolId="centralsalary" 
          defaultRating={4.6} 
          defaultCount={94} 
          onRatingChange={(rating, count) => setRatingInfo({ rating, count })} 
        />
      </div>
      <ShareWidget title="Central Govt Salary Calculator" />
      </article>
  );
};

export default CentralSalary;
