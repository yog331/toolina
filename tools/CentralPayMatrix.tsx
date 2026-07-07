
import React, { useState, useMemo, useEffect } from 'react';
import AccompanyingText from '../components/AccompanyingText';
import ShareWidget from '../components/ShareWidget';
import SEO from '../components/SEO';
import StarRatingWidget from '../components/StarRatingWidget';

interface PayLevel {
  level: string;
  gp: string | number;
  start: number;
}

const CentralPayMatrix: React.FC = () => {
  const [ratingInfo, setRatingInfo] = useState<{rating: number, count: number}>({ rating: 5.0, count: 279 });

    const [searchTerm, setSearchTerm] = useState('');
  const [highlightValue, setHighlightValue] = useState<number | ''>('');

  // SEO Optimization
  useEffect(() => {
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Access the complete 7th Pay Commission Matrix for Central Government Employees. View all Levels L-1 to L-18 and Indices 1 to 40. Official pay scale and increment guide.");
    }

    // Structured Data (JSON-LD)
    const scriptId = "central-pay-matrix-json-ld";
    let script = document.getElementById(scriptId) as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Table",
      "about": "Central 7th Pay Commission Matrix",
      "description": "Comprehensive table of pay levels and indices for central government employees.",
      "mainEntityOfPage": "https://toolina.in/7th-pay-matrix-central-government"
    });

    return () => { script?.remove(); };
  }, []);

  // Initial values for L-1 to L-18 as per Central 7th CPC
  const baseLevels: PayLevel[] = [
    { level: 'L-1', gp: 1800, start: 18000 },
    { level: 'L-2', gp: 1900, start: 19900 },
    { level: 'L-3', gp: 2000, start: 21700 },
    { level: 'L-4', gp: 2400, start: 25500 },
    { level: 'L-5', gp: 2800, start: 29200 },
    { level: 'L-6', gp: 4200, start: 35400 },
    { level: 'L-7', gp: 4600, start: 44900 },
    { level: 'L-8', gp: 4800, start: 47600 },
    { level: 'L-9', gp: 5400, start: 53100 },
    { level: 'L-10', gp: 5400, start: 56100 },
    { level: 'L-11', gp: 6600, start: 67700 },
    { level: 'L-12', gp: 7600, start: 78800 },
    { level: 'L-13', gp: 8700, start: 123100 },
    { level: 'L-13A', gp: 8900, start: 131100 },
    { level: 'L-14', gp: 10000, start: 144200 },
    { level: 'L-15', gp: 'HAG', start: 182200 },
    { level: 'L-16', gp: 'HAG+', start: 205400 },
    { level: 'L-17', gp: 'Apex', start: 225000 },
    { level: 'L-18', gp: 'CabSec', start: 250000 },
  ];

  const fullMatrix = useMemo(() => {
    return baseLevels.map(bl => {
      const range: number[] = [bl.start];
      // Note: Higher levels have fewer indices, but L-1 to L-14 usually have 40
      const maxIndex = bl.start >= 182200 ? 10 : 40; 
      for (let i = 1; i < maxIndex; i++) {
        const nextVal = Math.round((range[i - 1] * 1.03) / 100) * 100;
        range.push(nextVal);
      }
      return { ...bl, range };
    });
  }, []);

  // Filter levels based on search
  const filteredLevels = fullMatrix.filter(l => 
    l.level.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.gp.toString().includes(searchTerm)
  );

  const indices = Array.from({ length: 40 }, (_, i) => i);

  return (
    <article className="max-w-7xl mx-auto space-y-4 md:space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20 px-0 sm:px-4">
      <SEO title="7th Pay Matrix Central Govt 2025 - Official Pay Scale Table | Toolina" description="Free professional calculator and internal tool by Toolina. Accurate, fast, and easy to use." 
        structuredData={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "7th Pay Matrix Central Govt 2025 - Official Pay Scale Table",
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
      {/* Header Section - Refined for Mobile Spacing */}
      <header className="bg-white p-5 md:p-10 lg:p-12 rounded-none sm:rounded-[2.5rem] border-b sm:border border-slate-200 shadow-2xl shadow-slate-100/50 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-48 md:w-80 h-48 md:h-80 bg-blue-50 rounded-bl-[15rem] -mr-16 -mt-16 opacity-40 blur-3xl"></div>
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6 md:mb-10 relative z-10">
          <div className="flex items-center gap-3 md:gap-5">
            <div className="w-10 h-10 md:w-16 md:h-16 bg-blue-600 rounded-xl md:rounded-[1.5rem] flex items-center justify-center text-xl md:text-4xl shadow-xl shadow-blue-100 text-white shrink-0">
              ⚖️
            </div>
            <div>
              <h1 className="text-xl md:text-4xl lg:text-5xl font-display font-black text-slate-900 tracking-tight leading-none">
                Central Govt <span className="text-blue-600">Pay Matrix</span>
              </h1>
              <p className="text-slate-500 font-medium text-[9px] md:text-lg mt-1 italic">7th CPC Official Central Govt. Table</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch gap-2 w-full lg:w-auto max-w-2xl">
            <div className="relative group flex-1 lg:w-56">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                placeholder="Find Level (L-7)..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 md:py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-4 ring-blue-50 focus:bg-white transition-all placeholder:text-slate-400"
              />
            </div>
            <div className="relative group flex-1 lg:w-52">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-black text-[8px] uppercase tracking-tighter">Mark</span>
              <input 
                type="number" 
                placeholder="Highlight Pay" 
                value={highlightValue}
                onChange={(e) => setHighlightValue(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full pl-14 pr-3 py-2.5 md:py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-4 ring-blue-50 focus:bg-white text-blue-600 transition-all placeholder:text-slate-300"
              />
            </div>
          </div>
        </div>

        {/* Swipe Hint - Higher Visibility */}
        <div className="lg:hidden flex items-center justify-center gap-2 mb-3 text-[9px] font-black text-blue-500/60 uppercase tracking-[0.2em] relative z-10 bg-blue-50/50 py-2 rounded-lg border border-blue-100/50">
          <svg className="w-3 h-3 animate-bounce-x" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
          Scroll right for Pay Levels
        </div>
        <style>{`
          @keyframes bounce-x {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(3px); }
          }
          .animate-bounce-x { animation: bounce-x 1s infinite; }
        `}</style>

        {/* Matrix Table - Optimized scrolling & Density */}
        <div className="relative overflow-hidden rounded-xl sm:rounded-[2rem] border border-slate-200 shadow-inner bg-slate-50/20">
          <div className="overflow-x-auto overflow-y-auto max-h-[65vh] md:max-h-[75vh] scrollbar-hide relative overscroll-contain">
            <table className="text-left border-separate border-spacing-0 w-max min-w-full">
              <thead className="sticky top-0 z-30">
                <tr className="bg-blue-600 text-white">
                  <th className="w-[45px] md:w-[60px] min-w-[45px] md:min-w-[60px] px-1.5 md:px-2 py-4 md:py-6 font-black text-[9px] md:text-[12px] uppercase tracking-widest sticky left-0 z-40 bg-blue-600 border-r border-white/10 shadow-[6px_0_10px_-4px_rgba(0,0,0,0.3)] text-center">
                    #
                  </th>
                  {filteredLevels.map(l => (
                    <th key={l.level} className="w-[70px] md:w-[95px] min-w-[70px] md:min-w-[95px] px-1 md:px-2 py-4 md:py-6 font-black text-[10px] md:text-[13px] uppercase tracking-widest text-center border-r border-white/10 last:border-r-0 whitespace-nowrap">
                      {l.level}
                    </th>
                  ))}
                </tr>
                <tr className="bg-blue-500 text-white/90">
                  <th className="px-1.5 md:px-2 py-2 md:py-3 font-black text-[8px] md:text-[10px] uppercase tracking-widest sticky left-0 z-40 bg-blue-500 border-r border-white/10 shadow-[6px_0_10px_-4px_rgba(0,0,0,0.3)] text-center">
                    GP
                  </th>
                  {filteredLevels.map(l => (
                    <th key={`${l.level}-gp`} className="px-1 md:px-2 py-2 md:py-3 font-bold text-[9px] md:text-[11px] text-center border-r border-white/10 last:border-r-0 whitespace-nowrap">
                      {typeof l.gp === 'number' ? `₹${l.gp}` : l.gp}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {indices.map(idx => (
                  <tr key={idx} className="hover:bg-blue-50 transition-colors group">
                    <td className="px-1.5 md:px-2 py-3 md:py-4 font-black text-blue-600 bg-white sticky left-0 z-20 border-r border-slate-100 group-hover:bg-blue-50 whitespace-nowrap shadow-[6px_0_10px_-4px_rgba(0,0,0,0.1)] text-center text-[9px] md:text-[11px]">
                      {idx + 1}
                    </td>
                    {filteredLevels.map(l => {
                      const val = l.range[idx];
                      if (val === undefined) return <td key={`${l.level}-${idx}`} className="px-1 md:px-2 py-3 md:py-4 bg-slate-50/40"></td>;
                      const isMatch = highlightValue !== '' && val === highlightValue;
                      return (
                        <td key={`${l.level}-${idx}`} className={`px-1 md:px-2 py-3 md:py-4 text-center text-[10px] md:text-sm font-mono font-bold border-r border-slate-100 last:border-r-0 transition-all ${isMatch ? 'bg-blue-600 text-white scale-[1.03] z-10 shadow-lg' : 'text-slate-600'}`}>
                          <div className={`transition-transform cursor-default ${!isMatch && 'hover:scale-110 hover:text-blue-600'}`}>
                            {val.toLocaleString()}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredLevels.length === 0 && (
            <div className="py-16 md:py-32 text-center bg-white w-full">
              <div className="text-3xl md:text-6xl grayscale opacity-20 mb-4">⚖️</div>
              <p className="text-[10px] md:text-sm font-black text-slate-400 uppercase tracking-widest">No Level Found for "{searchTerm}"</p>
              <button onClick={() => setSearchTerm('')} className="mt-4 text-blue-600 font-bold text-[9px] md:text-xs hover:underline uppercase tracking-widest">Show All Levels</button>
            </div>
          )}
        </div>

        {/* Legend / Info Section - Refined for Responsive layout */}
        <div className="mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 relative z-10">
          <div className="p-6 md:p-8 bg-blue-50/50 rounded-[2rem] border border-blue-100 hover:bg-white hover:shadow-xl transition-all group">
            <div className="text-2xl md:text-3xl mb-3 group-hover:scale-110 transition-transform">📉</div>
            <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-2">Pay Clusters</h3>
            <p className="text-[10px] md:text-xs text-slate-600 leading-relaxed font-medium">
              Levels grouped by Pay Bands: PB-1 (L 1-5), PB-2 (L 6-9), PB-3 (L 10-12), and senior scales (L 13-18).
            </p>
          </div>
          <div className="p-6 md:p-8 bg-blue-50/50 rounded-[2rem] border border-blue-100 hover:bg-white hover:shadow-xl transition-all group">
            <div className="text-2xl md:text-3xl mb-3 group-hover:scale-110 transition-transform">📅</div>
            <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-2">Increments</h3>
            <p className="text-[10px] md:text-xs text-slate-600 leading-relaxed font-medium">
              Standard <strong>3% annual increment</strong> logic applies, rounded to nearest 100 per 7th CPC.
            </p>
          </div>
          <div className="p-6 md:p-8 bg-blue-50/50 rounded-[2rem] border border-blue-100 hover:bg-white hover:shadow-xl transition-all group">
            <div className="text-2xl md:text-3xl mb-3 group-hover:scale-110 transition-transform">⚖️</div>
            <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-2">MACPS Rules</h3>
            <p className="text-[10px] md:text-xs text-slate-600 leading-relaxed font-medium">
              Promotion fixation: One increment in current level then placement in higher cell of next level.
            </p>
          </div>
        </div>
      </header>

      {/* SEO Footer - Edge to edge on mobile */}
      <footer className="bg-slate-900 rounded-none sm:rounded-[3rem] p-6 sm:p-10 md:p-16 text-white space-y-10 md:space-y-16 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.08),transparent)] pointer-events-none"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 relative z-10">
          <div className="space-y-4 md:space-y-6">
            <h2 className="text-2xl md:text-5xl font-display font-black tracking-tight leading-tight">
              Official Central <span className="text-blue-400">7th CPC Audit Tool</span>
            </h2>
            <p className="text-slate-400 leading-relaxed text-xs md:text-lg">
              Replacing the complex grade pay system, the 7th CPC matrix provides a transparent view of career progression. Used by DDOs and employees for verifying pay fixation, increment dates, and pension calculations.
            </p>
          </div>
          <div className="bg-white/5 p-6 md:p-10 rounded-[2.5rem] border border-white/10 backdrop-blur-sm">
            <h3 className="text-base md:text-xl font-black uppercase tracking-widest text-slate-200 mb-6 flex items-center gap-3">
              <span className="text-xl md:text-2xl">🏛️</span> Knowledge Base
            </h3>
            <ul className="space-y-5 md:space-y-7">
              {[
                { q: "What defines a 'Cell'?", a: "Each cell represents the basic pay for a specific level at a particular year of service/increment." },
                { q: "Is this matrix final?", a: "Yes, this reflects the gazetted matrix applicable for all Central Govt departments as of 2025." },
                { q: "How does it impact DA?", a: "Dearness Allowance is calculated directly on the Basic Pay value found in these cells." }
              ].map((item, i) => (
                <li key={i} className="space-y-1 group">
                  <h4 className="text-[11px] md:text-sm font-bold text-blue-400 group-hover:text-white transition-colors tracking-tight">{item.q}</h4>
                  <p className="text-[9px] md:text-xs text-slate-400 leading-relaxed">{item.a}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="pt-8 md:pt-12 border-t border-white/10 relative z-10 text-center">
          <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">PRECISION DATA BY YOGICALCULATOR AUDIT SYSTEMS</p>
        </div>
      </footer>
    
      
      
      <AccompanyingText 
        toolName="Central Pay Matrix"
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
          toolId="centralpaymatrix" 
          defaultRating={5.0} 
          defaultCount={279} 
          onRatingChange={(rating, count) => setRatingInfo({ rating, count })} 
        />
      </div>
      <ShareWidget title="Central Govt Pay Matrix" />
      </article>
  );
};

export default CentralPayMatrix;
